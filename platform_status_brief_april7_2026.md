# Christie's East Hampton — Platform Status Brief
**April 7, 2026 · Prepared by Manny**

---

## Executive Summary

The Christie's East Hampton operating system is a six-tab internal dashboard running on a React 19 / Express 4 / tRPC 11 stack, backed by four Google Sheets connected via a Google service account, two external API feeds (Yahoo Finance, CoinGecko), one Freddie Mac mortgage rate feed, one Perplexity AI news feed, one ElevenLabs voice synthesis feed, and one Twilio WhatsApp delivery channel. The platform is live, tested (35/35 passing), and checkpoint-saved as of April 7, 2026.

This brief maps every data connection in the system — what is live, what is static, what is wired but not yet active, and what is genuinely missing.

---

## Part I — The Nine Google Sheets

The platform is connected to nine Google Sheets. Four are read and written by the server via a Google service account. Two are embedded as live iframes. Three are navigation links only.

| # | Sheet Name | Sheet ID | Connection Mode | Used By |
|---|-----------|----------|-----------------|---------|
| 1 | **Office Pipeline** | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` | **Service account — read/write** | PIPE tab, WhatsApp PIPE/STATUS commands |
| 2 | **Market Matrix** | `176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g` | **Service account — read only** | MARKET tab donut ring, WhatsApp BRIEF command |
| 3 | **Intelligence Web Master** | `1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0` | **Service account — read only** | INTEL Layer 5 entity table, WhatsApp STATUS command |
| 4 | **Growth Model v2** | `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag` | **Service account — read only** | FUTURE tab arc bars, agent roster, OUTPUTS/ROSTER/VOLUME/ASSUMPTIONS tabs |
| 5 | **Podcast Calendar** | `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8` | **Iframe embed** | INTEL Layer 2 (left calendar panel) |
| 6 | **Event Calendar** | `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s` | **Iframe embed** | INTEL Layer 2 (right calendar panel) |
| 7 | **Future Agents Recruiting** | `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA` | **Link only** | INTEL Nine-Sheet Matrix navigation panel |
| 8 | **Social Pipeline** | `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I` | **Link only** | INTEL Nine-Sheet Matrix navigation panel |
| 9 | **Hamptons Outreach Intelligence** | `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI` | **Link only** | INTEL Nine-Sheet Matrix navigation panel |

**What "service account" means in practice:** The server holds a `GOOGLE_SERVICE_ACCOUNT_JSON` credential. Every time the dashboard loads a live tab, the server authenticates silently with Google and reads the sheet. No OAuth popup. No user login to Google. The sheet owner (Ed) controls access by sharing the sheet with the service account email. If a sheet is unshared, the tab returns an empty state — it does not crash.

**What "iframe embed" means:** The Podcast and Event calendars are rendered directly from Google Sheets using Google's public embed URL (`?widget=true`). The dashboard does not parse or store the data — it displays the sheet as-is. Any edit Ed makes to those sheets appears in the dashboard on the next page load or within the iframe's own refresh cycle (typically under 60 seconds).

**What "link only" means:** Sheets 7, 8, and 9 appear in the Nine-Sheet Matrix navigation panel on the INTEL tab as clickable cards. Clicking opens the sheet in a new browser tab. No data is read from them. They are navigation infrastructure only.

---

## Part II — The MARKET Tab and the Donut Ring

This is the most important data connection in the platform. The **Hamptons Market Signal donut ring** is the visual centerpiece of the MARKET tab.

### What the donut ring shows

The ring displays eleven segments — one per hamlet — sized proportionally by **dollar volume share**. The dominant segment is labeled in the center. The ring is colored by hamlet tier (Premier / Signature / Established / Emerging).

### Where the data comes from

The donut ring uses a **two-layer data model**:

**Layer 1 — Static baseline (hamlet-master.ts):** Every hamlet has a hardcoded `volumeShare` percentage, `medianPriceDisplay`, `anewScore` (CIS), `lastSale`, `lastSalePrice`, `lastSaleDate`, and `restaurants` data. This is the fallback layer. It is updated manually by Manny when Ed provides new figures.

**Layer 2 — Live overlay (Market Matrix Google Sheet):** On every page load (and every 5 minutes via `refetchInterval`), the server reads the Market Matrix sheet via the service account. The live values — `cisScore`, `median2025`, `dollarVolumeShare`, `dollarVolume2025`, `sales2025`, `direction4Year` — are merged on top of the static baseline using hamlet name matching. When a live row is found, the donut segment uses the **live `dollarVolumeShare`** from the sheet. When no live row is found (e.g., the sheet is empty or a hamlet name doesn't match), it falls back to the static value.

**The merge function** (`mergeHamletData`) normalizes hamlet names by stripping non-alpha characters before matching, so "East Hampton Village" in the sheet matches "east-hampton-village" in the code.

### What this means for Ed

**If Ed updates the Market Matrix sheet, the donut ring updates within 5 minutes** — no code change, no deployment, no Manny intervention. The sheet is the single source of truth for live market data. The static layer in `hamlet-master.ts` is the safety net.

### Current static values in hamlet-master.ts (as of April 7, 2026)

| Hamlet | Median (Static) | Volume Share (Static) | CIS Score |
|--------|----------------|----------------------|-----------|
| Sagaponack | $8.04M | 4% | 9.4 |
| East Hampton Village | $5.25M | 7% | 9.2 |
| Bridgehampton | $4.47M | 8% | 9.1 |
| Southampton Village | $4.385M | 9% | 8.9 |
| Water Mill | $4.55M | 6% | 8.8 |
| Sag Harbor | $2.80M | 7% | 8.5 |
| Amagansett | $4.35M | 6% | 8.7 |
| East Hampton North | $2.03M | 12% | 7.8 |
| Wainscott | $3.18M | 5% | 8.3 |
| Springs | $1.58M | 14% | 7.2 |
| Montauk | $2.24M | 10% | 7.9 |

**Source:** Saunders 2024 vs. 2025 annual report cross-referenced William Raveis YE 2025. These figures are locked doctrine. They do not change unless Ed provides new annual data.

---

## Part III — Financial Ticker (Header Strip)

The dashboard header carries two data strips. Both are live.

### Strip 1 — Primary (S&P 500, Bitcoin, 30Y Fixed Mortgage, Gold)
### Strip 2 — Secondary (Silver, VIX, 30Y Treasury, Hamptons Median)

| Ticker | Source | Update Frequency | Notes |
|--------|--------|-----------------|-------|
| **S&P 500** | Yahoo Finance API (`^GSPC`) | On page load | Server-side proxy at `/api/market-data` |
| **Bitcoin** | CoinGecko API | On page load | Free tier, no API key required |
| **Gold** | Yahoo Finance API (`GC=F` futures) | On page load | Gold futures, not spot |
| **Silver** | Yahoo Finance API (`SI=F` futures) | On page load | Silver futures |
| **VIX** | Yahoo Finance API (`^VIX`) | On page load | CBOE Volatility Index |
| **30Y Treasury** | Yahoo Finance API (`^TYX`) | On page load | 30-year Treasury yield |
| **30Y Fixed Mortgage** | FRED API (series `MORTGAGE30US`) | **24-hour cache** | Freddie Mac PMMS, updated weekly on Thursdays. Falls back to last known value if FRED is unavailable. |
| **Hamptons Median** | **Static — $2.34M** | Manual update | Updated by Manny per market report cycle. Not connected to any live feed. |

**Important note on the Hamptons Median:** This figure is hardcoded in `DashboardLayout.tsx` at line 401. It reads `$2.34M` and carries a `+7% YoY` attribution. It does not pull from the Market Matrix sheet. To update it, Manny edits the code. This is a known gap — see Part VII.

---

## Part IV — The Six Tabs: Data Status

### HOME Tab
The HOME tab is primarily static content. The founding letter, Christie's history, and the gallery are all hardcoded. The audio player (`/api/tts/founding-letter`) calls ElevenLabs on demand using voice ID `fjnwTZkKtQOJaYzGLa6n` (William). The PDF download button calls `generateChristiesLetter()` in `pdf-exports.ts` — this is a jsPDF function, fully client-side, no server call. The newsletter subscription form calls `trpc.newsletter.subscribe` which posts to the Beehiiv API — **this requires `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` environment variables that are not currently configured** (see Part VII).

### MARKET Tab
**Fully live.** Reads the Market Matrix sheet every 5 minutes via `trpc.market.hamletMatrix`. The donut ring, the eleven hamlet cards, the CIS scores, the median prices, and the direction arrows all update from the sheet. The hamlet card hero photos come from CDN URLs stored in `hamlet-master.ts` — these are static and do not change unless Manny updates them. The "last sale" data (address, price, date) is also static in `hamlet-master.ts`.

### MAPS Tab
**Mixed.** The Paumanok SVG aerial plate and hamlet boundary overlays are static GeoJSON files hosted on CDN. The Hamlet Intelligence Matrix cards read from `hamlet-master.ts` (static). The live listings panel calls `/api/listings` which syncs from the Christie's Real Estate Group API (`christiesrealestategroup.com/realestate/listingsv2/`) using Ed's MLS IDs (`NY_EELI:530479` and `NY_ONEKEYMLS:184926`). This sync runs automatically at 6AM Eastern every day and on server start. The listings are cached in memory — if the Christie's API is unavailable, the last cached set is returned.

### PIPE Tab
**Fully live — read/write.** Reads all deals from the Office Pipeline Sheet via `trpc.pipe.sheetDeals`. Status updates (inline dropdowns) write back to the sheet via `trpc.pipe.updateSheetStatus`. New deal entries append to the sheet via `trpc.pipe.appendSheet`. The KPI strip now shows seven category breakouts derived from the section headers in the sheet. Deduplication is applied server-side — four previously duplicate rows (191 Bull Path, 55 Meadow Lane, 11 Meadowlark, 795 N.Sea Mecox) are now filtered.

### FUTURE Tab
**Mixed.** The Ascension Arc bar chart uses a two-layer model: the 2026 bar segments are derived live from the Growth Model v2 VOLUME tab (`trpc.future.volumeData`). All other year targets (2025, 2027, 2028, 2029, 2031) come from the static `MILESTONE_TARGETS` constant in `FutureTab.tsx`. The agent roster table reads live from the Growth Model v2 ROSTER tab (`trpc.future.growthModel`). The Profit Pool section is fully static — hardcoded prose and table values. The 300-day countdown cards are static.

### INTEL Tab
**Five layers, mixed connectivity:**

| Layer | Name | Data Source | Live? |
|-------|------|-------------|-------|
| 1 | Institutional Mind Map | `InstitutionalMindMap.tsx` — 36 nodes hardcoded | Static nodes, live hover news via Perplexity (5-min server cache) |
| 2 | Calendar Intelligence | Podcast + Event sheets (iframe embed) | Live — updates when sheet is saved |
| 3 | Nine-Sheet Matrix | Static `SHEET_IDS` array with navigation links | Navigation only — not parsed |
| 4 | Document Library | Static `DOCUMENT_LIBRARY` array (8 CDN URLs) | Static — all 8 URLs confirmed live |
| 5 | Intelligence Web | Intelligence Web Master sheet via service account | Live — 47–48 entities, 4 filter tabs |

---

## Part V — WhatsApp Intelligence Channel

The WhatsApp channel delivers to Ed's phone via Twilio. Two automated briefs run daily. Five manual commands are available.

### Automated Schedules

| Time | Delivery | Content Source |
|------|----------|---------------|
| **8:00 AM Eastern** | Voice note (ElevenLabs William voice) | 14-category Cronkite brief via Perplexity AI |
| **8:00 PM Eastern** | Voice note (ElevenLabs William voice) | Pipeline summary from Office Pipeline Sheet |

### Manual Commands

| Command | Response Type | Data Source |
|---------|--------------|-------------|
| `NEWS` | Voice note | Perplexity AI — 14-category Cronkite brief on demand |
| `PIPE` | Text reply | Last 5 deals from Office Pipeline Sheet (live) |
| `STATUS` | Text reply | Live entity count from Intelligence Web Sheet + pipeline summary |
| `BRIEF [address]` | Text reply | Hamlet lookup from Market Matrix Sheet (live as of Sprint 16) |
| `HELP` | Text reply | Static command list |

### Voice Synthesis
All voice notes use ElevenLabs voice ID `fjnwTZkKtQOJaYzGLa6n` (William) with model `eleven_multilingual_v2`. Audio is uploaded to S3 and delivered as a Twilio media URL.

---

## Part VI — PDF Exports

Three PDF functions exist in `pdf-exports.ts`, all using jsPDF (client-side, no server call):

| Function | Triggered By | Pages | Key Content |
|----------|-------------|-------|-------------|
| `generateMarketReport()` | MARKET tab "Download Report" button | Page 1: Founding Letter (8 paragraphs + Ed signature + headshot) · Page 2: Hamlet Atlas (11 hamlets, overflow to continuation page) · Final Page: Closing paragraph + contact card (Ed headshot, URL, QR codes) | Hamlet data from `hamlet-master.ts` static layer |
| `generateChristiesLetter()` | HOME tab "Download Letter" button | Single page | Founding letter only |
| `generateEastHamptonVillageReport()` | MARKET tab EH Village card | Single page | EH Village static data (YoY +9.2%, DOM 61, $/sqft $1,420 est.) |

**Note:** The Market Report PDF uses static data from `hamlet-master.ts`. It does not pull live figures from the Market Matrix sheet at the moment of generation. This is a known gap — see Part VII.

---

## Part VII — Known Gaps and Disconnected Elements

These are elements that exist in the platform but are not yet wired to a live data source, or that have a known limitation.

| # | Element | Current State | What's Needed |
|---|---------|--------------|---------------|
| 1 | **Hamptons Median in header** | Hardcoded `$2.34M` in `DashboardLayout.tsx` | Wire to `market.hamletMatrix` — compute weighted median from live sheet data |
| 2 | **PDF Market Report — live data** | Uses static `hamlet-master.ts` at generation time | Pass live `matrixResponse` from the MARKET tab into `generateMarketReport()` at button click |
| 3 | **Beehiiv newsletter** | `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` not configured | Ed provides API key + publication ID; Manny adds to secrets |
| 4 | **Wainscott last sale attribution** | `115 Beach Ln, $59M` — source not confirmed | Ed confirms address and price; Manny updates `hamlet-master.ts` |
| 5 | **EH North last sale** | `TBD` hidden in display | Ed provides a confirmed last sale; Manny updates `hamlet-master.ts` |
| 6 | **Resources page QR code** | Linktree QR (third-party) | Replace with direct `christiesrealestategroupeh.com` QR — one function call |
| 7 | **`pipeline` database table** | Created in schema, never written to | Either remove from schema or wire PIPE tab to write to DB as backup |
| 8 | **Mind Map nodes — live count** | 36 nodes hardcoded in `InstitutionalMindMap.tsx` | If the Intelligence Web sheet is the source of truth, the mind map should read from it |
| 9 | **WhatsApp BRIEF — hamlet median** | Returns live hamlet name + CIS from Market Matrix | Could also return live median price from same sheet row |
| 10 | **Perplexity news cache** | 5-min server-side Map cache (added Sprint 16) | Cache survives server restarts only if persisted to DB — currently lost on restart |

---

## Part VIII — Other Manny Chats and Reports

You asked whether any other Manny sessions have produced reports or data that should be tied into this dashboard. Based on the full audit:

**Documents already in the platform (Document Library, INTEL Layer 4):**
1. CIREG Org Chart v2 (April 2026) — HTML
2. Christie's Estate Advisory Card — PDF
3. Hamptons Intelligence Brief (HTML)
4. Market Intelligence Brief (HTML)
5. Hamptons Competitive Landscape (HTML)
6. Modern Day Path UHNW Backend Strategy — PDF
7. Christie's Intelligence Web (locked HTML)
8. Infrastructure Audit April 6, 2026 — PDF (added Sprint 16)

**Reports produced in this chat session that are not yet in the Document Library:**
- This brief (Platform Status Brief, April 7, 2026) — will be added to Document Library as item 9 upon your confirmation.

**What is NOT connected from other sessions:** The Cronkite 14-category WhatsApp brief uses Perplexity AI to pull live news at the moment of delivery. It is not stored anywhere in the dashboard. If you want a historical log of morning briefs, that would require a new database table and a tRPC query to display them on the INTEL tab. This is a Sprint 17 candidate.

---

## Part IX — Infrastructure Summary

| Component | Technology | Status |
|-----------|-----------|--------|
| Frontend | React 19 + Tailwind 4 + shadcn/ui | Live |
| Backend | Express 4 + tRPC 11 + Superjson | Live |
| Database | MySQL / TiDB (via Drizzle ORM) | Live — `users` and `pipeline` tables exist; `pipeline` table unused |
| Google Sheets | googleapis v4 + service account | Live — 4 sheets read/write |
| Financial tickers | Yahoo Finance + CoinGecko + FRED | Live |
| Voice synthesis | ElevenLabs API (William voice) | Live |
| WhatsApp | Twilio + node-cron | Live — 8AM + 8PM scheduled |
| AI news | Perplexity AI (sonar model) | Live — 5-min server cache |
| Listings sync | Christie's Real Estate Group API | Live — 6AM daily cron |
| PDF generation | jsPDF (client-side) | Live |
| CDN | CloudFront + Manus CDN | Live — all 8 document URLs confirmed |
| Test suite | Vitest | 35/35 passing |
| Deployment | Manus hosted (checkpoint `07984f08`) | Live |

---

## Part X — One-Sentence Summary per Tab

**HOME:** Static founding letter + on-demand ElevenLabs audio — no live data connections except the financial ticker in the header.

**MARKET:** The most connected tab — live Market Matrix sheet drives the donut ring, hamlet cards, CIS scores, and medians every 5 minutes.

**MAPS:** Live Christie's listings sync (6AM daily) overlaid on static hamlet boundary data and static hamlet intelligence cards.

**PIPE:** Fully live read/write to the Office Pipeline Sheet — the only tab that writes back to Google.

**FUTURE:** Live Growth Model v2 VOLUME and ROSTER tabs drive the 2026 arc bar and agent table; all other year targets are static governance constants.

**INTEL:** Five layers — two live (Intelligence Web sheet, Perplexity hover news), two live-embed (Podcast + Event calendars), one navigation-only (Nine-Sheet Matrix), one static (Document Library).

---

*Prepared by Manny · April 7, 2026 · Christie's East Hampton Operating System*
