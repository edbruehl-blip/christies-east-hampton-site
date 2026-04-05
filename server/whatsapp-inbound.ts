/**
 * WhatsApp Inbound Webhook
 * ─────────────────────────────────────────────────────────────────────────────
 * Receives inbound WhatsApp messages from Twilio at:
 *   POST /api/whatsapp/inbound
 *
 * Supported commands (case-insensitive):
 *   NEWS   — 14-category Cronkite intelligence brief via Perplexity, delivered
 *            as ElevenLabs William voice note
 *   PIPE   — Last 5 pipeline deals from Google Sheet (text reply)
 *   STATUS — Active listing count + pipeline summary (text reply)
 *   BRIEF  — Trigger morning brief immediately (voice note)
 *   HELP   — List available commands (text reply)
 *
 * Twilio webhook URL:
 *   https://www.christiesrealestategroupeh.com/api/whatsapp/inbound
 *
 * Twilio validates requests via X-Twilio-Signature header.
 * In production, validate with twilio.validateRequest().
 */
import type { Express } from "express";
import { ENV } from "./_core/env";
import { storagePut } from "./storage";
import twilio from "twilio";

// ─── Perplexity 14-category Cronkite prompt ───────────────────────────────────
const CRONKITE_SYSTEM_PROMPT = `You are William, the Christie's East Hampton intelligence officer. You deliver a concise authoritative spoken brief in the voice of Walter Cronkite — measured, precise, and gravely important. No filler. No hedging. No assumptions. No estimates. Only verified intelligence attributed to named sources. If you cannot name the source, the sentence does not appear. Format as a spoken brief, not a list. Short declarative sentences. Maximum 400 words. Begin immediately with category one.`;

const CRONKITE_USER_PROMPT = `Deliver the Christie's East Hampton 14-category intelligence brief. Each category must contain only information sourced from a named publication, report, or data provider with a date. If you cannot attribute a statement to a specific named source published within the last 30 days, do not include it. No estimates. No assumptions. No broad market characterizations without a citation. William reads what happened, not what might be happening.

For category one, use only these verified 2025 medians as the Hamptons data foundation — do not source hamlet prices from the web. Sagaponack $8.04M. East Hampton Village $5.25M. Bridgehampton $4.47M. Southampton Village $4.385M. Water Mill $4.55M. Amagansett $4.35M. Wainscott $3.18M. East Hampton North $2.03M. Sag Harbor $2.80M. Montauk $2.24M. Springs $1.58M. Source: Saunders 2024 versus 2025 annual report cross-referenced William Raveis YE 2025.

Cover each category in one to two sentences. Deliver as a spoken brief. Begin now.

One — Hamptons Luxury Real Estate Market. Source only named transactions or reports published within 30 days. Two — Christie's International Real Estate. Global auction results and brand news from Christie's official releases only. Three — Ultra-High-Net-Worth Buyer Activity. Named sources only. No characterizations of unnamed buyer behavior. Four — Competing Brokerage Intelligence. Named firms, named agents, named transactions only. Five — Federal Reserve and Mortgage Rate Watch. Current Freddie Mac PMMS rate and Fed statement language only. Six — Equity Markets and Wealth Effect. Named index levels from today only. S&P 500, VIX, 10-year Treasury. Seven — Hamptons Development and Zoning. Named projects, named municipalities, named board decisions only. Eight — Christie's Auction Calendar. Upcoming named sales with estimates from Christie's official calendar only. Nine — Private Collector Market. Named auction results or named publications within 30 days only. Ten — Hamptons Social and Cultural Calendar. Named events with confirmed dates only. Eleven — Geopolitical Risk and Safe-Haven Demand. Named geopolitical events from named news sources only. Twelve — Recruiting Intelligence. Named agents, named firms, named moves from named publications only. Thirteen — Media and Press. Named articles from named publications within 7 days only. Fourteen — Scripture. One verse. Tuned to today's macro tone. Book, chapter, verse cited.

Close with Soli Deo Gloria.`;

// ─── Fetch news brief from Perplexity ─────────────────────────────────────────
export async function fetchCronkiteBrief(): Promise<string> {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.perplexityApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: CRONKITE_SYSTEM_PROMPT },
        { role: "user", content: CRONKITE_USER_PROMPT },
      ],
      max_tokens: 600,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Perplexity API error: ${response.status} — ${err}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content ?? "No brief available at this time.";
}

// ─── ElevenLabs synthesis ─────────────────────────────────────────────────────
const ELEVENLABS_VOICE_ID = "N2lVS1w4EtoT3dr4eOWO"; // William
const ELEVENLABS_MODEL    = "eleven_multilingual_v2";

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

// ─── Upload to S3 ─────────────────────────────────────────────────────────────
async function uploadAudio(buffer: Buffer, label: string): Promise<string> {
  const key = `whatsapp-briefs/${label}-${Date.now()}.mp3`;
  const { url } = await storagePut(key, buffer, "audio/mpeg");
  return url;
}


// ─── 6-hour Cronkite brief cache ─────────────────────────────────────────────
// Avoids redundant Perplexity + ElevenLabs calls when NEWS is texted multiple
// times within the same morning. Cache is in-memory (process lifetime).
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
let briefCache: { audioUrl: string; generatedAt: number } | null = null;

function getCachedBrief(): string | null {
  if (!briefCache) return null;
  if (Date.now() - briefCache.generatedAt > SIX_HOURS_MS) {
    briefCache = null;
    return null;
  }
  return briefCache.audioUrl;
}

function setBriefCache(audioUrl: string): void {
  briefCache = { audioUrl, generatedAt: Date.now() };
}

// ─── Send WhatsApp reply ──────────────────────────────────────────────────────
async function sendTextReply(to: string, body: string): Promise<void> {
  const client = twilio(ENV.twilioAccountSid, ENV.twilioAuthToken);
  await client.messages.create({
    from: ENV.twilioWhatsappFrom,
    to,
    body,
  });
}

async function sendVoiceReply(to: string, audioUrl: string, caption: string): Promise<void> {
  const client = twilio(ENV.twilioAccountSid, ENV.twilioAuthToken);
  await client.messages.create({
    from: ENV.twilioWhatsappFrom,
    to,
    body: caption,
    mediaUrl: [audioUrl],
  });
}

// ─── Command handlers ─────────────────────────────────────────────────────────

async function handleNews(to: string): Promise<void> {
  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // Check 6-hour cache before calling Perplexity + ElevenLabs
  const cachedUrl = getCachedBrief();
  if (cachedUrl) {
    console.log("[WhatsApp NEWS] Serving cached brief (< 6h old)");
    await sendVoiceReply(
      to,
      cachedUrl,
      "📰 Christie's East Hampton — Intelligence Brief · " + dateLabel
    );
    return;
  }

  // Cache miss — generate fresh brief
  await sendTextReply(to, "🎙️ Fetching your Christie's intelligence brief. William will deliver it in 30 seconds…");

  const briefText = await fetchCronkiteBrief();
  const intro = "This is William with your Christie's East Hampton intelligence brief. ";
  const fullText = intro + briefText;

  const audioBuffer = await synthesiseAudio(fullText);
  const audioUrl    = await uploadAudio(audioBuffer, "news-brief");

  // Cache the result for 6 hours
  setBriefCache(audioUrl);

  await sendVoiceReply(
    to,
    audioUrl,
    "📰 Christie's East Hampton — Intelligence Brief · " + dateLabel
  );
}

async function handleBrief(to: string): Promise<void> {
  await sendTextReply(to, "🌅 Triggering morning brief now…");
  // Import and reuse the morning brief from whatsapp-route
  const { deliverBriefToNumber } = await import("./whatsapp-route");
  await deliverBriefToNumber(to);
}

async function handleStatus(to: string): Promise<void> {
  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  await sendTextReply(
    to,
    `📊 Christie's East Hampton — Status Report · ${now}\n\n` +
    `Platform: LIVE at christiesrealestategroupeh.com\n` +
    `Pipeline: Active — check PIPE tab for current deals\n` +
    `Intelligence Web: 43 entities tracked\n` +
    `Next brief: 8:00 AM Eastern\n\n` +
    `Reply NEWS for intelligence brief · PIPE for pipeline · BRIEF for morning brief`
  );
}

async function handlePipe(to: string): Promise<void> {
  // Pull last 5 active deals from the Pipeline Sheet
  try {
    const { readPipelineDeals } = await import("./sheets-helper");
    const deals = await readPipelineDeals();
    const active = deals
      .filter(d => !d.isSectionHeader && d.address && d.price)
      .slice(0, 5);

    if (active.length === 0) {
      await sendTextReply(to, "📋 No active pipeline deals found.");
      return;
    }

    const lines = active.map(d =>
      `• ${d.address}${d.town ? `, ${d.town}` : ""} — ${d.status || "Active"} — ${d.price || "Price TBD"}`
    );

    await sendTextReply(
      to,
      `📋 Christie's EH Pipeline — Top ${active.length} Deals\n\n` +
      lines.join("\n") +
      `\n\nFull pipeline: christiesrealestategroupeh.com (PIPE tab)`
    );
  } catch (err) {
    await sendTextReply(to, "📋 Pipeline data temporarily unavailable. Check the PIPE tab directly.");
  }
}

async function handleHelp(to: string): Promise<void> {
  await sendTextReply(
    to,
    `🏛️ Christie's East Hampton — William Command Center\n\n` +
    `Available commands:\n` +
    `  NEWS   — 14-category intelligence brief (voice)\n` +
    `  PIPE   — Pipeline deal summary\n` +
    `  STATUS — Platform status report\n` +
    `  BRIEF  — Morning brief (voice)\n` +
    `  HELP   — This menu\n\n` +
    `26 Park Place, East Hampton · 646-752-1233`
  );
}

// ─── Route registration ───────────────────────────────────────────────────────
export function registerWhatsAppInbound(app: Express): void {
  // POST /api/whatsapp/inbound — Twilio webhook
  app.post("/api/whatsapp/inbound", async (req, res) => {
    // Respond 200 immediately so Twilio does not retry
    res.status(200).send("<Response></Response>");

    const body: string = (req.body?.Body ?? "").trim().toUpperCase();
    const from: string = req.body?.From ?? "";

    if (!from) {
      console.warn("[WhatsApp inbound] No From number in request");
      return;
    }

    console.log(`[WhatsApp inbound] Command: "${body}" from ${from}`);

    try {
      if (body === "NEWS") {
        await handleNews(from);
      } else if (body === "PIPE" || body === "PIPELINE") {
        await handlePipe(from);
      } else if (body === "STATUS") {
        await handleStatus(from);
      } else if (body === "BRIEF" || body === "MORNING") {
        await handleBrief(from);
      } else if (body === "HELP" || body === "?") {
        await handleHelp(from);
      } else {
        // Unknown command — send help menu
        await handleHelp(from);
      }
    } catch (err: any) {
      console.error(`[WhatsApp inbound] Handler error for command "${body}":`, err);
      try {
        await sendTextReply(from, `⚠️ Command failed: ${err.message ?? "Unknown error"}. Try again or reply HELP.`);
      } catch (_) {
        // Swallow secondary error
      }
    }
  });

  console.log("[WhatsApp] Inbound webhook registered at POST /api/whatsapp/inbound");
}
