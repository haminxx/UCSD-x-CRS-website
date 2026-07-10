/** Fall 2026 Application survey (Typeform). */
export const FALL_2026_APPLICATION_URL = "https://form.typeform.com/to/hQtOGGHW";

/**
 * Recruitment chat API (Gemini proxy on Render free tier).
 * Set NEXT_PUBLIC_CHAT_API_URL after you create the Render service, e.g.
 * https://ucsdxcrs-recruitment-chat.onrender.com/api/recruitment-chat
 *
 * This is a public endpoint URL — never put GEMINI_API_KEY here.
 */
export const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL?.trim() ||
  "https://ucsdxcrs-recruitment-chat.onrender.com/api/recruitment-chat";
