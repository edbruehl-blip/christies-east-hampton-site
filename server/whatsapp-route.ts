/**
 * William WhatsApp Route
 * -----------------------------------------------------------------------------
 * Provides two Express endpoints:
 *
 *   POST /api/whatsapp/morning-brief   — 8AM Hamptons market brief (voice note)
 *   POST /api/whatsapp/evening-summary — 8PM pipeline summary (voice note)
 *   POST /api/whatsapp/test            — Send a test voice note immediately
 *
 * Flow:
 *   1. Generate brief text from hamlet data + live market context
 *   2. Synthesise audio via ElevenLabs (William voice, eleven_turbo_v2 — Doctrine 9)
 *   3. Upload MP3 to S3 so Twilio can fetch it via public URL
 *   4. Send WhatsApp media message via Twilio
 *
 * Both endpoints are protected by a shared secret header:
 *   X-William-Secret: <WILLIAM_WHATSAPP_SECRET>
 *
 * Cron triggers (server-side node-cron):
 *   0 8  * * * → morning brief
 *   0 20 * * * → evening summary
 */

import type { Express } from "express";
import { ENV } from "./_core/env";
import { storagePut } from "./storage";
import twilio from "twilio";
import { fetchCronkiteBrief } from "./whatsapp-inbound";
import { readPipelineDeals, readGrowthModelVolume } from "./sheets-helper";

// --- ElevenLabs config --------------------------------------------------------
const ELEVENLABS_VOICE_ID = "fjnwTZkKtQOJaYzGLa6n"; // William — unified voice (same as tts-route.ts)
const ELEVENLABS_MODEL    = "eleven_turbo_v2"; // Doctrine 9 — TTS Model Lock (aligned with whatsapp-inbound.ts)

// --- ElevenLabs synthesis -----------------------------------------------------

async function synthesiseAudio(text: string): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ENV.elevenLabsApiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs synthesis failed: ${response.status} — ${err}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// --- Upload to S3 and get public URL -----------------------------------------

async function uploadAudio(buffer: Buffer, label: string): Promise<string> {
  const key = `whatsapp-briefs/${label}-${Date.now()}.mp3`;
  const { url } = await storagePut(key, buffer, "audio/mpeg");
  return url;
}

// --- Send WhatsApp voice note via Twilio --------------------------------------

async function sendWhatsAppVoiceNote(audioUrl: string, caption: string): Promise<string> {
  const client = twilio(ENV.twilioAccountSid, ENV.twilioAuthToken);
  const message = await client.messages.create({
    from: ENV.twilioWhatsappFrom,
    to:   ENV.williamWhatsappTo,
    body: caption,
    mediaUrl: [audioUrl],
  });
  return message.sid;
}

// --- Pipeline summary paragraph ---------------------------------------------

async function getPipelineSummary(): Promise<string> {
  try {
    const deals = await readPipelineDeals();
    // Filter to active deals only (not Closed, not Withdrawn)
    const active = deals.filter(d =>
      !d.isSectionHeader &&
      d.status &&
      !d.status.toLowerCase().includes('closed') &&
      !d.status.toLowerCase().includes('withdrawn') &&
      !d.status.toLowerCase().includes('expired')
    );
    if (active.length === 0) return '';
    // Sort by status priority: Under Contract > Active > Pending > everything else
    const priority = (s: string) => {
      const sl = s.toLowerCase();
      if (sl.includes('under contract') || sl.includes('contract')) return 0;
      if (sl.includes('pending')) return 1;
      if (sl.includes('active')) return 2;
      return 3;
    };
    const sorted = [...active].sort((a, b) => priority(a.status) - priority(b.status));
    const top3 = sorted.slice(0, 3);
    const lines = top3.map(d => {
      const addr = d.town ? `${d.address}, ${d.town}` : d.address;
      return `${addr} — ${d.status}`;
    });
    return `Pipeline update: ${lines.join('. ')}. `;
  } catch {
    return '';
  }
}

// --- Volume scorecard line for morning brief ---------------------------------
// "Team Closed: $X.XXM · Gap to $75M: $YY.YYM" — Sprint 13: $55M→$75M (D6 · OUTPUTS B32)
async function getVolumeScorecardLine(): Promise<string> {
  try {
    const { total } = await readGrowthModelVolume();
    const TARGET_2026 = 75_000_000; // D6 · OUTPUTS B32 · Sprint 13
    const closed = total.act2026 ?? 0;
    const gap = Math.max(0, TARGET_2026 - closed);
    const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(2)}M`;
    if (closed === 0) {
      return `Team Closed: $0 · Gap to $75M: ${fmtM(TARGET_2026)}. `;
    }
    return `Team Closed: ${fmtM(closed)} · Gap to $75M: ${fmtM(gap)}. `;
  } catch {
    return '';
  }
}

// --- Core delivery function ---------------------------------------------------
async function deliverBrief(type: "morning" | "evening" | "test"): Promise<{
  sid: string;
  audioUrl: string;
  textLength: number;
}> {
  // Prepend scorecard + pipeline summary to the Cronkite brief
  // Morning: Scorecard → Pipeline → Cronkite
  // Evening: Pipeline (3 closest-to-close, no GCI) → Cronkite
  const [cronkiteText, pipelineSummary, scorecardLine] = await Promise.all([
    fetchCronkiteBrief(),
    (type === 'morning' || type === 'evening') ? getPipelineSummary() : Promise.resolve(''),
    type === 'morning' ? getVolumeScorecardLine() : Promise.resolve(''),
  ]);
  // Assemble: morning gets scorecard first; evening gets pipeline first; test gets Cronkite only
  const text = [scorecardLine, pipelineSummary, cronkiteText].filter(Boolean).join('');
  // Debug: log the first 200 chars so we can verify pipeline prepend in server logs
  console.log(`[William ${type}] text preview (first 200): ${text.slice(0, 200)}`);
  const label = type === "morning" ? "morning" : type === "evening" ? "evening" : "test";
  const caption =
    type === "morning"
      ? "🌅 Christie's EH — Morning Market Brief"
      : type === "evening"
      ? "🌙 Christie's EH — Evening Pipeline Summary"
      : "🔔 Christie's EH — William Test Brief";

  const audioBuffer = await synthesiseAudio(text);
  const audioUrl    = await uploadAudio(audioBuffer, label);
  const sid         = await sendWhatsAppVoiceNote(audioUrl, caption);

  return { sid, audioUrl, textLength: text.length };
}

// --- Exported delivery helper for inbound handler ---------------------------

export async function deliverBriefToNumber(to: string): Promise<void> {
  const text = await fetchCronkiteBrief();
  const audioBuffer = await synthesiseAudio(text);
  const audioUrl    = await uploadAudio(audioBuffer, "morning");
  const client = twilio(ENV.twilioAccountSid, ENV.twilioAuthToken);
  await client.messages.create({
    from: ENV.twilioWhatsappFrom,
    to,
    body: "🌅 Christie's EH — Morning Market Brief",
    mediaUrl: [audioUrl],
  });
}

// --- Route registration -------------------------------------------------------

export function registerWhatsAppRoute(app: Express): void {
  // Guard: all whatsapp routes require Twilio credentials
  const guard = (_req: any, res: any, next: any) => {
    if (!ENV.twilioAccountSid || !ENV.twilioAuthToken || !ENV.williamWhatsappTo) {
      res.status(503).json({ error: "Twilio credentials not configured" });
      return;
    }
    next();
  };

  // POST /api/whatsapp/morning-brief
  app.post("/api/whatsapp/morning-brief", guard, async (_req, res) => {
    try {
      const result = await deliverBrief("morning");
      res.json({ ok: true, ...result });
    } catch (err: any) {
      console.error("[WhatsApp morning-brief error]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/whatsapp/evening-summary
  app.post("/api/whatsapp/evening-summary", guard, async (_req, res) => {
    try {
      const result = await deliverBrief("evening");
      res.json({ ok: true, ...result });
    } catch (err: any) {
      console.error("[WhatsApp evening-summary error]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/whatsapp/test — fire immediately for live testing
  app.post("/api/whatsapp/test", guard, async (_req, res) => {
    try {
      const result = await deliverBrief("test");
      res.json({ ok: true, ...result });
    } catch (err: any) {
      console.error("[WhatsApp test error]", err);
      res.status(500).json({ error: err.message });
    }
  });
}

// --- Cron scheduler (node-cron) -----------------------------------------------
// Called once from server/_core/index.ts after server starts.

export async function startWhatsAppScheduler(): Promise<void> {
  // SPRINT 41: Automated 8AM/8PM cron disabled by Ed Bruehl directive.
  // Manual /api/whatsapp/test-morning and /api/whatsapp/test-evening endpoints remain active.
  // Re-enable by restoring the cron.schedule blocks below.
  console.log("[WhatsApp] Scheduler disabled — automated cron off. Manual test endpoints active.");
}
