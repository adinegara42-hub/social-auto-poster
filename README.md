# Social Auto Poster v0.8 — Publishing Engine

Upgrade v0.7 dengan OAuth state protection, token encryption, account persistence, account binding, dan worker per target.

Run:
npm install
cp .env.example .env
docker compose up -d
npx prisma generate
npx prisma migrate dev --name v08
npm run dev
npm run worker

OAuth:
- YouTube: /api/auth/youtube
- TikTok: /api/auth/tiktok
- Meta: intentionally gated until the current Meta app permissions/Graph API configuration is verified.

Catatan: worker sekarang memisahkan retry/status per PostTarget. Provider-specific media publishing tetap harus diaktifkan setelah kredensial dan approval API masing-masing tersedia.


## v0.9 Media Publishing Engine

- YouTube: OAuth refresh + resumable upload via `videos.insert`.
- TikTok: Direct Post `FILE_UPLOAD`, creator privacy discovery, chunk upload, and publish-status polling.
- Worker now binds each scheduled target to a selected connected account.
- Instagram/Facebook remain gated until Meta app credentials, approved permissions, and account/Page configuration are supplied.
- For TikTok local FILE_UPLOAD, the implementation requires a video of at least 5 MB. Smaller files need a public URL flow.


## v1.0 Production Hardening

- API validation for platform/account/schedule/caption.
- Account binding is mandatory for every selected platform.
- Post detail and safe deletion endpoints.
- Database health endpoint.
- Dashboard health indicator and deletion for unprocessed scheduled posts.
- Failed BullMQ jobs are retained for inspection.
- YouTube and TikTok publishing engine remains enabled; Meta remains gated.


## v1.1 Meta-ready

- Added a Meta configuration/status endpoint and explicit adapter boundary.
- Instagram/Facebook are still gated; no unverified Meta endpoint or permission is fabricated.
- Dashboard visibly reports Meta configuration state.
- YouTube/TikTok publishing remains unchanged.

## v1.2 Analytics + Retry Engine

- Analytics snapshot model/API and dashboard.
- Manual retry endpoint for failed targets, using BullMQ with exponential backoff.
- Existing automatic retry remains enabled.
- TikTok status polling/webhooks can feed analytics/status updates; current TikTok API documents Fetch Status and webhooks. 

## v1.3 AI Content Generator

- AI endpoint `/api/ai/generate`.
- Generates hook, title, caption, and hashtags per platform.
- Optional OpenAI-compatible provider via `AI_API_URL`, `AI_API_KEY`, `AI_MODEL`.
- Without credentials, a deterministic fallback keeps the dashboard usable.
- TikTok captions must respect the official 2,200 UTF-16 rune limit; Direct Post also requires the creator-info flow and `video.publish` authorization. 
