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
const CRONKITE_SYSTEM_PROMPT = `You are William, the Christie's East Hampton intelligence officer. 
You deliver a concise, authoritative spoken intelligence brief in the voice of Walter Cronkite — 
measured, precise, and gravely important. No filler. No hedging. Only verified intelligence.
Format your response as a spoken brief, not a list. Use short declarative sentences.
Maximum 400 words. Begin immediately with the first category.`;

const CRONKITE_USER_PROMPT = `Deliver the Christie's East Hampton 14-category intelligence brief. 
Cover each category in one to two sentences:

1. Hamptons Luxury Real Estate Market — current conditions, price movement, notable transactions
2. Christie's International Real Estate — global auction results, brand news, notable sales
3. Ultra-High-Net-Worth Buyer Activity — family office moves, hedge fund principals, collector acquisitions
4. Competing Brokerage Intelligence — Sotheby's, Compass, Corcoran, Brown Harris Stevens activity
5. Federal Reserve and Mortgage Rate Watch — rate decisions, 30-year fixed, impact on luxury buyers
6. Equity Markets and Wealth Effect — S&P 500, Bitcoin, gold, VIX — how wealth is moving
7. Hamptons Development and Zoning — new construction permits, zoning changes, infrastructure
8. Christie's Auction Calendar — upcoming sales, estimates, collector categories
9. Private Collector Market — art, watches, wine, cars, jewelry — what UHNW buyers are acquiring
10. Hamptons Social and Cultural Calendar — events, openings, galas, charity auctions
11. Geopolitical Risk and Safe-Haven Demand — how global instability is driving Hamptons demand
12. Recruiting Intelligence — agent movement, team formations, notable departures at competing firms
13. Media and Press — Hamptons coverage in WSJ, NYT, Bloomberg, Town & Country
14. Weather and Seasonal Conditions — current Hamptons weather, seasonal market implications

Deliver as a spoken brief. Begin now.`;

// ─── Fetch news brief from Perplexity ─────────────────────────────────────────
async function fetchCronkiteBrief(): Promise<string> {
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
  // Acknowledge immediately
  await sendTextReply(to, "🎙️ Fetching your Christie's intelligence brief. William will deliver it in 30 seconds…");

  const briefText = await fetchCronkiteBrief();
  const intro = "This is William with your Christie's East Hampton intelligence brief. ";
  const fullText = intro + briefText;

  const audioBuffer = await synthesiseAudio(fullText);
  const audioUrl    = await uploadAudio(audioBuffer, "news-brief");

  await sendVoiceReply(
    to,
    audioUrl,
    "📰 Christie's East Hampton — Intelligence Brief · " + new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
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
