# Christie's East Hampton — Full Platform Audit
**Date:** April 4, 2026  
**Checkpoint:** `f0531838`  
**Domain:** christiesrealestategroupeh.com  
**Build health:** 35/35 tests passing · 0 TypeScript errors · esbuild clean

---

## Overview

This audit covers every tab, every backend sync, every API connection, every asset, and every data layer of the Christie's East Hampton intelligence dashboard. Items are classified as **Live** (working in production), **Wired but Pending Credential** (code complete, env var not yet set), or **Flagged** (inconsistency or gap requiring a decision).

---

## I. Navigation Structure

Six tabs are visible in the public nav bar. One tab (`IDEAS`) exists in the routing type system but has been intentionally removed from navigation. The `IDEAS` route still resolves if navigated to directly.

| Tab | Label | Status |
|-----|-------|--------|
| HOME | HOME | Live |
| MARKET | MARKET | Live |
| MAPS | MAPS | Live |
| PIPE | PIPE | Live |
| FUTURE | FUTURE | Live |
| INTEL | INTEL | Live |
| IDEAS | *(hidden)* | Route exists, not in nav |

**Flag:** `IDEAS` still exists as a routable page. If the CIS Calculator has been permanently migrated to MAPS, the `IdeasTab` component and its route in `App.tsx` should be removed to avoid confusion if a user ever lands on it directly.

---

## II. Global Header — Five-Layer Instrument Panel

The header renders on every tab and carries the following live feeds.

| Layer | Content | Data Source | Status |
|-------|---------|-------------|--------|
| Layer 1 | Tab nav · CIREG logo · Ed headshot | CDN assets (d3w216np43fnr4 / manuscdn.com) | Live |
| Layer 2 | Institutional marquee ticker | Static string in `DashboardLayout.tsx` | Live |
| Layer 3 | S&P 500 · Bitcoin · 30Y Fixed Mtg · Gold | `/api/market-data` proxy → Yahoo Finance + CoinGecko + FRED | Live |
| Layer 4 | Silver · VIX · 30Y Treasury · Hamptons Median | Same proxy | Live |
| Layer 5 | 7 social icons · 26 Park Place · East Hampton weather | Open-Meteo (client-side, no key required) | Live |

**Hamptons Median** is static at `$2.34M` — hardcoded in `DashboardLayout.tsx`. This is updated manually per market report cycle. No flag, but note for Ed: this number should be reviewed each quarter.

**"Data current as of" label** calls `trpc.market.dataTimestamp`, which pings the Office Pipeline Google Sheet via service account. If the service account loses access, this label silently disappears (no error shown to user). This is acceptable behavior.

---

## III. Tab-by-Tab Audit

### HOME Tab
**Data source:** Static. No live API calls.  
**Assets:** 9-image auction gallery from `cdn-assets.ts` (all `files.manuscdn.com` URLs). James Christie portrait, Ed headshot, CIREG logo — all from CDN.  
**Hamlet count in copy:** "eleven distinct hamlets" — correct (11 records in `hamlet-master.ts`).  
**Status:** Live. No flags.

---

### MARKET Tab
**Data source:** Static. All market data is drawn from `MASTER_HAMLET_DATA` in `hamlet-master.ts`. No live Sheets or API calls.  
**Hamlet images:** Now wired (added this session). Each `HamletTile` card shows a 160px hero photo using `hamlet.imageUrl || hamlet.photo`.  
**Image CDN:** All 11 hamlet `imageUrl` values point to `d2xsxph8kpxj0f.cloudfront.net`. This is the older CloudFront distribution. The `cdn-assets.ts` registry notes that this domain serves `application/octet-stream` MIME type in some cases, which can cause browser rendering failures.

**Flag — hamlet image CDN:** The 11 hamlet photos in `hamlet-master.ts` use `d2xsxph8kpxj0f.cloudfront.net`, not `files.manuscdn.com`. The `cdn-assets.ts` file explicitly warns that the older CloudFront domain had MIME type issues. These images should be verified in a live browser. If any fail to render, they need to be re-uploaded to `files.manuscdn.com` and the `hamlet-master.ts` `imageUrl` values updated.

**Hamlet count in copy:** "All ten hamlets" — **inconsistency**. The data file has 11 hamlets (Wainscott is the 11th). See Section VI.

---

### MAPS Tab
**Data source:** `GET /api/listings` — fetches from the Christie's profile scraper cache.  
**Map:** Google Maps via Manus proxy (no API key required from user). All Google Maps JS API features available.  
**CIS Calculator:** Migrated here from IDEAS tab.  
**Status:** Live. Listing data depends on the scraper cache being populated.

---

### PIPE Tab
**Data source:** `trpc.pipe.sheetDeals` → `readPipelineDeals()` → Google Sheets API → Office Pipeline Sheet.  
**Sheet ID:** `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` — matches between client and server. Confirmed locked.  
**Auth:** Google service account via `GOOGLE_SERVICE_ACCOUNT_JSON` env var.  
**Polling:** 60-second interval, 30-second stale time.  
**Write path:** `trpc.pipe.updateSheetStatus` and `trpc.pipe.updateSheetCloseDate` write back to the Sheet directly.  
**Append path:** `trpc.pipe.appendSheet` (used by FamilyOfficeList "Add to Pipeline" button).  
**Import path:** `trpc.pipe.importFromProfile` scrapes Christie's profile and appends new listings.  
**DB fallback:** A `pipeline` MySQL table exists in the schema but is only used by the deprecated `trpc.pipe.list/upsert/delete` procedures. The Google Sheet is the single source of truth.  
**Status:** Live, pending `GOOGLE_SERVICE_ACCOUNT_JSON` being set and the sheet shared with `christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com`.

---

### FUTURE Tab
**Data source:** Static. Growth Model v2 data is hardcoded in the component. One external link to a Google Sheet (`1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag`) for manual reference — no live embed or API call.  
**Status:** Live. No flags.

---

### INTEL Tab

**Layer 1 — Master Calendar**  
Google Calendar embed (hardcoded iframe URL with calendar ID `b591e65f...`). Source sheet links point to Podcast Pipeline (`1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8`) and Event Calendar (`1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s`). No API call — pure iframe embed.  
**Status:** Live.

**Layer 2 — Live Sheets (3-panel grid)**  
Three Google Sheets embedded as iframes:
- Agent Recruiting: `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA`
- Social/Podcast Pipeline: `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I`
- Hamptons Outreach Intelligence: `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI`

**Status:** Live (iframes load if sheets are shared publicly or with the viewer).

**Layer 3 — Canon Documents**  
Document library with six categories. Live URLs:
- CIREG Org Chart v2: `d2xsxph8kpxj0f.cloudfront.net` → HTML
- Live Market Report v2: `files.manuscdn.com` → HTML
- Website Wireframe v2: `files.manuscdn.com` → HTML
- Estate Advisory Card PDF: `d2xsxph8kpxj0f.cloudfront.net` → PDF
- 300-Day Ascension Plan: `files.manuscdn.com` → HTML
- Council Brief March 2026: `files.manuscdn.com` → HTML

Pending (null URLs, show "Staging" badge on staging, hidden on production):
- Hamlet PDF · East Hampton Village
- Attorney Database
- IBC Overview
- IBC Brief

**Canon PDF Assets** (via `usePdfAssets` hook): 9 assets defined, all have `url: null`. None are visible on production. All show "Staging" badge on staging.

**Layer 4 — Relationship Intelligence**  
Reserved slot. Shows "In Development — Awaiting approved spec and Ed GO." One competitor profile (Frank Newbold) exists in the code but is rendered below the reserved slot.

**Intelligence Web Tabs** (Jarvis / Whale / Auction)  
**Flag — Sheet ID mismatch:** `IntelligenceWebTabs.tsx` reads data from `trpc.intel.webEntities`, which calls `readIntelWebRows()` using `INTEL_WEB_SHEET_ID = "1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0"` in `sheets-helper.ts`. However, the "Open Sheet" button in the component links to `https://docs.google.com/spreadsheets/d/1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA/edit` — which is the **Agent Recruiting** sheet, not the Intelligence Web sheet. The button takes the user to the wrong sheet.

**Family Office List:** 12 principals, static data. "Add to Pipeline" button writes to the Office Pipeline Sheet via `trpc.pipe.appendSheet`. Requires auth.

**Local Charity Tracker:** Static. 6 initiatives. No live data.

**Attorney Database:** 4 seeded profiles (Debbas, Lester, Tarbet, McGrath). Static.

**Newsletter Manager:** Wired to `trpc.newsletter.subscribe/sendTestEmail/getStats`. Requires `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `GMAIL_SMTP_USER`, `GMAIL_APP_PASSWORD` env vars. None are currently set (not in `env.ts`). All newsletter actions will return "not configured" errors until these are added.

---

## IV. Backend Routes (Express)

| Endpoint | File | Auth | Status |
|----------|------|------|--------|
| `GET /api/market-data` | `market-route.ts` | None | Live |
| `GET /api/listings` | `listings-sync-route.ts` | None | Live |
| `POST /api/listings/sync` | `listings-sync-route.ts` | None | Live |
| `POST /api/tts/report` | `tts-route.ts` | None | Live |
| `GET /api/pdf/report` | `pdf-route.ts` | Manus session required | Live |
| `POST /api/whatsapp/morning-brief` | `whatsapp-route.ts` | Twilio creds guard | Live |
| `POST /api/whatsapp/evening-summary` | `whatsapp-route.ts` | Twilio creds guard | Live |
| `POST /api/whatsapp/test` | `whatsapp-route.ts` | Twilio creds guard | Live |
| `POST /api/whatsapp/inbound` | `whatsapp-inbound.ts` | Twilio signature | Live |
| `/api/trpc/*` | `routers.ts` | Per-procedure | Live |

---

## V. William / WhatsApp Intelligence Layer

**Cron schedule:** node-cron, `America/New_York` timezone.
- 8:00 AM → morning brief (voice note via ElevenLabs + Twilio)
- 8:00 PM → evening summary (voice note via ElevenLabs + Twilio)

**Both briefs** now use `fetchCronkiteBrief()` — the live Perplexity Cronkite prompt. The static `buildMorningBrief()` and `buildEveningSummary()` functions still exist in `whatsapp-route.ts` but are no longer called. They can be removed in a future cleanup sprint.

**Inbound commands:**
- `NEWS` → 14-category Cronkite brief via Perplexity, synthesised by ElevenLabs, delivered as voice note. 6-hour cache.
- `PIPE` → Last 5 pipeline deals from Google Sheet (text reply).
- `BRIEF` / `MORNING` → Morning brief immediately (voice note).
- `STATUS` → Platform status report (text reply).
- `HELP` / `?` → Command menu (text reply).

**Perplexity prompt:** 11 hamlet medians are hardcoded in the prompt (Wainscott and East Hampton North included, using "East Hampton North" naming). These are sourced from Saunders 2024 vs 2025 annual report cross-referenced William Raveis YE 2025. This is correct and current.

**Required env vars:** `ELEVENLABS_API_KEY` ✓ · `TWILIO_ACCOUNT_SID` ✓ · `TWILIO_AUTH_TOKEN` ✓ · `TWILIO_WHATSAPP_FROM` ✓ · `WILLIAM_WHATSAPP_TO` ✓ · `PERPLEXITY_API_KEY` ✓ (all injected by platform).

---

## VI. Hamlet Canon — Naming and Count Inconsistencies

This is the most significant data consistency issue in the platform. The hamlet count and naming are not uniform across all files.

| Location | Count | Naming Used |
|----------|-------|-------------|
| `hamlet-master.ts` (data file) | **11** | `east-hampton-north`, `wainscott` |
| `HomeTab.tsx` copy | 11 | "East Hampton North", "Wainscott" |
| `ReportPage.tsx` copy | 11 | "East Hampton North", "Wainscott" |
| `MarketTab.tsx` copy | **10** ("All ten hamlets") | — |
| `PublicPage.tsx` copy | **10** | "East Hampton Town" (old name) |
| `routers.ts` TTS narration | **10** | "East Hampton Town" (old name) |
| `tts-route.ts` narration | **10** | "East Hampton Town" (old name) |
| `whatsapp-route.ts` morning brief | **10** | — |
| `listings-sync-route.ts` default | — | `east-hampton-town` (old ID) |
| `hamlet-master.ts` header comment | **10** ("all ten South Fork hamlets") | — |
| Perplexity prompt (whatsapp-inbound) | **11** | "East Hampton North", "Wainscott" |

**The canonical count is 11.** The data file has 11 records. The Perplexity prompt uses 11. HOME and REPORT pages say 11. However, MARKET tab copy, TTS narration, WhatsApp morning brief, and several server files still say "ten" and use the old name "East Hampton Town" instead of "East Hampton North."

**Action required:** A single text-sweep to update all "ten hamlet" references to "eleven" and all "East Hampton Town" references to "East Hampton North" across: `MarketTab.tsx`, `PublicPage.tsx`, `routers.ts` (TTS narration text), `tts-route.ts`, `whatsapp-route.ts`, `listings-sync-route.ts`, and the header comment in `hamlet-master.ts`.

---

## VII. Asset CDN Audit

| Asset Category | CDN Domain | Count | Status |
|----------------|-----------|-------|--------|
| CIREG logos (official brand) | `d3w216np43fnr4.cloudfront.net` | 2 (white + black) | Live |
| Ed headshot, James Christie portrait, auction gallery | `files.manuscdn.com` | 34 | Live |
| Hamlet location photos | `d2xsxph8kpxj0f.cloudfront.net` | 11 | **Verify** |
| INTEL doc: Org Chart HTML | `d2xsxph8kpxj0f.cloudfront.net` | 1 | Live |
| INTEL doc: Estate Advisory Card PDF | `d2xsxph8kpxj0f.cloudfront.net` | 1 | Live |
| INTEL docs: Wireframes, Council Brief, 300-Day | `files.manuscdn.com` | 4 | Live |
| Video: Christie's Valuations | `d2xsxph8kpxj0f.cloudfront.net` | 1 (`.mov`) | Verify |

**Flag:** The `cdn-assets.ts` registry explicitly warns that `d2xsxph8kpxj0f.cloudfront.net` previously served `application/octet-stream` MIME type, causing browser rendering failures. This was the reason all gallery images were migrated to `files.manuscdn.com`. The hamlet photos, org chart HTML, estate advisory card PDF, and Christie's valuations video still use the old domain. The HTML and PDF documents may be fine (browsers handle those regardless of MIME type), but the hamlet images and `.mov` video should be tested in a live browser on the deployed domain.

---

## VIII. Database Schema

Two tables in MySQL/TiDB:

**`users`** — Manus OAuth sessions. Fields: `id`, `openId`, `name`, `email`, `loginMethod`, `role` (enum: `user`/`admin`), `createdAt`, `updatedAt`, `lastSignedIn`.

**`pipeline`** — Legacy DB pipeline tracker. Fields: `id`, `address`, `hamlet`, `type`, `status`, `askPrice`, `dom`, `notes`, `sortOrder`, `createdAt`, `updatedAt`. This table is written to by `trpc.pipe.upsert` (protected procedure) but is **not** the primary data source for the PIPE tab. The Google Sheet is the source of truth. The DB table is a secondary record and is not displayed anywhere in the current UI.

---

## IX. Google Sheets Inventory

| Sheet | ID | Used By | Access Method |
|-------|----|---------|---------------|
| Office Pipeline | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` | PIPE tab (read/write), `market.dataTimestamp`, WhatsApp PIPE command | Service account (`GOOGLE_SERVICE_ACCOUNT_JSON`) |
| Intelligence Web | `1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0` | INTEL Intelligence Web Tabs | Service account |
| Agent Recruiting | `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA` | INTEL Layer 2 embed (iframe) | Public/shared view |
| Social/Podcast Pipeline | `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I` | INTEL Layer 2 embed (iframe) | Public/shared view |
| Hamptons Outreach Intelligence | `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI` | INTEL Layer 2 embed (iframe) | Public/shared view |
| Podcast Pipeline | `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8` | INTEL Calendar source link | Public/shared view |
| Event Calendar | `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s` | INTEL Calendar source link | Public/shared view |
| Growth Model v2 | `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag` | FUTURE tab (link only, no embed) | Public/shared view |

---

## X. Environment Variables

| Variable | Purpose | Status |
|----------|---------|--------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Sheets API auth (PIPE + Intel Web) | Platform-injected |
| `ELEVENLABS_API_KEY` | William voice synthesis | Platform-injected |
| `TWILIO_ACCOUNT_SID` | WhatsApp delivery | Platform-injected |
| `TWILIO_AUTH_TOKEN` | WhatsApp delivery | Platform-injected |
| `TWILIO_WHATSAPP_FROM` | WhatsApp from number | Platform-injected |
| `WILLIAM_WHATSAPP_TO` | William's delivery number | Platform-injected |
| `PERPLEXITY_API_KEY` | Cronkite brief generation | Platform-injected |
| `JWT_SECRET` | Session cookies | Platform-injected |
| `DATABASE_URL` | MySQL/TiDB | Platform-injected |
| `BEEHIIV_API_KEY` | Newsletter subscribe | **Not set** |
| `BEEHIIV_PUBLICATION_ID` | Newsletter publication | **Not set** |
| `GMAIL_SMTP_USER` | Newsletter send-as | **Not set** |
| `GMAIL_APP_PASSWORD` | Gmail SMTP auth | **Not set** |

---

## XI. Consolidated Flags — Priority Order

The following items require a decision or action. They are ordered by operational impact.

**P1 — Hamlet count/naming sweep (text only, no logic change)**  
Update "ten" → "eleven" and "East Hampton Town" → "East Hampton North" across 7 files. This is a copy-only change with no data or logic impact. Affects: `MarketTab.tsx`, `PublicPage.tsx`, `routers.ts`, `tts-route.ts`, `whatsapp-route.ts`, `listings-sync-route.ts`, and the header comment in `hamlet-master.ts`.

**P2 — Intelligence Web "Open Sheet" link points to wrong sheet**  
`IntelligenceWebTabs.tsx` line 166: the "Open Sheet" button links to the Agent Recruiting sheet (`1a7arxf3…`) instead of the Intelligence Web sheet (`1eELH…`). One-line fix.

**P3 — Hamlet images: verify d2xsxph8 CloudFront domain renders correctly**  
The 11 hamlet photos in `hamlet-master.ts` use the older CloudFront domain. Test in a live browser on the deployed domain. If any fail to render, re-upload to `files.manuscdn.com` and update the `imageUrl` values.

**P4 — Newsletter credentials not set**  
`BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `GMAIL_SMTP_USER`, `GMAIL_APP_PASSWORD` are not in the platform secrets. Newsletter subscribe, stats, and test-email will return errors until these are added. If newsletter is not yet active, this is acceptable.

**P5 — IDEAS tab route still exists**  
The `IdeasTab` component and its route in `App.tsx` are still present. If IDEAS is permanently retired, remove the component and route. Low risk — it is just dead code.

**P6 — Dead code: static brief builders in whatsapp-route.ts**  
`buildMorningBrief()` and `buildEveningSummary()` are no longer called (both briefs now use `fetchCronkiteBrief()`). They can be removed in a cleanup sprint. No operational impact.

---

## XII. What Is Working Well

The platform is architecturally sound. The Google Sheet is correctly established as the single source of truth for the pipeline. The Perplexity Cronkite prompt is the most current and accurate representation of the hamlet model (11 hamlets, correct naming, sourced medians). The financial data proxy correctly bypasses CORS for Yahoo Finance, CoinGecko, and FRED. The PDF auth gate is in place. The WhatsApp cron scheduler is running with correct Eastern timezone. The asset CDN migration to `files.manuscdn.com` is complete for all gallery and portrait assets. The five-layer header is fully wired. All 35 tests pass.

---

*Audit conducted April 4, 2026 · Checkpoint f0531838 · christiesrealestategroupeh.com*
