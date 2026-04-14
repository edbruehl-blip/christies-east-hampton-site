import type { Express } from "express";
import { ENV } from "./_core/env";
import { fetchYF, fetchMortgageRate } from "./market-route";
import { FLAGSHIP_LETTER_TEXT, CHRISTIES_LETTER_TEXT } from "./letter-content";

// ─── Founding Letter (Ed Bruehl — private, not exposed as a button) ──────────
const FOUNDING_LETTER = `Christie's East Hampton. A letter from the desk.

Art. Beauty. Provenance. Since 1766.

Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.

The East End is not a market. It is a territory — eleven distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.

This platform exists to carry the Christie's standard into every conversation, every deal brief, every family meeting on the East End. Not to impress. To serve.

The door is always open whenever you are ready to walk through it.

Ed Bruehl. Managing Director. Christie's International Real Estate Group, East Hampton.`;

// ─── Letter texts imported from ./letter-content.ts ─────────────────────────
// FLAGSHIP_LETTER_TEXT and CHRISTIES_LETTER_TEXT are imported at the top of this file.
// Do not redefine them here. Edit letter-content.ts to update the letter content.


// ─── Market Intelligence Brief — static fallback ──────────────────────────────
// Used when live data is unavailable. The dynamic endpoint assembles fresh data each call.
const MARKET_REPORT_FALLBACK = `Good morning. Here is your Christie's East Hampton market brief. East End, 2026.

The Hamptons Median is 2.34 million dollars across all eleven hamlets, East End, first quarter 2026. This represents a 7 percent year-over-year increase driven by East Hampton Village, Southampton Village, and Bridgehampton.

Hamlet Atlas.
Sagaponack. Median: 7.5 million dollars. Year-over-year volume: plus 4 percent. Sagaponack remains the most land-constrained, price-dense hamlet on the East End. Generational asset territory.
East Hampton Village. Median: 5.15 million dollars. Year-over-year volume: plus 12 percent. The institutional core of the Hamptons market. South of the Highway commands a premium of 30 to 45 percent over comparable properties north of the highway.
Bridgehampton. Median: 5.1 million dollars. Year-over-year volume: plus 8 percent. The most active trophy corridor. New construction is driving absorption.
Southampton Village. Median: 3.55 million dollars. Year-over-year volume: plus 14 percent. The strongest volume growth in the trophy tier.
Water Mill. Median: 4.2 million dollars. Year-over-year volume: plus 7 percent. Equestrian corridor. Land value is the primary driver.
Amagansett. Median: 4.25 million dollars. Year-over-year volume: plus 9 percent. The emerging premier corridor.
East Hampton North. Median: 2.03 million dollars. Year-over-year volume: plus 18 percent. The highest volume growth in the entire matrix.
Wainscott. Median: 3.6 million dollars. Year-over-year volume: plus 10 percent. Anchored by the March 2026 record sale at 115 Beach Lane at 59 million dollars. CIS 8.8 — thin sample, 10 to 20 transactions per year. A quiet, land-rich corridor between East Hampton Village and Bridgehampton.
Sag Harbor. Median: 2.85 million dollars. Year-over-year volume: plus 11 percent. The most walkable hamlet on the East End.
Springs. Median: 1.35 million dollars. Year-over-year volume: plus 17 percent. The most honest value proposition on the East End.
Montauk. Median: 2.24 million dollars. Year-over-year volume: plus 9 percent. The eastern anchor of the East End.

Christie's East Hampton. 26 Park Place, East Hampton, New York. 646-752-1233. Here to serve you the way James Christie did, since 1766.`;

const VOICE_ID = "fjnwTZkKtQOJaYzGLa6n";

// ─── Server-side audio cache ──────────────────────────────────────────────────
// Pre-generates flagship letter audio once on startup so the button is instant.
// Avoids desktop fetch timeout caused by ElevenLabs latency (8–15s for 4K chars).
let flagshipAudioCache: Buffer | null = null;
let flagshipCachePromise: Promise<Buffer | null> | null = null;

async function generateFlagshipAudio(apiKey: string): Promise<Buffer | null> {
  try {
    console.log('[TTS] Pre-generating flagship letter audio cache...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min timeout
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: FLAGSHIP_LETTER_TEXT,
          model_id: 'eleven_turbo_v2',
          voice_settings: { stability: 0.55, similarity_boost: 0.75 },
        }),
      }
    );
    clearTimeout(timeout);
    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error(`[TTS] Cache generation failed ${elevenRes.status}: ${errText}`);
      return null;
    }
    const arrayBuffer = await elevenRes.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    console.log(`[TTS] Flagship letter audio cached — ${buf.length} bytes`);
    return buf;
  } catch (err) {
    console.error('[TTS] Cache generation error:', err);
    return null;
  }
}

export function warmFlagshipCache(apiKey: string) {
  if (flagshipCachePromise) return; // already warming
  flagshipCachePromise = generateFlagshipAudio(apiKey).then(buf => {
    flagshipAudioCache = buf;
    return buf;
  });
}

// ─── Shared TTS handler ────────────────────────────────────────────────────────
async function streamTts(text: string, apiKey: string, res: import("express").Response) {
  const elevenRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
        },
      }),
    }
  );
  if (!elevenRes.ok) {
    const errText = await elevenRes.text();
    console.error(`[TTS] ElevenLabs error ${elevenRes.status}: ${errText}`);
    res.status(elevenRes.status).json({ error: errText });
    return;
  }
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Accept-Ranges", "bytes"); // Allows browser seek/skip on streamed audio
  const reader = elevenRes.body?.getReader();
  if (!reader) {
    res.status(500).json({ error: "No response body from ElevenLabs" });
    return;
  }
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
}

// ─── Dynamic Market Intelligence Brief ────────────────────────────────────────
// Assembles a fresh spoken brief from live market data + Perplexity narrative each call.
async function buildDynamicMarketBrief(): Promise<string> {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // 1. Fetch live market prices in parallel
  let sp500 = "unavailable";
  let gold = "unavailable";
  let mortgage = "unavailable";
  let vix = "unavailable";

  try {
    const [spData, goldData, mortgageData, vixData] = await Promise.allSettled([
      fetchYF("%5EGSPC"),
      fetchYF("GC%3DF"),
      fetchMortgageRate(),
      fetchYF("%5EVIX"),
    ]);

    if (spData.status === "fulfilled" && spData.value) {
      const d = spData.value;
      const dir = d.change >= 0 ? "up" : "down";
      sp500 = `${d.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, ${dir} ${Math.abs(d.change).toFixed(2)} percent`;
    }
    if (goldData.status === "fulfilled" && goldData.value) {
      const d = goldData.value;
      const dir = d.change >= 0 ? "up" : "down";
      gold = `${d.price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} dollars per ounce, ${dir} ${Math.abs(d.change).toFixed(2)} percent`;
    }
    if (mortgageData.status === "fulfilled") {
      mortgage = mortgageData.value.rate;
    }
    if (vixData.status === "fulfilled" && vixData.value) {
      vix = vixData.value.price.toFixed(2);
    }
  } catch (err) {
    console.warn("[TTS] Market data fetch partial failure:", err);
  }

  // 2. Call Perplexity for a fresh Hamptons market narrative
  let perplexityNarrative = "";
  try {
    const perplexityKey = ENV.perplexityApiKey;
    if (perplexityKey) {
      const pRes = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${perplexityKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: `You are William, the voice intelligence system for Christie's East Hampton. You deliver concise, factual spoken market intelligence. Today is ${today}. Use only named sources published within the last 30 days. No speculation. No unnamed sources. Speak in natural prose suitable for audio — no bullet points, no headers, no markdown. Three to four sentences maximum.`,
            },
            {
              role: "user",
              content: "Give me the single most important Hamptons luxury real estate market development from the past 30 days. Named transaction or named report only. One to two sentences. Then give me one sentence on Christie's International Real Estate news if any. Then one sentence on UHNW buyer activity if any named source exists.",
            },
          ],
          max_tokens: 200,
          temperature: 0.1,
        }),
      });
      if (pRes.ok) {
        const pData = await pRes.json() as { choices: Array<{ message: { content: string } }> };
        const raw = pData.choices[0]?.message?.content ?? "";
        // Strip any markdown artifacts
        perplexityNarrative = raw.replace(/[#*_`]/g, "").trim();
      }
    }
  } catch (err) {
    console.warn("[TTS] Perplexity narrative fetch failed:", err);
  }

  // 3. Assemble the spoken brief
  const marketSection = perplexityNarrative
    ? `Market Intelligence. ${perplexityNarrative}`
    : "Market Intelligence. No new named Hamptons transactions have been confirmed in the past 30 days. The verified 2026 East End median remains 2.34 million dollars.";

  const script = `Good morning. Here is your Christie's East Hampton market brief.

${marketSection}

Capital Markets. S&P 500 is at ${sp500}. Gold is at ${gold}. The 30-year fixed mortgage rate is ${mortgage}. VIX is at ${vix}.

Hamlet Atlas. Verified 2026 medians. Sagaponack, 7.5 million dollars. East Hampton Village, 5.15 million dollars. Bridgehampton, 5.1 million dollars. Southampton Village, 3.55 million dollars. Water Mill, 4.2 million dollars. Amagansett, 4.25 million dollars. East Hampton North, 2.03 million dollars. Wainscott, 3.6 million dollars. Sag Harbor, 2.85 million dollars. Springs, 1.35 million dollars. Montauk, 2.24 million dollars.

Christie's East Hampton. 26 Park Place, East Hampton, New York. 646-752-1233. Here to serve you the way James Christie did, since 1766.`;

  return script;
}

export function registerTtsRoute(app: Express) {
  // GET /api/tts/founding-letter — private founding letter (not exposed as a button)
  app.get("/api/tts/founding-letter", async (req, res) => {
    const apiKey = ENV.elevenLabsApiKey;
    if (!apiKey) {
      res.status(503).json({ error: "ELEVENLABS_API_KEY not configured" });
      return;
    }
    try {
      await streamTts(FOUNDING_LETTER, apiKey, res);
    } catch (err) {
      console.error("[TTS] Unexpected error:", err);
      if (!res.headersSent) res.status(500).json({ error: "TTS generation failed" });
    }
  });

  // GET /api/tts/christies-letter — James Christie's letter to the families
  app.get("/api/tts/christies-letter", async (req, res) => {
    const apiKey = ENV.elevenLabsApiKey;
    if (!apiKey) {
      res.status(503).json({ error: "ELEVENLABS_API_KEY not configured" });
      return;
    }
    try {
      await streamTts(CHRISTIES_LETTER_TEXT, apiKey, res);
    } catch (err) {
      console.error("[TTS] Unexpected error:", err);
      if (!res.headersSent) res.status(500).json({ error: "TTS generation failed" });
    }
  });

  // GET /api/tts/flagship-letter — Christie's Flagship Letter (council document)
  // Serves from in-memory cache with HTTP Range support for browser streaming.
  // Range support is critical: without it, browsers must download the full ~9MB
  // before playback starts. With Accept-Ranges + Range handling, audio begins
  // within ~2 seconds as the browser fetches only the first chunk it needs.
  app.get("/api/tts/flagship-letter", async (req, res) => {
    const apiKey = ENV.elevenLabsApiKey;
    if (!apiKey) {
      res.status(503).json({ error: "ELEVENLABS_API_KEY not configured" });
      return;
    }
    try {
      // Resolve the buffer (from cache or wait for it)
      let buf: Buffer | null = flagshipAudioCache;
      if (!buf && flagshipCachePromise) {
        buf = await Promise.race([
          flagshipCachePromise,
          new Promise<null>(resolve => setTimeout(() => resolve(null), 30000)),
        ]);
      }

      if (buf) {
        const total = buf.length;
        const rangeHeader = req.headers['range'];

        if (rangeHeader) {
          // Handle Range: bytes=start-end for progressive streaming
          const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
          if (match) {
            const start = parseInt(match[1], 10);
            const end = match[2] ? parseInt(match[2], 10) : total - 1;
            const chunkSize = end - start + 1;
            res.writeHead(206, {
              'Content-Type': 'audio/mpeg',
              'Content-Range': `bytes ${start}-${end}/${total}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize,
              'Cache-Control': 'no-store',
            });
            res.end(buf.subarray(start, end + 1));
            return;
          }
        }

        // Full response — include Accept-Ranges so browser knows it can seek/stream
        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-Length': total,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-store',
        });
        res.end(buf);
        return;
      }

      // Cache unavailable — fall back to live stream
      await streamTts(FLAGSHIP_LETTER_TEXT, apiKey, res);
    } catch (err) {
      console.error("[TTS] Unexpected error:", err);
      if (!res.headersSent) res.status(500).json({ error: "TTS generation failed" });
    }
  });

  // GET /api/tts/market-report — Dynamic Market Intelligence Brief
  // Assembles live market prices + Perplexity narrative each call.
  // Falls back to static script if APIs are unavailable.
  app.get("/api/tts/market-report", async (req, res) => {
    const apiKey = ENV.elevenLabsApiKey;
    if (!apiKey) {
      res.status(503).json({ error: "ELEVENLABS_API_KEY not configured" });
      return;
    }
    try {
      let script: string;
      try {
        script = await buildDynamicMarketBrief();
      } catch (buildErr) {
        console.warn("[TTS] Dynamic brief build failed, using fallback:", buildErr);
        script = MARKET_REPORT_FALLBACK;
      }
      await streamTts(script, apiKey, res);
    } catch (err) {
      console.error("[TTS] Unexpected error:", err);
      if (!res.headersSent) res.status(500).json({ error: "TTS generation failed" });
    }
  });
}
