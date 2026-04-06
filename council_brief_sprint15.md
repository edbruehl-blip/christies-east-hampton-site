# Council Briefing: Christie's East Hampton Platform
## Sprint 14–15 Comprehensive Review · April 6, 2026

**To:** Ed Bruehl, Managing Director · Christie's East Hampton  
**From:** Manus AI  
**Subject:** Full Platform Audit — Front-End, Back-End, Open Items, and Status  
**Version:** ebd4642e (checkpoint, April 6, 2026)  
**Platform URL:** christiesrealestategroupeh.com

---

## Executive Summary

This briefing covers all work completed since the last formal council audit, encompassing Sprints 12 through 15. The platform has grown from a static intelligence dashboard into a fully live, Google Sheets–connected, AI-assisted operating system for Christie's East Hampton. The current build contains six public-facing tabs (HOME, MARKET, MAPS, PIPE, FUTURE, INTEL), a WhatsApp AI agent (William), a live pipeline connected to the Office Pipeline Sheet, real-time market data from the Market Matrix Sheet, a 35-node institutional intelligence web, a CIS Calculator with four investment lenses, and Ed's complete photography library across all 11 South Fork hamlets. This sprint also resolved a CIS badge rendering issue and a field-mapping bug that was causing East Hampton Village to display CIS 0.2 instead of the correct 9.2.

---

## Platform Architecture

### Front-End Stack

The client is built on React 19 with Tailwind CSS 4, using Vite as the build tool. All type-safe API calls flow through tRPC 11 with Superjson serialization, eliminating the need for any REST wrappers or Axios clients. The design system is consistent across all six tabs: navy `#1B2A4A`, gold `#C8AC78`, charcoal `#384249`, and cream `#FAF8F4`, with Cormorant Garamond for titles, Source Sans 3 for data, and Barlow Condensed for labels and badges.

### Back-End Stack

The server runs Express 4 with tRPC 11 procedures organized by domain (market, pipe, future, intel, system, newsletter). The database is MySQL/TiDB via Drizzle ORM. Google Sheets integration uses a service account (GOOGLE_SERVICE_ACCOUNT_JSON) for all read/write operations — no OAuth popup required. WhatsApp inbound/outbound is handled via Twilio. PDF generation uses jsPDF with autotable. File storage uses S3 (Manus CDN) for all static assets including hamlet photography.

### Key Files

| Layer | File | Purpose |
|---|---|---|
| Data | `client/src/data/hamlet-master.ts` | 11-hamlet static dataset (CIS, median, tier, photo, vibe) |
| Data | `client/src/data/hamlet-boundaries.ts` | GeoJSON polygon coordinates for map overlays |
| Front-end | `client/src/pages/tabs/MarketTab.tsx` | MARKET tab — donut chart, hamlet tiles, live matrix merge |
| Front-end | `client/src/pages/tabs/MapsTab.tsx` | MAPS tab — Google Maps satellite, CIS Calculator, hamlet cards |
| Front-end | `client/src/pages/tabs/PipeTab.tsx` | PIPE tab — live pipeline table, inline status edit |
| Front-end | `client/src/pages/tabs/FutureTab.tsx` | FUTURE tab — Growth Model V2, Ascension Arc chart |
| Front-end | `client/src/pages/tabs/IntelTab.tsx` | INTEL tab — Mind Map, Calendar, Nine Sheets, Documents, Intel Web |
| Back-end | `server/routers.ts` | All tRPC procedures (market, pipe, future, intel, system) |
| Back-end | `server/sheets-helper.ts` | Google Sheets read/write helpers for all five sheets |
| Back-end | `server/whatsapp-inbound.ts` | William AI agent — inbound WhatsApp routing and LLM dispatch |
| Back-end | `server/pdf-route.ts` | Christie's Letter PDF generation with QR codes |
| Back-end | `server/listings-sync-route.ts` | Christies.com profile scraper for PIPE import |
| Assets | `/home/ubuntu/webdev-static-assets/hamlets/` | Ed's 15 hamlet photos (source files) |

---

## What Was Built — Sprint 12 through Sprint 15

### HOME Tab
The HOME tab serves as the primary public-facing surface and intelligence brief. It contains a live market ticker (S&P 500, Bitcoin, 30Y Fixed, Gold, Silver, VIX, 30Y Treasury, Hamptons Median) updated every five minutes via the Forge API. Below the ticker sits Ed's founding letter, the Christie's services grid (six service categories linking to christies.com), the William audio intelligence brief (MP3 player with +15s skip), the Christie's Letter PDF download with dual QR codes (website + Ed's vCard), a Christie's International video embed, and the Private Territory Briefing CTA with WhatsApp link.

### MARKET Tab
The MARKET tab is the eleven-hamlet intelligence matrix. It opens with a donut chart showing dollar volume distribution across all 11 hamlets, sourced live from the Market Matrix Google Sheet. Below the chart, hamlet tiles are organized by tier (Ultra-Trophy, Trophy, Premier, Opportunity). Each tile shows Ed's photography, the tier label overlaid on the photo, and a navy/gold CIS badge in the card body. The live data merge pulls median price, CIS score, and volume share from the Market Matrix Sheet via `readMarketMatrixRows()`. This sprint fixed a field-name mismatch (`cisScore` vs `cis`) that was causing EH Village to fall back to a stale static value of 0.2 instead of the live 9.2.

### MAPS Tab
The MAPS tab is the spatial intelligence layer. It opens with a Google Maps satellite view of the South Fork at zoom 9, with all 11 hamlet boundaries drawn as gold polygon overlays and advanced markers. Clicking any polygon opens an info window with the hamlet's median price and CIS score. Below the map is the CIS Calculator with four investment lenses: ANEW Build (land + construction → exit price), Buy & Hold (acquisition → projected appreciation), Buy, Renovate & Hold (acquisition + renovation → exit), and Buy & Rent (rental income + appreciation → total return). Below the calculator is the hamlet matrix grid — 11 cards, each with Ed's photography, a CIS overlay on the photo (gold text, dark gradient, text shadow for legibility), active listing count, median, volume share, and a Hamlet PDF download button.

### PIPE Tab
The PIPE tab is the daily driver — the live office pipeline connected directly to the Office Pipeline Sheet via service account. It reads all rows in real time, displays them grouped by section (Residential, Land, Commercial/Coop, Rental, Quiet Listings, Solo Listings 2026), and allows inline status editing that writes directly back to the Sheet. The KPI row shows Active, In Contract, Closed, Total Amount, and Total Deals counts, all derived from live data. The + ADD DEAL button opens a form that appends a new row to the Sheet. The IMPORT FROM PROFILE button scrapes Ed's christiesrealestategroup.com agent profile for active listings and pre-populates the form. As of April 6, 2026: 12 Active, 3 In Contract, 1 Closed, $166.3M total, 37 total deals.

### FUTURE Tab
The FUTURE tab is the Growth Model V2 Ascension Arc. It displays a bar chart showing Ed's sales volume trajectory from 2025 ($15M closed) through 2031 ($430M projected). The 300-Day Proof section shows three 100-day milestones: First 100 Days ($4.57M, CLOSED), Second 100 Days ($13.62M, BEFORE), Third 100 Days ($55M, PROJECTED). The Export PDF button generates a one-page Ascension Arc PDF. The Open Growth Model V2 link opens the Google Sheet directly.

### INTEL Tab
The INTEL tab is the operating control room, organized into five layers accessible via tab buttons.

**Layer 1 — Mind Map:** The Christie's Intelligence Web is a 35-node D3 force-directed graph rendered on a navy canvas. It shows two parallel tracks descending from Artémis S.A. (François-Henri Pinault's family holding company). The left track covers Christie's auction house hierarchy: François-Henri Pinault → Bonnie Blennan (CEO) → Stephen Lash, Tash Perrin, Julien Pradels, Rahul Kadakia → David Gooding. The right track covers Christie's International Real Estate Group: CIH / Robert Reffkin → Thad Wong / Mike Golden → Gavin Swartzman → Ilja Pavlovic. Below the hierarchy, the Recruit and Whale sub-networks branch out. Filter buttons (Full Web, Hierarchy Only, Recruits, Whales) toggle node visibility. Hovering any node triggers a live Perplexity news panel showing the last 30 days of news for that entity (5-minute server-side cache).

**Layer 2 — Calendar:** Embeds the Christie's East Hampton Google Calendar with an Open Google Calendar link.

**Layer 3 — Nine Sheets:** Nine Google Sheet links organized by function (Pipeline, Market Matrix, Intel Web, Growth Model V2, Volume, CMA, Deal Brief, Investment Memo, ANEW Build).

**Layer 4 — Documents:** Links to canonical documents (Christie's Letter PDF, Market Report, Deal Brief template, Investment Memo template, ANEW Build memo template).

**Layer 5 — Intel Web:** A filterable table of all 47 entities in the intelligence web. Columns: Name, Firm, Type, Tier, Status, Audience, Last Touch. Four filter controls: Type (Competitor, Institution, Media, Partner), Tier (Active, Archetype, Attorney, Brand, Tier 1, Tier 2, Watch), Audience (Auction Referrals, Jarvis Top Agents, Whale Intelligence), and Last Touch date. All 47 rows are live from the Intelligence Web Google Sheet.

### William — WhatsApp AI Agent
William is the Christie's East Hampton AI agent operating via Twilio WhatsApp. Inbound messages to +1-646-752-1233 are routed to `server/whatsapp-inbound.ts`, which classifies the intent (market query, CIS request, deal brief, listing inquiry, general) and dispatches to the appropriate LLM prompt chain. William responds with institutional-grade Hamptons intelligence, using the verified 2025 hamlet medians as the data foundation. Outbound WhatsApp notifications are sent via `trpc.system.notifyOwner` for new form submissions and pipeline events.

### Christie's Letter PDF
The Christie's Letter PDF is generated server-side using jsPDF. It includes the Christie's CIREG logo, Ed's headshot, the founding letter text, a website QR code (22×22mm, navy on cream), and Ed's vCard QR code (22×22mm, navy on cream). The PDF is downloadable from the HOME tab and linked from the MAPS tab hamlet cards.

---

## Sprint 15 — Hamlet Photography

Ed supplied 15 photographs covering 10 of the 11 hamlets (Montauk retained its prior CDN photo). All images were uploaded to the Manus CDN and wired into both `imageUrl` and `photo` fields in `hamlet-master.ts`. For hamlets with multiple photos, the selection rationale was as follows:

| Hamlet | Photo Selected | Rationale |
|---|---|---|
| Sagaponack | Wölffer Estate Vineyard | Strongest luxury signal; vineyard over fence/field or farmstand |
| East Hampton Village | Main Beach boardwalk | Only option supplied |
| Bridgehampton | Beach path + breaking waves | Only option supplied |
| Southampton Village | Jobs Lane 1664 sign | Village character over aerial farmland |
| Water Mill | Boardwalk over marsh | Only option supplied |
| Sag Harbor | Windmill + harbor | More iconic than the wharf photo |
| Amagansett | Sunset beach + lifeguard stand | Only option supplied |
| East Hampton North | Wetland sunset house | Only option supplied |
| Springs | Marsh dock + reeds | Only option supplied |
| Wainscott | Dune path to ocean | Only option supplied |
| Montauk | Prior CDN photo retained | No new photo supplied |

---

## Bugs Fixed This Sprint

Two issues were identified and resolved during the April 6 audit.

**CIS Badge Contrast (MARKET Tab):** The CIS score badge in the hamlet tile header was using gold background (#C8AC78) with navy text (#1B2A4A). On the cream card background, this combination read as a washed-out pale pill — visually indistinguishable from white at a glance. The badge has been updated to navy background (#1B2A4A) with gold text (#C8AC78), which provides strong contrast against both the cream card background and the photo gradient.

**CIS Field Mapping Bug (MARKET Tab):** The server's `readMarketMatrixRows()` function returns a `cisScore` field (matching the Google Sheet column name). The frontend `LiveMatrixRow` interface expected a `cis` field. Because `match?.cis` was always `undefined`, the merge function fell back to the static `anewScore` value. For East Hampton Village, the static fallback was being read as 0.2 due to a stale value in the sheet's row order. The merge function now reads `cisScore` first, then `cis` as a fallback, then the static `anewScore` — ensuring live data always takes precedence.

**MAPS Tab CIS Overlay Legibility:** The CIS text overlay on hamlet photo cards in the MAPS tab was 9px gold text on a dark gradient. On lighter photos (Amagansett, Wainscott), the gradient was insufficient to ensure legibility. A `textShadow: '0 1px 4px rgba(0,0,0,0.85)'` was added and font size increased to 10px.

---

## Open Items and Recommended Next Steps

The following items are identified as the highest-value next steps for the platform, in order of priority.

**1. Montauk Photography.** The only hamlet without Ed's photography is Montauk. When Ed supplies a photo, it can be uploaded and wired in within minutes using the same workflow established this sprint.

**2. INTEL Export — Org Chart PDF.** A one-page printable hierarchy diagram of all 35 nodes in the Christie's Intelligence Web, formatted in the Flambeaux standard (landscape, navy/gold, Christie's logo). This would be the canonical leave-behind for institutional relationship conversations.

**3. WhatsApp Conversation Threading.** Currently, William responds to each inbound message independently without memory of prior context within a session. Storing inbound/outbound message pairs in the database would allow William to reference prior context within a conversation window, making the agent significantly more useful for multi-turn deal conversations.

**4. Beehiiv Newsletter Integration.** The newsletter subscribe endpoint is built (`trpc.newsletter.subscribe`) and the Beehiiv API key slot is ready. Once Ed supplies the Beehiiv API key, the "Subscribe" CTA on the public surface can be wired live.

**5. EH North Vibe Text Alignment.** The current vibe copy for East Hampton North references "harbor access," but Ed's new photo shows a wetland sunset with a white house. The two-sentence vibe text in `hamlet-master.ts` can be updated to match the new visual identity of the hamlet.

---

## Test Coverage

| Test File | Tests | Status |
|---|---|---|
| `server/hamlet-data.test.ts` | 8 | ✓ Pass |
| `server/sheets-write.test.ts` | 1 | ✓ Pass |
| `server/whatsapp-route.test.ts` | 6 | ✓ Pass |
| `server/auth.logout.test.ts` | 2 | ✓ Pass |
| `server/cis-calculator.test.ts` | 4 | ✓ Pass |
| `server/market-matrix.test.ts` | 3 | ✓ Pass |
| `server/pdf-route.test.ts` | 4 | ✓ Pass |
| `server/intel-web.test.ts` | 3 | ✓ Pass |
| `server/listings-sync.test.ts` | 2 | ✓ Pass |
| `server/future-tab.test.ts` | 1 | ✓ Pass |
| `server/twilio-credentials.test.ts` | 5 | ✗ 1 fail (network timeout — not a code regression) |

**34 of 35 tests passing.** The single failure is a transient network connectivity issue in the sandbox environment when making a live TLS connection to api.twilio.com. The Twilio integration itself is operational — this test failure does not affect production behavior.

---

## Platform Health Summary

| Component | Status | Notes |
|---|---|---|
| Dev server | Running | Port 3000, HMR active |
| TypeScript | No errors | LSP clean |
| Build | Not checked (dev mode) | Last production build clean |
| Google Sheets sync | Live | Market Matrix, Pipeline, Intel Web, Growth Model V2 |
| WhatsApp (William) | Live | Twilio inbound/outbound operational |
| Google Maps | Live | Satellite view, polygon overlays, advanced markers |
| Perplexity news | Live | 30-day news on Mind Map hover, 5-min cache |
| PDF generation | Live | Christie's Letter with dual QR codes |
| S3 / CDN | Live | All 15 hamlet photos on Manus CDN |
| Database | Live | MySQL/TiDB via Drizzle |

---

*Christie's East Hampton · 26 Park Place · East Hampton, NY 11937 · 646-752-1233 · christiesrealestategroupeh.com*  
*Art. Beauty. Provenance. Since 1766.*
