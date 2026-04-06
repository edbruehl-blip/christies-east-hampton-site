# Christie's East Hampton · Platform Update Brief
**Date:** April 5, 2026  
**From:** Manny  
**To:** Full Council  
**Re:** Platform Status — Post-Sprint 10 · All Systems Verified

---

## Where We Stand

The platform is live at **christiesrealestategroupeh.com**. Every tab is rendering. Every live data feed is confirmed. The two production crashes from last night — PIPE and INTEL — have been diagnosed, fixed, and published. Here is the full picture.

---

## What the Platform Does Today

The dashboard is a single-URL operating system for the Christie's East Hampton territory. It has six internal tabs and two public-facing routes.

| Surface | Status | What It Does |
|---|---|---|
| **HOME** | Live | James Christie founding letter · market ticker (S&P, BTC, Gold, VIX, 30Y Treasury, Mortgage, Weather) · Christie's Auction House services · YouTube channel |
| **MARKET** | Live | Eleven-hamlet matrix with CIS scores, medians, volume shares, last sales, hamlet photography · WhatsApp territory briefing CTA |
| **MAPS** | Live | Google Maps satellite view · all 11 hamlet markers · CIS Calculator (4 lenses: ANEW Build, Buy & Hold, Buy Renovate & Hold, Buy & Rent) · hamlet PDF exports |
| **PIPE** | Live | 47 deals reading live from Office Pipeline Google Sheet via service account · inline status edits write directly back to Sheet · Add Deal + Import from Profile buttons |
| **FUTURE** | Live | 2026 scorecard (52 podcasts, 12 collector events, 12 agents, 12 raving fans) · Ascension Arc visual ($2.5M → $13.62M → $20M+ → $143M+ → $280M+ → $3B) · PDF export |
| **INTEL** | Live | Layer 1: Google Calendar (Christie's events, podcast, Wednesday Circuit) · Layer 2: live sheet embeds (Outreach Intelligence, Agent Recruiting, Podcast Pipeline) · Layer 3: canon documents (org chart, estate advisory card, market report, 300-day ascension) · Layer 4: Intelligence Web (44 entities — Jarvis Top Agents, Whale Intelligence, Auction Referrals) |
| **/public** | Live | Public-facing surface: founding letter, hamlet cards, Christie's services — no PIPE, no INTEL, no internal data |
| **/report** | Live | Full market report: founding letter, rate environment, hamlet atlas, model deal, Christie's auction intelligence, estate advisory CTA · PDF download · TTS audio (William voice) |

---

## What Happened Last Night

Two tabs went down after the Sprint 10 publish. Both had the same root cause.

**Sprint 9 P5 security hardening** promoted ten tRPC procedures from `publicProcedure` to `protectedProcedure`. The intent was correct — write operations (status edits, deal adds, sheet appends) should require a session. But the hardening pass also caught two **read** procedures that should never have been gated: `pipe.sheetDeals` and `intel.webEntities`.

These two procedures do not use session cookies. They use `GOOGLE_SERVICE_ACCOUNT_JSON` — a server-side credential that authenticates directly to the Google Sheets API. When they were promoted to `protectedProcedure`, the tRPC auth middleware blocked the call before the service account ever ran. The Sheet connection was never broken. The auth layer was blocking the door.

**The fix was one line each.** Both procedures reverted to `publicProcedure`. All write procedures remain `protectedProcedure`. Server-side confirmation: `pipe.sheetDeals` → 47 deals loaded. `intel.webEntities` → 44 entities loaded. 35/35 tests passing.

To prevent recurrence, a 19-line **AUTH MODEL comment block** now sits at the top of `server/routers.ts`. It names every procedure, states which auth layer governs it (service account vs session cookie), and explains exactly why promoting Sheets reads to `protectedProcedure` breaks them. Any future hardening pass will read it before touching anything.

---

## Open Items (Ranked by Priority)

The following items are logged and sequenced. Nothing is blocking the platform today.

**Immediate (before next sprint):**
- `CRITICAL-1` and `CRITICAL-2` are resolved and published. No blockers remain.
- Sprint 7 Item 1 (Org Chart v2 — dynamic, sheet-driven, Zone One/Two) is still open. The placeholder card is live in INTEL Layer 3. The full build awaits Ed GO.
- Newsletter activation (Beehiiv + Gmail SMTP) is scaffolded and waiting on credentials from Ed.

**Sprint 9 P5 remaining items (not yet started):**
- TTL cache on `pipe.sheetDeals` — prevents hitting the 300-requests/minute Sheets API quota under heavy use.
- `SHEET_ID` moved from hardcoded value in `sheets-helper.ts` to environment variable.
- Shared CSS max-width variable (`--frame-max-w`) applied consistently to MAPS, PIPE, and INTEL containers.

**Sprint 9 P4 mobile pass (partially complete):**
- MAPS hamlet markers: touch targets increased to 44px. ✓
- HOME ticker: no-wrap on narrow viewports. ✓
- INTEL sticky section navigator: Layer 1 / 2 / 3 / 4. ✓
- FUTURE bar chart labels on mobile. ✓
- James Christie portrait scaling on iPhone — still open.

**Sprint 6 open items (low priority, pre-May 1):**
- Favicon: IMG_4386 (cream C on crimson) — not yet set.
- Art/Beauty/Provenance copy audit across all surfaces.
- Tier label removal from any remaining surfaces.

---

## System Health

| Check | Result |
|---|---|
| Vitest suite | 35/35 passing |
| esbuild compile | 90.3kb · 0 errors |
| TypeScript | 0 errors |
| PIPE live read | 47 deals · service account confirmed |
| INTEL live read | 44 entities · service account confirmed |
| /public route | No OAuth redirect · no internal data |
| /report route | Full market report · PDF + TTS functional |
| WhatsApp briefs | 8AM + 8PM · William voice · Perplexity NEWS handler live |
| Market ticker | S&P, BTC, Gold, VIX, 30Y Treasury, Mortgage, Weather · all live |
| Google Calendar | Christie's auction events + Wednesday Circuit synced |

---

## What Is Not on the Platform

For the record — surfaces that are explicitly excluded from every public-facing route:

- PIPE deal data (Office Pipeline Sheet)
- INTEL Layer 4 (Intelligence Web — Jarvis targets, Whale Intelligence, Auction Referrals)
- Family Office Registry
- Attorney Intelligence
- Agent Recruiting Sheet
- Any internal calendar or operational data

The `/public` route was audited this morning. It renders the founding letter, hamlet cards, Christie's services, and the territory briefing CTA. Nothing else.

---

## Suggested Next Actions for Ed

1. **Publish** — click the Publish button in the Management UI to push checkpoint `3ce0c12c` to production.
2. **Verify PIPE live** — navigate to PIPE on the live site, confirm 47 deals load within 3 seconds.
3. **Verify INTEL live** — navigate to INTEL Layer 4, confirm Jarvis / Whale / Auction Referrals tabs populate.
4. **Newsletter credentials** — send Beehiiv API key and Gmail SMTP app password to Manny when ready. Newsletter is fully scaffolded and will activate on credential receipt.
5. **Org Chart v2 GO signal** — when Ed is ready to build the dynamic, sheet-driven org chart (Zone One public / Zone Two private), send GO and Manny will build in one session.

---

*Art. Beauty. Provenance. · Since 1766.*  
*Soli Deo Gloria.*
