# Christie's East Hampton — Council Architecture Brief
**Date:** April 1, 2026  
**Author:** Manny (AI Agent)  
**Purpose:** Complete map of what exists, where it lives, and what connects to what — for Ed, Claude, ChatGPT, and the full council before any wireframe or structural work begins.

---

## SECTION I — The Platform at a Glance

The Christie's East Hampton platform is a single web application running on the Manus hosting infrastructure. It is a seven-tab dashboard built in React 19 + TypeScript, served by an Express 4 backend, with a MySQL database for persistent data, and a collection of Google Sheets as the primary source of truth for operational data. The frontend and backend communicate exclusively via tRPC — no REST endpoints except for a small number of legacy Express routes (PDF, market data, WhatsApp, listings sync).

The live URL is `www.christiesrealestategroupeh.com`. The codebase lives at `/home/ubuntu/christies-eh-replatform` in the Manus sandbox. The current locked checkpoint is `66b6623a`.

---

## SECTION II — The Seven Tabs

| Tab | Route | Component File | Primary Data Source | Classification |
|-----|-------|---------------|---------------------|---------------|
| HOME | `/` | `HomeTab.tsx` | Hardcoded + CDN assets | Static |
| MARKET | `/market` | `MarketTab.tsx` | `hamlet-master.ts` (hardcoded) | Static |
| MAPS | `/maps` | `MapsTab.tsx` | `hamlet-master.ts` + `/api/listings` | Live (listings auto-sync) |
| IDEAS | `/ideas` | `IdeasTab.tsx` | `hamlet-master.ts` + user input | Calculator |
| PIPE | `/pipe` | `PipeTab.tsx` | MySQL DB + Google Sheet embed | Hybrid |
| FUTURE | `/future` | `FutureTab.tsx` | Hardcoded (manual sync from Growth Model v2) | Static |
| INTEL | `/intel` | `IntelTab.tsx` | Google Sheet embeds + static doc URLs | Hybrid |

---

## SECTION III — Tab-by-Tab Architecture

### HOME
The HOME tab is fully static. It renders a full-bleed hero section using CDN-hosted auction room imagery and the James Christie portrait (both from `cdn-assets.ts`). The founding letter is a hardcoded array of paragraphs (`FOUNDING_PARAGRAPHS`) in `HomeTab.tsx`. The YouTube intelligence matrix is a hardcoded array of 9 video IDs. The James Christie portrait links to `/report`. Nothing in HOME touches the database or any external API.

### MARKET
The MARKET tab renders ten hamlet tiles, a donut chart, and a quadrant matrix. All data — hamlet names, tier classifications, median prices, ANEW scores, volume shares, and color codes — comes from a single hardcoded file: `client/src/data/hamlet-master.ts`. This file is the single source of truth for all hamlet data across the entire platform. It exports `MASTER_HAMLET_DATA` (10 hamlet objects), `TIER_COLORS` (color map by tier), and helper functions for tier ordering. The MARKET tab does not call any API or database. It is a pure render of `hamlet-master.ts`.

### MAPS
The MAPS tab is the only tab with a live external data feed. It renders the Paumanok SVG map with hamlet dot overlays, a sidebar with hamlet detail cards, and EELE listing cards per hamlet. The listing data comes from `GET /api/listings`, which is an Express route (`listings-sync-route.ts`) that scrapes Ed's Christie's Real Estate Group profile page, classifies listings by hamlet via keyword matching, and caches results in memory. A 6 AM cron job (America/New_York) calls `syncListings()` automatically. The map dot colors are driven by `TIER_COLORS` from `hamlet-master.ts`. Hamlet coordinates are hardcoded in `hamlet-master.ts`. EELE listing cards show placeholder data (Address: TBD, Price: TBD, Status: Active) until real listings are returned from the sync.

**Known limitation:** The listings sync classifier maps to 9 hamlet keywords (East Hampton Village, Sagaponack, Bridgehampton, Water Mill, Southampton Village, Sag Harbor, Amagansett, Springs, East Hampton Town). Montauk is folded into East Hampton Town in the classifier — it is not a separate classification bucket yet.

### IDEAS (ANEW Calculator)
The IDEAS tab is a multi-mode investment calculator. It imports hamlet options from `MASTER_HAMLET_DATA` and calculator logic from `calculators/anew-calculator`. It exports results to PDF via `lib/pdf-exports.ts`. The calculator runs entirely client-side — no database, no API calls. PDF export calls `GET /api/pdf/report` (Puppeteer server-side render of the `/report` page) or generates a client-side PDF directly depending on the export type. The IDEAS tab does not persist any data.

### PIPE
The PIPE tab has a two-layer architecture. **Layer 1 (primary):** The full Office Pipeline Google Sheet (`1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`) embedded full-width as an iframe. This sheet is the source of truth for the pipeline. **Layer 2 (secondary):** A database-backed quick-add tracker above the sheet. This layer uses tRPC procedures `pipe.list`, `pipe.upsert`, and `pipe.delete`, which read/write to the `pipeline` table in MySQL. The database currently holds exactly two records: 25 Horseshoe Road (IN CONTRACT) and 2 Old Hollow (IN CONTRACT). The quick-add UI is explicitly labeled "Local Draft — not synced to Pipeline Sheet." The two layers are independent — the DB records do not write to the Google Sheet and vice versa.

**Important:** Montauk is not in the HAMLET_OPTIONS dropdown in PipeTab.tsx. The current options are the original 9 hamlets. This is a known gap.

### FUTURE
The FUTURE tab is fully hardcoded. It displays the 2026 scorecard, the 2026–2031 GCI outlook table and bar chart, the agent roster (6 seats), and the 300-day arc phases. All values are hardcoded arrays in `FutureTab.tsx`. The 2026 GCI shown is `$3.95M` (manually updated in the array to reflect the full operating number). The tab includes a link out to the Growth Model v2 Google Sheet but does not embed it or pull live data from it. **The FUTURE tab is a manual mirror of the Growth Model — it is not wired to any live data source.**

### INTEL
The INTEL tab has three layers.

**Layer 1 — Master Calendar:** A dual-embed of the Podcast Calendar (`1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8`) and Event Calendar (`1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s`) as side-by-side iframes. These are the source sheets — the INTEL calendar is a view, not a source.

**Layer 2 — Live Working Sheets:** A 2×2 grid of four Google Sheet embeds:
- Agent Recruiting (`1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA`) — Future Agents sheet
- Social / Podcast Pipeline (`1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I`) — Social Pipeline sheet
- Hamptons Outreach Intelligence (`1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI`) — UHNW targeting sheet (formerly labeled "Contact Database" in code — renamed this session)
- Auction Events (`1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s`) — Event Calendar sheet (same sheet as Layer 1 right panel)

**Layer 3 — Canon Documents:** A static document library organized into 7 sections: Org Chart & Hierarchy, Market Report, Canon Documents (from `usePdfAssets` hook), Constitution & SOPs, Council Briefs, Attorney Database, and Adam Kalb IBC Materials. Documents with live URLs show an "Open Document" or "Open PDF" button. Documents with null URLs show "Staging" in the dev environment and are hidden in production. Currently, all Canon PDF assets in `usePdfAssets.ts` have null URLs — they are staging placeholders.

**Sprint 5 Horizon Banner:** A hardcoded banner at the bottom of INTEL listing three upcoming items: Daily Listing Sync, Canon Library, and Christie AI Tab. This is a display-only element.

---

## SECTION IV — The Eight Google Sheets (Locked IDs)

| Sheet Name | Sheet ID | Classification | Feeds | Status |
|-----------|----------|---------------|-------|--------|
| Growth Model v2 | `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag` | SOURCE | FUTURE tab (manual), INTEL doc library | Active — CONTACTS_STAGING tab added Sprint 5 |
| Office Pipeline | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` | SOURCE | PIPE tab (Layer 1 embed) | Active — 3 tabs (Sheet1, Deal Log, Pipeline Quadrant BACKUP Feb27) |
| Market Matrix | `176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g` | SOURCE | MARKET tab, PDF, council briefings | Active — single tab, ten hamlets, Montauk scored |
| Future Agents | `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA` | WORKING | INTEL Layer 2 (Agent Recruiting embed) | Active — QUADRANT column added Sprint 5 |
| Social Pipeline | `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I` | WORKING | INTEL Layer 2 (Social/Podcast embed) | Active — four tabs |
| Event Calendar | `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s` | SOURCE | INTEL Layer 1 (right panel) + INTEL Layer 2 (Auction Events) | Active — Bridge Car Show Aug 2026, Wednesday Circuit added Sprint 5 |
| Podcast Calendar | `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8` | SOURCE | INTEL Layer 1 (left panel) | Active — Balsam Farm + Green Thumb Nursery added Sprint 5 |
| Hamptons Outreach | `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI` | WORKING | INTEL Layer 2 (Hamptons Outreach Intelligence embed) | Active — 9 tabs, UHNW targeting, NOT the relationship Contact Database |

---

## SECTION V — The Database (MySQL)

Two tables are live in production.

**`users`** — Manus OAuth users. Fields: `openId`, `name`, `email`, `loginMethod`, `role` (admin/user), timestamps. The owner (`OWNER_OPEN_ID` env var) is auto-promoted to admin on first login.

**`pipeline`** — PIPE tab quick-add records. Fields: `address`, `hamlet`, `type`, `status`, `askPrice`, `dom`, `notes`, `sortOrder`, timestamps. Currently holds 2 records: 25 Horseshoe Road (IN CONTRACT) and 2 Old Hollow (IN CONTRACT). Six seed records were deleted in Sprint 5.

No other tables exist. The Growth Model, Market Matrix, calendars, and all other operational data live in Google Sheets, not the database.

---

## SECTION VI — The Server Routes (Non-tRPC)

Four custom Express routes run alongside tRPC:

| Route | File | Purpose |
|-------|------|---------|
| `GET /api/listings` | `listings-sync-route.ts` | Scrapes Christie's profile, classifies listings by hamlet, returns JSON. Also exposes `POST /api/listings/sync` for manual trigger. |
| `GET /api/market-data` | `market-route.ts` | Fetches S&P 500, gold, silver, VIX, 30Y Treasury, Bitcoin from Yahoo Finance / CoinGecko. Returns formatted strings + `updatedAt`. Mortgage rate is hardcoded at 6.38%. |
| `POST /api/whatsapp/*` | `whatsapp-route.ts` | Generates morning and evening William briefs, sends via Twilio WhatsApp API. Morning brief closes: "We look forward to seeing you at 26 Park Place — here to serve you the way James Christie did, since 1766." Evening brief: same closing. |
| `GET /api/pdf/report` | `pdf-exports.ts` | Puppeteer server-side render of the `/report` page → PDF blob download. |

The 6 AM cron job (`server/_core/index.ts`) calls `syncListings()` automatically in the America/New_York timezone.

---

## SECTION VII — What Is Hardcoded vs. Live

| Data | Location | Live or Hardcoded |
|------|----------|-------------------|
| Hamlet names, tiers, prices, ANEW scores | `hamlet-master.ts` | **Hardcoded** |
| Hamlet map coordinates | `hamlet-master.ts` | **Hardcoded** |
| TIER_COLORS | `hamlet-master.ts` | **Hardcoded** |
| Ed's active listings | `/api/listings` (scrape) | **Live** (6 AM cron) |
| Market ticker data (S&P, gold, etc.) | `/api/market-data` | **Live** (on-demand fetch) |
| Mortgage rate | `market-route.ts` | **Hardcoded** at 6.38% |
| Pipeline records | MySQL `pipeline` table | **Live** (tRPC) |
| Growth Model GCI figures | `FutureTab.tsx` arrays | **Hardcoded** (manual sync) |
| Calendar data | Google Sheets (embed) | **Live** (sheet edits reflect immediately) |
| Canon documents | `IntelTab.tsx` + `usePdfAssets.ts` | **Hardcoded URLs** (null = staging) |
| William brief content | `whatsapp-route.ts` | **Hardcoded** (no live data pull) |
| HOME founding letter | `HomeTab.tsx` | **Hardcoded** |
| YouTube intelligence matrix | `HomeTab.tsx` | **Hardcoded** |

---

## SECTION VIII — What Is Slop in the INTEL Tab

This is the honest answer to Ed's observation. The INTEL tab has accumulated structural complexity that needs to be resolved before Sprint 6 wireframe work begins.

**Issue 1 — Event Calendar appears twice.** The Event Calendar sheet (`1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s`) is embedded in both Layer 1 (right panel of the dual calendar) and Layer 2 (as the "Auction Events" SheetPanel). The user sees the same sheet in two places on the same page.

**Issue 2 — Layer 2 is four sheets in a 2×2 grid.** The grid contains: Agent Recruiting, Social/Podcast Pipeline, Hamptons Outreach Intelligence, and Auction Events. These four sheets have different audiences and purposes. Embedding them all in a single 2×2 grid creates visual noise. The grid was designed for operational convenience but may not be the right structure for a public-facing or client-facing surface.

**Issue 3 — Layer 3 has 7 document sections, most with null URLs.** In production, sections with all-null documents are hidden entirely. In staging, they show "Staging" badges. The Canon PDF section (`usePdfAssets`) has 9 entries, all with null URLs. This means Layer 3 in production currently shows only: Org Chart (1 live doc), Market Report (1 live doc), Constitution & SOPs (3 live docs), and Council Briefs (1 live doc). Attorney Database and IBC Materials are invisible in production.

**Issue 4 — Sprint 5 Horizon Banner.** The banner at the bottom of INTEL lists three items as "coming soon." These are now Sprint 6 items, not Sprint 5. The banner label should be updated to "Sprint 6 Horizon" at minimum, or removed if the council decides the horizon banner is not part of the final design.

**Issue 5 — CONTACTS_STAGING is inside Growth Model v2.** It is not a standalone sheet and is not wired to any dashboard surface. It is staging-only until Sprint 6 promotion.

---

## SECTION IX — Known Gaps (Not Slop — Planned)

These are intentional gaps, not errors. They are documented here so the council has a complete picture.

- **Montauk in PIPE dropdown:** PipeTab.tsx HAMLET_OPTIONS has 9 entries — Montauk is missing. Ten-hamlet parity requires adding it.
- **Listings classifier — Montauk:** The scraper in `listings-sync-route.ts` folds Montauk into East Hampton Town. A dedicated Montauk keyword bucket is needed for accurate MAPS display.
- **Growth Model live wire:** FUTURE tab is a manual mirror. Sprint 6 spec calls for REFERRAL_PIPELINES tab to back up the $825K ASSUMPTIONS cell. The FUTURE tab itself will remain hardcoded until a decision is made to embed the Growth Model directly.
- **Canon PDFs:** All 9 Canon PDF assets in `usePdfAssets.ts` have null URLs. Ed supplies the files; Manny uploads to CDN and wires the URLs. This is a Sprint 6 action.
- **Christie AI Tab:** Listed in the Sprint 5 Horizon Banner. Not yet built. Requires Claude API integration inside the dashboard.
- **Contact Database promotion:** CONTACTS_STAGING remains in Growth Model v2 until Ed activates the two dropdowns (ROLE + CADENCE) and the first real record is entered. Promotion to standalone sheet is a Sprint 6 action.

---

## SECTION X — The Design System

All seven tabs share one design language. The tokens are:

| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#1B2A4A` | Headers, dark backgrounds, primary text on cream |
| Gold | `#C8AC78` | Accent labels, borders, tier badges, dividers |
| Cream | `#FAF8F4` | Page backgrounds, card backgrounds |
| Charcoal | `#384249` | Secondary text |
| Muted | `#7a8a8e` | Captions, subtitles |
| Serif | Cormorant Garamond | Headlines, property names |
| Condensed | Barlow Condensed | Labels, badges, ALL CAPS metadata |
| Body | Source Sans 3 | Data, descriptions, body copy |

---

## SECTION XI — What Claude Needs to Know Before Wireframing

1. **INTEL tab has structural slop** (Section VIII above). The wireframe should resolve the Event Calendar duplication and the Layer 2 grid density before adding anything new.
2. **FUTURE tab is hardcoded.** Any wireframe that assumes live Growth Model data will require a Sprint 6 wiring task.
3. **All Google Sheet embeds are iframes.** They are not data pulls — the sheet content is rendered inside the dashboard but not parsed or stored. Styling the embedded sheets requires changes inside Google Sheets itself, not in the React code.
4. **The database has two tables.** Any new feature that requires persistence needs a schema migration (`pnpm db:push`) before it can be built.
5. **Tier labels are in `hamlet-master.ts`.** Removing or changing tier labels affects MARKET tab tiles, MAPS tab dot colors, and IDEAS tab calculator output simultaneously.
6. **The favicon swap is pending.** Two options were submitted: `IMG_4387.jpeg` (crimson C on white) and `IMG_4386.JPG` (cream C on crimson). Ed's instruction is "whichever looks best." Manny's recommendation: `IMG_4386.JPG` (cream C on crimson) — it reads clearly at 16×16 favicon size. The white-background version disappears on light browser chrome.

---

*End of Council Architecture Brief — April 1, 2026.*  
*No changes made in this document. Audit only. Awaiting council direction.*
