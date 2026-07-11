# Recruitment chat server (Render + OpenAI)

Small Express proxy: browser → this server → OpenAI Chat API.
The OpenAI API key stays in Render Environment — never in the static site or GitHub.

## Quick setup (you do this once)

### 1. Get an OpenAI API key

OpenAI does **not** have a permanent free API tier like Gemini. You need an account with billing enabled, but **`gpt-4o-mini`** is very cheap for a small recruitment chatbot (often pennies per month).

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / log in
3. Open [API keys](https://platform.openai.com/api-keys) → **Create new secret key**
4. Copy the key (starts with `sk-…`) — you won't see it again
5. Open [Billing](https://platform.openai.com/settings/organization/billing) and add a payment method + a small credit limit (e.g. $5/month) if prompted

New accounts sometimes receive starter credits — check your [Usage](https://platform.openai.com/usage) page.

### 2. Update Render

1. [Render Dashboard](https://dashboard.render.com) → **ucsd-x-crs-website**
2. **Environment**:
   - **Delete** `GEMINI_API_KEY` and `GEMINI_MODEL` (no longer used)
   - **Add** `OPENAI_API_KEY` = your `sk-…` key (no quotes)
   - **Add** `OPENAI_MODEL` = `gpt-4o-mini` (optional — this is the default)
3. **Settings** (confirm):
   - Root Directory = `chat-server`
   - Build Command = `npm install`
   - Start Command = `npm start`
4. **Manual Deploy** → **Clear build cache & deploy**
5. Wait until **Live**, then open `/health` — expect:

```json
{
  "ok": true,
  "provider": "openai",
  "hasKey": true,
  "keyFormatValid": true,
  "model": "gpt-4o-mini"
}
```

### 3. Test chat

1. https://ucsdxcrs.web.app/recruitment/
2. Send a message (first request after idle may take 30–60s on Render free tier)

## Local test

```bash
cd chat-server
npm install
set OPENAI_API_KEY=sk-your_key_here
npm start
```

Then set `NEXT_PUBLIC_CHAT_API_URL=http://localhost:10000/api/recruitment-chat` for local Next.

## Update FAQ answers

1. Edit `content/recruitment-faq.md`
2. Copy to `chat-server/knowledge.md`
3. Push to GitHub — Render auto-redeploys

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `/health` → `hasKey: false` | Set `OPENAI_API_KEY` on Render |
| `invalid_key` | Wrong/revoked key — create a new one at platform.openai.com/api-keys |
| `billing` / `insufficient_quota` | Add payment method + credits in OpenAI billing settings |
| Slow first reply | Render free tier cold start — retry once |

## Security

| Store here | OpenAI key? |
| --- | --- |
| GitHub | No |
| `NEXT_PUBLIC_*` | No |
| Render Environment | **Yes** |
| Public chat API URL | OK (endpoint only) |
