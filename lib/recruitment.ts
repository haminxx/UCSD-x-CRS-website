/** Fall 2026 Application survey (Typeform). */
export const FALL_2026_APPLICATION_URL = "https://form.typeform.com/to/hQtOGGHW";

/**
 * Recruitment chat API (OpenAI proxy on Render free tier).
 * Override with NEXT_PUBLIC_CHAT_API_URL if needed, e.g.
 * https://ucsd-x-crs-recruitment-chatbot.onrender.com/api/recruitment-chat
 *
 * This is a public endpoint URL — never put OPENAI_API_KEY here.
 */
export const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL?.trim() ||
  "https://ucsd-x-crs-recruitment-chatbot.onrender.com/api/recruitment-chat";
