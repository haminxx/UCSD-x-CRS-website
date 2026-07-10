import { readFileSync } from "fs";
import { join } from "path";
import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

initializeApp();
setGlobalOptions({ region: "us-central1", maxInstances: 20 });

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

function loadKnowledge(): string {
  try {
    return readFileSync(join(__dirname, "..", "knowledge.md"), "utf8");
  } catch {
    return "UCSD × CRS is a student-led Collegiate Racing Series team at UC San Diego.";
  }
}

function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowList = new Set([
    "https://ucsdxcrs.web.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  const allowed =
    origin && allowList.has(origin) ? origin : "https://ucsdxcrs.web.app";

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "3600",
  };
}

function buildSystemPrompt(knowledge: string): string {
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

function toGeminiContents(history: ChatTurn[], message: string) {
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> =
    [];

  for (const turn of history.slice(-12)) {
    if (!turn?.content?.trim()) continue;
    contents.push({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content.trim().slice(0, 2000) }],
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: message.trim().slice(0, 2000) }],
  });

  return contents;
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  history: ChatTurn[],
  message: string,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: toGeminiContents(history, message),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    }),
  });

  const data = (await res.json()) as {
    error?: { message?: string };
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `Gemini HTTP ${res.status}`);
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Empty Gemini response");
  }

  return text;
}

export const recruitmentChat = onRequest(
  {
    secrets: [geminiApiKey],
    cors: false,
    invoker: "public",
  },
  async (req, res) => {
    const headers = corsHeaders(req.get("origin") || undefined);
    for (const [k, v] of Object.entries(headers)) {
      res.set(k, v);
    }

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const body = req.body as {
      message?: unknown;
      history?: unknown;
    };

    const message =
      typeof body?.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 2000) {
      res.status(400).json({ error: "Invalid message" });
      return;
    }

    const historyRaw = Array.isArray(body?.history) ? body.history : [];
    const history: ChatTurn[] = historyRaw
      .filter(
        (t): t is ChatTurn =>
          !!t &&
          typeof t === "object" &&
          ((t as ChatTurn).role === "user" ||
            (t as ChatTurn).role === "assistant") &&
          typeof (t as ChatTurn).content === "string",
      )
      .slice(-12);

    try {
      const knowledge = loadKnowledge();
      const reply = await callGemini(
        geminiApiKey.value(),
        buildSystemPrompt(knowledge),
        history,
        message,
      );
      res.status(200).json({ reply });
    } catch (err) {
      console.error("recruitmentChat error", err);
      res.status(502).json({
        error:
          "Chat is temporarily unavailable. Please try again, or use Contact / Fall 2026 Application.",
      });
    }
  },
);
