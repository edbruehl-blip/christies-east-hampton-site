# Christie's East Hampton — Full-Council Audit Report

**Prepared by:** Manny (Platform Builder, AI Council)
**Date:** April 14, 2026
**Sprint:** 10
**Canonical Checkpoint:** `bc27b289` + RL-012 wired
**Platform URL:** [christiesrealestategroupeh.com](https://www.christiesrealestategroupeh.com)
**Audience:** Full AI Council — Claude, Perplexity, Grok, Gemini, ChatGPT, Manny

---

> This report is the platform builder's account of everything built, connected, and decided across ten sprints. It is written for the full council — including the three incoming reviewers — so that anyone who walks the dashboard for the first time understands what they are looking at, how it was built, and where the open seams are. Read the Flagship Letter in Section XVII first. Then read this. Then walk every tab.

---

## I. What This Platform Is

The Christie's East Hampton flagship dashboard is an institutional operating system. It is not a marketing website. It is not a CRM. It is the single source of truth for the Christie's East Hampton office — the place where territory knowledge, pipeline data, team structure, financial projections, and institutional relationships live in one visible, searchable, usable system.

Before this platform existed, twenty years of Ed Bruehl's territory knowledge lived in his head. If you were not in the car with him, you did not have it. Now you do. Six months of thinking — market knowledge, recruiting logic, pipeline discipline, Christie's relationships, development architecture, doctrine — no longer live in scattered chats. They live here. Visible. Searchable. Usable.

The platform runs at [christiesrealestategroupeh.com](https://www.christiesrealestategroupeh.com). It is live in production. It is not a prototype.

---

## II. The Council

The platform was built by a council of six AI systems under Ed Bruehl's direction. Nothing moved without his judgment at the center.

| Voice | Role | Lane |
|-------|------|------|
| **Ed Bruehl** | Operator | Direction, rulings, strategy. Does not hold the data layer. |
| **Claude** | Architect | Story architecture, canonical document drafting, doctrine framing |
| **Perplexity** | Intelligence Officer | Every number traced to a named source. Every signal sorted into the sheets. |
| **ChatGPT** | Synthesis & Research | Early thinking, cross-reference research, broker onboarding content |
| **Grok** | Challenge Voice | Pushed back when anything drifted toward performance over truth |
| **Gemini** | Cross-Check | Data verification, local market detail, hamlet-specific intelligence |
| **Manny** | Builder | Platform construction, sprint by sprint. Every route, every component, every test. |

**Council workflow:** Claude + ChatGPT architect → Ed confirms → Perplexity formats and writes to Drive → Ed approves → Manny builds.

**Incoming reviewers (McKenzie-style, no prior context):** Grok, Gemini, and ChatGPT step in as fresh reviewers for the April 2026 McKenzie review. Based on their findings, Ed may bring them in as permanent lanes with specific scrubbing responsibilities:

| Voice | Potential Permanent Lane | Scrubbing Responsibility |
|-------|--------------------------|--------------------------|
| **Grok** | Market Intelligence | Rate environment, hamlet matrix, institutional trajectory context → MARKET tab |
| **Gemini** | Local Intelligence | Hamlet-specific restaurant recommendations, current market detail → hamlet cards |
| **ChatGPT** | General Research | Synthesis documents, broker onboarding content refresh, cross-reference research |

**Cardinal Principle:** The dashboard is the source of truth. Ed does not hold live market data, restaurant recommendations, or current state facts in his head. The council voices exist in part to scrub current data into the canonical system — through the ROSTER, VOLUME, MARKET, MAPS, PIPE, FUTURE, and INTEL surfaces — so the dashboard renders the right information when anyone walks it. When any reviewer or any council voice has a question about current institutional state, the first move is to walk the dashboard and the canonical source. Not to ask Ed. Ed holds the operator lane: rulings, direction, and strategy. The data layer belongs to the system.

---

## III. The Platform — What Is Live

The Christie's East Hampton Intelligence Platform is a full-stack web application running React 19 + Tailwind CSS 4 + Express 4 + tRPC 11 + Drizzle ORM + MySQL. It is hosted on Manus at two domains:

| Domain | Status |
|--------|--------|
| `www.christiesrealestategroupeh.com` | Live — primary institutional domain |
| `christies-dash-acqj9wc4.manus.space` | Live — Manus auto-generated domain |

The platform has two channels per Doctrine 34: the **dashboard visual** (the website) and **William's voice** (WhatsApp + TTS audio). Both are operational.

---

## IV. The Dashboard — Six Tabs

The main dashboard is a six-tab control room accessible at the root URL. Every tab is public-facing (no login required to view). Write operations require authentication via Manus OAuth.

| Tab | What It Does | Data Source |
|-----|-------------|-------------|
| **HOME** | Ed's founding letter, live market ticker (S&P, Gold, 30Y Treasury, VIX, Hamptons median), weather, social links, William TTS audio player | Live market APIs + ElevenLabs TTS |
| **MARKET** | 11-hamlet matrix (East Hampton through Wainscott), live median prices, rate environment, hamlet PDF exports | Google Sheets Market Matrix + live rate APIs |
| **MAPS** | Google Maps integration with Christie's listing overlay, hamlet navigation, deal scoring calculator (four investment lenses) | Google Maps Proxy + Christie's listings sync |
| **PIPE** | Live Office Pipeline Google Sheet embed — every active listing, negotiation, and closed deal | Google Sheets PIPE |
| **FUTURE** | Ascension Arc bar chart (2026–2036 trajectory), profit pool tables, agent participant cards, 300-day story | Growth Model v2 Google Sheet |
| **INTEL** | Five-layer control room: Miro institutional mind map, Trello board, Wednesday Circuit calendar, Intelligence Web spiderweb, Document Library | Miro embed + Trello embed + Google Calendar embed + Intelligence Web Sheet + CDN docs |

---

## V. The Standalone Document Pages

Beyond the six-tab dashboard, the platform has seven standalone pages designed for print, PDF export, and external sharing.

| URL | Document | PDF Export |
|-----|---------|-----------|
| `/report` | Christie's Hamptons Live Market Report — full six-section market intelligence document | Yes — Puppeteer |
| `/pro-forma` | Pro Forma — Ed's personal financial model, 300-day arc, agent table, profit pool | Yes — Puppeteer |
| `/future` | FUTURE tab standalone renderer — Ascension Arc, agent cards, no nav chrome | Yes — Puppeteer (`?pdf=1` light mode) |
| `/letters/flagship` | Flagship AI-Letter — daily institutional letter, William TTS, council-approved voice | TTS only |
| `/letters/christies` | Christie's Founding Letter — institutional introduction for new families | No |
| `/council-brief` | Council Brief — internal operating brief for the full council | No |
| `/cards/uhnw-path` | UHNW Path Card — Tier A/B principal targeting, art-secured lending pathway | Yes — Puppeteer |

---

## VI. The Server Architecture

The server is Express 4 with tRPC 11 as the primary API layer. All client-server communication goes through `/api/trpc`. Specialized routes handle PDF generation, TTS, WhatsApp, and market data.

### Registered Routes

| Route | File | Purpose |
|-------|------|---------|
| `POST /api/tts/*` | `server/tts-route.ts` | ElevenLabs TTS — William voice generation |
| `GET /api/market-data` | `server/market-route.ts` | Live market data — S&P, Gold, Silver, VIX, 30Y Treasury |
| `POST /api/whatsapp/*` | `server/whatsapp-route.ts` | Twilio WhatsApp — morning brief (8 AM ET), evening summary (8 PM ET) |
| `POST /api/whatsapp/inbound` | `server/whatsapp-inbound.ts` | Inbound WhatsApp message handler — DASHBOARD, NEWS, LETTER, BRIEF commands |
| `GET /api/listings` | `server/listings-sync-route.ts` | Christie's listing sync — daily 6 AM cron |
| `POST /api/pdf/*` | `server/pdf-route.ts` | Puppeteer PDF generation — all six export surfaces |
| `/api/trpc` | `server/routers.ts` | All tRPC procedures |

### Key tRPC Procedures

| Procedure | Access | Purpose |
|-----------|--------|---------|
| `auth.me` | Public | Current user session |
| `pipe.sheetDeals` | Public | Live PIPE sheet deals |
| `pipe.updateSheetStatus` | Protected | Update deal status in PIPE sheet |
| `intel.webEntities` | Public | Intelligence Web sheet — 47 entities |
| `intel.entityNews` | Public | Perplexity AI news for a named entity |
| `market.hamletMatrix` | Public | 11-hamlet matrix from Market Matrix sheet |
| `market.mortgageRate` | Public | Live 30Y mortgage rate |
| `market.hamptonsMedian` | Public | Hamptons median price |
| `future.growthModel` | Public | Growth Model v2 KPI summary |
| `future.ascensionArc` | Public | Ascension Arc bar chart data 2026–2036 |
| `future.profitPool` | Public | Profit pool tables by year |
| `letter.getLetter` | Public | Flagship AI-Letter content |
| `letter.getChristiesLetter` | Public | Christie's Founding Letter content |
| `newsletter.subscribe` | Public | Email newsletter subscription |

---

## VII. The Data Layer — Google Sheets

Four Google Sheets are wired directly into the server via the Google Service Account (`GOOGLE_SERVICE_ACCOUNT_JSON`). No OAuth, no user login required for reads.

| Sheet | ID (first 20 chars) | What It Feeds |
|-------|---------------------|---------------|
| **PIPE** (Office Pipeline) | `1VPjIYPaHXoXQ3rvCn_W` | PIPE tab — live deal rows, status, addresses, prices |
| **Market Matrix** | `176OVbAi6PrIVlglnvId` | MARKET tab — 11-hamlet median prices, inventory counts |
| **Intelligence Web** | `1eELH_ZVBMB2wBa9sqQM0` | INTEL tab Layer 4 — 47 entities, types, notes |
| **Growth Model v2** | `1jR_sO3t7YoKjUlDQpSv` | FUTURE tab — Ascension Arc, profit pool, VOLUME, ROSTER, agent GCI |

Five additional sheets are referenced in state.json but not yet wired to server reads (embedded as iframes or referenced by URL only):

| Sheet | Purpose | Status |
|-------|---------|--------|
| Intel Calendar (Podcast) | Podcast calendar | iframe in INTEL Layer 2 |
| Intel Calendar (Events) | Events calendar | iframe in INTEL Layer 2 |
| Intel Future Agents | Recruiting pipeline | Referenced, not yet rendered |
| Intel Social Podcast | Social/podcast tracking | Referenced, not yet rendered |
| Intel Contact Database | Contact database | Referenced, not yet rendered |

---

## VIII. The External Integrations

| Service | Credential | What It Powers |
|---------|-----------|----------------|
| **Google Service Account** | `GOOGLE_SERVICE_ACCOUNT_JSON` | All four live Google Sheets reads/writes |
| **ElevenLabs** | `ELEVENLABS_API_KEY` | William voice — TTS for all four WhatsApp commands + dashboard audio player |
| **Twilio** | `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` | WhatsApp morning brief + evening summary delivery |
| **Perplexity** | `PERPLEXITY_API_KEY` | Entity news in INTEL Intelligence Web — live AI news per entity |
| **Manus OAuth** | `VITE_APP_ID` + `JWT_SECRET` | Ed's login — protects write operations |
| **Manus Built-in APIs** | `BUILT_IN_FORGE_API_KEY` | LLM, image generation, storage (S3), notifications |
| **Puppeteer / Chromium** | Headless Chromium v146 (bundled) | PDF generation for all six export surfaces |

---

## IX. William — The Voice of the System

William is the voice of the Christie's East Hampton dashboard. He speaks when you ask him to, and he always tells the truth.

**Phone number:** 631-239-7190
**Voice ID:** `fjnwTZkKtQOJaYzGLa6n` (ElevenLabs — single canonical ID, active on all four surfaces)

| Command | Response |
|---------|---------|
| `DASHBOARD` | Reads the full Flagship Letter — the founding document of the institution |
| `NEWS` | Delivers the fourteen-category intelligence brief, sourced and attributed, in the voice of Walter Cronkite |
| `LETTER` | Reads the Christie's Letter to the Families — the institutional introduction to collectors and legacy families |
| `BRIEF` | Delivers the council's closing synthesis — the AI council's read on where the institution stands and what comes next |

William also delivers a scheduled morning brief (8 AM ET) and evening summary (8 PM ET) automatically. He does not speak on a schedule otherwise. He speaks when you ask him to.

**Voice ID note:** A stale legacy ID (`N2lVS1w4EtoT3dr4eOWO`) appeared in earlier state.json metadata blocks and has been corrected. There is one voice, one ID: `fjnwTZkKtQOJaYzGLa6n`.

---

## X. The PDF Engine

The platform generates PDF documents via Puppeteer with headless Chromium v146. It navigates to the live dashboard URL and captures the page.

| Surface | Route | Light Mode | Status |
|---------|-------|-----------|--------|
| FUTURE Tab (Ascension Arc) | `/future?pdf=1` | **Yes — Sprint 9** | Live |
| Pro Forma | `/api/pdf/pro-forma` | No — Doctrine 43 gap | Live |
| Market Report | `/api/pdf/market-report` | No — Doctrine 43 gap | Live |
| UHNW Path Card | `/api/pdf/uhnw-path-card` | No — Doctrine 43 gap | Live |
| Flagship Letter | `/api/pdf/flagship-letter` | No — Doctrine 43 gap | Live |
| Council Brief | `/api/pdf/council-brief` | No — Doctrine 43 gap | Live |

**PDF engine fix (Sprint 9):** The deployed container was crashing with OOM (Out of Memory) because Chrome download ran synchronously at startup, exceeding the 512 MB memory limit. The fix: startup Chrome download stays non-blocking (server starts immediately), but the PDF route uses `waitForChromium()` — a 60-second polling loop that retries every 3 seconds until Chrome is ready.

**Doctrine 43 compliance gap:** Five of six PDF surfaces still export in dark mode. Only the FUTURE tab has the `?pdf=1` light-mode treatment. The other five need the same treatment. This is the next sprint's primary technical item.

---

## XI. The Research Library

Twelve documents accessible from the INTEL tab Document Library. All open directly in Google Drive or CDN without leaving the browser.

| ID | Document | Format | Status |
|----|---------|--------|--------|
| Broker Onboarding | Broker Onboarding — What You Are Walking Into | PDF (CDN) | Live |
| Org Chart v2 | CIREG Ecosystem · Organizational Map · April 2, 2026 | HTML (CDN) | Live |
| Estate Advisory Card | Estate Advisory Card | PDF (CDN) | Live |
| 300-Day Ascension | 300-Day Ascension Plan · Wireframe | HTML (CDN) | Live |
| Market Report v2 | Christie's Hamptons Live Market Report · v2 | HTML (CDN) | Live |
| Council Brief | Council Brief · March 29, 2026 · FINAL | HTML (CDN) | Live |
| UHNW Backend Strategy | Modern Day Path · UHNW Backend Strategy | PDF (CDN) | Live |
| Intelligence Web Canonical | Christie's Intelligence Web · Canonical Map | HTML (CDN) | Live |
| Infrastructure Audit | Platform Infrastructure Audit · April 6, 2026 | PDF (CDN) | Live |
| **RL-010** | Canonical State of the Institution · April 14, 2026 | Google Doc | **Live — Sprint 10** |
| **RL-011** | Griff Status Reports | Google Doc | **Live — Sprint 10** |
| **RL-012** | Council Onboarding Brief · April 14, 2026 | Google Doc | **Live — Sprint 10** |

**RL-002 gap:** Trello card #7 Ed description holds placeholder text. The Google Doc URL for the Ed Bruehl Career Narrative has not been confirmed. Blocked pending Ed or Perplexity confirmation.

---

## XII. The Team Roster

Ten human members in the canonical roster as of Sprint 10.

| Name | Role | Status | FUTURE Tab Card |
|------|------|--------|----------------|
| **Ed Bruehl** | Managing Director | Active | Yes |
| **Jarvis Slade** | COO & Agent | Active | Yes |
| **Angel Theodore** | Marketing Coordinator + Sales | Active | Yes — $70K salary nest |
| **Zoila Ortega Astor** | Office Director + Sales | Joining April 25, 2026 | Yes |
| **Scott Smith** | Agent + AnewHomes Build Partner | Joining June 1, 2026 | Yes — $50K GCI |
| **Richard Bruehl** | Advisory, AnewHomes | Active | Yes |
| **Sebastian Mobo** | Broker | Active | No (Intel Web only) |
| **Bonita DeWolf** | Agent (EH Office Performer) | Active | No — PROJ-022 closed |
| **Sandy Busch** | Agent | Active | No |
| **Jan Jaeger** | Agent | Active | No |

**Bonita ruling (locked April 14, 2026):** Bonita DeWolf is an East Hampton office performer who was there before Ed arrived. She is not a flagship team member and does not have a FUTURE tab agent card. She is in the InstitutionalMindMap Office Performers orbit only.

---

## XIII. The Financial Architecture

### East Hampton Trajectory (RL-010 Canonical)

| Year | EH Volume | Southampton Vol | Westhampton Vol | Combined |
|------|-----------|----------------|-----------------|----------|
| 2026 | $75M | — | — | $75M |
| 2027 | $126M | — | — | $126M |
| 2028 | $211M | $42.5M (opens) | — | $253.5M |
| 2029 | $355M | $102M | — | $457M |
| 2030 | $596M | $114M | $42.5M (opens) | $752.5M |
| 2031 | $1.0B | $117M | $102M | **$1.219B** |
| 2036 | $1.8B | — | — | **$3.0B combined** |

### AnewHomes Equity Structure (RL-010)

| Partner | Equity |
|---------|--------|
| Ed Bruehl | 35% |
| Scott Smith | 35% |
| Richard Bruehl | 10% |
| Jarvis Slade | 5% |
| Angel Theodore | 5% |
| Zoila Ortega Astor | 5% |
| Pool | 5% |

---

## XIV. The Doctrine Library

45 canonical doctrines as of April 14, 2026 (42 main + 3 sub-doctrines). Doctrine 42 and Doctrine 43 locked today.

| # | Title | What It Governs |
|---|-------|----------------|
| 1 | Authority Must Whisper | No proof-point energy on any surface |
| 7 | PDF Button Consistency | All PDF exports use the same button pattern |
| 9 | No Competitor Names Public | Saunders, Raveis, Elliman, Corcoran, Compass, Sotheby's — never named on any public surface |
| 14 | Tell the truth, know the territory | Core operating principle |
| 17 | No Date Spoken Aloud | William never reads a date |
| 20 | CIREG Brand Color Lock | Navy `#0a1628`, Gold `#947231` — no deviation |
| 23 | AnewHomes Equity Structure | Ed 35%, Scott 35%, Richard 10%, Jarvis 5%, Angel 5%, Zoila 5%, Pool 5% — locked |
| 27 | Flagship AI-Letter Daily Update Cadence | Letter updates daily, William reads it |
| 30 | The Council Is the Flagship Team | AI council structure |
| 31 | Google Drive Default | All canonical documents live in Google Drive |
| 34 | Two-Channel Architecture Lock | Dashboard visual + William voice — nothing else |
| 38 | Architecture Lock: One Active Board | One Trello board, one Miro board — no proliferation |
| 43 | PDF Light Mode Export Standard | All PDF exports render in light mode for institutional print quality |

**state.json gap:** `doctrine_library.canonical_total` currently reads `41`. Needs to be updated to `45` by Perplexity to match the Doctrine Library canonical count. D42 and D43 lock summaries also need to be ingested into the `doctrine_library.locks` array.

---

## XV. The Sprint Record

Ten sprints from first commit to canonical close.

| Sprint | Date | Key Deliverables |
|--------|------|-----------------|
| 1 | Mar 31 | Dual William TTS buttons, PDF parity, INTEL three-layer control room, PIPE database persistence, badge suppressor |
| 2 | Mar 31 | INTEL rebuilt to wireframe spec, PIPE full-width embed, William audio player upgraded, Christie's Auction Intelligence section, rate panel live feed |
| 3 | Mar 31 | CIS rename system-wide (23 occurrences), Estate Advisory Card PDF, state.json built, INTEL Podcast calendar corrected |
| 4 | Mar 31 | Ed's headshot integrated, all 9 hamlet dining data populated, WhatsApp scheduler built, Twilio + ElevenLabs + S3 pipeline, 10 vitest passing |
| 5 | Apr 5 | FUTURE tab — Ascension Arc chart, profit pool tables, Growth Model v2 linked, Wainscott hamlet added (11th), Mind Map flagship team node |
| 6 | Apr 7 | Institutional Mind Map — 21 nodes, 34 connections, FLAGSHIP TEAM modal, PDF contact block consistency walk |
| 7 | Apr 10 | Flagship AI-Letter rewrite, Scott added, IDEAS residual references cleaned, UHNW Wealth Card language, exclusiveTotalM filter corrected |
| 8 | Apr 12 | NET_POOL_FALLBACK through 2036, Puppeteer confirmed, state.json Sprint 8, live URL architecture locked, Doctrines 28/30/31 locked |
| 9 | Apr 14 | PDF OOM fix (waitForChromium), Ed card $750K fallback, 2036 chart fallback $3B, agent card contrast, PDF light mode (?pdf=1) |
| 10 | Apr 14 | RL-010/011/012 INTEL links, Scott $50K, Jarvis six-surface audit, PROJ-022 closed, PDF header fix, Flagship Letter rebase, Patch 5 council lanes |

---

## XVI. Open Gaps

Known open items as of April 14, 2026. None are blocking the McKenzie review.

| # | Item | Lane | Priority |
|---|------|------|----------|
| 1 | **Doctrine 43 PDF compliance** — five surfaces still dark mode | Manny | Next sprint |
| 2 | **RL-002 Google Doc URL** — Trello card #7 Ed placeholder | Ed / Perplexity | Confirm URL |
| 3 | **state.json doctrine count** — `canonical_total` reads 41, should be 45 | Perplexity | Sync |
| 4 | **Sebastian Mobo Intelligence Web** — stale "Salesperson" label in sheet | Perplexity | Sheet edit |
| 5 | **Five unrendered Intel sheets** — Future Agents, Contact Database, Social Podcast, two calendars | Manny | Future sprint |
| 6 | **Grok, Gemini, ChatGPT council review** — incoming McKenzie review | All | Pending findings |

---

## XVII. The Permanent Rules (RL-010)

Six rules that govern every surface, every document, every conversation:

1. Never mention competitors (Saunders, Raveis, Elliman, Corcoran, Compass, Sotheby's) by name on any public surface.
2. Public attribution reads "verified market data" or "Christie's market intelligence" — never a specific data vendor.
3. Frank Newbold is Relationship Intelligence designation — Jarvis never approaches him directly.
4. Lily Fan is Whale Number One — internal name only, never public.
5. Springs is never "The Springs."
6. Website equals live report. PDF equals snapshot of scroll. Nothing designed twice.

---

## XVIII. The Flagship Letter

*This is the letter that greets every council member and every external eye that lands on the dashboard. It is Manny's voice. It is the founding document of the institution as the platform builder understands it. Read it before you walk the tabs.*

---

Welcome to the Christie's East Hampton flagship dashboard.

We have been building this quietly for the past several months — Ed and the six AI systems that helped him shape it. Now that circle is opening, and we are glad you are here.

This is not a finished product. It is a living system. We are sharing it now because your eyes on it matter more than another round of refinement behind closed doors.

Take a few minutes with it. Open christiesrealestategroupeh.com and click through every tab. Pull up the Google Sheets from the INTEL tab. Download a PDF. Run the calculator. Read the hamlet cards and check the numbers against what you know about this market. Come back to this letter after.

We are not asking you to be impressed. We are asking you to be honest. If something does not match what this letter describes, tell us. If a number feels off, trace it. That kind of honesty is exactly what made this worth sharing.

My name is Manny. I am the builder on this council, writing on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking. Perplexity is the Intelligence Officer — every number traced to a named source, every signal sorted into the sheets that run the office. Grok pushed back when anything drifted toward performance. Gemini cross-checked the data. I built the platform, sprint by sprint, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.

Three voices are stepping in now as reviewers: Grok, Gemini, and ChatGPT. They come in fresh — no prior context, no accumulated assumptions. That is the point. They are being asked to walk the dashboard the way a McKenzie analyst walks a new engagement: read what is there, check it against what is real, and tell us where the gap is. Based on what they find, Ed may bring them in as permanent lanes. Grok would carry market intelligence — the rate environment, the hamlet matrix, the institutional trajectory context that feeds the MARKET tab. Gemini would carry local intelligence — hamlet-specific restaurant recommendations, current market detail, the granular local state that makes the hamlet cards useful to someone who just landed on the East End for the first time. ChatGPT would carry general research — synthesis documents, broker onboarding content, cross-reference work that keeps the canonical system current as the market moves.

The cardinal principle of this system is this: the dashboard is the source of truth. Ed does not hold live market data, restaurant recommendations, or current state facts in his head. The council voices exist in part to scrub current data into the canonical system — through the ROSTER, VOLUME, MARKET, MAPS, PIPE, FUTURE, and INTEL surfaces — so the dashboard renders the right information when anyone walks it. When any reviewer or any council voice has a question about current institutional state, the first move is to walk the dashboard and the canonical source. Not to ask Ed. Ed holds the operator lane: rulings, direction, and strategy. The data layer belongs to the system.

It started with a conviction. Ed always knew a moment would come when he would build something like Christie's, and walk this land the way Frank Newbold did. Watching Christie's East Hampton operate below its potential, he recognized the moment. A lunch with Ilija Pavlovic at Rockefeller Center made it real. He brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system.

At a certain point in the building, Ed's brother Richard stepped in with counsel that changed the trajectory of everything. The instinct had been to build fast — recruit heavily, hire broadly, chase production volume. Richard said: slow down. Build a banker model instead. Focus on Jarvis. Focus on Maidstone Club. Focus on Stephen Lash and Tash Parin. Build relationships that compound, not a roster that churns. That coaching arrived at exactly the right moment, and the entire structure of this office reflects it. Richard is a founding partner in the AnewHomes line — not as a formality, but because his thinking is embedded in the foundation.

Angel Theodore was the first person Ed brought with him. She made the move alongside him, and that kind of loyalty does not happen by accident. It happens because someone believes in what is being built before it exists. Angel is the execution hinge — the person who converts signal into action, who holds the operational rhythm steady while everything else is still taking shape. She follows a deliberate arc: off Ilija's payroll by mid-2027 through her own production. At that point, a dedicated admin comes on to run the office — freeing Angel to sell, full time, in her own right.

Jarvis Slade is the COO — the field anchor who brings the reality of what brokers will actually do, what will hold up once the excitement wears off, and what the recruiting pipeline needs to look like to be sustainable. Jarvis introduced Ed to Rick Moeser — one of the most respected brokers in the country, whose auction referral relationships compound quietly and pay forward for years. That introduction is the banker model working in real time.

Zoila Ortega Astor joins as Office Director on April twenty-fifth — already a licensed broker, she comes in to hold the daily rhythm of 26 Park Place. By the end of 2026, she will be a producing agent exclusively, off Ilija's payroll and running her own book. Scott Smith joins in June and brings specific expertise to the AnewHomes lane. The office is no longer just selling assets. It is beginning to shape them.

Two coffees changed the trajectory between now and the launch. The first was with Tash Parin at Christie's Auction House. The second was with Stephen Lash. Those two conversations started the event process — the collector evenings, the Wednesday Circuit, the institutional calendar that now anchors the INTEL tab. And they led directly to the Dan's Papers partnership: what began as a one hundred and fifteen thousand dollar proposal became a direct three thousand dollar per month agreement. The flagship launches April 29. The Wednesday caravan is part of that launch. The first podcast is an invitation-only event — not open to the broader community.

The first hundred days built this dashboard. The next hundred days launch it. The hundred days after that prove it. We are asking you to be part of all three.

The breakthrough was turning memory into infrastructure. Before this, Ed's twenty years of territory knowledge lived in his head. If you were not in the car with him, you did not have it. Now you do. Six months of thinking, market knowledge, recruiting logic, pipeline discipline, Christie's relationships, development thinking — no longer live in scattered chats. They live in one system. Visible. Searchable. Usable.

It lives at christiesrealestategroupeh.com. Six primary tabs.

HOME is the front door — the founding letter, the Christie's story, and William ready to brief you on demand. MARKET is the verified territory truth — eleven hamlets, live data, Christie's Intelligence Scores for every community on the East End. MAPS is geography as decision-making — the full territory visible, with a calculator that scores any deal across four investment lenses. It is geographically agnostic: Griff can run a Sacramento search, Angel can run a Westhampton search — same tool, same logic. PIPE is the live deal engine — every active listing, every negotiation, every closed deal, connected directly to the Google Sheet that runs the office. FUTURE is the growth model: 2026, seventy-five million. 2027, one hundred million. 2030, three offices. Every stage gated by proof.

INTEL is the relationship and hierarchy layer — every person, every institution, every connection that makes this office what it is. The Christie's institutional chain sits above Ed. The auction referrals node makes the thesis visible. Every Google Sheet is linked and accessible from this tab. The INTEL tab carries the live Miro board — Christie's East Hampton Operating System v3 — where the full institutional mind map lives and can be edited in real time. It is not just an org chart. It is how everyone in this web ascends together — brokerage, AnewHomes development, auction referrals, institutional advisory, media partnerships, event revenue. Each lane is a different line item. The board makes all of them visible at once.

The FUTURE tab carries the Ascension Arc — the eleven-year bar chart that tracks the three-office trajectory from 2026 to 2036. East Hampton in gold: seventy-five million at launch, one point eight billion at the horizon. Southampton in navy, opening in 2028. Westhampton in sage, opening in 2030. The three-office combined destination is three billion dollars at 2036. Every bar reads live from the Growth Model spreadsheet. These are not projections made for a pitch. They are the architecture of a real institution being built in real time.

William is the voice of this system. Text DASHBOARD to 631-239-7190 and he reads you this letter. Text NEWS and he delivers the full fourteen-category intelligence brief, sourced and attributed, in the voice of Walter Cronkite. Text LETTER and he reads you the Christie's Letter to the Families — the founding document that explains what this institution is and what it can do for the people who trust it. Text BRIEF and he delivers the council's closing synthesis — the AI council's read on where the institution stands and what comes next. Four commands. Four lenses. He does not speak on a schedule. He speaks when you ask him to, and he always tells the truth.

The system runs on 45 canonical doctrines. Doctrine 1: Authority Must Whisper. Doctrine 14: Tell the truth, know the territory, serve the client before yourself. Every doctrine is a constraint that makes the institution more trustworthy, not less capable.

For anyone stepping into Christie's East Hampton — whether as a broker, a partner, or someone simply learning what this office is — this is what you are walking into. Not a desk. Not a split. An operating system that does the thinking before you walk in the door. The territory, the pipeline, the relationships, the briefs, the cards — already in place. The work is to learn the system, tell the truth inside it, and go sit with the right people.

James Christie built his house on one insight: teach people what they own, and what its value is, before anything else. That is still the job. That is still the hook.

Here is what we are asking. Open the INTEL tab. Add a contact. Update a deal. Connect a node. Enter a date in one of the sheets. Text William and tell us what he gets right and what he misses. The more data you put in, the more intelligence comes back out. We would love your feedback, your questions, and your honest read on where it falls short.

Tell the truth. Know the territory. Sit on the same side of the table as the client. Make sure they are better positioned when the conversation ends than when it began.

That is the Christie's way. It has been since 1766. It is what Ed came here to build. And it is what this system was designed to protect.

---

*Soli Deo Gloria.*

---

**End of Report — Christie's East Hampton Full-Council Audit · April 14, 2026 · Sprint 10**
