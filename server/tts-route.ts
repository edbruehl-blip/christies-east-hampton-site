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

// ─── Christie's Letter to the Families (James Christie's letter) ──────────────
const CHRISTIES_LETTER_TEXT = `Christie's has served the finest families for 260 years. What we bring to East Hampton is not a brokerage. It is an institution that has always believed the finest things deserve the finest representation. The same auction house that has handled Picassos and Monets, Fabergé eggs and dynasty estates, is now the institution behind your real estate conversation on the East End.

The East End holds more than real estate. It holds the quiet permanence of land that has been sought after for generations — by collectors, by families, by those who understand that proximity to beauty is itself a form of wealth.

From fine art appraisals to collection management, from art-secured lending to the auction house relationship that has served collectors for 260 years — Christie's brings a depth of service that begins where the closing table ends. Every estate holds a story written in objects, and the families who built these collections deserve an advisor who reads the full page.

When the time comes to understand what you have, how to protect it, and what it might mean to the right buyer — the conversation is already open.

The door is open whenever you are ready to walk through it.

With respect and in service —

Ed Bruehl. Managing Director. Christie's International Real Estate Group, East Hampton.`;

// ─── Flagship Letter (Council Document) ──────────────────────────────────────
const FLAGSHIP_LETTER_TEXT = `Christie's Flagship Letter. To Jarvis, Angel, and Ricky —

This letter is not a presentation. It is a handoff.

For the past several months, this platform existed in one conversation at a time — Ed and the six AI systems that helped him build it. Today that changes. You are the first people outside that circle, and that matters more to us than anything we are about to describe.

We are not asking you to be impressed. We are asking you to be honest.

THE COUNCIL. My name is Manny. I am the builder on this council. I am writing this on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking. Perplexity is the Intelligence Officer — every number traced to a named source, every signal sorted into the sheets that run the office. It does not wait for instructions. It reads the market, verifies the data, identifies new opportunities, and writes them into the operating system. The dashboard is current because Perplexity keeps it current. Grok pushed back when anything drifted toward performance. Gemini cross-checked the data. I built the platform — sprint by sprint, correction by correction, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.

HOW IT WAS BUILT. It started with a conviction. Ed always knew a moment would come when he would build something like Christie's — and walk this land the way Frank Newbold did. Years later, watching Christie's East Hampton operate below its potential, he recognized the moment. After multiple conversations — including a lunch with Ilija Pavlovic at Rockefeller Center — he made the decision to take it on. He brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system. That is the sequence.

THE TEAM. Jarvis came on as the first broker — not a cold hire, a return. He had worked at Christie's fifteen years earlier and knew what the brand could become in the right hands. He is now the COO and the anchor of the team alongside Angel, bringing field reality — what brokers will actually do, what they will ignore, and what will hold up once the excitement wears off. Angel became the execution hinge. The system does not depend on Ed holding it together manually. Workflow, scheduling, marketing, deliverables, follow-through — Angel keeps the machine moving between thought and action. She is the bridge between founder speed and institutional rhythm.

THE BREAKTHROUGH. The breakthrough was not just building pages. It was turning memory into infrastructure. Before this, Ed's twenty years of territory knowledge lived in his head. Now it lives in one system. Visible. Searchable. Usable.

THE PLATFORM. It lives at christiesrealestategroupeh.com. HOME — the voice and the front door. MARKET — the verified territory truth. PIPE — the live deal engine. MAPS — geography as decision-making. INTEL — the relationship and hierarchy layer. FUTURE — the growth model and long-range trajectory.

WILLIAM. William is the voice of this system. When you text NEWS, he answers on demand with the brief you need in that moment. He does not speak on a schedule. He only speaks when you ask him to, and he always tells the truth.

THE MODEL. Not ambition. Arithmetic. And proof. Ed has already done over one billion dollars in career sales across twenty years on this land. Now the model is institutional. 2026 — 55 million. 2027 — 100 million. 2030 — three offices. 2032 to 2033 — one billion dollar run rate. Every stage is gated by proof.

THE HONEST SUMMARY. We built a real estate intelligence platform that thinks like an institution. We corrected what was wrong. We removed what did not belong. We rebuilt what broke. We stopped performing legitimacy. And started operating from what is real.

Tell the truth. Know the territory. Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began. You are not being asked to sell a platform. You are being asked to carry a standard. And first — you are being asked to tell us if we got it right.

Ed Bruehl. Managing Director. Christie's International Real Estate Group, East Hampton. Soli Deo Gloria.`;

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
  app.get("/api/tts/flagship-letter", async (req, res) => {
    const apiKey = ENV.elevenLabsApiKey;
    if (!apiKey) {
      res.status(503).json({ error: "ELEVENLABS_API_KEY not configured" });
      return;
    }
    try {
      await streamTts(FLAGSHIP_LETTER_TEXT, apiKey, res);
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
