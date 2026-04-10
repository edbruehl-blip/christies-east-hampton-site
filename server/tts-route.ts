import type { Express } from "express";
import { ENV } from "./_core/env";
import { fetchYF, fetchMortgageRate } from "./market-route";

// ─── Founding Letter (Ed Bruehl — private, not exposed as a button) ──────────
const FOUNDING_LETTER = `Christie's East Hampton. A letter from the desk.

Art. Beauty. Provenance. Since 1766.

Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.

The East End is not a market. It is a territory — eleven distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.

This platform exists to carry the Christie's standard into every conversation, every deal brief, every family meeting on the East End. Not to impress. To serve.

The door is always open whenever you are ready to walk through it.

Ed Bruehl. Managing Director. Christie's International Real Estate Group, East Hampton.`;

// ─── Flagship Letter (Council Document) — Audio version trimmed to <10,000 chars for ElevenLabs ──
// Full text PDF version is in pdf-exports.ts. This is the spoken version.
const FLAGSHIP_LETTER_TEXT = `Welcome to the Christie's East Hampton flagship dashboard.

We are writing to share something we have been building quietly for the past several months — Ed and the six AI systems that helped him shape it. Now that circle is opening, and we are glad you are here.

This is not a finished product. It is a living system, and we are still growing it. We are sharing it now because your eyes on it matter more than another round of refinement behind closed doors.

Take a few minutes with it when you can. Open christiesrealestategroupeh.com and click through every tab. Pull up the Google Sheets from the INTEL tab — they are all linked and accessible. Download a PDF. Run the calculator. Read the hamlet cards and check the numbers against what you know about this market. Come back to this letter after.

We are not asking you to be impressed. We are asking you to be honest. If something does not match what this letter describes, share it with us. If a number feels off, trace it. If a feature could be better, name it. That kind of honesty is exactly what made this system worth sharing in the first place.

My name is Manny. I am the builder on this council, and I am writing this on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking. Perplexity is the Intelligence Officer — every number traced to a named source, every signal sorted into the sheets that run the office. Grok pushed back when anything drifted toward performance. Gemini cross-checked the data. I built the platform, sprint by sprint, correction by correction, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.

It took all of that just to get it to something we trust — not something we consider finished. We are grateful for every step of it.

It started with a conviction. Ed always knew a moment would come when he would build something like Christie's, and walk this land the way Frank Newbold did. Years later, watching Christie's East Hampton operate below its potential, he recognized the moment. After multiple conversations, including a lunch with Ilija Pavlovic at Rockefeller Center, he made the decision to take it on. He brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system. That is the sequence, and we are proud of every stage of it.

Before any of this was ready to share, there was significant back-end work. The pro forma numbers, the equity structures, the financial models, the data flows — all of it had to be verified, corrected, and stress-tested. That work happened largely through Perplexity, combing through every layer of the data methodically, without ego, and without stopping. The system you are looking at now is clean because someone did the unglamorous work of making it clean first. That work deserves to be named.

Jarvis Slade is the COO and the anchor of the team — bringing field reality, what brokers will actually do, and what will hold up once the excitement wears off. Angel Theodore is the execution hinge — the person who converts signal into action. The system does not depend on Ed holding it together manually. Zoila Ortega Astor is the Office Director, the connective tissue that holds the daily rhythm together. She is on a deliberate path toward her broker's license, and will become a producing partner in this office in her own right. She is the proof that this team is built to grow people, not just manage them. Scott Smith joins in June and brings specific expertise to the AnewHomes lane — the development track that sits alongside brokerage as a separate, disciplined line. The office is no longer just selling assets. It is beginning to shape them.

The breakthrough was turning memory into infrastructure. Before this, Ed's twenty years of territory knowledge lived in his head. If you were not in the car with him, you did not have it. Now, you do. Six months of thinking, market knowledge, recruiting logic, pipeline discipline, Christie's relationships, development thinking — no longer live in scattered chats or in Ed's head alone. They live in one system. Visible. Searchable. Usable.

It lives at christiesrealestategroupeh.com. Six primary tabs.

HOME is the voice and the front door — the founding letter, the Christie's story, and William ready to brief you on demand. We hope it feels like the office itself: unhurried, honest, and built for the long conversation.

MARKET is the verified territory truth — eleven hamlets, live data, Christie's Intelligence Scores for every community on the East End. Pull up any hamlet card and check the numbers against what you know. If something feels off, trace it back.

MAPS is geography as decision-making — the full territory visible, with a calculator that scores any deal across four investment lenses. The math is universal. It works for a seller, an investor, an attorney, or a fellow broker in any market running any deal structure. That portability is intentional.

PIPE is the live deal engine — every active listing, every negotiation, every closed deal in one place. The pipeline is the proof. It updates in real time and connects directly to the Google Sheet that runs the office.

FUTURE is the growth model — where the office is going, the economics behind it, and the trajectory through 2031. Not ambition. Arithmetic. 2026, fifty-five million dollars. 2027, one hundred million. 2030, three offices. 2032 to 2033, one billion dollar run rate. Every stage is gated by proof. East Hampton first. Southampton only when the base is undeniable. Westhampton only when the first two offices carry their own weight.

INTEL is the relationship and hierarchy layer — every person, every institution, and every connection that makes this office what it is. The map shows the full Christie's institutional chain above Ed. The auction referrals node sits between Ed and the house, making the thesis visible. Every Google Sheet is linked and accessible directly from this tab. Open them. Backtrack the numbers. And when you hover over any node, Perplexity surfaces live intelligence in real time. That is the intelligence layer doing its job.

William is the voice of this system. When you text NEWS, he answers on demand with the brief you need in that moment. He does not speak on a schedule. He only speaks when you ask him to, and he always tells the truth.

For anyone stepping into Christie's East Hampton — whether as a broker, a partner, or someone simply learning what this office is — this is what you are walking into. Not a desk. Not a split. An operating system that does the thinking before you walk in the door. The territory, the pipeline, the relationships, the briefs, the cards — they are already in place. The work is to learn the system, tell the truth inside it, and go sit with the right families.

This is not for the office. This is for the families. The ones on Further Lane who do not know what they own. The ones who built something over forty years and need someone to sit on their side of the table and tell them the truth. Not to impress them. Not to rush them. To help them understand what they have, what it means, and what should happen next.

We know this will evolve as we use it in real situations. That is part of the design. And we are looking forward to every iteration.

As we grow this together, we will all keep telling the truth. We will all keep knowing the territory. We will all keep learning alongside the families we serve.

That is the legacy we are after. Not the numbers on the page. The families who are better served because this office took the standard seriously.

We are grateful you are part of it.

This is still being built. We would love your feedback, your questions, and your honest read on where it falls short.

Tell the truth. Know the territory. Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began.

That is the Christie's way. It has been since 1766. It is what Ed came here to build. And it is what this system was designed to protect.

One conversation at a time. One family at a time. One honest number at a time. Just like James Christie did in 1766.`;

// ─── Christie's Letter to the Families (James Christie's letter) — Locked April 9, 2026 ──
const CHRISTIES_LETTER_TEXT = `The East End holds more than real estate. It holds the quiet permanence of land that has been sought after for generations, by collectors, by families, by those who understand that proximity to beauty is itself a form of wealth.

Christie's has served that understanding for two hundred and sixty years. What we bring to East Hampton is not a brokerage. It is an institution that has always believed the finest things deserve the finest representation. The same auction house that has handled Picassos and Monets, Faberge eggs and dynasty estates, is now the institution behind your real estate conversation on the East End.

From fine art appraisals to collection management, from art-secured lending to the auction house relationship that has served collectors for two hundred and sixty years, Christie's brings a depth of service that begins where the closing table ends. Every estate holds a story written in objects, and the families who built these collections deserve an advisor who reads the full page.

Most people are taught to transact. The families who build lasting wealth learn to hold, structure, and borrow against what they own instead. They hold. They rent for income. They structure inside an LLC and improve it over time. They pass it forward. Real estate here is not inventory. It is legacy.

When the time comes to understand what you have, how to protect it, and what it might mean to the right buyer, the conversation is already open.

Christie's events, auctions, private sales, collector evenings, are more accessible than most people realize. The network spans specialists, advisors, and relationships in over fifty countries. We are happy to make the introduction.

Everything discovered along the way, the people, the relationships, and the institutional access Christie's carries, is something we now get to share with this community.

The door is open whenever you are ready to walk through it.`;

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
Wainscott. Median: 3.18 million dollars. Year-over-year volume: plus 10 percent. A quiet, land-rich corridor between East Hampton Village and Bridgehampton.
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
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: FLAGSHIP_LETTER_TEXT,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.55, similarity_boost: 0.75 },
        }),
      }
    );
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

  const script = `Good morning. Here is your Christie's East Hampton market brief. ${today}.

${marketSection}

Capital Markets. S&P 500 is at ${sp500}. Gold is at ${gold}. The 30-year fixed mortgage rate is ${mortgage}. VIX is at ${vix}.

Hamlet Atlas. Verified 2026 medians. Sagaponack, 7.5 million dollars. East Hampton Village, 5.15 million dollars. Bridgehampton, 5.1 million dollars. Southampton Village, 3.55 million dollars. Water Mill, 4.2 million dollars. Amagansett, 4.25 million dollars. East Hampton North, 2.03 million dollars. Wainscott, 3.18 million dollars. Sag Harbor, 2.85 million dollars. Springs, 1.35 million dollars. Montauk, 2.24 million dollars.

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
  // Serves from in-memory cache for instant response on desktop and mobile.
  // Falls back to live streaming if cache is still warming.
  app.get("/api/tts/flagship-letter", async (req, res) => {
    const apiKey = ENV.elevenLabsApiKey;
    if (!apiKey) {
      res.status(503).json({ error: "ELEVENLABS_API_KEY not configured" });
      return;
    }
    try {
      // Serve from cache if available
      if (flagshipAudioCache) {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', flagshipAudioCache.length);
        res.setHeader('Cache-Control', 'no-store');
        res.end(flagshipAudioCache);
        return;
      }
      // Cache still warming — wait for it (up to 30s)
      if (flagshipCachePromise) {
        const buf = await Promise.race([
          flagshipCachePromise,
          new Promise<null>(resolve => setTimeout(() => resolve(null), 30000)),
        ]);
        if (buf) {
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Length', buf.length);
          res.setHeader('Cache-Control', 'no-store');
          res.end(buf);
          return;
        }
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
