import type { Express } from "express";
import { ENV } from "./_core/env";

// ─── Founding letter text ──────────────────────────────────────────────────────
const FOUNDING_LETTER = `Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.

The South Fork is not a market. It is a territory — eleven distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.

This platform exists to carry the Christie's standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.

The Christie's Intelligence Score is not a sales tool. It is a discipline. Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate.

The eleven hamlets of the South Fork represent the most concentrated wealth corridor in the northeastern United States. East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton Village. Sag Harbor. Amagansett. Wainscott. East Hampton North. Springs. Montauk. Each one has a story. Each one has a price. Each one has a buyer.

Christie's East Hampton is not a brokerage. It is a standard. The auction house has been the authority on provenance, value, and discretion for 260 years. That authority now extends to the South Fork.

The families who built this territory deserve representation that matches the weight of their decisions. Not a pitch. Not a presentation. A system. A process that has been tested, scored, and proven.

Every export from this platform — every market report, every deal brief, every CMA — carries the Christie's name because it has earned the right to carry it. The standard is not aspirational. It is operational.

Not a pitch. A system. Not a promise. A process that has been tested, scored, and proven.`;

// ─── Full market report text ───────────────────────────────────────────────────
const MARKET_REPORT_TEXT = `Christie's East Hampton — Live Market Report. Q1 2026.

Hamptons Local Intelligence.

East Hampton Town. The East Hampton Town Board has approved a new affordable housing overlay district along Springs Fireplace Road, adding 48 units of workforce housing to the corridor. The Planning Board is reviewing a 12-lot subdivision on Accabonac Road with a public hearing scheduled for April. The East Hampton School District reported a 4.2 percent enrollment increase, the largest in a decade, driven by year-round residency growth.

Southampton Town. Southampton Town has extended its moratorium on new short-term rental permits through December 2026, citing neighborhood character concerns in Bridgehampton and Water Mill. The Bridgehampton Commons redevelopment proposal — a mixed-use retail and residential project — received preliminary approval. Southampton Village is advancing a 12 million dollar Main Street infrastructure upgrade.

Sag Harbor. The Sag Harbor Village Board approved the Watchcase Factory residential conversion final phase, adding 22 luxury units to the historic complex. The Sag Harbor Cinema restoration is on schedule for a summer 2026 reopening. The village is reviewing a proposal to expand the waterfront park along Long Wharf.

Market Intelligence.

Capital Flow Signal: Strong Inflow. Institutional and family office capital continues to flow into the South Fork at elevated levels. The 30-year fixed mortgage rate is holding at 6.38 percent — above the 2021 historic low but within the range that qualified Hamptons buyers have historically absorbed. The 10-year Treasury is at 4.81 percent. The VIX volatility index is at 30.61, reflecting macro uncertainty, but Hamptons transaction volume remains insulated from equity market volatility at the ultra-trophy tier.

The Hamptons Median is 2.34 million dollars across all eleven hamlets, South Fork, first quarter 2026. This represents a 7 percent year-over-year increase driven by East Hampton Village, Southampton Village, and Bridgehampton.

Hamlet Atlas.

Sagaponack. CIS Score: 9.4. Median: 7.5 million dollars. Year-over-year volume: plus 4 percent. Sagaponack remains the most land-constrained, price-dense hamlet on the South Fork. Generational asset territory. Christie's standard.

East Hampton Village. CIS Score: 9.2. Median: 5.15 million dollars. Year-over-year volume: plus 12 percent. The institutional core of the Hamptons market. South of the Highway commands a premium of 30 to 45 percent over comparable properties north of the highway.

Bridgehampton. CIS Score: 9.1. Median: 5.1 million dollars. Year-over-year volume: plus 8 percent. The most active trophy corridor. New construction is driving absorption. Buyer profile is predominantly family office and second-generation wealth.

Southampton Village. CIS Score: 9.0. Median: 3.55 million dollars. Year-over-year volume: plus 14 percent. The strongest volume growth in the trophy tier. Main Street infrastructure investment is accelerating buyer confidence.

Water Mill. CIS Score: 8.8. Median: 4.2 million dollars. Year-over-year volume: plus 7 percent. Equestrian corridor. Land value is the primary driver. New construction premium is significant.

Amagansett. CIS Score: 8.9. Median: 4.25 million dollars. Year-over-year volume: plus 9 percent. The emerging premier corridor. Beach access and proximity to East Hampton Village are the primary value drivers.

East Hampton North. CIS Score: 8.6. Median: 2.03 million dollars. Year-over-year volume: plus 18 percent. The highest volume growth in the entire matrix. Entry-point buyers are discovering the corridor.

Wainscott. CIS Score: 8.5. Median: 3.18 million dollars. Year-over-year volume: plus 10 percent. A quiet, land-rich corridor between East Hampton Village and Bridgehampton. Understated and undervalued.

Sag Harbor. CIS Score: 8.4. Median: 2.85 million dollars. Year-over-year volume: plus 11 percent. The most walkable hamlet on the South Fork. The Watchcase conversion and Cinema restoration are catalysts for continued appreciation.

Springs. CIS Score: 6.8. Median: 1.35 million dollars. Year-over-year volume: plus 17 percent. The most honest value proposition on the East End. Artist community. Authentic character. The entry point for buyers who understand the South Fork.

Montauk. CIS Score: 8.2. Median: 2.24 million dollars. Year-over-year volume: plus 9 percent. The eastern anchor of the South Fork. Oceanfront character, year-round community, and a buyer profile that values authenticity over prestige.

Christie's East Hampton. 26 Park Place, East Hampton, New York. 646-752-1233. We look forward to seeing you at 26 Park Place — here to serve you the way James Christie did, since 1766.`;

const VOICE_ID = "fjnwTZkKtQOJaYzGLa6n";

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
        model_id: "eleven_multilingual_v2",
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

export function registerTtsRoute(app: Express) {
  // GET /api/tts/founding-letter — reads only the founding letter
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

  // GET /api/tts/market-report — reads the full market report (news + intel + hamlet atlas)
  app.get("/api/tts/market-report", async (req, res) => {
    const apiKey = ENV.elevenLabsApiKey;
    if (!apiKey) {
      res.status(503).json({ error: "ELEVENLABS_API_KEY not configured" });
      return;
    }
    try {
      await streamTts(MARKET_REPORT_TEXT, apiKey, res);
    } catch (err) {
      console.error("[TTS] Unexpected error:", err);
      if (!res.headersSent) res.status(500).json({ error: "TTS generation failed" });
    }
  });
}
