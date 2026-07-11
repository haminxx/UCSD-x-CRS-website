# Firebase Functions (optional — same-domain chat proxy)

Recruitment chat runs on **Render** (`https://ucsd-x-crs-website.onrender.com`).

The website at `https://ucsdxcrs.web.app/recruitment/` calls that API in the background.
**Different domains is normal** — the Render root URL shows JSON because it is an API server, not the website.

## Optional: same-domain `/api/recruitment-chat`

To serve chat at `https://ucsdxcrs.web.app/api/recruitment-chat` (instead of the Render URL):

1. Upgrade Firebase to **Blaze** (pay-as-you-go)
2. Uncomment the `rewrites` block in root `firebase.json` (see git history)
3. Deploy: `firebase deploy --only functions,hosting`

The `recruitmentChat` function proxies to Render — your OpenAI key stays on Render.

Without Blaze, chat still works via direct Render URL (configured in `lib/recruitment.ts`).
