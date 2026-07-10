# Recruitment chat server (Render free tier)

Small Express proxy: browser → this server → Google Gemini.
The Gemini API key stays in Render Environment — never in the static site or GitHub.

## Why Render (not Firebase Functions / Railway)

- Firebase Functions need **Blaze** (billing account)
- Railway free offering is mostly **credits**, not a lasting free web service
- Render free Web Service works for this hobby chatbot (may sleep when idle; first reply can be slow)

## Blueprint (`render.yaml`)

The repo root includes `render.yaml` so a **Blueprint** deploy uses `chat-server` as the root (not the Next.js site). Prefer **New → Blueprint** and select this repo if you are creating the service from scratch.

## Dual start (works even if Root Directory is blank)

Repo root `npm start` → `node scripts/start.js`:

- If `RENDER=true` (set automatically by Render): installs `chat-server` deps if needed, then runs `node chat-server/server.js`
- Otherwise: runs Next.js (`next start`) for local/static hosting builds

So even when the dashboard Root Directory is empty and Start Command is `npm start`, the chat service should start — **as long as Build Command installs chat-server deps**.

## Fix existing service (502 / wrong start command)

If Render logs show `ucsd-x-crs-website@0.1.0 start` → `next start` and *Could not find a production build in the '.next' directory*, the service was pointed at the **repo root** and using the old start script. After this repo update, either option works:

### Option A (preferred) — Root Directory = `chat-server`

1. Open the service → **Settings**
2. **Root Directory** = `chat-server`
3. **Build Command** = `npm install`
4. **Start Command** = `npm start`
5. Confirm **Environment** has `GEMINI_API_KEY` (and preferably `GEMINI_MODEL` = `gemini-3.5-flash`)
6. **Manual Deploy** → **Clear build cache & deploy**

### Option B — Root Directory blank (repo root fallback)

1. **Root Directory** = *(empty)*
2. **Build Command** = `npm install --prefix ./chat-server`  
   (or `npm run render-build`)
3. **Start Command** = `npm start`  
   (runs `scripts/start.js`, which detects `RENDER=true` and starts chat-server)
4. Confirm **Environment** has `GEMINI_API_KEY` (and preferably `GEMINI_MODEL` = `gemini-3.5-flash`)
5. **Manual Deploy** → **Clear build cache & deploy**

Do **not** use Build Command `npm install && npm run build` at repo root for this service — that builds Next.js and is unnecessary for the chatbot.

After redeploy, `/health` and `/api/recruitment-chat` should respond (cold start on free tier may take 30–60s).

### Quick dashboard checklist (if auto-redeploy still fails)

1. Root Directory = `chat-server` **or** blank with Build = `npm install --prefix ./chat-server`
2. Start Command = `npm start`
3. `GEMINI_API_KEY` is set in Environment
4. `GEMINI_MODEL` = `gemini-3.5-flash` (or leave unset — server remaps shut-down `gemini-2.0-flash`)
5. Manual Deploy → Clear build cache & deploy
6. Wait until status is Live, then open `/health`

## Deploy on Render — step by step

### A. Gemini API key

1. Open https://aistudio.google.com/apikey
2. Create an API key (free tier)
3. Copy it — do **not** commit it

### B. Create the Render web service

1. Sign up / log in at https://render.com (GitHub login is easiest)
2. Prefer **New** → **Blueprint** (uses root `render.yaml`), **or** **New** → **Web Service**
3. Connect the repo: `haminxx/UCSD-x-CRS-website` (or your fork)
4. Settings (must match — wrong Root Directory used to run Next.js and fail):
   - **Name:** `ucsd-x-crs-recruitment-chatbot` (or any name)
   - **Region:** Oregon (or closest)
   - **Root Directory:** `chat-server` (preferred)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free
5. **Environment** → Add:
   - Key: `GEMINI_API_KEY`
   - Value: *(paste your Gemini key)*
   - Optional: `GEMINI_MODEL` = `gemini-3.5-flash` (default; `gemini-2.0-flash` was shut down June 2026 and is auto-remapped)
6. Click **Create Web Service** and wait until status is **Live**
7. Copy your service URL, e.g. `https://ucsd-x-crs-recruitment-chatbot.onrender.com`

### C. Point the website at Render

In the website repo root, set the public chat URL (this is **not** a secret):

Create or edit `.env.local` / use hosting build env:

```env
NEXT_PUBLIC_CHAT_API_URL=https://ucsd-x-crs-recruitment-chatbot.onrender.com/api/recruitment-chat
```

The site default in `lib/recruitment.ts` already points at that URL. Override only if your Render hostname differs, then:

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
