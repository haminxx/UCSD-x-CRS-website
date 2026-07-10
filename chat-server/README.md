# Recruitment chat server (Render free tier)

Small Express proxy: browser → this server → Google Gemini.
The Gemini API key stays in Render Environment — never in the static site or GitHub.

## Why Render (not Firebase Functions / Railway)

- Firebase Functions need **Blaze** (billing account)
- Railway free offering is mostly **credits**, not a lasting free web service
- Render free Web Service works for this hobby chatbot (may sleep when idle; first reply can be slow)

## Deploy on Render — step by step

### A. Gemini API key

1. Open https://aistudio.google.com/apikey
2. Create an API key (free tier)
3. Copy it — do **not** commit it

### B. Create the Render web service

1. Sign up / log in at https://render.com (GitHub login is easiest)
2. **New** → **Web Service**
3. Connect the repo: `haminxx/UCSD-x-CRS-website` (or your fork)
4. Settings:
   - **Name:** `ucsdxcrs-recruitment-chat` (any name)
   - **Region:** Oregon (or closest)
   - **Root Directory:** `chat-server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free
5. **Environment** → Add:
   - Key: `GEMINI_API_KEY`
   - Value: *(paste your Gemini key)*
   - Optional: `GEMINI_MODEL` = `gemini-2.0-flash`
6. Click **Create Web Service** and wait until status is **Live**
7. Copy your service URL, e.g. `https://ucsdxcrs-recruitment-chat.onrender.com`

### C. Point the website at Render

In the website repo root, set the public chat URL (this is **not** a secret):

Create or edit `.env.local` / use hosting build env:

```env
NEXT_PUBLIC_CHAT_API_URL=https://YOUR-SERVICE.onrender.com/api/recruitment-chat
```

Or temporarily put that URL in `lib/recruitment.ts` as the default, then:

```bash
npm run build
npx firebase deploy --only hosting --project ucsdxcrs
```

### D. Test

1. Open https://ucsdxcrs.web.app/recruitment/
2. Send a chat message
3. First request after idle may take 30–60s (free tier cold start)

### E. Update FAQ answers

1. Edit `content/recruitment-faq.md`
2. Copy to `chat-server/knowledge.md`
3. Push to GitHub — Render auto-redeploys if connected

## Local test

```bash
cd chat-server
npm install
set GEMINI_API_KEY=your_key_here
npm start
```

Then set `NEXT_PUBLIC_CHAT_API_URL=http://localhost:10000/api/recruitment-chat` for local Next.

## Security

| Store here | Gemini key? |
|---|---|
| GitHub | No |
| `NEXT_PUBLIC_*` | No |
| Render Environment | **Yes** |
| Public chat API URL | OK (endpoint only) |
