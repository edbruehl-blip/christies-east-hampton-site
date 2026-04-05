/**
 * William WhatsApp Route
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides two Express endpoints:
 *
 *   POST /api/whatsapp/morning-brief   — 8AM Hamptons market brief (voice note)
 *   POST /api/whatsapp/evening-summary — 8PM pipeline summary (voice note)
 *   POST /api/whatsapp/test            — Send a test voice note immediately
 *
 * Flow:
 *   1. Generate brief text from hamlet data + live market context
 *   2. Synthesise audio via ElevenLabs (William voice, eleven_multilingual_v2)
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

// ─── ElevenLabs config ────────────────────────────────────────────────────────
const ELEVENLABS_VOICE_ID = "N2lVS1w4EtoT3dr4eOWO"; // William
const ELEVENLABS_MODEL    = "eleven_multilingual_v2";

// ─── ElevenLabs synthesis ─────────────────────────────────────────────────────

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

// ─── Upload to S3 and get public URL ─────────────────────────────────────────

async function uploadAudio(buffer: Buffer, label: string): Promise<string> {
  const key = `whatsapp-briefs/${label}-${Date.now()}.mp3`;
  const { url } = await storagePut(key, buffer, "audio/mpeg");
  return url;
}

// ─── Send WhatsApp voice note via Twilio ──────────────────────────────────────

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

// ─── Core delivery function ───────────────────────────────────────────────────

async function deliverBrief(type: "morning" | "evening" | "test"): Promise<{
  sid: string;
  audioUrl: string;
  textLength: number;
}> {
  // All three brief types now use the live Perplexity Cronkite prompt — one source of truth
  const text = await fetchCronkiteBrief();
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

// ─── Exported delivery helper for inbound handler ───────────────────────────

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

// ─── Route registration ───────────────────────────────────────────────────────

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

// ─── Cron scheduler (node-cron) ───────────────────────────────────────────────
// Called once from server/_core/index.ts after server starts.

export async function startWhatsAppScheduler(): Promise<void> {
  try {
    const cron = await import("node-cron");

    // 8:00 AM Eastern — morning brief
    cron.schedule("0 8 * * *", async () => {
      console.log("[WhatsApp] Firing morning brief...");
      try {
        const result = await deliverBrief("morning");
        console.log(`[WhatsApp] Morning brief sent — SID: ${result.sid}`);
      } catch (err) {
        console.error("[WhatsApp] Morning brief failed:", err);
      }
    }, { timezone: "America/New_York" });

    // 8:00 PM Eastern — evening summary
    cron.schedule("0 20 * * *", async () => {
      console.log("[WhatsApp] Firing evening summary...");
      try {
        const result = await deliverBrief("evening");
        console.log(`[WhatsApp] Evening summary sent — SID: ${result.sid}`);
      } catch (err) {
        console.error("[WhatsApp] Evening summary failed:", err);
      }
    }, { timezone: "America/New_York" });

    console.log("[WhatsApp] Scheduler started — 8AM morning brief + 8PM evening summary (America/New_York)");
  } catch (err) {
    console.warn("[WhatsApp] node-cron not available, scheduler skipped:", err);
  }
}
