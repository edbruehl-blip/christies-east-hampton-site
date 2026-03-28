# Environment Variables Reference

**Christie's East Hampton Re-platform**

The following environment variables must be configured in the Netlify dashboard before launch. Real keys never live in the repository.

| Variable | Purpose | Required For |
|---|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API | MAPS tab Earth animation and static embed |
| `ELEVENLABS_API_KEY` | ElevenLabs voice synthesis | WhatsApp William voice layer |
| `OPENAI_API_KEY` | OpenAI GPT | Intelligence layer |
| `PERPLEXITY_API_KEY` | Perplexity API | INTEL tab live comps |
| `TWILIO_ACCOUNT_SID` | Twilio | WhatsApp William inbound routing |
| `TWILIO_AUTH_TOKEN` | Twilio | WhatsApp William inbound routing |
| `NETLIFY_BLOBS_STORE_ID` | Netlify Blobs | Deal pipeline persistence store |

To configure: Netlify Dashboard → Site Settings → Environment Variables → Add variable.
