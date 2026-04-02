# Christie's East Hampton — Spreadsheet Governance Inventory
**Date:** April 1, 2026  
**Prepared by:** Manny  
**Status:** Audit only. No deletions. No merges. No renames. Hard stop after Return 3.

---

## RETURN 1 — Full 8-Sheet Inventory

### 1. Growth Model v2
**Sheet ID:** `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag`

| Field | Value |
|-------|-------|
| Tab structure | ROSTER · ASSUMPTIONS · OUTPUTS · LEADERBOARD · CONTACTS_STAGING |
| Purpose | Agent production modeling, GCI forecasting, expansion planning, and (as of Sprint 5) institutional pipeline staging |
| Owner | Ed Bruehl |
| Classification | **SOURCE** — all GCI math originates here |
| Feeds | INTEL tab (FUTURE surface), dashboard OUTPUTS display, Sprint 6 REFERRAL_PIPELINES tab |
| Recommendation | **Keep** — primary financial model. CONTACTS_STAGING tab is temporary staging; promote to standalone sheet when data entry begins |

**Current state after Sprint 5 edits:**
ROSTER tab holds 3 agent cohorts; ROSTER!I43 = $3,125,000 (formula-driven, untouched). ASSUMPTIONS tab now includes row 27: `2026_INSTITUTIONAL_PIPELINE_GCI = $825,000` with full Ilija/auction/council breakdown note. OUTPUTS tab now shows a three-line GCI breakdown (Agent Production $3,125,000 + Institutional/Referral $825,000 = Total GCI $3,950,000) plus House Take at 30% ($1,185,000). CONTACTS_STAGING tab has 14 column headers (NAME through NOTES); no data, no formulas; dropdowns pending Ed activation.

---

### 2. Office Pipeline
**Sheet ID:** `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`

| Field | Value |
|-------|-------|
| Tab structure | Sheet1 (primary) · Deal Log · Pipeline Quadrant BACKUP Feb27 |
| Purpose | Live deal tracking across all active, pending, and closed transactions |
| Owner | Ed Bruehl |
| Classification | **SOURCE** — the authoritative deal record for the office |
| Feeds | PIPE tab on dashboard (via database), WhatsApp briefs, weekly reporting |
| Recommendation | **Keep** — Sheet1 is the live source. Deal Log is a working history tab. Pipeline Quadrant BACKUP Feb27 is an archive snapshot and should be classified ARCHIVE pending Ed review |

**Current state:** Sheet1 is organized by category (BUY-SIDE, LISTING-SIDE, RESIDENTIAL LISTINGS, LAND LISTINGS, COMMERCIAL/COOP, PENDING LISTINGS, PENDING DEALS). Columns: ADDRESS, TOWN, TYPE, PRICE, STATUS, AGENT, SIDE, ERS/EBB SIGNED, EELI LINK, SIGNS, PHOTOS, ZILLOW SHOWCASE. Live entries include 2 Old Hollow Road (In Contract, Buyer) and 138A Montauk Highway (In Contract, Seller). 25 Horseshoe Road does not appear in the visible portion of Sheet1 — it may be in a lower section or requires a separate entry. **Flag for Ed:** confirm 25 Horseshoe Road placement in this sheet.

---

### 3. Market Matrix
**Sheet ID:** `176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g`

| Field | Value |
|-------|-------|
| Tab structure | Market Matrix (single tab) |
| Purpose | Hamptons hamlet-level market intelligence: 2025 medians, YoY change, volume, DOM, inventory, tier weight, trend, and notes |
| Owner | Ed Bruehl |
| Classification | **SOURCE** — canonical market data used by the MARKET tab on the dashboard |
| Feeds | MARKET tab (hamlet tiles, donut chart, quadrant display), Market Report PDF, council briefings |
| Recommendation | **Keep** — clean single-tab structure. Ten hamlets confirmed and scored. No action needed |

**Current state:** 12 hamlet rows (East Hampton Village through Hampton Bays, including Shelter Island and Westhampton). MARKET QUADRANTS section defines four tiers: OCEANFRONT/TROPHY $20M+, ESTATE $10M–$20M, VILLAGE LUXURY $4M–$10M, MARKET <$4M. All data is 2025 baseline with YoY change columns. Montauk is present and scored.

---

### 4. Contact Database (Hamptons Outreach)
**Sheet ID:** `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI`

| Field | Value |
|-------|-------|
| Tab structure | UHNW Oceanfront · Vendors & Service Partners · vendors_tab_paste · Builders · Architects · Accountants & Advisors · Gatekeeper Network · Campaign Playbook · Proof Points · SOP — Angel & Astra |
| Purpose | UHNW outreach intelligence and property targeting — NOT a relationship CRM |
| Owner | Ed Bruehl / Angel (execution) |
| Classification | **WORKING** — active outreach targeting sheet; not a contact relationship database |
| Feeds | INTEL tab (outreach layer), Angel/Astra SOP execution, letter campaign targeting |
| Recommendation | **Keep under current name** — this sheet should be renamed or clearly distinguished from the future Contact Database (CONTACTS_STAGING). The brief's label "Contact Database" is a naming collision. Recommend renaming this sheet "Hamptons Outreach Intelligence" in Sprint 6 to eliminate confusion |

**Critical naming note:** The brief refers to this sheet as "Contact Database," but its actual content is UHNW property targeting and outreach intelligence. The true relationship contact database is CONTACTS_STAGING (in Growth Model v2). These are two different tools serving two different purposes. This collision must be resolved before Sprint 6 data entry begins.

---

### 5. Future Agents
**Sheet ID:** `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA`

| Field | Value |
|-------|-------|
| Tab structure | Future Agents (single tab) |
| Purpose | Quiet recruiting pipeline — tracking prospective agents by firm, connector, interest level, and expected move date |
| Owner | Ed Bruehl |
| Classification | **WORKING** — active recruiting intelligence, not yet a SOURCE |
| Feeds | INTEL tab (recruiting layer), Ed's weekly motion cadence |
| Recommendation | **Keep** — clean, single-tab structure. QUADRANT column added (Sprint 5). Eight active prospects tracked. EXPANSION TARGETS section (East Hampton 2026, Southampton 2027, Westhampton 2028) is strategic context, not operational data |

**Current state:** 8 active prospects (JR Kenneth, Jane, Susan Ryan, Jeremy Dunham, Ian Dios, Rod, Rob Cummings, Jamie Dillon). Weekly motion defined as 2 direct touches + 2 connector asks + 2 value drops. QUADRANT column (column I) added and blank — ready for Ed to populate.

---

### 6. Podcast Calendar
**Sheet ID:** `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8`

| Field | Value |
|-------|-------|
| Tab structure | Podcast Calendar (single tab) |
| Purpose | 52-episode 2026 podcast production calendar — guest scheduling, recording dates, edit status, and publish tracking |
| Owner | Ed Bruehl / Angel (execution) |
| Classification | **SOURCE** — canonical podcast schedule; INTEL Calendar is a VIEW of this data |
| Feeds | INTEL Calendar (view only), Social Pipeline (content derivative), weekly dispatch |
| Recommendation | **Keep** — single-tab, clean structure. PUBLIC/PDF/DISPATCH columns added (Sprint 5). Balsam Farm (Ep 13, CONFIRMED) and Green Thumb Nursery (Ep 14, CONFIRMED) added. Episodes 15–52 are blank planning rows |

**Current state:** Episodes 1–9 have guests assigned (Pierre Debbas, Marit Molin, Solo/Ed, Brad Beyer, Gia Fiorello, Christie's Art Specialist, Family Office Advisor, Ilija Pavlovic, Pierre Debbas return). Episodes 10–12 are dated but guest-TBD. Episodes 13–14 are confirmed. Episodes 15–52 are blank.

---

### 7. Event Calendar
**Sheet ID:** `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s`

| Field | Value |
|-------|-------|
| Tab structure | HEADLINE EVENTS (single tab, primary section visible) |
| Purpose | 2026 event tracking — headline events, dates, venues, status, owner, budget, attendance, and notes |
| Owner | Ed Bruehl |
| Classification | **SOURCE** — canonical event schedule; INTEL Calendar is a VIEW of this data |
| Feeds | INTEL Calendar (view only), weekly dispatch, PDF/public communications |
| Recommendation | **Keep** — PUBLIC/PDF/DISPATCH columns added (Sprint 5). Bridge Car Show updated to August 2026. Wednesday Circuit added as Recurring 2026. No structural changes needed |

**Current state:** Active events include Brad Beyer Art Event, Real Deal Roundtable NYC, The Bridge Car Show (August 2026), Real Deal Roundtable Hamptons, Wednesday Circuit (Recurring 2026). Columns: Event, Date, Venue, Status, Owner, Budget, Attendance, Notes, PUBLIC (I), PDF (J), DISPATCH (K).

---

### 8. Social Pipeline
**Sheet ID:** `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I`

| Field | Value |
|-------|-------|
| Tab structure | Content Calendar · Platform Scorecard · Paid Media · 30-Day Targets |
| Purpose | Social media content planning, platform performance tracking, paid media management, and short-term targeting |
| Owner | Ed Bruehl / Angel (execution) |
| Classification | **WORKING** — active content operations; derives from Podcast Calendar and Event Calendar |
| Feeds | Angel/Astra weekly execution, platform posting, paid campaign management |
| Recommendation | **Keep** — four-tab structure is appropriate. Content Calendar is the primary working surface. Platform Scorecard and 30-Day Targets are operational VIEW tabs. Paid Media is a WORKING tab. No structural changes needed |

**Current state:** Content Calendar tracks Ep 3 (Brad Beyer) content — POSTED, SCHEDULED, DRAFT, and RUNNING items across Instagram, TikTok, YouTube, LinkedIn, Facebook, X/Twitter, and Threads. Ep 4 content is PLANNED for March 5–10, 2026.

---

## RETURN 2 — Cleanup Recommendation

The system is structurally sound. No deletions, merges, or renames are recommended in this pass. Three items require Ed review before Sprint 6.

**Item 1 — Naming collision (Priority: High).** The brief labels sheet `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI` as "Contact Database," but its actual content is UHNW outreach targeting intelligence. The true relationship contact database is CONTACTS_STAGING in Growth Model v2. These serve different purposes and must carry different names before Sprint 6 data entry begins. Recommended resolution: rename the Hamptons Outreach sheet to "Hamptons Outreach Intelligence" in Sprint 6 (not now — per brief rules).

**Item 2 — 25 Horseshoe Road placement (Priority: Medium).** The Office Pipeline Sheet1 does not show 25 Horseshoe Road in the visible rows. It may exist further down in the PENDING DEALS section or may need to be added. The dashboard database has the record (inserted Sprint 5), but the Google Sheet source should match. Ed to confirm placement.

**Item 3 — Pipeline Quadrant BACKUP Feb27 (Priority: Low).** This tab in the Office Pipeline sheet is a Feb 27 snapshot. It should be formally classified as ARCHIVE and locked against editing. No action needed now — flag for Sprint 6 cleanup pass.

| Sheet | Classification | Status | Action |
|-------|---------------|--------|--------|
| Growth Model v2 | SOURCE | Clean | Keep — CONTACTS_STAGING to be promoted Sprint 6 |
| Office Pipeline | SOURCE | Minor flag | Keep — confirm 25 Horseshoe Road placement |
| Market Matrix | SOURCE | Clean | Keep — no action needed |
| Contact Database (Hamptons Outreach) | WORKING | Naming collision | Keep — rename in Sprint 6 |
| Future Agents | WORKING | Clean | Keep — QUADRANT column ready for population |
| Podcast Calendar | SOURCE | Clean | Keep — Eps 13–14 confirmed, 15–52 ready |
| Event Calendar | SOURCE | Clean | Keep — Bridge Car Show + Wednesday Circuit added |
| Social Pipeline | WORKING | Clean | Keep — four-tab structure appropriate |

---

## RETURN 3 — Sprint 6 Specification

Sprint 6 has three work streams. No action is taken on any of these until Ed reviews and approves this inventory.

**Work Stream A — Growth Model: Institutional Pipeline Wiring**

The $825,000 institutional/referral GCI is currently a single ASSUMPTIONS cell. Sprint 6 builds the REFERRAL_PIPELINES tab that backs it up with line-item detail: Ilija network ($450K), Auction house ($125K), International council ($100K), Retirement magnet early introductions ($150K). Each line item gets a source, a probability weight, and a timeline. The OUTPUTS tab three-line display remains unchanged — it already links correctly to ASSUMPTIONS!B27.

**Work Stream B — Contact Database: Promotion from Staging to Source**

CONTACTS_STAGING becomes the standalone Contact Database when Ed activates the two dropdowns (ROLE and CADENCE) and the first real contact record is entered. At that point, the tab should be moved to its own Google Sheet (not remain inside Growth Model v2), and the Hamptons Outreach sheet should be renamed to eliminate the naming collision. The INTEL tab on the dashboard will then wire to the Contact Database as a VIEW surface.

**Work Stream C — Market Report PDF: v3 Wireframe Parity**

The current PDF export covers 6 sections. The v3 wireframe calls for 8 pages: Cover → Hamlet Grid → Rate Environment → Saunders Competitive Stats → Auction Intelligence → Resources → (two additional sections TBD). Sprint 6 expands the PDF to full 8-page parity and wires the Hamlet Grid directly to Market Matrix data so median prices and YoY changes auto-populate from the source sheet.

---

**Hard stop.** Inventory returned. Cleanup recommendation returned. Sprint 6 spec returned. Awaiting Ed review before any further action.

*Soli Deo Gloria.*
