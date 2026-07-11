import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";

setGlobalOptions({ region: "us-central1", maxInstances: 10 });

/** Render chat server — OPENAI_API_KEY lives on Render, not Firebase. */
const RENDER_CHAT_URL =
  process.env.RENDER_CHAT_URL?.trim() ||
  "https://ucsd-x-crs-website.onrender.com/api/recruitment-chat";

function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowList = new Set([
    "https://ucsdxcrs.web.app",
    "https://ucsdxcrs.firebaseapp.com",
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

/**
 * Proxies POST /api/recruitment-chat on ucsdxcrs.web.app → Render chat server.
 * Requires Firebase Blaze to deploy. Client falls back to Render if unavailable.
 */
export const recruitmentChat = onRequest(
  { cors: false, invoker: "public" },
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
      res.status(405).json({
        error: "Method not allowed",
        hint: "POST chat messages to this endpoint from ucsdxcrs.web.app/recruitment/",
      });
      return;
    }

    try {
      const proxyRes = await fetch(RENDER_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body ?? {}),
      });

      let data: unknown = {};
      try {
        data = await proxyRes.json();
      } catch {
        data = { error: "Invalid upstream response" };
      }

      res.status(proxyRes.status).json(data);
    } catch (err) {
      console.error("recruitmentChat proxy error", err);
      res.status(502).json({
        error:
          "Chat proxy unavailable. Try again, or use Contact / Fall 2026 Application.",
      });
    }
  },
);
