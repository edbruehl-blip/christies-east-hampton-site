# Environment Variables Reference

**Christie's East Hampton — Manus Platform**

All environment variables are managed via the Manus Secrets panel (Settings → Secrets in the Management UI). Real keys never live in the repository.

| Variable | Purpose | Required For |
|---|---|---|
| `ELEVENLABS_API_KEY` | ElevenLabs voice synthesis | LISTEN · FOUNDING LETTER button, TTS endpoint |
| `TWILIO_ACCOUNT_SID` | Twilio | WhatsApp William inbound/outbound |
| `TWILIO_AUTH_TOKEN` | Twilio | WhatsApp William inbound/outbound |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google Sheets + Calendar API | PIPE tab live Sheet reads/writes, calendar sync |
| `JWT_SECRET` | Session cookie signing | Manus OAuth |
| `VITE_APP_ID` | Manus OAuth application ID | Authentication |
| `OAUTH_SERVER_URL` | Manus OAuth backend | Authentication |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal | Authentication |
| `DATABASE_URL` | MySQL/TiDB connection | All database operations |
| `BUILT_IN_FORGE_API_KEY` | Manus built-in APIs (server-side) | LLM, storage, notifications |
| `VITE_FRONTEND_FORGE_API_KEY` | Manus built-in APIs (client-side) | Frontend API access |

To configure: Manus Management UI → Settings → Secrets → Add Secret.

**Platform:** Manus only — christies-dash-acqj9wc4.manus.space + www.christiesrealestategroupeh.com  
**Netlify:** Removed from architecture April 2, 2026.
