const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const PORT = Number(process.env.PORT) || 10000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || "";
/** gemini-2.0-flash was shut down 2026-06-01; remap so stale Render env still works. */
const SHUT_DOWN_MODELS = new Set([
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
]);
const requestedModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash";
const GEMINI_MODEL = SHUT_DOWN_MODELS.has(requestedModel)
  ? "gemini-3.5-flash"
  : requestedModel;

const ALLOWED_ORIGINS = new Set([
  "https://ucsdxcrs.web.app",
  "https://ucsdxcrs.firebaseapp.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function loadKnowledge() {
  try {
    return fs.readFileSync(path.join(__dirname, "knowledge.md"), "utf8");
  } catch {
    return "UCSD × CRS is a student-led Collegiate Racing Series team at UC San Diego.";
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

async function callGemini(apiKey, systemPrompt, history, message) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

  if (!res.ok) {
    throw new Error(data?.error?.message || `Gemini HTTP ${res.status}`);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p?.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Empty Gemini response");
  }

  return text;
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
  res.json({ ok: true, hasKey: Boolean(GEMINI_API_KEY) });
});

app.post("/api/recruitment-chat", async (req, res) => {
  if (!GEMINI_API_KEY) {
    res.status(503).json({
      error:
        "Chat server is missing GEMINI_API_KEY. Add it in Render Environment.",
    });
    return;
  }

  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > 2000) {
    res.status(400).json({ error: "Invalid message" });
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
    const knowledge = loadKnowledge();
    const reply = await callGemini(
      GEMINI_API_KEY,
      buildSystemPrompt(knowledge),
      history,
      message,
    );
    res.status(200).json({ reply });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("recruitment-chat error", detail);
    res.status(502).json({
      error:
        "Chat is temporarily unavailable. Please try again, or use Contact / Fall 2026 Application.",
      // Safe diagnostic (Gemini messages never include the API key)
      detail: detail.slice(0, 200),
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Recruitment chat listening on :${PORT} (model=${GEMINI_MODEL}${
      requestedModel !== GEMINI_MODEL ? `, remapped from ${requestedModel}` : ""
    })`,
  );
});
