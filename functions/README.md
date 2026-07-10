# Recruitment chat (Gemini) — setup guide

Static Next.js export cannot hold a Gemini API key in the client bundle.
Chat goes: browser → Firebase Hosting rewrite `/api/recruitment-chat` →
Cloud Function `recruitmentChat` → Gemini (server-side, secret key).

## 1. Get a Gemini API key

1. Open [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key (free tier is fine for recruitment Q&A)
3. Copy the key — do **not** commit it or put it in `NEXT_PUBLIC_*`

## 2. Store the key as a Firebase secret

From the repo root (Firebase CLI logged into project `ucsdxcrs`):

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

Paste the key when prompted. This stores it in Google Cloud Secret Manager
for the function — **not** in GitHub and **not** in the static site.

Optional model override (default `gemini-2.0-flash`):

```bash
# set in Google Cloud Console → Cloud Functions → recruitmentChat → env
# or use firebase functions:config (legacy). Prefer secrets for the key only.
```

## 3. Install & build functions

```bash
cd functions
npm install
npm run build
cd ..
```

## 4. Deploy function (+ hosting rewrite)

```bash
npx firebase deploy --only functions,hosting
```

Hosting rewrite maps `POST /api/recruitment-chat` → `recruitmentChat`.
The site defaults `NEXT_PUBLIC_CHAT_API_URL` to `/api/recruitment-chat`
(same origin on https://ucsdxcrs.web.app).

If you ever need a direct Cloud Functions URL instead:

```bash
# .env.local (local only; not required for production rewrite)
NEXT_PUBLIC_CHAT_API_URL=https://us-central1-ucsdxcrs.cloudfunctions.net/recruitmentChat
```

`NEXT_PUBLIC_CHAT_API_URL` is a **public endpoint URL**, not a secret.

## 5. Update the knowledge base

1. Edit `content/recruitment-faq.md` (canonical)
2. Copy to `functions/knowledge.md` (or rely on firebase predeploy copy)
3. Redeploy functions: `npx firebase deploy --only functions`

The model only knows what is in that markdown file (+ the current chat turns).
It does **not** auto-read Google Drive, the whole website, or git history.

### Google Drive?

You cannot securely “just connect Drive” from a static site for live RAG.
Practical path: export FAQ/docs into `content/recruitment-faq.md`.
Later you can add a script that syncs Drive → that file, then redeploy.

## Security checklist

| Store here | Gemini key? |
|---|---|
| GitHub repo / client `.env` with `NEXT_PUBLIC_` | **No** |
| Firebase Functions secret / Secret Manager | **Yes** |
| GitHub Actions secrets (only if CI deploys functions) | OK for deploy, not for client runtime |
