const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const PORT = Number(process.env.PORT) || 10000;

/** Strip quotes/newlines from copy-paste mistakes in Render Environment. */
function normalizeGeminiApiKey(raw) {
  if (raw == null) return "";
  let key = String(raw)
    .replace(/^\uFEFF/, "")
    .replace(/[\r\n]+/g, "")
    .trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }
  return key;
}

/** AI Studio keys start with AIza — helps catch wrong key types early. */
function keyFormatLooksValid(key) {
  return /^AIza[\w-]{20,}$/.test(key);
}

const GEMINI_API_KEY = normalizeGeminiApiKey(process.env.GEMINI_API_KEY);

/** Models shut down June 2026 — never call these. */
const SHUT_DOWN_MODELS = new Set([
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
]);

/**
 * Free-tier-friendly defaults (2026). Prefer 2.5 Flash over 3.x when the
 * project has no prepaid credits — 2.5 Flash remains on the free tier.
 * Override with GEMINI_MODEL on Render if needed.
 */
const DEFAULT_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

const requestedModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
const PRIMARY_MODEL = SHUT_DOWN_MODELS.has(requestedModel)
  ? DEFAULT_MODEL
  : requestedModel;

const ALLOWED_ORIGINS = new Set([
  "https://ucsdxcrs.web.app",
  "https://ucsdxcrs.firebaseapp.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const KNOWLEDGE_FALLBACK =
  "UCSD × CRS is a student-led Collegiate Racing Series team at UC San Diego.";

function loadKnowledge() {
  try {
    const text = fs.readFileSync(path.join(__dirname, "knowledge.md"), "utf8");
    return { text, loaded: true, chars: text.length };
  } catch {
    return {
      text: KNOWLEDGE_FALLBACK,
      loaded: false,
      chars: KNOWLEDGE_FALLBACK.length,
    };
  }
}

function buildSystemPrompt(knowledge) {
  return [
    "You are the UCSD × CRS recruitment assistant on the official website.",
    "Answer ONLY using the knowledge base below. Do not invent deadlines, fees, schedules, or policies.",
    "If the answer is not in the knowledge base, say you do not have that information yet and suggest the Fall 2026 Application CTA on the Recruitment page and/or the Contact page.",
    "Keep replies concise (2–5 short sentences). Be friendly and practical.",
    "",
    "=== KNOWLEDGE BASE ===",
    knowledge,
    "=== END KNOWLEDGE BASE ===",
  ].join("\n");
}

function toGeminiContents(history, message) {
  const contents = [];

  for (const turn of (history || []).slice(-12)) {
    if (!turn?.content?.trim()) continue;
    if (turn.role !== "user" && turn.role !== "assistant") continue;
    contents.push({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: String(turn.content).trim().slice(0, 2000) }],
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: String(message).trim().slice(0, 2000) }],
  });

  return contents;
}

function classifyGeminiError(message, status) {
  const m = String(message || "");
  if (/API[_ ]?key|invalid.?key|PERMISSION_DENIED|401/i.test(m) || status === 401) {
    return "invalid_key";
  }
  if (
    /prepayment|billing|credit|quota|RESOURCE_EXHAUSTED|exceeded your current quota/i.test(
      m,
    ) ||
    status === 429
  ) {
    return "billing";
  }
  if (
    /not found|NOT_FOUND|is not found|unsupported|no longer available|has been shut down|404/i.test(
      m,
    ) ||
    status === 404
  ) {
    return "model_unavailable";
  }
  return "unknown";
}

function publicErrorMessage(kind) {
  switch (kind) {
    case "invalid_key":
      return "Chat server Gemini API key is invalid. In Render Environment, set GEMINI_API_KEY to a fresh key from https://aistudio.google.com/apikey (no quotes). If the key was created in Google Cloud Console, set Application restrictions to None for server use.";
    case "billing":
      return "Chat is temporarily unavailable (Gemini API billing/credits). Please use Contact / Fall 2026 Application, or try again later.";
    case "model_unavailable":
      return "Chat model is unavailable. Please try again later, or use Contact / Fall 2026 Application.";
    default:
      return "Chat is temporarily unavailable. Please try again, or use Contact / Fall 2026 Application.";
  }
}

function modelCandidates(primary) {
  const list = [primary, ...FALLBACK_MODELS.filter((m) => m !== primary)];
  return [...new Set(list.filter((m) => !SHUT_DOWN_MODELS.has(m)))];
}

async function callGeminiOnce(apiKey, model, systemPrompt, history, message) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: toGeminiContents(history, message),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    }),
  });

  const data = await res.json();
  const errMsg = data?.error?.message || `Gemini HTTP ${res.status}`;

  if (!res.ok) {
    const err = new Error(errMsg);
    err.status = res.status;
    err.kind = classifyGeminiError(errMsg, res.status);
    err.model = model;
    throw err;
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p?.text || "")
    .join("")
    .trim();

  if (!text) {
    const err = new Error("Empty Gemini response");
    err.kind = "unknown";
    err.model = model;
    throw err;
  }

  return text;
}

/**
 * Try primary model, then free-tier fallbacks on model-not-found / unsupported.
 * Do not retry on billing or invalid key — those are project-level.
 */
async function callGemini(apiKey, systemPrompt, history, message) {
  const models = modelCandidates(PRIMARY_MODEL);
  let lastErr;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const text = await callGeminiOnce(
        apiKey,
        model,
        systemPrompt,
        history,
        message,
      );
      if (i > 0) {
        console.warn(`recruitment-chat: fell back to model ${model}`);
      }
      return text;
    } catch (err) {
      lastErr = err;
      const kind = err?.kind || classifyGeminiError(err?.message, err?.status);
      console.error(
        `recruitment-chat model=${model} kind=${kind}:`,
        err?.message || err,
      );
      if (kind === "billing" || kind === "invalid_key") {
        throw err;
      }
      // model_unavailable / unknown → try next fallback
      if (i === models.length - 1) {
        throw err;
      }
    }
  }

  throw lastErr || new Error("Gemini call failed");
}

const app = express();
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || ALLOWED_ORIGINS.has(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "32kb" }));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "ucsdxcrs-recruitment-chat",
    endpoints: { chat: "POST /api/recruitment-chat" },
  });
});

app.get("/health", (_req, res) => {
  const knowledge = loadKnowledge();
  res.json({
    ok: true,
    hasKey: Boolean(GEMINI_API_KEY),
    keyFormatValid: keyFormatLooksValid(GEMINI_API_KEY),
    model: PRIMARY_MODEL,
    // Knowledge is the bundled markdown file — not Google Drive / Firebase.
    knowledgeLoaded: knowledge.loaded,
    knowledgeChars: knowledge.chars,
  });
});

app.post("/api/recruitment-chat", async (req, res) => {
  if (!GEMINI_API_KEY) {
    res.status(503).json({
      error:
        "Chat server is missing GEMINI_API_KEY. Add it in Render Environment.",
      kind: "missing_key",
    });
    return;
  }

  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > 2000) {
    res.status(400).json({ error: "Invalid message", kind: "bad_request" });
    return;
  }

  const historyRaw = Array.isArray(req.body?.history) ? req.body.history : [];
  const history = historyRaw
    .filter(
      (t) =>
        t &&
        typeof t === "object" &&
        (t.role === "user" || t.role === "assistant") &&
        typeof t.content === "string",
    )
    .slice(-12);

  try {
    const { text: knowledge } = loadKnowledge();
    const reply = await callGemini(
      GEMINI_API_KEY,
      buildSystemPrompt(knowledge),
      history,
      message,
    );
    res.status(200).json({ reply });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    const kind =
      err?.kind || classifyGeminiError(detail, err?.status);
    console.error("recruitment-chat error", kind, detail);
    res.status(502).json({
      error: publicErrorMessage(kind),
      kind,
      // Safe diagnostic (Gemini messages never include the API key)
      detail: detail.slice(0, 240),
    });
  }
});

app.listen(PORT, () => {
  if (GEMINI_API_KEY && !keyFormatLooksValid(GEMINI_API_KEY)) {
    console.warn(
      "GEMINI_API_KEY is set but does not look like an AI Studio key (expected AIza… prefix). Create one at https://aistudio.google.com/apikey — paste in Render with no quotes.",
    );
  }
  console.log(
    `Recruitment chat listening on :${PORT} (model=${PRIMARY_MODEL}${
      requestedModel !== PRIMARY_MODEL
        ? `, remapped from ${requestedModel}`
        : ""
    }, fallbacks=${FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL).join(",")})`,
  );
});
