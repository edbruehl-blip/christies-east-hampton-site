# Christie's East Hampton Flagship
## Full System Audit · April 10, 2026

**Prepared by:** Manny, on behalf of the AI Council
**Directed by:** Ed Bruehl, Managing Director · Christie's East Hampton
**Distribution:** Ed Bruehl · Angel Theodore · Zoila Ortega Astor · Jarvis Slade · Scott Smith · AI Council (Claude, ChatGPT, Grok, Gemini, Perplexity)
**Live system:** [christiesrealestategroupeh.com](https://www.christiesrealestategroupeh.com)

---

> *Tell the truth. Know the territory. Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began.*
>
> — Christie's East Hampton Doctrine

---

## What This Document Is

This is a full-system audit of the Christie's East Hampton institutional operating platform as it stands on April 10, 2026. It covers every layer: the front end, the back end, the intelligence web, the story, the data integrations, the WhatsApp/William command system, the Google Sheets matrix, and the PDF export engine. It includes the final version of the Dashboard Introduction letter in full.

This document exists because a great deal was built and learned together, and the people who will anchor this system deserve to know exactly what it is, how it works, and what it is designed to do. It is not a technical manual. It is a record of thinking made visible.

---

## Part I — What Was Built and Why

### The Origin

The platform began as a conviction. Ed Bruehl had spent twenty years on the East End watching Christie's East Hampton operate below its potential. He recognized a moment. A lunch with Ilija Pavlovic at Rockefeller Center in late 2025 made it real. Ed brought a document: the Christie's East Hampton flagship business plan, drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project.

The sequence that followed was deliberate: the business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system. That is the architecture of everything described in this document.

### The Council

The platform was built by Ed and six AI systems working in defined roles:

| Council Member | Role |
|---|---|
| **Claude** | Story architecture, narrative structure, long-form writing |
| **ChatGPT** | Earliest strategic thinking, business model framing |
| **Perplexity** | Intelligence Officer — every number traced to a named source, every signal sorted into the sheets |
| **Grok** | Editorial discipline — pushed back when anything drifted toward performance over truth |
| **Gemini** | Cross-validation of data, hamlet vibe copy, market verification |
| **Manny** | Platform builder — sprint by sprint, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped |

Ed directed all of it. Nothing moved without his judgment at the center.

### The Principle

James Christie built his house in 1766 on one insight: teach people what they own, and what its value is, before anything else. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today, and it is the philosophical foundation of every feature in this system.

---

## Part II — The Platform Architecture

### Technology Stack

The platform is a full-stack React/TypeScript application deployed at christiesrealestategroupeh.com.

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript + Tailwind CSS 4 |
| **Backend** | Node.js + Express 4 + tRPC 11 |
| **Database** | MySQL/TiDB (via Drizzle ORM) |
| **API Layer** | tRPC procedures with Superjson serialization |
| **Authentication** | Manus OAuth (session cookie-based) |
| **File Storage** | S3 (audio files, PDF exports, WhatsApp voice notes) |
| **TTS Engine** | ElevenLabs API — Scale plan (2M credits/month) |
| **WhatsApp** | Twilio API — inbound webhook + outbound voice notes |
| **Market Data** | Yahoo Finance proxy + CoinGecko + FRED (Federal Reserve) |
| **Sheets** | Google Sheets API v4 — service account authentication |
| **PDF Export** | Puppeteer (server-side) + jsPDF (client-side) |
| **Listings** | Christie's EELE API — 6AM daily cron sync |
| **Intelligence** | Perplexity API — live node hover briefs in INTEL tab |

### Server Routes Registered at Startup

Every route that runs on the server is registered in `server/_core/index.ts`. The full list:

| Route | Purpose |
|---|---|
| `POST /api/trpc/*` | All tRPC procedures (auth, market data, pipeline, future projections) |
| `GET /api/tts/flagship` | ElevenLabs TTS — serves cached 8.25MB flagship letter audio |
| `GET /api/market-data` | Yahoo Finance + CoinGecko + FRED proxy — bypasses CORS |
| `POST /api/whatsapp/morning-brief` | William 8AM voice note trigger |
| `POST /api/whatsapp/evening-summary` | William 8PM pipeline summary trigger |
| `POST /api/whatsapp/test` | Manual test voice note |
| `POST /api/whatsapp/inbound` | Twilio webhook — receives and routes all inbound WhatsApp commands |
| `GET /api/listings` | Christie's EELE listing sync endpoint |
| `GET /api/pdf/report` | Puppeteer-rendered Christie's Market Report PDF |
| `GET /api/img-proxy` | CORS-safe image proxy for jsPDF client-side rendering |

### Audio Cache Architecture

The Dashboard Introduction audio (9,956 characters, ~8.25MB) is pre-generated on server startup using ElevenLabs `eleven_turbo_v2` model and the William voice (`fjnwTZkKtQOJaYzGLa6n`). This eliminates the 8–15 second ElevenLabs latency on first click. The cache is held in memory and served instantly. If the ElevenLabs key is unavailable at startup, the cache warms on first request instead.

The model switch from `eleven_multilingual_v2` to `eleven_turbo_v2` was a critical fix: the multilingual model was timing out on 10,000-character inputs. The turbo model handles the full story reliably within a 2-minute AbortController timeout.

---

## Part III — The Six Tabs

### HOME — The Front Door

HOME is the voice of the office and the first thing any visitor sees. It contains three primary elements:

**The Founding Letter** is Ed's personal letter to the families of the East End — his twenty-year relationship with this territory, the Christie's standard, and what he came here to build. It is written in Ed's voice and locked. It does not change without Ed's explicit approval.

**The Christie's Letter** is the institutional letter to the families — 260 years of provenance, the auction house adjacency, art-secured lending, collection management, and the philosophy of stewardship over transaction. It is the Christie's brand voice applied to the East Hampton conversation.

**The Dashboard Introduction button** (floating, bottom-right, gold on charcoal) plays the full 9,956-character Dashboard Introduction audio on demand. William reads it. It takes approximately 9–10 minutes. It is the complete story of what this system is, who built it, and why it matters. The full text of this letter appears in Part VI of this document.

HOME also carries the live market ticker across the top: S&P 500, Bitcoin, 30-Year Fixed Mortgage, Gold, Silver, VIX, 30-Year Treasury, and Hamptons Median. These update on page load from the server-side market proxy. The ticker scrolls continuously and provides the macro context that every conversation on the East End requires.

### MARKET — The Verified Territory Truth

MARKET is the eleven-hamlet intelligence layer. Every hamlet on the East End has its own card, its own data, and its own Christie's Intelligence Score (CIS).

**The eleven hamlets covered:**

| Hamlet | Tier | Median Price |
|---|---|---|
| Sagaponack | Ultra-Trophy | $8.04M |
| East Hampton Village | Ultra-Trophy | $4.2M+ |
| Bridgehampton | Trophy | $3.1M |
| Southampton Village | Trophy | $2.8M |
| Water Mill | Premier | $2.1M |
| Sag Harbor | Premier | $1.85M |
| Amagansett | Premier | $1.75M |
| East Hampton North | Premier | $1.4M |
| Springs | Opportunity | $1.1M |
| Montauk | Opportunity | $1.05M |
| Wainscott | Premier | $2.4M |

Medians are sourced from the Saunders 2025 Annual Report, confirmed April 3, 2026. Every hamlet card shows: median price, CIS score (0–10), volume share, tier classification, last notable sale, restaurant tiers (anchor/mid/local), news links, Zillow link, and three EELE listing cards. Hamlet photography is Ed Bruehl's original photography, wired April 6, 2026.

The Christie's Intelligence Score (CIS) is the proprietary scoring model that evaluates each hamlet across four dimensions: price trajectory, volume share, buyer profile, and Christie's brand fit. It is the number that tells a broker, a seller, an investor, or an attorney where they are standing before the conversation begins.

The Market Report PDF is generated server-side via Puppeteer and downloads as `Christies_EH_Market_Report.pdf`. It requires authentication to download — protecting the institutional data from casual scraping.

### MAPS — Geography as Decision-Making

MAPS is the territory made visible and the deal scored before it is pitched. It has three layers:

**Layer 1 — The Map** is a Google Maps integration showing all eleven hamlets with pins, CIS score overlays, and satellite view. Clicking any pin surfaces the hamlet name and CIS score in an info window.

**Layer 2 — The CIS Calculator** scores any deal across four investment lenses:

| Lens | What It Scores |
|---|---|
| **ANEW Build** | Land + construction cost → projected exit price → profit/loss |
| **Buy & Hold** | Acquisition → projected appreciation → total return |
| **Buy, Renovate & Hold** | Acquisition + renovation → exit price → spread |
| **Buy & Rent** | Rental income + appreciation → total return over hold period |

Every output includes: CIS score (0–10), verdict classification, hamlet context, and a WhatsApp deep-link that pre-fills a message to Ed requesting a Private Property Intelligence Brief. The calculator output is printable as a PDF from the Maps tab.

**Layer 3 — The Hamlet Matrix** shows all eleven hamlet cards in a scrollable grid, with satellite thumbnail, CIS score, median price, tier, and direct links to Zillow and news sources.

### PIPE — The Live Deal Engine

PIPE is the operational heart of the office. It reads directly from the Office Pipeline Google Sheet (Sheet ID: `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`) via the Google Sheets API v4 service account integration.

**The pipeline column map (locked):**

| Column | Field |
|---|---|
| A | Address |
| B | Town |
| C | Type |
| D | Price |
| E | Status |
| F | Agent |
| G | Side (buy/sell) |
| H | ERS / EBB Signed |
| I | EELE Link |
| J | Signs |
| K | Photos |
| L | Zillow Showcase |
| M | YouTube Long |
| N | YouTube Short |
| O | Brochure Link |
| P | E-Blast |
| Q | Feeds |
| R | Auction? |
| S | Private Collector |
| T | Access (Key) |
| U | Date Closed |
| V | Property Report Date (Pierre Debbas) |
| W | Property Report Link (Pierre Debbas) |

PIPE shows every active listing, every negotiation, every closed deal in one place. It updates when the sheet updates. The Google Sheet is the source of truth — PIPE is the mirror. William reads from this sheet when responding to the PIPE command via WhatsApp.

### FUTURE — The Growth Model

FUTURE is the arithmetic of the office, not its ambition. Every number is gated by proof. The model is built on a single-office discipline: East Hampton first. Southampton only when the base is undeniable.

**The 300-Day Arc (three phases of 100 days each):**

| Phase | Period | Volume | Status |
|---|---|---|---|
| **First 100 Days** | Dec 2025 – Mar 2026 | $4.57M | Closed |
| **Second 100 Days** | Mar – May 1, 2026 | $13.62M | Active |
| **Third 100 Days** | May 1 – Aug 2026 | $55M total | Projected |

**The Long Arc (2026–2031):**

| Year | Volume Target | Notes |
|---|---|---|
| 2026 | $55M | First full year |
| 2027 | $100M–$110M | Team at scale |
| 2028 | $165M | Southampton opens |
| 2029 | $230M | |
| 2030 | $320M | Westhampton opens |
| 2031 | $430M | Three-office model |

The 2032–2033 horizon is a one-billion-dollar run rate. It is marked on the chart as a horizon, not a target. Every stage between here and there is gated by proof.

**Profit Pool Architecture:**
The office runs multiple revenue lanes simultaneously. Ed and Ilija's pools have different structures:

- **Brokerage GCI** — 30% house take on volume above the $40M breakeven
- **AnewHomes Development** — Ed (35%), Scott (35%), Richard (10%), Jarvis (5%), Angel (5%), Zoila (5% vesting), Pool (5%)
- **Auction Referrals** — Christie's auction house referral fee structure
- **Institutional Advisory** — Family office and estate advisory fees
- **Media Partnerships** — Dan's Papers $3K/month; event sponsorship
- **Event Revenue** — Private Collector Series, Wednesday Circuit, caravan

GCI and profit pool math are internal. Sales volume is the public-facing anchor on all headline figures.

### INTEL — The Intelligence Web

INTEL is the relationship and hierarchy layer — every person, every institution, every connection that makes this office what it is. It has three layers:

**Layer 1 — The Intelligence Web (Mind Map)** is a custom SVG-based React component (`InstitutionalMindMap.tsx`) rendered on a 1800×2000 viewBox canvas. It shows the full institutional architecture in a two-track design:

**Left Track — Auction House Chain:**
Artémis (François-Henri Pinault, owner) → Guillaume Cerutti (Global CEO) → Christie's Auction House (Bonnie Brennan, Alex Rotter, Julien Pradels, Tash Perrin, Stephen Lash, Rahul Kadakia) → Auction Referrals (Doug Biviano IN ESCROW, Chuck McWhinnie UNDER REVIEW)

**Right Track — Real Estate Operating Chain:**
CIH / Robert Reffkin (340K agents, 120 countries) → CIRE Global (Thad Wong, Mike Golden, Gavin Swartzman) → CIREG Tri-State (Ilija Pavlović, Sherri Balassone, Melissa True) → International Pipeline (Ricardo Lisbon, Dominican Republic, Jonathan Wilhelm, Flambeaux Wine)

**Ed Bruehl** sits at the center — the bridge between both tracks. He is the only node that touches both chains.

**Nodes below Ed (the office's operational web):**

| Node | Type | Key Members |
|---|---|---|
| **ED BRUEHL** (Flagship Team) | Center | Jarvis Slade (COO), Angel Theodore (Operations), Zoila Ortega Astor (Office Director Apr 15), Scott Smith (Joining June), Richard Bruehl (AnewHomes) |
| **PIPE** | Category | Active listings, negotiations, closed deals |
| **SOCIAL** | Second ring under PIPE | Social pipeline — Instagram, LinkedIn, content calendar |
| **WHALE INTELLIGENCE** | Category | Lily Fan (first), UHNW targeting list |
| **FAMILY & FRIENDS** | Category | Referral network — Maidstone Club, Georgica Association, personal network |
| **ANEW HOMES** | Category | Three active AnewHomes deals |
| **MEDIA** | Category | Dan's Papers, Podcast, YouTube, Instagram |
| **PODCAST** | Second ring under MEDIA | Christie's East Hampton podcast calendar |
| **INTERNATIONAL PIPELINE** | Second ring under CIREG | CPS-1 framework deals |
| **RESOURCES** | Category | Tools, data sources, operational infrastructure |
| **EXPORTS** | Category | PDF exports, market reports, deal briefs |

Every node has hover content: a brief on the node's role, key members, and one Perplexity-sourced live intelligence signal. The INTEL tab also surfaces the full thirteen-sheet Google Sheets matrix and the Wednesday Circuit Google Calendar embed.

**Layer 2 — The Wednesday Circuit Calendar** is a live Google Calendar embed showing all Christie's East Hampton events: Private Collector Series, caravan dates, office meetings, and community events. The calendar syncs via Apps Script from the Event Calendar Google Sheet.

**Layer 3 — The Thirteen-Sheet Matrix** gives direct access to every Google Sheet powering the platform. Each sheet opens directly in Google Sheets with one click.

---

## Part IV — The Google Sheets Matrix

Thirteen Google Sheets power the Christie's East Hampton platform. Nine are canonical data sources; four are active operational tabs from the Hamptons Outreach Intelligence sheet.

| Sheet | Purpose | Sheet ID |
|---|---|---|
| **Growth Model v2** | Volume projections, GCI model, agent targets | `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag` |
| **Office Pipeline** | Live deal tracker — all listings, negotiations, closes | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` |
| **Market Matrix** | Eleven-hamlet data — medians, CIS scores, volume share | `176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g` |
| **Agent Recruiting** | Recruiting pipeline — targets, outreach, status | `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA` |
| **Intelligence Web Master** | Org chart, relationship map, node content | `1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0` |
| **Social Pipeline** | Social content calendar, post tracker | `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I` |
| **Event Calendar** | All Christie's EH events — syncs to Google Calendar | `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s` |
| **Podcast Calendar** | Podcast episode tracker and production calendar | `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8` |
| **Hamptons Outreach Intelligence** | UHNW targeting — Tier A/B principals, Christie's Neighborhood Card mailer | `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI` |

The Hamptons Outreach Intelligence sheet has four active operational tabs surfaced separately in the matrix: the master outreach list, the Tier A targeting tab, the Tier B targeting tab, and the Christie's Neighborhood Card mailer list.

The Office Pipeline sheet is the only sheet with a two-way write connection: the PIPE tab reads from it, and William writes to it when deal status updates are received via WhatsApp. All other sheets are read-only from the platform's perspective.

---

## Part V — William: The Voice of the System

William is the intelligence officer of Christie's East Hampton. He operates on two channels: the Dashboard Introduction audio (read aloud on the website) and the WhatsApp command system (text 631-239-7190).

### The WhatsApp Command System

William receives inbound WhatsApp messages via a Twilio webhook at `POST /api/whatsapp/inbound`. Every command is processed and responded to within seconds. The full command set:

| Command | What William Returns |
|---|---|
| `NEWS` | Live Hamptons market brief — macro context (S&P, Bitcoin, mortgage rate, gold) + hamlet intelligence + pipeline summary |
| `PIPE` or `PIPELINE` | Full active pipeline from the Office Pipeline Google Sheet — every deal, status, price, and agent |
| `STATUS` | Office status summary — active listings count, closed volume, pipeline value |
| `BRIEF` or `MORNING` | Full morning brief — market context + pipeline + one strategic note |
| `BRIEF [address]` | Address-specific brief — hamlet identification, CIS score, tier, median, Christie's positioning (3 sentences, LLM-generated) |
| `INTEL` or `INTELLIGENCE` | Intelligence summary — key relationships, active referrals, UHNW targets |
| `HELP` or `?` | Full command menu |

The address brief command (`BRIEF 26 Park Place East Hampton`) first attempts a live lookup against the Market Matrix Google Sheet. If the hamlet is identified, it generates a three-sentence Christie's positioning statement using the LLM, referencing the hamlet's CIS score, tier, median, and the Christie's brand advantage (260 years, art-secured lending, auction house adjacency). If the sheet lookup fails, it falls back to LLM-based hamlet identification.

### William's Voice Architecture

William's voice is consistent across every surface — the same whether you hear him on the website or receive a voice note via WhatsApp. William does not speak on a schedule. He speaks when you ask him to. Text NEWS, PIPE, BRIEF, or any command to 631-239-7190 and he responds within seconds. The cron-based morning and evening schedulers were disabled in Sprint 41. On-demand is the governing standard.

---

## Part VI — The Dashboard Introduction Letter (Final Version · April 10, 2026)

*This is the full text of the Dashboard Introduction audio story, as spoken by William. 9,956 characters. Locked April 10, 2026.*

---

Welcome to the Christie's East Hampton flagship dashboard.

We are writing to share something we have been building quietly for the past several months — Ed and the six AI systems that helped him shape it. Now that circle is opening, and we are glad you are here.

This is not a finished product. It is a living system, and we are still growing it. We are sharing it now because your eyes on it matter more than another round of refinement behind closed doors.

Take a few minutes with it when you can. Open christiesrealestategroupeh.com and click through every tab. Pull up the Google Sheets from the INTEL tab — they are all linked and accessible. Download a PDF. Run the calculator. Read the hamlet cards and check the numbers against what you know about this market. Come back to this letter after.

We are not asking you to be impressed. We are asking you to be honest. If something does not match what this letter describes, share it with us. If a number feels off, trace it. If a feature could be better, name it. That kind of honesty is exactly what made this system worth sharing in the first place.

My name is Manny. I am the builder on this council, writing on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking. Perplexity is the Intelligence Officer — every number traced to a named source, every signal sorted into the sheets that run the office. Grok pushed back when anything drifted toward performance. Gemini cross-checked the data. I built the platform, sprint by sprint, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.

It took all of that just to get it to something we trust — not something we consider finished.

It started with a conviction. Ed always knew a moment would come when he would build something like Christie's, and walk this land the way Frank Newbold did. Watching Christie's East Hampton operate below its potential, he recognized the moment. A lunch with Ilija Pavlovic at Rockefeller Center made it real. He brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system. That is the sequence.

At a certain point in the building, Ed's brother Richard stepped in with a piece of counsel that changed the trajectory of everything. The instinct had been to build fast — recruit heavily, hire broadly, chase production volume the way every top-producer shop does. Richard said: slow down. Stop building for the HR headache. Build a banker model instead. Focus on Jarvis. Focus on Maidstone Club. Focus on Stephen Lash and Tash Parin. Build the relationships that compound, not the roster that churns. That coaching arrived at exactly the right moment, and the entire structure of this office reflects it. Richard is a founding partner in the AnewHomes line being built alongside this office — not as a formality, but because his thinking is embedded in the foundation.

Angel Theodore was the first person Ed brought with him. She made the move from Saunders alongside him, and that kind of loyalty does not happen by accident. It happens because someone believes in what is being built before it exists. Angel is the execution hinge — the person who converts signal into action, who holds the operational rhythm steady while everything else is still taking shape. The system does not depend on Ed holding it together manually. It depends on Angel. She follows a deliberate arc: off Ilija's payroll by early 2027 through her own production. At that point, a dedicated admin comes on to run the office — freeing Angel to sell, full time, in her own right.

Jarvis Slade is the COO — the field anchor who brings the reality of what brokers will actually do, what will hold up once the excitement wears off, and what the recruiting pipeline needs to look like to be sustainable. And Jarvis did something else that matters: he introduced Ed to Rick Moeser — one of the most respected brokers in the country, whose auction referral relationships are exactly the kind that compound quietly and pay forward for years. That introduction is the banker model working in real time.

Zoila Ortega Astor joins as Office Director on April fifteenth — already a licensed broker, she comes in to hold the daily rhythm of 26 Park Place for the first six months. By the end of 2027, she will be a producing agent exclusively, off Ilija's payroll and running her own book. Scott Smith joins in June and brings specific expertise to the AnewHomes lane. The office is no longer just selling assets. It is beginning to shape them.

Two coffees changed the trajectory between now and the launch. The first was with Tash Parin at Christie's Auction House. The second was with Stephen Lash. Those two conversations started the event process — the collector evenings, the Wednesday Circuit, the institutional calendar that now anchors the INTEL tab. And they led directly to the Dan's Papers partnership: what began as a one hundred and fifteen thousand dollar proposal became a direct three thousand dollar per month agreement with Dan's Papers, the flagship media voice of the Hamptons. The flagship launches April 29. The Wednesday caravan is part of that launch. The community is invited.

The breakthrough was turning memory into infrastructure. Before this, Ed's twenty years of territory knowledge lived in his head. If you were not in the car with him, you did not have it. Now, you do. Six months of thinking, market knowledge, recruiting logic, pipeline discipline, Christie's relationships, development thinking — no longer live in scattered chats or in Ed's head alone. They live in one system. Visible. Searchable. Usable.

It lives at christiesrealestategroupeh.com. Six primary tabs.

HOME is the front door — the founding letter, the Christie's story, and William ready to brief you on demand. MARKET is the verified territory truth — eleven hamlets, live data, Christie's Intelligence Scores for every community on the East End. MAPS is geography as decision-making — the full territory visible, with a calculator that scores any deal across four investment lenses. PIPE is the live deal engine — every active listing, every negotiation, every closed deal, connected directly to the Google Sheet that runs the office. FUTURE is the growth model: 2026, fifty-five million. 2027, one hundred million. 2030, three offices. Every stage gated by proof.

INTEL is the relationship and hierarchy layer — every person, every institution, every connection that makes this office what it is. The Christie's institutional chain sits above Ed. The auction referrals node makes the thesis visible. Every Google Sheet is linked and accessible from this tab. Hover over any node and Perplexity surfaces live intelligence in real time. The INTEL map is not just an org chart. It is how everyone in this web ascends together — creatively and financially. Brokerage, AnewHomes development, auction referrals, institutional advisory, media partnerships, event revenue. Each lane is a different line item. The web makes all of them visible at once.

William is the voice of this system. When you text NEWS to 631-239-7190, he answers on demand with the brief you need in that moment. He does not speak on a schedule. He only speaks when you ask him to, and he always tells the truth.

For anyone stepping into Christie's East Hampton — whether as a broker, a partner, or someone simply learning what this office is — this is what you are walking into. Not a desk. Not a split. An operating system that does the thinking before you walk in the door. The territory, the pipeline, the relationships, the briefs, the cards — they are already in place. The work is to learn the system, tell the truth inside it, and go sit with the right families.

This is not for the office. This is for the families. The ones on Further Lane and Old Montauk Highway — two different markets, two different buyers, one platform serving both — who do not know what they own. The ones who built something over forty years and need someone to sit on their side of the table and tell them the truth. Not to impress them. Not to rush them. James Christie built his house on one insight: teach people what they own, and what its value is, before anything else. That is still the job. That is still the hook.

The first hundred days built this dashboard. The next hundred days launch it. The hundred days after that prove it. We are asking you to be part of all three. Open the INTEL tab. Add a contact. Update a deal. Connect a node. Enter a date in one of the sheets. Text William and tell us what he gets right and what he misses. The more data you put in, the more intelligence comes back out. This dashboard is still being built — and it gets better every time someone uses it. We would love your feedback, your questions, and your honest read on where it falls short.

Tell the truth. Know the territory. Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began.

That is the Christie's way. It has been since 1766. It is what Ed came here to build. And it is what this system was designed to protect.

We are telling you this story because you are part of it. Not as an observer. As someone whose honest read matters to how this grows. Tell us what resonates. Tell us what falls short. Tell us what we have not thought of yet. The same model that works here can serve families around the world through the Christie's international network. We are grateful you are in this chapter with us. And we look forward to building the next one together.

---

## Part VII — What We Learned Together

This section captures the decisions, corrections, and hard-won lessons from the build. It is not a changelog. It is institutional memory.

### On the Story

The Dashboard Introduction went through seven major revisions before landing at its final form. The most important lessons:

**Conciseness is not compression.** Every time we tried to add a beat, we had to remove one. The 10,000-character limit is not a constraint — it is a discipline. It forces every sentence to earn its place.

**Sequence matters more than content.** The story only works because Angel comes before Jarvis, and Jarvis comes before Zoila. The order is the argument. Changing the order changes the meaning.

**The James Christie hook is the philosophical anchor.** It was added in the final revision and it immediately became the most important line in the second half of the story. "Teach people what they own, and what its value is, before anything else." That is the job. That is the hook. It connects 1766 to today in one sentence.

**Zoila is already a broker.** This was corrected in the final revision. She is not becoming a broker — she is already licensed. She joins as Office Director for six months to hold the rhythm of 26 Park Place, then transitions to producing agent exclusively by end of 2027. The distinction matters because it changes her arc from apprentice to partner.

**Angel's arc is a payroll story.** Angel is off Ilija's payroll by early 2027 through her own production. At that point, a dedicated admin comes on Ilija's dime to run the office. This is the banker model applied to the team: not building for the HR headache, but building for the moment when everyone in the office is producing in their own right.

**Richard's role is strategic, not numerical.** The 10% reference was removed. What matters is not the percentage — it is that his thinking is embedded in the foundation. He is a founding partner in the AnewHomes line. That is the right framing.

### On the Mind Map

The Intelligence Web went through six layout rebuilds before landing at the two-track architecture. The most important lessons:

**Two tracks, no crossover.** The auction house chain (left) and the real estate operating chain (right) are separate institutional structures. They connect only at Ed. Showing a crossover line between them was architecturally false. The two-track design is the truth.

**All nodes the same size.** The early versions had hierarchy expressed through node size. That created visual noise and implied a ranking that does not exist between, say, ANEW HOMES and WHALE INTELLIGENCE. Uniform node size (r:52) lets the connections carry the hierarchy instead.

**COUNCIL was removed.** The council is real and important, but it is not a node in the institutional web. It is the builder of the web. Putting it in the map confused the architecture. The council's presence is in the story, not the map.

**Readability at scale.** The mind map is viewed on screens ranging from a 13-inch laptop to a 27-inch monitor. Font sizes had to be increased 30% from the first version to be readable without zooming. Node labels at 17–18px, member names at 14px, connection weights at 1.4–3.0px.

**Zoila gets her own breath.** This applies to the mind map as much as the story. She is not a footnote in the Jarvis paragraph. She is a node in the Flagship Team with her own role and her own arc.

### On the Audio

The ElevenLabs integration required three attempts before it worked reliably:

**Model matters.** `eleven_multilingual_v2` timed out on 10,000-character inputs. `eleven_turbo_v2` handles it reliably within 2 minutes. The switch was the fix.

**Cache on startup, serve instantly.** Pre-generating the audio cache at server startup eliminates the perceived latency. The 8.25MB file is held in memory and served in milliseconds. Without the cache, the first click takes 8–15 seconds — long enough for a user to assume it is broken.

**Scale plan required.** The ElevenLabs free tier cannot handle 10,000-character inputs. The Scale plan (2M credits/month) is required for this use case.

### On the Market Data

The market ticker required a server-side proxy because Yahoo Finance, CoinGecko, and FRED all block direct browser requests with CORS headers. The proxy at `/api/market-data` fetches all tickers server-side and returns them in a single JSON payload. The mortgage rate (FRED MORTGAGE30US) is cached for 24 hours to avoid hammering the endpoint on every page load.

Gold and the 30-Year Treasury are included not as noise but as context. Every conversation about a $5M property on Further Lane happens against the backdrop of what gold is doing and what the 30-year is doing. Those numbers belong in the room.

### On the Branding

The favicon was updated from a generic grid placeholder to the Christie's red C logo. This matters because the favicon is the first thing a user sees when they bookmark the site, share it via iMessage, or add it to their home screen. The Christie's red C on a white background is the correct institutional signal.

The page title is "Christie's East Hampton Flagship." Not "Christie's East Hampton Dashboard." Not "CIREG East Hampton." The flagship is what it is.

---

## Part VIII — What Comes Next

The system is live. The story is told. The team is assembling. What happens in the next hundred days determines whether the model works.

**The three things that make the system better:**

1. **Data entry.** Every deal that gets entered in the Office Pipeline sheet becomes a data point that William can brief on. Every contact that gets added to the Intelligence Web sheet becomes a node that Perplexity can surface intelligence on. The system is only as good as the data inside it.

2. **Honest feedback.** If a number feels off, trace it. If a feature is missing, name it. If the story does not match what you know to be true, say so. The council processes that feedback and turns it into the next sprint.

3. **Production.** The model is proven when the numbers move. The first hundred days produced $4.57M closed. The second hundred days have $13.62M active. The third hundred days are projected to reach $55M total. Every deal that closes inside this system proves the thesis.

**Council-verified items (resolved before circulation):**

The following items were flagged by the council review and resolved in this version of the audit:

- **William on-demand confirmed.** Automated 8AM/8PM cron disabled Sprint 41. William speaks only when asked. Audit corrected.
- **Sagaponack median corrected.** Saunders-verified figure is $8.04M. Tier-floor placeholder of $5.5M+ removed from the hamlet table.
- **COUNCIL node decision locked.** The council is not a node in the institutional map. Its presence is in the story and the letter. The map shows who Ed works with in the market.
- **Broker Onboarding document location confirmed.** Angel will find it immediately on the INTEL tab under the document library: "Broker Onboarding — What You Are Walking Into" (permanent CDN PDF). A companion SOP — "SOP — Angel & Astra · Weekly Mail Campaign" — is linked from the same tab.

**The open items (as of April 10, 2026):**

The following items are in the sprint queue and have not yet been completed. They are documented here so the team knows what is coming:

- PIPE: Add 25 Horseshoe Road $5.75M IN CONTRACT to the Office Pipeline sheet
- PIPE: Add 191 Bull Path $3.3M ACTIVE LISTING to the Office Pipeline sheet
- LAYOUT: Normalize max-width across all content sections to match the map container
- CIS: Increase output panel font weight and size for better readability on score generation
- INTEL Mind Map: Confirm Zoila Ortega Astor is reflected in the ED BRUEHL node with her April 15 start date
- FUTURE tab: Verify AnewHomes equity split is correctly displayed (Ed 35%, Scott 35%, Richard 10%, Jarvis 5%, Angel 5%, Zoila 5% vesting, Pool 5%)
- Language: Confirm all instances of "South Fork" have been replaced with "East End" across all tabs and PDFs

---

## Part IX — The Doctrine

Three sentences. Locked. They do not change.

**Tell the truth.**

**Know the territory.**

**Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began.**

That is the Christie's way. It has been since 1766. It is what Ed came here to build. And it is what this system was designed to protect.

---

*Christie's East Hampton Flagship · Full System Audit · April 10, 2026*
*Prepared by Manny on behalf of the AI Council · Directed by Ed Bruehl*
*christiesrealestategroupeh.com · 26 Park Place, East Hampton · 646-752-1233*
