# Christie's East Hampton — Full Site Audit
**Prepared by Manny · April 3, 2026 · For Ed Bruehl & Full Council**

> This document is a complete inventory of every page, tab, component, data source, and backend service on the Christie's East Hampton dashboard as of checkpoint **ad5b5b12**. It is written so that Ed, the Full Council, and any future collaborator can open this document and know exactly what exists, what is live, what is pending, and what comes next — before the next round of edits begins.

---

## Architecture Overview

The platform lives at **www.christiesrealestategroupeh.com** and is a single-page React 19 application backed by an Express 4 server with tRPC 11 procedures, a MySQL/TiDB database, and Google Sheets as the operational data layer. The design system is consistent across every surface: **Navy #1B2A4A · Gold #C8AC78 · Charcoal #384249 · Cream #FAF8F4**, with Cormorant Garamond for headlines, Source Sans 3 for body, and Barlow Condensed for labels and badges.

There are two routes:

| Route | Description |
|---|---|
| `/` | The seven-tab dashboard — the primary daily-use instrument panel |
| `/report` | The standalone Live Market Report — a separate full-page destination, no nav chrome |

The dashboard is wrapped in a five-layer instrument panel header that is **persistent and sticky** across all seven tabs. Every tab renders inside this chrome.

---

## Global Header — Five-Layer Instrument Panel

This is the first thing every visitor sees. It never disappears.

**Layer 1 — Tab Row.** The CIREG white logo lockup (official three-part brand guideline version, white on navy) sits at the far left. Six navigation tabs follow: HOME · MARKET · MAPS · PIPE · FUTURE · INTEL. A PUBLIC/PRIVATE toggle sits at the right, and Ed's headshot (CDN-hosted) anchors the far right corner. On mobile, a hamburger icon opens a slide-in drawer with the same six tabs. The IDEAS tab was removed from public navigation in Sprint 6 — the CIS calculator migrated to MAPS.

**Layer 2 — Institutional Ticker.** A continuous 55-second marquee loop reads: *"Stewarding Hamptons legacies · Enjoy it · Improve it · Pass it on · Art · Beauty · Provenance · Since 1766 · Christie's East Hampton · Exceptional Service."* Gold text on navy.

**Layer 3 — Primary Data Strip.** Four live market indicators: **S&P 500 · Bitcoin · 30Y Fixed Mortgage · Gold.** All four are fetched via the server-side `/api/market-data` proxy, which bypasses Yahoo Finance CORS restrictions on the deployed domain. Values show price and daily change. A timestamp reads "Updated [time] UTC."

**Layer 4 — Secondary Data Strip.** Four additional indicators: **Silver · VIX · 30Y Treasury · Hamptons Median.** Hamptons Median is static at $2.34M, updated manually per market report cycle. All others are live from the same server proxy.

**Layer 5 — Social + Office/Weather Strip.** Seven social icons (Instagram, Threads, X/Twitter, TikTok, YouTube, Facebook, LinkedIn) — all linked to Ed's verified accounts. Office address: 26 Park Place, East Hampton, NY 11937. Phone: 646-752-1233. Email: ebruehl@christiesrealestate.com. Live East Hampton weather from Open-Meteo API (lat 40.9637, lng -72.1848), refreshed every 5 minutes.

---

## Tab 1 — HOME

**Purpose:** The door. First impression. Institutional identity. Entry point to the full market report.

### Section A — Full-Bleed Hero

The Christie's Grand Saleroom auction room photograph fills the entire viewport as a background image with a directional dark overlay (heavier on the left, lighter on the right). Two columns sit over this image.

The **left column** contains: (1) the James Christie portrait thumbnail, gold-bordered, which is clickable — tapping it navigates to `/report`. Below the portrait, a label reads "TAP FOR MARKET REPORT." Below that, an identity card shows the Christie's Est. 1766 badge, "Christie's East Hampton," the "MANAGING DIRECTOR" label, "Ed Bruehl," and "Christie's International Real Estate Group."

The **right column** contains the founding letter — nine paragraphs of institutional doctrine. This is the first text above the fold. Key lines: *"Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale."* ... *"The South Fork is not a market. It is a territory — ten distinct hamlets."* ... *"The Christie's Intelligence Score is not a sales tool. It is a discipline."*

Below the founding letter, a **dual audio player** (William / ElevenLabs TTS) allows the user to listen to either the Founding Letter or the Market Report as narrated audio. The player has play/pause, 15-second rewind, 15-second forward, a scrub bar with elapsed/total time, and a share-link copy button. Two channel buttons select which audio to play. The ElevenLabs voice ID is `fjnwTZkKtQOJaYzGLa6n` (the "Manny" key, rotated April 2, 2026 with Text to Speech permission confirmed live).

### Section B — Christie's Auction Intelligence (YouTube Matrix)

A 3×3 grid of nine YouTube videos. Each card shows the video thumbnail with a gold play button overlay and the video title. Clicking a card replaces the thumbnail with a live embedded YouTube player (autoplay). Videos include:

1. Bringing James Christie's Legacy to the Hamptons
2. Get to Know Me — Ed Bruehl, Hamptons Real Estate
3. Uncovering Value in Hamptons Real Estate — Traveling Podcast
4. Your Hamptons Real Estate Podcast Ep. 1 — Pierre Debbas Esq.
5. Your Hamptons Real Estate Podcast Ep. 2 — Marit Molin
6. Your Hamptons Real Estate Podcast Ep. 3 — Brad Beyer
7. Found Inventory in the Hamptons — Ed Bruehl
8. 3 Essentials for Every Successful Deal — Ed Bruehl
9. SOLD & CLOSED: 129 Seven Ponds Road, Water Mill — 33.3 Acres

### Section C — Footer

Navy background. Doctrine line: "Art. Beauty. Provenance. · 26 Park Place, East Hampton, NY 11937 · 646-752-1233." Three contact blocks: Office address, Direct phone, Email.

---

## Route `/report` — Live Market Report

**Purpose:** The room. The full institutional intelligence document. Six sections, scrollable, no nav chrome. A "← Back to Home" bar at the top returns to the dashboard.

This page is the governing principle of the platform: *"website = live report · report = website scrolled · PDF = snapshot."*

| Section | Title | Content |
|---|---|---|
| 1 | Institutional Opening | James Christie portrait hero, full founding letter, PDF download button (generates Christie's Hamptons Market Report PDF via `generateMarketReport()`), dual TTS audio player (same William/ElevenLabs engine as HOME), share-link copy buttons |
| 2 | Hamptons Local Intelligence | Bloomberg-style news feed — live Hamptons real estate news items with source, date, and headline links |
| 3 | Market Intelligence | CFS donut ring (volume share by hamlet), rate environment sidebar (30Y mortgage corridor 6.38%, Hamptons Median $2.34M), tier legend |
| 4 | Hamlet Atlas Matrix | Nine hamlet tiles, each expandable inline — shows median price, CIS score, tier badge, volume share bar, last notable sale |
| 5 | IDEAS / CIS Intelligence | Model deal card, CIS chip, QR code linking to the CIS calculator on MAPS |
| 6 | Resources & Authority | Christie's ecosystem links, Ed Bruehl contact block, doctrine footer |

The PDF export (`generateMarketReport()`) produces a multi-page Christie's-branded PDF with the CIREG logo, Ed's headshot, QR code, and two doctrine lines. No faith language on any export.

---

## Tab 2 — MARKET

**Purpose:** Hamptons-native market intelligence. Static data from the master hamlet dataset. No live queries — this tab loads instantly.

### Hamptons Market Signal

An SVG donut ring (`HamletDonut`) renders all ten hamlets as proportional arc segments based on their `volumeShare` percentage. The dominant corridor is labeled at center. To the right, the `RateEnvironment` sidebar shows: 30Y mortgage corridor (6.38%, with fallback from FRED API), Hamptons Median ($2.34M), and a tier legend (Tier 1 Institutional through Tier 4 Value).

### Hamlet Intelligence Matrix

All ten hamlets are grouped by tier and rendered as `HamletTile` cards. Each tile shows: hamlet name, median price, CIS score (out of 10), tier badge, CIS progress bar, volume share bar, and last notable sale. Tier headers show the tier name and hamlet count.

**Ten Hamlets · Tier Structure:**

| Tier | Hamlets |
|---|---|
| Tier 1 — Institutional | East Hampton Village, Sagaponack, Bridgehampton |
| Tier 2 — Premium | Water Mill, Southampton Village, Georgica Pond area |
| Tier 3 — Established | Sag Harbor, Amagansett, Wainscott |
| Tier 4 — Value | Springs, Montauk, Hampton Bays, East Hampton Town |

---

## Tab 3 — MAPS

**Purpose:** The Maps Intelligence Hub. Five layers. The canonical home of the CIS/ANEW calculator (migrated from IDEAS in Sprint 6). The most complex tab on the platform.

### Layer 1 — Paumanok Aerial Plate

A full-width Google Map (via the Manus proxy — no API key required from Ed) centered on East Hampton. `AdvancedMarkerElement` markers for every hamlet. Satellite view. The map is interactive — pan, zoom, click markers. All Google Maps JavaScript API features are available through the proxy.

### Layer 2 — CIS Calculator (Christie's Intelligence Score / ANEW)

Four calculation modes, selectable via tab buttons:

| Mode | Inputs | What It Calculates |
|---|---|---|
| **ANEW Build** | Hamlet, Address, Land Value, Construction Cost, Soft Costs, Carry, Exit Price | All-in cost, exit price, spread, spread %, CIS score, verdict |
| **Buy · Hold** | Hamlet, Address, Purchase Price, Closing Costs, Hold Years, Projected Exit Price | Total cost basis, projected exit, spread, annualized return, CIS score |
| **Buy · Renovate · Hold** | Hamlet, Address, Purchase Price, Renovation Cost, Closing Costs, Hold Years, Projected Exit Price | All-in cost, exit, spread, CIS score |
| **Buy · Rent** | Hamlet, Address, Purchase Price, Closing Costs, Annual Rent, Annual Expenses, Hold Years, Projected Exit Price | Annual yield, total return, CIS score |

The **Results Panel** shows: Ed headshot (CDN), CIREG logo, hamlet name + lens label, verdict badge (Institutional / Executable / Monitor / Pass), CIS score, four metric tiles (All-In Cost, Exit Price, Spread, Spread %), optional Strategic Classification tag (for Tier 1 corridor + positive spread = "Institutional Asset — Executable Entry Basis"), and a mentor line.

**Export buttons** from the Results Panel generate PDFs:

| Export | Description |
|---|---|
| ANEW Build Memo | Single-deal ANEW analysis memo |
| CMA | Comparative Market Analysis |
| Deal Brief | One-page deal brief |
| Investment Memo | Two-page investment memo |
| Market Report | Full Christie's Hamptons Market Report |
| EH Village Hamlet | East Hampton Village deep-dive hamlet report |

All PDFs include CIREG logo, Ed headshot, QR code, and two doctrine lines. No faith language.

### Layer 3 — Ten Hamlet Matrix

A grid of all ten hamlet cards (`HamletMatrixCard`). Each card shows the hamlet photo, name, CIS score, and — **new as of Sprint 7** — a live listing badge ("1 ACTIVE," "2 ACTIVE," etc.) if Ed has active listings in that hamlet. The badge is populated from the `/api/listings` endpoint, which scrapes Ed's Christie's profile page daily at 6 AM.

Clicking a hamlet card expands the **Hamlet Detail Panel** (Layer 4), which shows:

- Full hamlet intelligence: median price, CIS score, tier, volume share, last notable sale
- Restaurant tiers (Anchor / Mid / Local counts)
- **Active Listings** — live from the scraper, showing address, price, beds/baths/sqft, and direct link to the Christie's listing page. If no live listings, shows "No active listings at this time."
- Zillow link for the hamlet
- News links for the hamlet

**Current live listings (as of April 3, 2026):**
- Montauk: 18 Tara Road — $3,990,000
- East Hampton: 2 listings (Hands Creek Road area + Hampton Bays area)
- Water Mill: 1 listing

### Layer 5 — Print Output

When a hamlet detail panel is open, a print-optimized output is available for generating the individual hamlet PDF.

---

## Tab 4 — PIPE

**Purpose:** Daily driver. Office Pipeline. Single source of truth. The private Office Pipeline Google Sheet is the backend — no public sharing required.

**Sheet ID (locked):** `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`
**Access method:** Google Service Account (`christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com`) — server-side proxy, no iframe, no sharing permissions changed.

### KPI Strip

Five live metrics computed from the Sheet data: **Active · In Contract · Closed · Total Volume · Total Deals.** Updates every 60 seconds automatically.

### Add Deal Button

A `+ Add Deal` button above the table expands a full entry form. Fields: Address (required), Town (dropdown: 12 options), Type (dropdown: Residential/Land/Commercial/Condo/Co-op/Rental), Price, Status (dropdown: Active/In Contract/Closed/Watch/Dead), Agent (default: Ed Bruehl), Side (dropdown: Buyer/Seller/Dual), ERS Signed, EELI Link, Date Closed. On submit, the row is appended directly to the private Sheet via the service account. The table refreshes automatically on success.

### Pipeline Table

A full-width styled table reading all rows live from the Sheet. Features:

- **Search box** — filters by address, town, or agent
- **Status filter tabs** — All / Active / In Contract / Closed / Watch / Dead
- **Manual refresh button** with last-synced timestamp
- **"Open Full Sheet ↗" link** — direct link to the Google Sheet
- **Section header rows** — BUY-SIDE / LISTING-SIDE visual dividers
- **Inline status editor** — click any row's status badge to change it; writes directly back to the Sheet via `trpc.pipe.updateSheetStatus`
- **12 visible columns:** Address · Town · Type · Price · Status · Side · Agent · ERS/EBB · Signs · Photos · Zillow · Date Closed

**Auto-refresh:** Every 60 seconds.

---

## Tab 5 — FUTURE

**Purpose:** Growth Model, Agent Roster, and 300-Day Arc. Data synced manually from Growth Model v2 Google Sheet (`1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag`).

### 2026 Scorecard

Four KPI tiles: **52 Podcasts** (weekly cadence, full year) · **12 Collector Events** (monthly, curated audience) · **12 Agents** (target roster, December 2026) · **12 Raving Fans** (institutional advocates).

### GCI Trajectory Chart

A custom SVG bar chart showing GCI ($M) by year from 2026 to 2031. The 2026 bar is highlighted in gold. Each bar shows the GCI value label above it.

| Year | Agents | GCI | Avg GCI | Milestone |
|---|---|---|---|---|
| 2026 | 15 | $3.95M | $263K | Base case — 15 agents, $3.95M GCI · $158M volume · $1.185M house take by December 2026 |
| 2027 | 6 | $1.56M | $260K | First team layer |
| 2028 | 10 | $2.50M | $250K | Operating scale |
| 2029 | 14 | $3.08M | $220K | Regional authority |
| 2030 | 18 | $3.60M | $200K | Institutional presence |
| 2031 | 22 | $4.40M | $200K | Full South Fork coverage |

### Outlook Table

The full 2026–2031 data rendered as a table with year, agents, GCI, average GCI, and milestone description.

### Agent Roster

Six cards: Ed Bruehl (Managing Director · Active · Founding), Seats 2–3 (Senior Associate / Associate · Recruiting · Q2 2026), Seats 4–5 (Associate · Target · Q3 2026), Seat 6 (Associate · Target · Q4 2026).

### 300-Day Arc

Four phase cards:

| Phase | Days | Label | Description |
|---|---|---|---|
| Phase I | 1–90 | Foundation | Establish systems, deploy ANEW calculator, first two agent hires, first three listings |
| Phase II | 91–180 | Activation | First closings, INTEL document library live, Paumanok Map deployed, morning brief cadence locked |
| Phase III | 181–270 | Acceleration | Six agents operating, Growth Model v2 on pace, first council brief published, podcast launched |
| Phase IV | 271–300 | Consolidation | Full South Fork market authority established. Annual GCI run rate confirmed. Year 2 plan locked |

A direct link to the Growth Model v2 Google Sheet is present at the bottom of the tab.

---

## Tab 6 — INTEL

**Purpose:** Operating Control Room. Intelligence, documents, SOPs, live working sheets, and the institutional archive. Three layers plus Sprint 7 additions.

### Layer 1 — Master Calendar (Above the Fold, Always Visible)

A full-width Google Calendar embed (600px height, navy background, gold events, month view, no chrome) showing the Christie's East Hampton master calendar. Below the calendar, filter tabs (All / Podcast / Event / Internal / Social) control which sheet embeds appear side by side:

- **Podcast Pipeline** — live embed of Sheet `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8` with "Open Sheet ↗" link
- **Event Calendar** — live embed of Sheet `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s` with "Open Sheet ↗" link

Internal and Social filter notes: "Internal and Social items are tracked inside the Podcast and Event sheets above."

### Layer 2 — Live Working Sheets

Three full-height sheet panels in a 3-column grid, each with a navy header, "Open ↗" link, 50vh iframe embed, and a "LIVE SHEET" footer badge:

| Panel | Sheet ID | Description |
|---|---|---|
| Agent Recruiting | `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA` | Future agents · Active targets · Status tracking |
| Social / Podcast Pipeline | `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I` | Content calendar · William Records · Platform scheduling |
| Hamptons Outreach Intelligence | `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI` | UHNW targeting · Outreach intelligence · Vendor network |

### Layer 3 — Canon Documents + Sprint 7 Intelligence Cards

The institutional archive. Rendered in this order:

**Org Chart & Hierarchy**
- CIREG Ecosystem · Organizational Map · April 2, 2026 (pinned, live HTML link): Five-tier institutional hierarchy — Artémis/Pinault Family → Christie's Auction House → CIH → CIREG Tri-State → Christie's East Hampton Flagship. Guillaume Cerutti marked departed March 30, 2026.

**Intel Source Registry** *(Sprint 7 Item 4)*
16 data sources mapped across four Growth Model pillars. Each source shows type (Sheet/API/Scraper/Manual/Component), cadence, what it feeds, status, and optional link. Filter tabs by pillar. Growth Model feed map at the bottom links to v2 Sheet.

| Pillar | Sources |
|---|---|
| Territory Intelligence | Listing scraper, MAPS hamlet data, MARKET tab, Zillow links, news feeds |
| Relationship Capital | Family Office List, Hamptons Outreach Intelligence Sheet, Attorney Database |
| Institutional Memory | Council Briefs, Constitution & SOPs, Org Chart, INTEL Archive |
| Advisory Voice | TTS briefs (William/ElevenLabs), Newsletter, Podcast Pipeline, Social/Podcast Sheet |

**Family Office Intelligence** *(Sprint 7 Item 2)*
12 UHNW principals across five tiers. Each card is expandable and shows: family office name, property address, estimated net worth, Christie's Angle, Approach strategy, Ed Bruehl / James Christie outreach letter (one-click copy), and "Add to Pipeline" button (writes directly to the Office Pipeline Sheet via `trpc.pipe.appendSheet`).

| Tier | Description |
|---|---|
| Further Lane | The highest-value corridor in the Hamptons |
| Sagaponack / Bridgehampton | Institutional land and estate principals |
| Georgica Pond | Ultra-private enclave, legacy families |
| European Family Offices | International capital, Artémis/Christie's connection |
| Broader South Fork | Established wealth across the ten hamlets |

**Local Charity Tracker** *(Sprint 7 Item 3)*
6 initiatives across two cause areas. Stats row: total initiatives, active, opportunities, cause areas. Filter tabs: All / Highway 27 / Housing. Each initiative card is expandable with org name, status, description, Christie's community position note, and direct links (website/contact).

| Cause Area | Initiatives |
|---|---|
| Highway 27 Safety | Road safety advocacy organizations on the primary Hamptons corridor |
| East Hampton Affordable Housing | Affordable housing initiatives serving the local workforce |

**Newsletter Infrastructure** *(Sprint 7 Item 5)*
Three tRPC procedures: `newsletter.subscribe`, `newsletter.sendTestEmail`, `newsletter.getStats`. The card shows: subscriber add form, Gmail SMTP test email form, five-step setup checklist (expandable, with links to Beehiiv and Gmail App Password setup), and a four-surface product spec (Beehiiv · Gmail SMTP · Dashboard · WhatsApp).

**Status:** Pending activation. Two credentials needed: `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` (from Beehiiv), and `GMAIL_SMTP_USER` + `GMAIL_APP_PASSWORD` (from Google App Passwords). Once set, the subscriber form and SMTP test go live immediately.

**Market Report**
- Christie's Hamptons Live Market Report · v2 · March 2026 (pinned, live HTML link): Full live market report wireframe — six sections, hamlet atlas, ANEW intelligence, rate environment, resources. Council-approved March 29, 2026.
- Hamlet PDF · East Hampton Village · Wireframe (staging only — no live URL yet)

**Canon PDFs** (from `usePdfAssets` hook — CDN-hosted)
Any PDFs uploaded to the CDN and registered in the PDF assets hook appear here with "Open PDF" buttons.

**Constitution & SOPs**
- Christie's East Hampton · Website Wireframe · v2 (live HTML link)
- Estate Advisory Card · PDF (live PDF link): Client-facing credential document — CIREG brand, Ed Bruehl, doctrine lines. Send as PDF in 30 seconds from any Christie's meeting.
- 300-Day Ascension Plan · Wireframe (live HTML link)

**Council Briefs**
- Council Brief · March 29, 2026 · FINAL (pinned, live HTML link): Five-layer header directive, PDF engine, MAPS hamlet spec, PIPE scaffold, and 300-day arc.

**Attorney Database** — Staging only (no live URL yet): Curated list of real estate attorneys, estate attorneys, and transaction counsel serving the South Fork market.

**Adam Kalb · IBC Materials** — Staging only (no live URLs yet): IBC overview and IBC brief.

### Sprint 7 Horizon Banner

A navy footer banner listing all six Sprint 7 completions:
Family Office List · Local Charity Tracker · Intel Source Registry · Newsletter Infrastructure · ElevenLabs Key · PIPE Tab Proxy.

### Doctrine Footer

"Art. Beauty. Provenance. · 26 Park Place, East Hampton, NY 11937 · 646-752-1233"

---

## Backend Services & Data Sources

| Service | What It Powers | Status |
|---|---|---|
| `/api/market-data` | All seven header ticker values (S&P, BTC, Gold, Silver, VIX, Treasury, Mortgage) | Live — Yahoo Finance + CoinGecko + FRED API |
| `/api/tts/founding-letter` | HOME and /report audio player — Founding Letter narration | Live — ElevenLabs voice `fjnwTZkKtQOJaYzGLa6n`, Manny key |
| `/api/tts/market-report` | HOME and /report audio player — Market Report narration | Live — same ElevenLabs key |
| `/api/listings` | MAPS hamlet live listing badges + detail panel | Live — scrapes christiesrealestategroup.com/realestate/agent/ed-bruehl/ |
| `/api/listings/sync` | Force-refresh the listing cache | Live — POST endpoint |
| Google Sheets (service account) | PIPE tab — reads, writes, and appends to private Office Pipeline Sheet | Live — `christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com` |
| Open-Meteo | East Hampton live weather in Layer 5 header | Live — no key required |
| ElevenLabs TTS | Audio narration for Founding Letter and Market Report | Live — Manny key, TTS permission confirmed |
| Twilio WhatsApp | Owner notifications via WhatsApp | Live — credentials confirmed in tests |
| Beehiiv + Gmail SMTP | Newsletter subscriber management and dispatch | Pending — awaiting `BEEHIIV_API_KEY` and `GMAIL_APP_PASSWORD` |

---

## PDF Export Engine

Six export types are available from the MAPS CIS Calculator Results Panel and from the `/report` page:

| Export | Trigger | Contents |
|---|---|---|
| Christie's Hamptons Market Report | MAPS Results Panel + /report PDF button | Five pages: cover, market signal, hamlet atlas, ANEW intelligence, resources |
| ANEW Build Memo | MAPS Results Panel | Single-deal ANEW analysis with all-in/exit/spread |
| CMA | MAPS Results Panel | Comparative Market Analysis |
| Deal Brief | MAPS Results Panel | One-page deal brief |
| Investment Memo | MAPS Results Panel | Two-page investment memo |
| East Hampton Village Hamlet Report | MAPS Results Panel | Single-hamlet deep-dive for EH Village |

All exports include: CIREG logo · Ed Bruehl headshot · QR code · Two doctrine lines. No faith language on any export.

---

## Test Suite

**25/25 tests passing** as of checkpoint ad5b5b12. Test files:

| File | What It Tests |
|---|---|
| `server/auth.logout.test.ts` | Auth logout procedure |
| `server/tts.test.ts` | ElevenLabs TTS endpoint (Manny key) |
| `server/twilio-credentials.test.ts` | Twilio WhatsApp credentials (5 assertions) |
| `server/sheets-write.test.ts` | Live Google Sheets write — updates 2 Old Hollow Road to Closed, April 2, 2026 |
| + 5 additional test files | Router procedures, market data, listings sync, newsletter helpers |

---

## What Is Live vs. Pending

### Live and Confirmed

Everything described above is live and operational on `www.christiesrealestategroupeh.com` unless noted below.

### Pending — Awaiting Credentials

- **Newsletter (Beehiiv + Gmail SMTP):** The infrastructure is built and wired. Two credentials needed: `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` from Beehiiv, and `GMAIL_SMTP_USER` + `GMAIL_APP_PASSWORD` from Google. Once set, the subscriber form and SMTP test go live immediately from the INTEL tab.

### Pending — No Live URL Yet (Staging Only)

- **Hamlet PDF · East Hampton Village:** The wireframe exists; the CDN-hosted PDF has not been generated and uploaded yet.
- **Attorney Database:** The card exists in INTEL Layer 3 with description; the actual database document has not been built yet.
- **Adam Kalb · IBC Materials:** Two cards exist in INTEL Layer 3 with descriptions; the actual documents have not been uploaded yet.

---

## Known Gaps and Next Actions

The following items are identified as the highest-value next steps before the May 1 launch:

**1. Newsletter Activation** — Provide `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `GMAIL_SMTP_USER`, and `GMAIL_APP_PASSWORD` to Manny. Manny sets them and fires the SMTP test from the INTEL tab. Newsletter goes live immediately.

**2. PIPE Tab — Bulk Import from Christie's Profile** — The daily 6 AM scraper already pulls the 4 live listings. A one-click "Import from Profile" button in the PIPE tab would add any scraped listing not already in the Sheet as a new Active deal row, eliminating manual entry for new listings.

**3. FUTURE Tab — GCI Milestone Progress Bars** — The Futures Arc has four phase milestones defined. Adding a live progress indicator to each milestone card showing actual vs. target GCI (based on Closed deals in the Pipeline Sheet) would make the FUTURE tab a live performance tracker rather than a static projection.

**4. Attorney Database** — Build the curated list of real estate attorneys, estate attorneys, and transaction counsel serving the South Fork. This is a high-value relationship asset for the Family Office List principals and for the PIPE tab deal workflow.

**5. Adam Kalb · IBC Materials** — Upload the IBC overview and brief documents to the CDN and register them in INTEL Layer 3. These are already stubbed with descriptions; they just need the actual documents.

**6. East Hampton Village Hamlet PDF** — Generate and upload the single-hamlet deep-dive PDF for East Hampton Village. This is the highest-priority hamlet for the Christie's brand and the most likely to be sent to clients.

---

*Christie's East Hampton · Art. Beauty. Provenance. · 26 Park Place, East Hampton, NY 11937 · 646-752-1233*
*Audit prepared by Manny · April 3, 2026 · Checkpoint ad5b5b12 · 25/25 tests passing*
