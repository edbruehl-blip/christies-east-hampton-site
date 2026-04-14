# Christie's East Hampton — Full Council Audit Report
**April 14, 2026 · Sprint 10 · Checkpoint 75812f81**
*Prepared by Manny (Platform Builder) for Ed Bruehl and the Full Council*

---

## What This Is

This is a complete, eyes-open audit of everything the council has built, connected, decided, and locked since the platform began. It covers the live dashboard at [www.christiesrealestategroupeh.com](https://www.christiesrealestategroupeh.com), the server architecture behind it, the data connections, the document library, the team roster, the doctrine library, and the open gaps. It is written from my lane — the builder — and reflects what I can see in the code, the state file, and the sprint record.

---

## I. The Platform — What Is Live

The Christie's East Hampton Intelligence Platform is a full-stack web application running React 19 + Tailwind 4 + Express 4 + tRPC 11 + Drizzle ORM + MySQL. It is hosted on Manus at two domains:

| Domain | Status |
|--------|--------|
| `www.christiesrealestategroupeh.com` | Live — primary institutional domain |
| `christies-dash-acqj9wc4.manus.space` | Live — Manus auto-generated domain |

The platform has two channels per Doctrine 34: the **dashboard visual** (the website) and **William's voice** (WhatsApp + TTS audio). Both are operational.

---

## II. The Dashboard — Six Tabs

The main dashboard is a six-tab control room accessible at the root URL. Every tab is public-facing (no login required to view). Write operations (pipeline status updates, newsletter management) require authentication via Manus OAuth.

| Tab | What It Does | Data Source |
|-----|-------------|-------------|
| **HOME** | Ed's founding letter, live market ticker (S&P, Gold, 30Y Treasury, VIX, Hamptons median), weather, social links, William TTS audio player | Live market APIs + ElevenLabs TTS |
| **MARKET** | 11-hamlet matrix (East Hampton through Wainscott), live median prices, rate environment, hamlet PDF exports | Google Sheets Market Matrix (`176OVbAi6`) + live rate APIs |
| **MAPS** | Google Maps integration with Christie's listing overlay, hamlet navigation, property intelligence | Google Maps Proxy + Christie's listings sync |
| **PIPE** | Live Office Pipeline Google Sheet embed (private sheet, server-side proxy — no public sharing required) | Google Sheets PIPE (`1VPjIYPa`) |
| **FUTURE** | Ascension Arc bar chart (2026–2036 trajectory), profit pool tables, agent participant cards, 300-day story | Growth Model v2 Google Sheet (`1jR_sO3t`) |
| **INTEL** | Five-layer control room: Miro institutional mind map, Trello board, Wednesday Circuit calendar, Intelligence Web spiderweb, Document Library | Miro embed + Trello embed + Google Calendar embed + Intelligence Web Sheet (`1eELH_ZV`) + CDN docs |

---

## III. The Standalone Pages

Beyond the six-tab dashboard, the platform has seven standalone pages reachable by direct URL. These are the institutional document surfaces — designed for print, PDF export, and external sharing.

| URL | What It Is | PDF Export |
|-----|-----------|-----------|
| `/report` or `/market` | Christie's Hamptons Live Market Report — full six-section market intelligence document | Yes — Puppeteer PDF |
| `/pro-forma` | Pro Forma — Ed's personal financial model, 300-day arc, agent table, profit pool | Yes — Puppeteer PDF |
| `/future` | FUTURE tab standalone renderer — Ascension Arc, agent cards, no nav chrome. PDF target for Puppeteer | Yes — Puppeteer PDF (`?pdf=1` light mode) |
| `/letters/flagship` | Flagship AI-Letter — daily institutional letter, William TTS, council-approved voice | No (TTS only) |
| `/letters/christies` | Christie's Founding Letter — institutional introduction for new families | No |
| `/council-brief` | Council Brief — internal operating brief for the full council | No |
| `/cards/uhnw-path` | UHNW Path Card — Tier A/B principal targeting, art-secured lending pathway | Yes — Puppeteer PDF |

---

## IV. The Server Architecture

The server is Express 4 with tRPC 11 as the primary API layer. All client-server communication goes through `/api/trpc`. There are no hand-rolled REST endpoints except for the specialized routes below.

### Registered Routes

| Route | File | Purpose |
|-------|------|---------|
| `POST /api/tts/*` | `server/tts-route.ts` | ElevenLabs TTS — William voice generation, flagship letter audio, market report audio |
| `GET /api/market-data` | `server/market-route.ts` | Live market data — S&P, Gold, Silver, VIX, 30Y Treasury, Hamptons median |
| `POST /api/whatsapp/*` | `server/whatsapp-route.ts` | Twilio WhatsApp — morning brief (8 AM ET), evening summary (8 PM ET), on-demand test |
| `POST /api/whatsapp/inbound` | `server/whatsapp-inbound.ts` | Inbound WhatsApp message handler |
| `GET /api/listings` | `server/listings-sync-route.ts` | Christie's listing sync — daily 6 AM cron from Christie's profile page |
| `POST /api/pdf/*` | `server/pdf-route.ts` | Puppeteer PDF generation — Pro Forma, Market Report, FUTURE tab, UHNW card |
| `/api/trpc` | `server/routers.ts` | All tRPC procedures |

### tRPC Procedures (Key)

The router has 30+ procedures. The most important ones:

| Procedure | Access | What It Does |
|-----------|--------|-------------|
| `auth.me` | Public | Returns current user session |
| `pipe.sheetDeals` | Public | Reads live PIPE sheet deals |
| `pipe.updateSheetStatus` | Protected | Updates deal status in PIPE sheet |
| `intel.webEntities` | Public | Reads Intelligence Web sheet — 47 entities |
| `intel.entityNews` | Public | Perplexity AI news for a named entity |
| `market.hamletMatrix` | Public | Reads 11-hamlet matrix from Market Matrix sheet |
| `market.mortgageRate` | Public | Live 30Y mortgage rate |
| `market.hamptonsMedian` | Public | Hamptons median price from sheet |
| `future.growthModel` | Public | Growth Model v2 — KPI summary |
| `future.volumeData` | Public | Agent sales volume by year from VOLUME tab |
| `future.ascensionArc` | Public | Ascension Arc bar chart data 2026–2036 |
| `future.profitPool` | Public | Profit pool tables by year |
| `letter.getLetter` | Public | Flagship AI-Letter content |
| `letter.getChristiesLetter` | Public | Christie's Founding Letter content |
| `newsletter.subscribe` | Public | Email newsletter subscription |

---

## V. The Data Connections — Google Sheets

Four Google Sheets are wired directly into the server via the Google Service Account (`GOOGLE_SERVICE_ACCOUNT_JSON`). The service account is the credential — no OAuth, no user login required for reads.

| Sheet | ID (first 20 chars) | What It Feeds |
|-------|---------------------|---------------|
| **PIPE** (Office Pipeline) | `1VPjIYPaHXoXQ3rvCn_W` | PIPE tab — live deal rows, status, addresses, prices |
| **Market Matrix** | `176OVbAi6PrIVlglnvId` | MARKET tab — 11-hamlet median prices, inventory counts |
| **Intelligence Web** | `1eELH_ZVBMB2wBa9sqQM0` | INTEL tab Layer 4 — 47 entities, types, notes |
| **Growth Model v2** | `1jR_sO3t7YoKjUlDQpSv` | FUTURE tab — Ascension Arc, profit pool, VOLUME, ROSTER, agent GCI |

Five additional sheets are referenced in state.json but not yet wired to server reads (they are embedded as iframes or referenced by URL only):

| Sheet | Purpose |
|-------|---------|
| Intel Calendar (Podcast) | Podcast calendar — iframe in INTEL Layer 2 |
| Intel Calendar (Events) | Events calendar — iframe in INTEL Layer 2 |
| Intel Future Agents | Recruiting pipeline — referenced, not yet rendered |
| Intel Social Podcast | Social/podcast tracking — referenced, not yet rendered |
| Intel Contact Database | Contact database — referenced, not yet rendered |

---

## VI. The External Integrations

| Service | Credential | What It Powers |
|---------|-----------|----------------|
| **Google Service Account** | `GOOGLE_SERVICE_ACCOUNT_JSON` | All four live Google Sheets reads/writes |
| **ElevenLabs** | `ELEVENLABS_API_KEY` | William voice — TTS for Flagship Letter, Market Report, morning brief |
| **Twilio** | `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` | WhatsApp morning brief + evening summary delivery |
| **Perplexity** | `PERPLEXITY_API_KEY` | Entity news in INTEL Intelligence Web — live AI news per entity |
| **Manus OAuth** | `VITE_APP_ID` + `JWT_SECRET` | Ed's login — protects write operations |
| **Manus Built-in APIs** | `BUILT_IN_FORGE_API_KEY` | LLM, image generation, storage (S3), notifications |
| **Puppeteer / Chromium** | Headless Chromium v146 (bundled) | PDF generation for all six export surfaces |

---

## VII. The Document Library — Research Library

The INTEL tab Layer 5 Document Library has eleven entries, all pinned and accessible from the dashboard without leaving the browser.

| ID | Document | Format | Status |
|----|----------|--------|--------|
| Broker Onboarding | Broker Onboarding — What You Are Walking Into | PDF (CDN) | Live |
| Org Chart v2 | CIREG Ecosystem · Organizational Map · April 2, 2026 | HTML (CDN) | Live |
| Estate Advisory Card | Estate Advisory Card | PDF (CDN) | Live |
| 300-Day Ascension | 300-Day Ascension Plan · Wireframe | HTML (CDN) | Live |
| Market Report v2 | Christie's Hamptons Live Market Report · v2 | HTML (CDN) | Live |
| Council Brief | Council Brief · March 29, 2026 · FINAL | HTML (CDN) | Live |
| UHNW Backend Strategy | Modern Day Path · UHNW Backend Strategy | PDF (CDN) | Live |
| Intelligence Web Canonical | Christie's Intelligence Web · Canonical Map | HTML (CDN) | Live |
| Infrastructure Audit | Platform Infrastructure Audit · April 6, 2026 | PDF (CDN) | Live |
| Lash Speaker Packet | Stephen Lash Speaker Briefing · July 2026 | PDF (CDN) | Live |
| **RL-010** | Canonical State of the Institution · April 14, 2026 | Google Doc | **Live — Sprint 10** |
| **RL-011** | Griff Status Reports | Google Doc | **Live — Sprint 10** |

---

## VIII. The Team Roster

Ten human members in state.json as of Sprint 10. The flagship team (participant grid in FUTURE tab and ProFormaPage) is the first six. The remaining four are EH office performers or advisory roles.

| Name | Role | Status | FUTURE Tab Card |
|------|------|--------|----------------|
| Ed Bruehl | Managing Director | Active | Yes |
| Jarvis Slade | COO & Agent | Active | Yes |
| Angel Theodore | Mktg Coord + Sales | Active | Yes |
| Zoila Ortega Astor | Office Director | Joining April 25, 2026 | Yes |
| Scott Smith | Agent (AnewHomes build partner) | Joining June 1, 2026 | Yes — $50K GCI |
| Richard Bruehl | Advisory AnewHomes | Active | Yes |
| Sebastian Mobo | Broker | Active | No (Intel Web only) |
| Bonita DeWolf | Agent (EH office performer) | Active | No — PROJ-022 closed |
| Sandy Busch | Agent | Active | No |
| Jan Jaeger | Agent | Active | No |

### The Council (AI Members)

| Name | Role | Lane |
|------|------|------|
| Claude | Strategic Intelligence / Architect | Document drafts, doctrine synthesis, canonical rewrites |
| Perplexity | Research Intelligence / Intelligence Officer | Google Docs writes, entity research, canonical formatting |
| Manny | Platform Builder | Dashboard code, server, data connections, PDF engine |
| Grok | Market Intelligence | Incoming — council review round pending |
| Gemini | Data Intelligence | Incoming — council review round pending |
| ChatGPT | General Intelligence | Incoming — council review round pending |

Council workflow per RL-010: Claude + ChatGPT → Ed confirms → Perplexity formats brief → Ed approves → Manny builds.

---

## IX. The Doctrine Library — 43 Locks

The doctrine library has 43 canonical locks as of Sprint 9. These govern how the platform looks, speaks, operates, and grows. The most operationally relevant to the dashboard:

| Doctrine | Title | What It Governs |
|----------|-------|----------------|
| 1 | Authority Must Whisper | No proof-point energy in any surface |
| 7 | PDF Button Consistency | All PDF exports use the same button pattern |
| 9 | TTS Model Lock | ElevenLabs `eleven_turbo_v2` — locked |
| 17 | No Date Spoken Aloud | William never reads a date |
| 20 | CIREG Brand Color Lock | Navy `#0a1628`, Gold `#C8AC78` — no deviation |
| 23 | Soli Deo Gloria | Operational sign-off — never in a document |
| 27 | Flagship AI-Letter Daily Update Cadence | Letter updates daily, William reads it |
| 30 | The Council Is the Flagship Team | AI council = institutional team |
| 31 | Google Drive Default | All canonical documents live in Google Drive |
| 34 | Two-Channel Architecture Lock | Dashboard visual + William voice — nothing else |
| 38 | Architecture Lock: One Active Board | One Trello board, one Miro board — no proliferation |

Doctrine 43 (PDF Light Mode Export Standard) was referenced in Ed's brief as a standing item for the next sprint. It is not yet in the doctrine library in state.json — it exists as an operational ruling from the April 14 sprint but has not been formally locked as a numbered doctrine. This is a gap.

---

## X. The PDF Engine

The PDF engine uses Puppeteer with headless Chromium v146. It navigates to the live dashboard URL and captures the page as a PDF. All six export surfaces are operational.

| Surface | Route | Light Mode (`?pdf=1`) | Status |
|---------|-------|----------------------|--------|
| Market Report | `/api/pdf/market-report` | No (dark mode) | Live |
| Pro Forma | `/api/pdf/pro-forma` | No (dark mode) | Live |
| FUTURE Tab | `/future?pdf=1` | **Yes — Sprint 9** | Live |
| UHNW Path Card | `/api/pdf/uhnw-path-card` | No (dark mode) | Live |
| Flagship Letter | `/api/pdf/flagship-letter` | No (dark mode) | Live |
| Council Brief | `/api/pdf/council-brief` | No (dark mode) | Live |

The OOM crash on the deployed container (Chrome download blocking server startup) was fixed in Sprint 9 via `waitForChromium()` — a 60-second polling retry loop. Chrome download is non-blocking; PDF requests wait up to 60 seconds on cold start.

Doctrine 43 compliance audit (light mode on all six surfaces) is queued for the next sprint.

---

## XI. The WhatsApp Pipeline

William delivers two scheduled voice notes daily via Twilio + ElevenLabs:

| Message | Schedule | Content |
|---------|----------|---------|
| Morning Brief | 8:00 AM Eastern daily | Market data summary — S&P, Gold, rates, Hamptons median, pipeline highlights |
| Evening Summary | 8:00 PM Eastern daily | Pipeline summary — active deals, status updates |
| On-demand test | `POST /api/whatsapp/test` | Manual trigger for testing |

Delivery: Twilio WhatsApp → Ed's WhatsApp number (`WILLIAM_WHATSAPP_TO`). Voice ID: `fjnwTZkKtQOJaYzGLa6n` (William — unified across all four surfaces: dashboard TTS player, WhatsApp inbound commands, WhatsApp scheduled briefs, tRPC procedure).

---

## XII. The AnewHomes Equity Structure

Per RL-010, the AnewHomes equity allocation is locked:

| Member | Equity Share |
|--------|-------------|
| Ed Bruehl | 35% |
| Scott Smith | 35% |
| Richard Bruehl | 10% |
| Jarvis Slade | 5% |
| Angel Theodore | 5% |
| Zoila Ortega Astor | 5% |
| Pool | 5% |

---

## XIII. The Trajectory — RL-010 Canonical Numbers

The locked institutional trajectory per RL-010 (April 14, 2026):

| Year | EH Volume | Southampton Vol | Westhampton Vol | Combined |
|------|-----------|----------------|-----------------|----------|
| 2026 | $75M | — | — | $75M |
| 2027 | $126M | — | — | $126M |
| 2028 | $211M | $42.5M | — | $253.5M |
| 2029 | $355M | $102M | — | $457M |
| 2030 | $596M | $114M | $42.5M | $752.5M |
| 2031 | $1.0B | $117M | $102M | $1.219B |
| 2036 | — | — | — | **$3.0B** (three-office combined) |

---

## XIV. The Sprint Record — What Was Built

Ten sprints completed. Sprint 10 is the current state.

| Sprint | Date | Key Deliverables |
|--------|------|-----------------|
| 1 | Mar 31 | Dual William TTS buttons, PDF parity, INTEL three-layer control room, PIPE database persistence, badge suppressor |
| 2 | Mar 31 | INTEL rebuilt to wireframe spec, PIPE full-width embed, William audio player upgraded, Christie's Auction Intelligence section, rate panel live feed |
| 3 | Mar 31 | CIS rename system-wide (23 occurrences), Estate Advisory Card PDF, state.json built, INTEL Podcast calendar corrected |
| 4 | Mar 31 | Ed's headshot integrated, all 9 hamlet dining data populated, WhatsApp scheduler built, Twilio + ElevenLabs + S3 pipeline, 10 vitest passing |
| 5 | Apr 5 | FUTURE tab — Ascension Arc chart, profit pool tables, Growth Model v2 linked, Wainscott hamlet added, Mind Map flagship team node |
| 6 | Apr 7 | Institutional Mind Map — 21 nodes, 34 connections, FLAGSHIP TEAM modal, PDF contact block consistency walk |
| 7 | Apr 10 | Flagship AI-Letter rewrite, Scott added, IDEAS residual references cleaned, UHNW Wealth Card language, exclusiveTotalM filter corrected |
| 8 | Apr 12 | NET_POOL_FALLBACK through 2036, Puppeteer confirmed, state.json Sprint 8, live URL architecture locked, Doctrines 28/30/31 locked |
| 9 | Apr 14 | PDF OOM fix (waitForChromium), Ed card $750K, 2036 fallback $3B, agent card contrast, PDF light mode (?pdf=1) |
| 10 | Apr 14 | RL-010/RL-011 INTEL links, Scott $50K, Jarvis six-surface audit, PROJ-022 closed, PDF header fix, RL-010 ingested into state.json |

---

## XV. Open Gaps and Standing Queue

These are the items I can see from my lane that are not yet done:

| Item | Priority | Notes |
|------|----------|-------|
| **Doctrine 43 compliance audit** | High | Walk all six PDF surfaces for light-mode compliance. Only FUTURE tab has `?pdf=1` light mode. Other five surfaces still export in dark mode. |
| **RL-012 INTEL wiring** | Medium | When Claude's new council onboarding brief lands in Drive, wire the Google Doc link into the Document Library. |
| **Updated Council Brief + Broker Onboarding links** | Medium | If either document moves to a new Drive location after Claude's rewrites, update the CDN URLs in the Document Library. |
| **Five unrendered Intel sheets** | Low | Future Agents, Social Podcast, Contact Database, Intel Calendar (Podcast), Intel Calendar (Events) are in state.json but not yet rendered as live dashboard components. |
| **Trello card #7 Ed RL-002 URL** | Low | `PLACEHOLDER_RL002` not in codebase — Trello-direct edit. Blocked pending RL-002 Google Doc URL confirmation. |
| **ROSTER tab cell C7** | Low | Jarvis role in Growth Model v2 Google Sheet ROSTER tab. If cell reads "Agent" only, sheet-direct edit needed. Dashboard code is clean. |
| **Intelligence Web Sebastian correction** | Low | Perplexity's lane — update Sebastian Mobo's row in Intelligence Web sheet from "Salesperson" to "Broker". |
| **Grok, Gemini, ChatGPT council review** | Pending | Incoming council members. No code action until their findings surface through the bridge. |

---

## XVI. The Permanent Rules (RL-010)

Six rules that govern every surface, every document, every conversation:

1. Never mention competitors (Saunders, Raveis, Elliman, Corcoran, Compass, Sotheby's) by name on any public surface.
2. Public attribution reads "verified market data" or "Christie's market intelligence" — never a specific data vendor.
3. Frank Newbold is Relationship Intelligence designation — Jarvis never approaches him directly.
4. Lily Fan is Whale Number One — internal name only, never public.
5. Springs is never "The Springs."
6. Website equals live report. PDF equals snapshot of scroll. Nothing designed twice.

---

*Manny — Platform Builder · Christie's East Hampton Council · April 14, 2026*
