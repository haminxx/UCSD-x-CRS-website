/** Fall 2026 Application survey (Typeform). */
export const FALL_2026_APPLICATION_URL = "https://form.typeform.com/to/hQtOGGHW";

/**
 * Render chat API (OpenAI proxy). The recruitment *page* is on Firebase;
 * chat *requests* go to this API URL in the background — that is normal.
 */
export const RENDER_CHAT_API_URL =
  "https://ucsd-x-crs-website.onrender.com/api/recruitment-chat";

/** Chat endpoint used by the recruitment modal. */
export function getChatApiUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CHAT_API_URL?.trim() || RENDER_CHAT_API_URL
  );
}

/** @deprecated Use getChatApiUrl() */
export const CHAT_API_URL = RENDER_CHAT_API_URL;
