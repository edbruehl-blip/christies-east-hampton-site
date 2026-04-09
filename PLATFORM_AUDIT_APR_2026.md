# Christie's East Hampton — Platform Audit
**Date:** April 9, 2026 · **Checkpoint:** `7d585724` · **Sprint:** 42 (closed)

---

## Executive Summary

The platform is structurally sound and fully deployed at `christiesrealestategroupeh.com`. All six tabs are live, all four Google Sheets are connected via service account, all four TTS endpoints are active, the WhatsApp intelligence layer is wired, and the PDF export suite covers nine document types. The audit below maps every layer — front end, back end, data, and integrations — and identifies what is live, what is static/hardcoded, and what is queued for future sprints.

---

## 1. Architecture Overview

The platform runs on a single Node.js/Express server (`server/_core/index.ts`) that serves both the React SPA and all API routes. In production, Vite builds the client to `dist/public` and Express serves it statically. In development, Vite runs as middleware. The database is MySQL/TiDB (managed by Drizzle ORM). Authentication is Manus OAuth with JWT session cookies.

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | React 19 + Tailwind 4 + Vite | ✅ Live |
| Backend | Express 4 + tRPC 11 | ✅ Live |
| Database | MySQL/TiDB via Drizzle ORM | ✅ Live |
| Auth | Manus OAuth + JWT cookies | ✅ Live |
| Data API | Google Sheets API (service account) | ✅ Live |
| Voice | ElevenLabs TTS (William voice) | ✅ Live |
| WhatsApp | Twilio + ElevenLabs voice notes | ✅ Wired (scheduler paused by directive) |
| Market Data | Yahoo Finance + CoinGecko + FRED | ✅ Live |
| Listings Sync | Christie's Real Estate Group API scrape | ✅ Live (6AM cron) |
| PDF Engine | jsPDF client-side + Puppeteer server-side | ✅ Live |
| CDN | files.manuscdn.com + CloudFront | ✅ Live (34 assets) |
| Domain | christiesrealestategroupeh.com + www | ✅ Active |

---

## 2. Server Routes — Complete Map

### tRPC Procedures (`/api/trpc`)

| Namespace | Procedure | Auth | Data Source |
|-----------|-----------|------|-------------|
| `auth` | `me` | public | Session cookie |
| `auth` | `logout` | public | Session cookie |
| `tts` | `foundingLetter` | public | ElevenLabs (legacy stub) |
| `tts` | `marketReport` | public | ElevenLabs (legacy stub) |
| `tts` | `ping` | public | Health check |
| `pipe` | `getKpis` | public | Google Sheet (PIPE) |
| `pipe` | `sheetDeals` | public | Google Sheet (PIPE) |
| `pipe` | `updateSheetStatus` | **protected** | Google Sheet (PIPE) — writes |
| `pipe` | `updatePropertyReport` | **protected** | Google Sheet (PIPE) — writes |
| `pipe` | `appendSheet` | **protected** | Google Sheet (PIPE) — writes |
| `pipe` | `list` | **protected** | MySQL DB (pipeline table) |
| `pipe` | `upsert` | **protected** | MySQL DB (pipeline table) |
| `pipe` | `delete` | **protected** | MySQL DB (pipeline table) |
| `pipe` | `importFromProfile` | **protected** | Christie's API scrape → Sheet |
| `intel` | `webEntities` | public | Google Sheet (Intelligence Web) |
| `intel` | `entityNews` | public | Perplexity API (on-demand) |
| `market` | `hamletMatrix` | public | Google Sheet (Market Matrix) |
| `market` | `mortgageRate` | public | FRED API (24h cache) |
| `market` | `dataTimestamp` | public | Server timestamp |
| `future` | `growthModel` | public | Google Sheet (Growth Model — OUTPUTS, ROSTER, ASSUMPTIONS) |
| `future` | `volumeData` | public | Google Sheet (Growth Model — VOLUME) |
| `future` | `generateProForma` | public | Google Sheets + Puppeteer PDF |
| `newsletter` | `subscribe` | public | Beehiiv API |
| `newsletter` | `getStats` | **protected** | Beehiiv API |
| `newsletter` | `sendTestEmail` | public | Gmail SMTP (nodemailer) |
| `system` | `notifyOwner` | **protected** | Manus notification API |

### Raw Express Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/tts/founding-letter` | GET | William reads Founding Letter | None |
| `/api/tts/christies-letter` | GET | William reads Christie's Letter | None |
| `/api/tts/flagship-letter` | GET | William reads Flagship Letter | None |
| `/api/tts/market-report` | GET | William reads Market Report Brief | None |
| `/api/market-data` | GET | S&P, Gold, Silver, VIX, Treasury, BTC, Mortgage | None |
| `/api/listings` | GET | Active listings from Christie's API (DB cache) | None |
| `/api/listings/sync` | POST | Force fresh listing sync | None |
| `/api/pdf/report` | GET | Puppeteer-rendered Market Report PDF | None |
| `/api/img-proxy` | GET | Image proxy for PDF generation | None |
| `/api/whatsapp/morning-brief` | POST | Trigger 8AM brief manually | Owner guard |
| `/api/whatsapp/evening-summary` | POST | Trigger 8PM summary manually | Owner guard |
| `/api/whatsapp/test` | POST | Test WhatsApp delivery | Owner guard |
| `/api/whatsapp/inbound` | POST | Twilio webhook — NEWS/PIPE/STATUS/BRIEF/HELP | Twilio signature |
| `/api/oauth/callback` | GET | Manus OAuth callback | N/A |

---

## 3. Database Schema

Three tables are live in MySQL/TiDB:

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | Auth — Manus OAuth sessions | `openId`, `role` (user/admin), `email` |
| `pipeline` | DB-backed pipeline entries (secondary to Sheet) | `address`, `hamlet`, `type`, `status`, `askPrice`, `dom`, `notes` |
| `listings` | Christie's API listings cache (Maps tab) | `address`, `price`, `hamlet`, `url`, `imageUrl`, `beds`, `baths`, `sqft`, `status`, `syncedAt` |

**Note:** The Google Sheet (`1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`) remains the single source of truth for the PIPE tab. The `pipeline` DB table is a secondary store used for the DB-backed list/upsert/delete procedures. The Sheet is what Ed reads and writes through the PIPE tab UI.

---

## 4. Google Sheets — Connected Sheets

| Sheet | ID | Tab | Used By |
|-------|----|-----|---------|
| Office Pipeline | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` | `PIPE` (A:W) | PIPE tab — deals, KPIs, status updates |
| Market Matrix | `176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g` | `Market Matrix` (A7:K18) | MARKET tab — 11 hamlet rows |
| Intelligence Web | `1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0` | `Intelligence Web` (A:Q) | INTEL tab — entity cards |
| Growth Model | `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag` | `OUTPUTS`, `ROSTER`, `ASSUMPTIONS`, `VOLUME` | FUTURE tab — Ascension Arc, agent roster, volume projections |

All four sheets authenticate via `GOOGLE_SERVICE_ACCOUNT_JSON` (service account: `christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com`).

---

## 5. Tab-by-Tab Status

### HOME
The founding letter section is the primary content surface. Ed's letter, signature, and four stacked audio players are all live. SectionB renders the platform doctrine card and the James Christie portrait link to `/report`. The Collateral Cards section (further down) renders the three PDF export cards (Christie's Letter, Flagship Letter, Market Report) each with their own audio player. The market ticker in the header pulls live data from `/api/market-data` every 5 minutes.

**Live data:** Market ticker (S&P, Gold, Silver, VIX, Treasury, BTC, Mortgage), Hamlet Matrix (passed to PDF export at generation time).

**Static/hardcoded:** The founding letter text itself, the doctrine lines, the platform description copy.

### MARKET
Renders the 11-hamlet matrix cards. Data is live from the Market Matrix Google Sheet, refreshed every 5 minutes. The mortgage rate panel pulls from FRED (24h cache). The donut chart and bar charts are computed from live sheet rows at render time.

**Live data:** All 11 hamlet rows (median, volume, DOM, tier), mortgage rate.

**Static/hardcoded:** The hamlet boundary descriptions and tier definitions in `hamlet-master.ts`.

### MAPS
Renders the Google Maps integration with Ed's active listings as pins. Listings are fetched from `/api/listings` (DB cache, synced daily at 6AM from Christie's Real Estate Group profile). The D3 hamlet territory overlay is drawn from `hamlet-boundaries.ts` (static GeoJSON-style data). The matrix card grid below the map uses `MASTER_HAMLET_DATA` (static baseline data).

**Live data:** Active listings (address, price, beds/baths, URL, image) from Christie's API.

**Static/hardcoded:** Hamlet boundary polygons, baseline hamlet statistics.

### PIPE
The PIPE tab is the operational deal management surface. It reads live from the Google Sheet (`sheetDeals` — 60-second polling). Ed can update deal status and property report fields directly from the UI, which writes back to the Sheet via `updateSheetStatus` and `updatePropertyReport`. New deals can be appended via the intake form (`appendSheet`). The "Import from Profile" button scrapes Ed's Christie's profile and seeds new listings into the Sheet.

**Live data:** All deal rows from the PIPE Sheet (address, status, ask price, DOM, notes, GCI, CIS score).

**Write-back:** Status updates, property report fields, new deal intake — all write to the Sheet.

### FUTURE
Renders the Ascension Arc (profit pool waterfall), agent roster table, volume projections, and model assumptions. All data is live from the Growth Model Google Sheet. The Pro Forma PDF is generated server-side via Puppeteer (`generateProForma` tRPC mutation) and injects live KPIs from the PIPE Sheet at generation time. The Card Stock export is generated client-side (jsPDF) and also injects live KPIs.

**Live data:** Growth model outputs (GCI targets, profit pool, Ed share), agent roster (name, volume, GCI), volume projections, pipeline KPIs (active pipeline total, relationship book total).

**Static/hardcoded:** The council-approved doctrine targets (Sprint 36 floor values — sheet can only go up, never below these).

### INTEL
Two primary components: the Institutional Mind Map (spiderweb) and the Intelligence Web Tabs (entity cards).

The **spiderweb** (`InstitutionalMindMap.tsx`) is a 47-node SVG visualization. All nodes are now circles (Sprint 42 Item 2). The dual Christie's nodes at the top are `cireg_affiliate` (CIREG Tri-State, Ilija's chain) and `cire_global` (Christie's International Real Estate, Gavin Swartzman). Hovering a node triggers a live Perplexity API call (`trpc.intel.entityNews`) to fetch current news about that entity. The EXPORTS sub-nodes are clickable PDF triggers wired to all nine export functions.

The **Intelligence Web Tabs** (`IntelligenceWebTabs.tsx`) reads live from the Intelligence Web Google Sheet (`trpc.intel.webEntities`) and renders entity cards by category (RECRUIT, WHALE, COMPETITOR, PARTNER, etc.).

**Live data:** Entity news on hover (Perplexity), entity cards (Intelligence Web Sheet).

**Static/hardcoded:** The 47-node graph topology, edge connections, and node metadata are hardcoded in `InstitutionalMindMap.tsx`. This is intentional — the spiderweb is a curated institutional map, not a dynamic feed.

---

## 6. Voice Layer (William)

Four TTS endpoints are active, all streaming MP3 audio from ElevenLabs (William voice, `ELEVENLABS_API_KEY`):

| Endpoint | Script | Approx. Duration |
|----------|--------|-----------------|
| `/api/tts/founding-letter` | Christie's founding principle, South Fork territory, Ed's role | ~90 seconds |
| `/api/tts/christies-letter` | 260-year institution letter, art/estate services | ~75 seconds |
| `/api/tts/flagship-letter` | Full council document to Jarvis, Angel, Ricky — platform story, tab walkthrough, model | ~4 minutes |
| `/api/tts/market-report` | Q1 2026 market brief, hamlet data, rate environment | ~2 minutes |

**Placement:**
- **HOME tab (SectionA):** Four stacked `WilliamAudioPlayer` components below Ed's signature — Founding Letter, Christie's Letter, Flagship Letter, Market Intelligence Brief.
- **/report page (Section1):** Three side-by-side buttons — Listen · Founding Letter, Listen · Flagship Letter, Listen · Market Report.

**WhatsApp voice layer:** The `deliverBrief()` function in `whatsapp-route.ts` assembles a brief from Perplexity (Cronkite prompt), pipeline summary, and volume scorecard, converts it to audio via ElevenLabs, uploads to S3, and sends as a Twilio WhatsApp voice note. The automated 8AM/8PM cron is **paused by Sprint 41 directive**. Manual endpoints (`/api/whatsapp/morning-brief`, `/api/whatsapp/evening-summary`, `/api/whatsapp/test`) remain active.

---

## 7. PDF Export Suite

Nine export functions are live in `pdf-exports.ts` (client-side jsPDF) plus one server-side Puppeteer export:

| Export | Function | Trigger | Live Data Injected |
|--------|----------|---------|-------------------|
| Market Report (5-page) | `generateMarketReport()` | HOME card, INTEL EXPORTS node | Market Matrix Sheet (11 hamlet rows) |
| Christie's Letter | `generateChristiesLetter()` | HOME card, INTEL EXPORTS node | None (static letter) |
| Flagship Letter | `generateFlagshipLetter()` | HOME card, INTEL EXPORTS node | None (static letter) |
| ANEW Build Memo | `generateAnewBuildMemo()` | IDEAS calculator | ANEW calculator inputs |
| Christie CMA | `generateChristieCMA()` | IDEAS calculator | ANEW calculator inputs |
| Deal Brief | `generateDealBrief()` | IDEAS calculator | ANEW calculator inputs |
| Investment Memo | `generateInvestmentMemo()` | IDEAS calculator | ANEW calculator inputs |
| UHNW Path Card | `generateUHNWPathCard()` | HOME card | None (static card) |
| Future Report (Ascension Arc) | `generateFutureReportPDF()` | FUTURE tab | Growth Model Sheet + Pipeline KPIs |
| Card Stock Export | `generateCardStockExport()` | FUTURE tab | Growth Model Sheet + Pipeline KPIs |
| Pro Forma (4-page) | `generateProFormaPDF()` (server-side) | FUTURE tab | Growth Model Sheet + Pipeline KPIs |
| East Hampton Village Report | `generateEastHamptonVillageReport()` | INTEL EXPORTS node | None (static hamlet data) |

All exports use the universal `drawPdfHeader()` helper (Sprint 42 Item 3) with four variants: `standard`, `letter`, `navy-bar`, `landscape`. All logos are base64-embedded — no CDN dependency at export time.

---

## 8. /report Page (James Christie Click-Through)

The `/report` route is a standalone page (no tab chrome) accessible by tapping the James Christie portrait on HOME. It has seven sections:

| Section | Content | Data |
|---------|---------|------|
| 1 — Institutional Opening | Gallery hero, founding letter, three audio buttons, PDF download | ElevenLabs TTS (live) |
| 2 — Hamptons Local Intelligence | Municipal news feed (East Hampton, Southampton, Sag Harbor) | **Static** — `HAMPTONS_NEWS` constant |
| 3 — Market Intelligence | CFS donut, rate environment, Hamptons Median | Yahoo Finance + FRED (live) |
| 4 — Hamlet Atlas Matrix | 9 hamlet tiles with inline expansion | `MASTER_HAMLET_DATA` (static baseline) |
| 5 — IDEAS / CIS Intelligence | Model deal card, CIS chip, QR code | **Static** — 9 Daniels Hole Road example |
| 6 — Resources & Authority | Christie's ecosystem, contact block, doctrine footer | **Static** |
| 7 — Estate Advisory | Estate Advisory Card component | **Static** |

**Known gap:** Section 2 (Hamptons Local Intelligence) is hardcoded static news. A live Perplexity feed was identified as a future item but has not been built.

---

## 9. Market Data Ticker

The global ticker in the dashboard header (`DashboardLayout.tsx`) fetches `/api/market-data` on mount and every 5 minutes. The server fetches all symbols in parallel:

| Symbol | Source | Fallback |
|--------|--------|---------|
| S&P 500 (`^GSPC`) | Yahoo Finance | null (hidden) |
| Gold (`GC=F`) | Yahoo Finance | null (hidden) |
| Silver (`SI=F`) | Yahoo Finance | null (hidden) |
| VIX (`^VIX`) | Yahoo Finance | null (hidden) |
| 30Y Treasury (`^TYX`) | Yahoo Finance | null (hidden) |
| Bitcoin | CoinGecko API | null (hidden) |
| 30Y Fixed Mortgage | FRED (`MORTGAGE30US`) | Last known value (24h cache) |
| Hamptons Median | Market Matrix Sheet | Last fetched value |

---

## 10. Open Items (Queued — Not Started)

The following items are in `todo.md` as pending. They are organized by priority:

**High priority (Sprint 43 candidates):**
- Wire `projGci2026` live from Growth Model Sheet (Sprint 39 carry — currently hardcoded in FUTURE)
- Jarvis actual 2026 production fields in Growth Model
- New Broker PIPE intake type
- Calculator button to newsletter placeholder (Sprint 40 carry)
- Ascension Arc profit pool corrections (2027 Ed share $360K, 2028 Ed share $750K)

**Medium priority:**
- Section 2 of `/report` — replace static `HAMPTONS_NEWS` with live Perplexity feed
- WhatsApp automated cron re-enable (paused by Sprint 41 directive — re-enable when Ed is ready)
- Favicon — upload Christie's C mark (IMG_4386) to CDN and set as `favicon.ico`
- Mobile polish — FUTURE tables horizontal scroll, INTEL mind map scrollable container, MARKET chart labels

**Low priority / housekeeping:**
- CIS rename — replace "ANEW Score" with "Christie's Intelligence Score (CIS)" across 7 files
- `state.json` build in `client/public` with sprint number, sheet IDs, design tokens
- Tier labels — remove from all surfaces
- Art/Beauty/Provenance audit across platform copy

---

## 11. What Is Solid

Every core system is connected and working. The four Google Sheets are live. The market ticker is live. The listings sync runs daily and persists to the database. The WhatsApp intelligence layer responds to NEWS, PIPE, STATUS, BRIEF, and HELP commands. All four William TTS scripts are wired to both HOME and the /report page. The PDF suite covers nine document types with live data injection at export time. The INTEL spiderweb has 47 nodes, all circles, with dual Christie's nodes at the top and live Perplexity hover news. The domain is live at `christiesrealestategroupeh.com`.

The platform is production-ready. The open items above are enhancements, not blockers.

---

*Audit conducted April 9, 2026 · Checkpoint `7d585724` · Sprint 42 closed*
