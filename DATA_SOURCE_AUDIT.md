# Christie's East Hampton — Data Source Audit
**Date:** April 8, 2026  
**Sprint:** 34 · Item 9  
**Scope:** All five priority surfaces + backend functions

---

## Summary

| Surface | Data Source | Status |
|---|---|---|
| HOME tab | Static letter text (correct by design) | VERIFIED |
| MARKET tab | Google Sheets live + FRED API live | LIVE (one display gap noted) |
| MAPS tab | Google Maps Proxy + hamlet-master static | LIVE |
| PIPE tab | Google Sheets live (Office Pipeline) | LIVE |
| FUTURE tab | Google Sheets live (Growth Model v2) | LIVE (fallbacks documented) |
| William Morning Brief | Growth Model + Pipeline + Perplexity Cronkite | LIVE |
| William Evening Brief | Pipeline + Perplexity Cronkite | LIVE (Sprint 34 wired) |
| Flagship Letter PDF | Static text (correct by design) | VERIFIED |
| Founding Letter PDF | Static text (correct by design) | VERIFIED |

---

## Surface-by-Surface Detail

### HOME Tab
- **Letter text:** Static array in `HomeTab.tsx` — correct by design. The founding letter is a fixed document, not a data feed.
- **James Christie image:** CDN URL. No local file.
- **Status:** VERIFIED CLEAN.

---

### MARKET Tab
- **Hamlet Matrix (11 hamlets):** LIVE — reads from `MARKET MATRIX` tab in Growth Model v2 Google Sheet via service account. Cached 5 minutes.
- **30Y Fixed Mortgage (nav bar ticker):** LIVE — fetches from FRED series `MORTGAGE30US` via public CSV endpoint. 24-hour cache. Falls back to last known value (6.38%) on FRED failure.
- **30Y Fixed Mortgage (MARKET tab Rate Environment card):** ⚠️ HARDCODED — displays `6.38%` as a static string in `MarketTab.tsx` line 394. Does NOT read the live FRED value. **This is the one actionable hardcoded item in the replatform.**
- **Hamptons Median:** LIVE — computed from hamlet matrix data.
- **Status:** ONE GAP — MARKET tab mortgage corridor card shows hardcoded 6.38% instead of live FRED value.

---

### MAPS Tab
- **Map tiles + geocoding:** LIVE — Google Maps Proxy (Manus-managed, no API key required).
- **Hamlet boundaries + CIS scores:** Static — `hamlet-master.ts` data file. Correct by design (hamlet boundaries don't change).
- **Listing pins:** Placeholder EELE listings when live data unavailable — documented behavior.
- **Status:** LIVE. Static hamlet data is correct by design.

---

### PIPE Tab
- **Pipeline deals:** LIVE — reads from Office Pipeline Google Sheet via service account. Address, status, price, town, notes all live.
- **Westhampton spelling:** CORRECTED Sprint 33 — B24 now reads "Westhampton."
- **Status:** LIVE AND CLEAN.

---

### FUTURE Tab
- **Agent volume + GCI (2026–2031):** LIVE — reads from Growth Model v2 VOLUME tab via service account.
- **Fallback values:** `$4,570,000` closed 2026 and `$13,620,000` active 2026 are hardcoded fallbacks used when the sheet returns zero or is unavailable. These are documented in the code and reflect the last known verified values.
- **Agent table (9 agents):** Falls back to hardcoded ROSTER data when live sheet returns no rows. All 9 agents with correct projected GCI per directive.
- **Zoila Ortega Astor $60K:** Labeled "salary from Ilija — not production GCI" in both the UI footnote and ROSTER tab Q8.
- **Status:** LIVE. Fallbacks are documented and intentional.

---

### William Morning Brief (8 AM)
- **Scorecard line:** LIVE — reads `readGrowthModelVolume()` from Growth Model v2. Format: `Team Closed: $X.XXM · Gap to $55M: $YY.YYM.`
- **Pipeline prepend:** LIVE — reads `readPipelineDeals()` from Office Pipeline sheet. Top 3 deals by status priority. Format: `{address}, {town} — {status}.`
- **Cronkite brief:** LIVE — Perplexity API call with Hamptons market prompt.
- **Status:** LIVE AND CLEAN.

### William Evening Brief (8 PM)
- **Pipeline prepend:** LIVE — wired Sprint 34. Same 3-deal format as morning. No scorecard.
- **Cronkite brief:** LIVE — same Perplexity call.
- **Status:** LIVE AND CLEAN. (Was not wired before Sprint 34.)

---

### Flagship Letter PDF (EXPORTS)
- **Content:** Static text in `generateFlagshipLetter()` — correct by design. All 8 council-approved edits incorporated Sprint 32.
- **Status:** VERIFIED CLEAN.

### Founding Letter PDF (EXPORTS)
- **Content:** Static text in `foundingParas` array — correct by design. Matches verified final.
- **Status:** VERIFIED CLEAN.

---

## Actionable Items

| Priority | Item | Location | Fix |
|---|---|---|---|
| HIGH | MARKET tab mortgage corridor card shows hardcoded 6.38% | `MarketTab.tsx` line 394 | Wire to `trpc.market.data.useQuery()` mortgage field — same value the nav bar ticker already reads live |
| LOW | FUTURE tab fallback values | `FutureTab.tsx` lines 99–107 | Update fallback numbers after each Growth Model verification cycle |

---

## Not Hardcoded (Confirmed Live)

- All 11 hamlet CIS scores and median prices in the Market Matrix
- All pipeline deal data (address, status, price, town, notes)
- All agent volume and GCI projections in the FUTURE tab
- The 30Y mortgage rate in the nav bar ticker
- The Growth Model scorecard line in the morning brief
- The Cronkite market brief (Perplexity API)
- All Google Maps functionality

---

*Audit conducted April 8, 2026 · Christie's East Hampton Intelligence Platform · Sprint 34*
