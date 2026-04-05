# Christie's East Hampton — Full Platform Audit
**Date:** April 4, 2026 · **Version:** f0531838 · **Prepared by:** Manus

---

## Executive Summary

The platform is structurally sound. The build compiles clean (9ms, 0 errors), 35 of 35 tests pass, and all primary data connections are live and correctly wired. This audit identifies **twelve items** requiring attention before the platform is considered fully production-clean. They are ranked by impact.

---

## Part I — What Is Built and Working

### Navigation & Layout

The dashboard is a single-page application with six visible tabs — HOME, MARKET, MAPS, PIPE, FUTURE, INTEL — rendered inside a five-layer header. The IDEAS tab exists in the codebase and in the route type definition but is intentionally removed from the visible navigation bar (the CIS Calculator was migrated to MAPS in Sprint 6). The `/report` route is a standalone page with no nav chrome, accessible via the MARKET tab's "Live Report" button.

### Tab-by-Tab Status

| Tab | Primary Data Source | Live? | Notes |
|---|---|---|---|
| HOME | Static copy + ElevenLabs TTS | Yes | TTS calls `/api/tts/founding-letter` |
| MARKET | `hamlet-master.ts` static data | Yes | No live sheet; data is hardcoded |
| MAPS | Google Maps proxy + `hamlet-master.ts` | Yes | ANEW/CIS calculator embedded |
| PIPE | Google Sheet `1VPjIYP…` via service account | Yes | Sheet is single source of truth |
| FUTURE | Static content only | Yes | No live data connections |
| INTEL | Google Sheet `1eELH_ZV…` (Intelligence Web) + static docs | Yes | Newsletter subscribe wired to tRPC |
| /report | `hamlet-master.ts` + static copy | Yes | PDF auth gate in place |

### Backend Services

| Service | Endpoint | Status |
|---|---|---|
| PIPE sheet read | `trpc.pipe.sheetDeals` | Live |
| PIPE sheet write | `trpc.pipe.updateSheetStatus`, `appendSheet` | Live |
| Intelligence Web read | `trpc.intel.webEntities` | Live |
| TTS narration | `GET /api/tts/founding-letter`, `/api/tts/market-report` | Live |
| PDF generation | `POST /api/pdf/report` | Live, auth-gated |
| WhatsApp inbound | `POST /api/whatsapp/inbound` | Live |
| WhatsApp cron | 7:00 AM + 6:00 PM ET daily | Live |
| Listings scraper | `GET /api/listings/sync`, daily 6 AM cron | Live |
| Market data proxy | `GET /api/market-data` | Live (FRED + Yahoo Finance) |
| Newsletter subscribe | `trpc.newsletter.subscribe` | Wired, credentials not set |

### Asset Infrastructure

All gallery images, agent portraits, document library PDFs, and the Christie's seal are hosted on `files.manuscdn.com` (the Manus CDN). The CIREG logo (white and black lockups) is on `d3w216np43fnr4.cloudfront.net` per brand guidelines. The 11 hamlet hero photos used in MARKET and MAPS tiles are on `d2xsxph8kpxj0f.cloudfront.net`. The Christie's valuations video in AuctionHouseServices is also on `d2xsxph8kpxj0f.cloudfront.net`.

### Credentials Confirmed in Platform Secrets

`ELEVENLABS_API_KEY` · `PERPLEXITY_API_KEY` · `TWILIO_ACCOUNT_SID` · `TWILIO_AUTH_TOKEN` · `TWILIO_WHATSAPP_FROM` · `WILLIAM_WHATSAPP_TO` · `GOOGLE_SERVICE_ACCOUNT_JSON` · `JWT_SECRET` · `DATABASE_URL`

---

## Part II — Issues Found (Ranked by Priority)

---

### Issue 1 — CRITICAL: Hamlet Count and Naming Inconsistency Across 7 Files

**What it is:** The platform has 11 hamlets in `hamlet-master.ts` (the canonical data file), including Wainscott and East Hampton North. However, seven files still say "ten hamlets" or list "East Hampton Town" instead of the two new hamlets.

**Where it appears:**

| File | Stale Text |
|---|---|
| `server/routers.ts` line 17 | "ten distinct hamlets" |
| `server/routers.ts` line 23 | "The ten hamlets… East Hampton Town. Montauk." (missing Wainscott, East Hampton North) |
| `server/routers.ts` line 60 | "Hamlet Atlas. Ten hamlets." in TTS narration |
| `client/src/pages/tabs/MarketTab.tsx` line 382 | "All ten hamlets · trailing 12 months" |
| `client/src/pages/PublicPage.tsx` line 44 | "ten distinct hamlets" |
| `client/src/pages/PublicPage.tsx` line 47 | "The ten hamlets… East Hampton Town. Montauk." |
| `client/src/pages/ReportPage.tsx` line 682 | "ten distinct hamlets" |
| `client/src/lib/pdf-exports.ts` line 438 | "ten hamlet datasets" |
| `client/src/lib/pdf-exports.ts` line 461 | "all ten hamlet cards" |
| `client/src/lib/pdf-exports.ts` line 511 | "ten distinct hamlets" |
| `server/newsletter.ts` line 260 | "ten distinct hamlets" |
| `server/whatsapp-route.ts` line 43 | "all ten hamlets" (in dead `buildMorningBrief` function) |

**What is correct:** `HomeTab.tsx` and `ReportPage.tsx` line 684 already say "eleven hamlets" with Wainscott and East Hampton North. The Perplexity Cronkite prompt in `whatsapp-inbound.ts` uses the correct 11-hamlet list with verified 2025 medians.

**Fix:** Text sweep — no logic or data changes required. Approximately 15 minutes of work.

---

### Issue 2 — HIGH: Intelligence Web "Open Sheet" Button Links to Wrong Sheet

**What it is:** The "Open Full Sheet" button in `IntelligenceWebTabs.tsx` links to the Agent Recruiting sheet (`1a7arxf3…`) instead of the Intelligence Web sheet (`1eELH_ZV…`).

**Impact:** Any user who clicks "Open Sheet" in the Jarvis, Whale, or Auction sub-tabs is taken to the wrong Google Sheet.

**Fix:** One-line change in `IntelligenceWebTabs.tsx`. The correct sheet ID is `1eELH_ZV…` as defined in `IntelTab.tsx` `SHEET_IDS.intelligenceWeb`.

---

### Issue 3 — HIGH: Two CDN Domains Serving Media — One Unverified in Production

**What it is:** The platform uses two different CloudFront domains for media:

- `d3w216np43fnr4.cloudfront.net` — CIREG official logo (white + black lockups). This is the Christie's International Real Estate Group CDN. Per brand guidelines, these URLs are canonical and should not be changed.
- `d2xsxph8kpxj0f.cloudfront.net` — Used for (a) all 11 hamlet hero photos in `hamlet-master.ts`, and (b) the Christie's valuations video in `AuctionHouseServices.tsx`.

The `d2xsxph8` domain previously caused MIME-type failures for the gallery images, which is why those were migrated to `files.manuscdn.com`. The hamlet photos and the video on this domain have **not been tested in the live production environment** since the replatform.

**Risk:** If `d2xsxph8` serves the hamlet images with incorrect MIME headers in production (as it did for the gallery), the MARKET tab tiles will show broken image boxes and the HOME/INTEL video will fail to play.

**Recommended action:** After publishing, open the live domain in a browser and verify (a) hamlet images load in MARKET tab, and (b) the Christie's valuations video plays in HOME tab. If either fails, re-upload to `files.manuscdn.com` and update the URLs in `hamlet-master.ts` and `AuctionHouseServices.tsx`.

---

### Issue 4 — MEDIUM: Listings Scraper Hamlet ID Mismatch

**What it is:** The `HAMLET_KEYWORDS` mapping in `listings-sync-route.ts` uses `east-hampton` as a catch-all bucket for "east hampton", "e hampton", and "hampton bays". However, the canonical hamlet IDs in `hamlet-master.ts` are `east-hampton-village` and `east-hampton-north` — there is no `east-hampton` ID in the master data file.

Additionally, the comment on line 44 of `listings-sync-route.ts` lists the master IDs as including `east-hampton` (the old ID), and does not include `wainscott` or `east-hampton-north`.

**Impact:** Any listing scraped from the Christie's profile page that matches "east hampton" will be tagged with hamlet ID `east-hampton`, which does not correspond to any hamlet in the master data. The listing will not display correctly in the PIPE tab hamlet filter.

**Fix:** Update `HAMLET_KEYWORDS` to use `east-hampton-village` and add a separate `east-hampton-north` entry. Update the comment to reflect the current 11-hamlet IDs.

---

### Issue 5 — MEDIUM: Two ElevenLabs Voice IDs in Use

**What it is:** The platform uses two different ElevenLabs voice IDs for "William":

- `tts-route.ts` uses voice ID `fjnwTZkKtQOJaYzGLa6n`
- `whatsapp-route.ts` uses voice ID `N2lVS1w4EtoT3dr4eOWO` (labeled "William, eleven_multilingual_v2")

These are different voices. The TTS narration on HOME and /report uses one voice; the WhatsApp audio brief uses a different voice.

**Impact:** William sounds different on the website versus WhatsApp. This may be intentional (different register for different channels) but should be confirmed.

**Action needed:** Confirm which voice ID is the canonical "William" voice and unify if desired.

---

### Issue 6 — MEDIUM: Dead Code — `buildMorningBrief` and `buildEveningSummary`

**What it is:** `whatsapp-route.ts` contains two functions — `buildMorningBrief()` (lines 36–54) and `buildEveningSummary()` (lines 55–68) — that are defined but never called anywhere in the codebase. The actual brief delivery (`deliverBrief()`) calls `fetchCronkiteBrief()` from `whatsapp-inbound.ts`, which uses Perplexity. The static brief builders are orphaned.

**Impact:** No functional impact. Dead code adds confusion and maintenance risk.

**Fix:** Delete both functions. Estimated 30 lines of removal.

---

### Issue 7 — MEDIUM: `PublicPage.tsx` Is Not Routed

**What it is:** `PublicPage.tsx` is a complete, fully-built public-facing marketing page (approximately 450 lines) with the five-layer header, hamlet copy, AuctionHouseServices video, and a contact section. It is imported in `HomeTab.tsx` and `AuctionHouseServices.tsx` but is **not registered as a route in `App.tsx`**. It cannot be reached by any URL.

**Impact:** The page is invisible to the public. If it was intended as a public landing page (e.g., `/public` or the root for unauthenticated users), it needs to be routed. If it was superseded by the dashboard, it should be deleted.

**Action needed:** Confirm intent. Route it or delete it.

---

### Issue 8 — MEDIUM: `IdeasTab.tsx` Is Dead Code

**What it is:** `IdeasTab.tsx` is a large file (~600 lines) containing the old IDEAS tab UI. It is imported in `App.tsx` and is reachable if a user navigates to `?tab=ideas` or if the `TabId` type is used programmatically. It is not visible in the nav bar.

**Impact:** No user-facing impact. However, it is a large dead file that imports components and adds to bundle size.

**Fix:** Remove the import from `App.tsx`, remove the `ideas` case from `TabContent`, remove `ideas` from `TabId`, and delete `IdeasTab.tsx`. This is a cleanup sprint item.

---

### Issue 9 — MEDIUM: `Home.tsx` and `ComponentShowcase.tsx` Are Template Leftovers

**What it is:** Two files from the Manus web template remain in the project:
- `client/src/pages/Home.tsx` — the template default home page, not imported anywhere
- `client/src/pages/ComponentShowcase.tsx` — a template UI component demo, not imported anywhere

Neither file is referenced in `App.tsx` or any other component.

**Impact:** No functional impact. Dead files from the original scaffold.

**Fix:** Delete both files.

---

### Issue 10 — LOW: Newsletter Credentials Not Set

**What it is:** The newsletter system (`server/newsletter.ts`) requires four environment variables that are not currently set in the platform secrets: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `GMAIL_SMTP_USER`, and `GMAIL_APP_PASSWORD`.

The newsletter subscribe button in INTEL tab is wired to `trpc.newsletter.subscribe`, which will return a "not configured" error if called.

**Impact:** Newsletter subscribe and send will fail silently or return an error. No other functionality is affected.

**Action needed:** Set credentials when newsletter is ready to go live. Not blocking.

---

### Issue 11 — LOW: `AIChatBox.tsx` Is Unused Template Code

**What it is:** `client/src/components/AIChatBox.tsx` is a pre-built chat interface from the Manus template. It is not imported or used anywhere in the project.

**Impact:** Adds to bundle size. No functional impact.

**Fix:** Delete or keep as a future-sprint asset. Cleanup candidate.

---

### Issue 12 — LOW: App.tsx Route Comment Lists IDEAS Tab

**What it is:** The comment block at the top of `App.tsx` reads:

> Routes: `/` → Seven-tab dashboard (HOME · MARKET · MAPS · IDEAS · PIPE · FUTURE · INTEL)

IDEAS is listed but is not in the visible navigation. The comment is stale.

**Fix:** Update the comment to list the six visible tabs. One line.

---

## Part III — Data Integrity Summary

### Hamlet Master Data (`hamlet-master.ts`)

The canonical data file contains **11 hamlets** in correct tier order. All 11 have `imageUrl` values pointing to `d2xsxph8kpxj0f.cloudfront.net`. The IDs are:

`sagaponack` · `east-hampton-village` · `bridgehampton` · `southampton-village` · `water-mill` · `sag-harbor` · `amagansett` · `wainscott` · `east-hampton-north` · `springs` · `montauk`

### Google Sheet IDs (Confirmed)

| Sheet | ID | Used In |
|---|---|---|
| Office Pipeline | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` | `sheets-helper.ts`, `PipeTab.tsx` — **match confirmed** |
| Intelligence Web | `1eELH_ZV…` | `IntelTab.tsx` SHEET_IDS — correct for data reads |
| Agent Recruiting | `1a7arxf3…` | `IntelligenceWebTabs.tsx` Open Sheet button — **wrong, should be Intelligence Web** |

### Perplexity Cronkite Prompt (Confirmed Correct)

The 14-category prompt in `whatsapp-inbound.ts` is the most current and accurate representation of the platform. It uses the correct 11-hamlet list with verified 2025 medians sourced from Saunders 2024 vs. 2025 annual report cross-referenced William Raveis YE 2025. It closes with "Soli Deo Gloria." It is the authoritative voice of William.

---

## Part IV — Action Plan

### Do Now (Before Publishing)

These two items take under 30 minutes combined and should be fixed before the next publish.

1. **Fix Intelligence Web "Open Sheet" button** — one line in `IntelligenceWebTabs.tsx`
2. **Update App.tsx route comment** — one line

### Do This Sprint (Clean-Up Pass)

These items have no functional impact but affect professional presentation and code hygiene.

3. **Hamlet count/naming sweep** — update all 12 stale "ten hamlet" references to "eleven hamlets" with correct hamlet names
4. **Fix listings scraper hamlet ID mapping** — update `HAMLET_KEYWORDS` to use `east-hampton-village` and `east-hampton-north`
5. **Delete dead code** — `buildMorningBrief`, `buildEveningSummary`, `Home.tsx`, `ComponentShowcase.tsx`, `AIChatBox.tsx`
6. **Resolve `IdeasTab.tsx`** — confirm retire or route, then act

### Do After Publishing (Verify Live)

7. **Test `d2xsxph8` domain in production** — verify hamlet images and Christie's video load correctly on `christiesrealestategroupeh.com`

### Confirm Intent (Decisions Required)

8. **`PublicPage.tsx`** — route it or delete it
9. **ElevenLabs voice IDs** — confirm whether `fjnwTZkK` (TTS) and `N2lVS1w4` (WhatsApp) should be unified

### When Ready

10. **Newsletter credentials** — set `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `GMAIL_SMTP_USER`, `GMAIL_APP_PASSWORD` when newsletter goes live

---

## Part V — Build Health

| Check | Result |
|---|---|
| TypeScript compilation | 0 errors |
| esbuild bundle | 0 errors, 9ms |
| Vitest test suite | 35/35 passing |
| Dev server | Running since 01:37 ET, no errors |
| Last checkpoint | `f0531838` |

---

*Audit conducted April 4, 2026. Every file in the project was read. No assumptions were made from memory.*
