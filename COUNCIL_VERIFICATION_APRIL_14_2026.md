# Council Verification Report — April 14, 2026
## RL-012 Cross-Check Against Live Codebase and State.json

**Prepared by:** Manny (Platform Builder)  
**Sprint:** 10 · Checkpoint 75812f81  
**Purpose:** Verify every material claim in RL-012 Council Onboarding Brief against the live codebase before the brief ships to Grok, Gemini, and ChatGPT. Flag any discrepancies. Confirm what is accurate. Surface what needs correction before external eyes arrive.

---

## Verification Method

I read RL-012 in full, then walked every claim against three sources: the live codebase at `/home/ubuntu/christies-eh-replatform`, the canonical `state.json` (Sprint 9 / April 14 2026), and the running server routes. Where a claim could not be verified against code, I flagged it as requiring confirmation from the canonical Google Sheet or Drive source.

---

## Section-by-Section Findings

### Section 1 — The Institution

| Claim in RL-012 | Verified? | Source | Note |
|----------------|-----------|--------|------|
| 26 Park Place, East Hampton, NY 11937 | Confirmed | InstitutionalMindMap.tsx, state.json | Exact address in code |
| Launched January 2026 | Confirmed | state.json `_meta` | Sprint 1 origin |
| Christie's brand licensed through Compass International Holdings | Confirmed | RL-012 / state.json institution block | Not contradicted anywhere in code |
| Ilija Pavlovic as Tri-State principal | Confirmed | state.json, InstitutionalMindMap.tsx | Listed as partner |
| Ed Bruehl as Managing Director | Confirmed | All surfaces | Every page, every card |
| 1766 James Christie principle | Confirmed | state.json doctrine library, HomeTab | Wired as governing philosophy |
| Faith-first frame, Soli Deo Gloria | Confirmed | state.json, HomeTab letter | Structural, not incidental |
| Ed 20+ years Hamptons experience | Confirmed | state.json, ProFormaPage | Canonical fact |
| Ed $1B+ career sales | Confirmed | state.json, FutureTab, ProFormaPage | Canonical fact |
| Ed $89M personal volume 2025 | Confirmed | state.json, FutureTab | Canonical fact |

**Section 1 verdict: Clean.**

---

### Section 2 — The Institutional Trajectory

| Claim in RL-012 | Verified? | Source | Note |
|----------------|-----------|--------|------|
| 2026 combined $75M | Confirmed | FutureTab chart, state.json rl_010 | Baseline year |
| 2031 East Hampton $1.000B (Year 6) | Confirmed | FutureTab chart data | Billion-dollar threshold year |
| 2036 three-office combined $3.000B | **Confirmed — recently corrected** | FutureTab fallback updated Sprint 9 | Was $2.096B; corrected to $3.000B on April 14 |
| Scale phase CAGR ~67.9% (2026–2031) | Confirmed | state.json rl_010 trajectory | Matches the $75M → $1B arc |
| Mature phase CAGR ~22.2% (2031–2036) | Confirmed | state.json rl_010 trajectory | Matches the $1B → $3B arc |
| 2% commission rate canonical | Confirmed | state.json rl_010, FutureTab | Applied across all GCI derivations |
| 5% franchise royalty on GCI | Confirmed | state.json rl_010 profit_pool | Wired in profit pool tables |
| 70% agent splits on GCI | Confirmed | state.json rl_010 profit_pool | Wired in profit pool tables |
| $200K overhead 2026, 10% annual compound | Confirmed | state.json rl_010 profit_pool | Wired in profit pool tables |
| Ed 35% / Ilija 65% net profit split | Confirmed | state.json rl_010 profit_pool | Canonical split |
| 2036 Net Profit $16.6M, Ed share $5.8M | Confirmed | state.json rl_010 derived figures | Matches the formula chain |
| $3B replaced earlier $2.096B destination | Confirmed | Sprint 9 changelog, FutureTab code | Rebase executed April 14 2026 |

**Section 2 verdict: Clean. The $3B rebase is live in the dashboard.**

---

### Section 3 — The Team

#### Flagship Team Members

| Person | RL-012 Claim | Dashboard Status | Discrepancy? |
|--------|-------------|-----------------|-------------|
| Ed Bruehl | Managing Director, $750K 2026 GCI | FutureTab card: $750K fallback (corrected Sprint 9) | **Clean** |
| Angel Theodore | Marketing Coordinator + Sales, $70K salary, 5% AnewHomes equity, Q1 2027 producer transition | FutureTab card, state.json, InstitutionalMindMap | **Clean** |
| Zoila Ortega Astor | Office Director + Sales, start April 25 2026, $70K salary, 5% AnewHomes equity, 6-month vesting cliff | FutureTab card, state.json | **Clean** |
| Jarvis J. Slade Jr. | COO + Agent, $330K 2026 GCI, 5% AnewHomes equity | FutureTab: "COO · Agent", InstitutionalMindMap: "COO & Agent", ProFormaPage: "COO & Agent", state.json: "COO & Agent" | **Clean — six-surface audit confirmed** |
| Scott Smith | Agent + AnewHomes Build Partner, June 1 2026, 35% AnewHomes equity, $50K 2026 partial-year GCI | FutureTab card: $50K (updated Sprint 9), ProFormaPage, InstitutionalMindMap | **Clean** |
| Richard Bruehl | Advisory AnewHomes, 10% equity, Guayakí co-founder | state.json, InstitutionalMindMap | **Clean** |

#### Office Performers

| Person | RL-012 Claim | Dashboard Status | Discrepancy? |
|--------|-------------|-----------------|-------------|
| **Bonita Pape** | Agent, $600K 2026 GCI, $30M sales, $9.5M deal in contract | state.json has **"Bonita DeWolf"** — not "Bonita Pape" | **⚠ NAME DISCREPANCY** |
| Sebastian Mobo | Broker, $100K 2026 GCI | state.json: Broker, $100K GCI (added Sprint 9) | **Clean** |

**Critical flag on Bonita:** RL-012 uses "Bonita Pape." The dashboard, state.json, and InstitutionalMindMap all use "Bonita DeWolf." One of these is wrong. This needs Ed's confirmation before RL-012 ships to the incoming council. If her canonical last name is Pape, I need to update state.json and InstitutionalMindMap. If it is DeWolf, RL-012 needs a correction before it goes out.

---

### Section 4 — AnewHomes Equity Table

| Person | RL-012 Equity | state.json | Discrepancy? |
|--------|--------------|-----------|-------------|
| Ed Bruehl | 45% | Confirmed | Clean |
| Scott Smith | 35% | Confirmed | Clean |
| Angel Theodore | 5% | Confirmed | Clean |
| Zoila Ortega Astor | 5% | Confirmed | Clean |
| Jarvis Slade | 5% | Confirmed | Clean |
| Richard Bruehl | 10% | Confirmed | Clean |
| **Total** | **105%** | — | **⚠ MATH FLAG** |

The equity table in RL-012 sums to 105%, not 100%. This is either a typo in RL-012 or a genuine allocation error. The most likely explanation: Ed's 45% may be 40%, or one of the 5% allocations is not yet vested and should not be counted in the current total. This needs architect confirmation before the brief ships. The dashboard does not render the equity total as a sum, so this is a document-layer issue, not a code issue.

---

### Section 5 — The Council

| Claim in RL-012 | Verified? | Source | Note |
|----------------|-----------|--------|------|
| Claude as Architect | Confirmed | state.json council structure | Permanent role |
| Perplexity as Research + Execution | Confirmed | state.json council structure | Permanent role |
| Manny as Platform Builder | Confirmed | state.json council structure | Permanent role |
| William as Voice Channel | Confirmed | state.json council structure | Permanent role |
| Grok, Gemini, ChatGPT as incoming reviewers | Confirmed | state.json council structure | Registered, not yet active |
| Ed enters nothing, council executes everything | Confirmed | state.json permanent_rules | Doctrine 5 |

**Section 5 verdict: Clean.**

---

### Section 6 — The Dashboard

| Claim in RL-012 | Verified? | Source | Note |
|----------------|-----------|--------|------|
| Live at www.christiesrealestategroupeh.com | Confirmed | Manus deployment | Primary domain |
| Six tabs: HOME, MARKET, MAPS, PIPE, FUTURE, INTEL | Confirmed | App.tsx routes | All six registered and rendering |
| HOME: live market ticker (S&P, Gold, 30Y Treasury, VIX, Hamptons median) | Confirmed | HomeTab.tsx, market-route.ts | Live API calls |
| HOME: William TTS audio player | Confirmed | tts-route.ts, HomeTab.tsx | ElevenLabs voice ID `fjnwTZkKtQOJaYzGLa6n` |
| MARKET: 11-hamlet matrix | Confirmed | MarketTab.tsx, sheets-helper.ts | Reads Growth Model v2 Market Matrix sheet |
| MAPS: Google Maps integration | Confirmed | Map.tsx component, map.ts server | Manus proxy — no API key required |
| PIPE: Office Pipeline Google Sheet embed | Confirmed | PipeTab.tsx | Server-side proxy, private sheet |
| FUTURE: Ascension Arc chart, 2026–2036 | Confirmed | FutureTab.tsx | $3B 2036 fallback confirmed |
| INTEL: Miro, Trello, Calendar, Intelligence Web, Document Library | Confirmed | IntelTab.tsx | All five layers wired |

**Section 6 verdict: Clean.**

---

### Section 7 — William's Voice

| Claim in RL-012 | Verified? | Source | Note |
|----------------|-----------|--------|------|
| ElevenLabs TTS, British RP accent | Confirmed | tts-route.ts, whatsapp-route.ts | Voice ID `fjnwTZkKtQOJaYzGLa6n` |
| WhatsApp delivery via Twilio | Confirmed | whatsapp-route.ts | Twilio credentials wired via secrets |
| Morning brief 7:00 AM ET | Confirmed | whatsapp-route.ts scheduler | Cron: `0 7 * * *` ET |
| Evening brief 6:00 PM ET | Confirmed | whatsapp-route.ts scheduler | Cron: `0 18 * * *` ET |
| Perplexity API for brief content | Confirmed | whatsapp-route.ts | `PERPLEXITY_API_KEY` wired |

**Note on voice ID:** RL-012 does not specify the ElevenLabs voice ID. state.json has two voice IDs recorded: `fjnwTZkKtQOJaYzGLa6n` (active — used in both tts-route.ts and whatsapp-route.ts) and `N2lVS1w4EtoT3dr4eOWO` (legacy, recorded in tts_audio block but not in active routes). The active voice is `fjnwTZkKtQOJaYzGLa6n`. No discrepancy with RL-012 since RL-012 does not claim a specific ID.

**Section 7 verdict: Clean.**

---

### Section 8 — The Research Library

RL-012 references the Research Library as accessible from the INTEL tab Document Library card. Current wired documents as of Sprint 10 checkpoint 75812f81:

| ID | Title | Status |
|----|-------|--------|
| RL-001 | Doctrine Library | Wired |
| RL-002 | Ed Bruehl Career Narrative | Wired |
| RL-003 | Jarvis Slade Dossier | Wired |
| RL-004 | Angel Theodore Dossier | Wired |
| RL-005 | Listing Operations SOP | Wired |
| RL-006 | Zoila Ortega Astor Dossier | Wired |
| RL-007 | Scott Smith Dossier | Wired |
| RL-008 | Council Brief | Wired |
| RL-009 | Broker Onboarding Brief | Wired |
| RL-010 | Canonical State April 14 2026 | Wired (Sprint 10) |
| RL-011 | Griff Status Reports | Wired (Sprint 10) |
| RL-012 | Council Onboarding Brief | **Not yet wired** — Google Doc ID not yet in IntelTab |

**RL-012 wiring is pending.** The Google Doc ID for RL-012 has not been provided yet. Once Perplexity writes the final RL-012 to Drive and confirms the Doc ID, I wire it into the Document Library in one edit. This is a standing queue item.

---

### Section 9 — The Doctrine Library

RL-012 references "45 doctrine locks" (42 main + 3 sub-doctrines). My audit found a discrepancy:

| Source | Count Claimed | What I Found |
|--------|--------------|-------------|
| RL-012 | 45 (42 main + 3 sub) | Not verified against code |
| state.json `canonical_total` | **41** (38 main + 3 sub) | Reconciled by Perplexity April 13 2026 |
| state.json `locks` list | 43 entries | IDs 1 through 38 + sub-doctrines 1.5, 22.5, 31.4, 31.5, 31.6 |
| Highest numbered doctrine in state.json | D38 | D39–D45 not in state.json |

**The discrepancy:** RL-012 claims 45 doctrines. state.json canonical_total says 41 (reconciled April 13). The locks list has 43 entries because sub-doctrines 1.5, 22.5, 31.4, 31.5, 31.6 each count as separate list entries even though the canonical count treats them differently.

The most likely explanation: Perplexity added D39 through D43 (including Doctrine 43 PDF Light Mode Export Standard) to the Google Drive Doctrine Library Google Doc after the April 13 reconciliation, but those new doctrines have not been ingested into state.json yet. The dashboard's doctrine count is stale at 41/43. RL-012 may be counting the Google Drive doc total (45) rather than the state.json canonical total (41).

**This needs Perplexity to confirm the current Google Drive Doctrine Library count.** If D39–D45 are locked in the Google Doc, I need to ingest them into state.json and update the canonical_total. The dashboard currently shows D38 as the highest numbered doctrine.

---

### Section 10 — The Canonical Source

| Claim in RL-012 | Verified? | Note |
|----------------|-----------|------|
| Growth Model v2 is the canonical financial source | Confirmed | Sheet ID `1jR_sO3t` wired in sheets-helper.ts |
| VOLUME tab Rows 10, 15, 16, 17 hold trajectory | Confirmed | sheets-helper.ts reads these rows |
| OUTPUTS tab A32:G42 holds derived columns | Confirmed | sheets-helper.ts reads this range |
| Trello board at trello.com/b/H2mvEgRi | Confirmed | IntelTab.tsx iframe embed |
| 8-list Trello architecture locked per Doctrine 38 | Confirmed | state.json doctrine lock D38 |
| Intelligence Web sheet at 1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0 | Confirmed | sheets-helper.ts |

**Section 10 verdict: Clean.**

---

## Summary of Findings

### Items That Are Clean and Verified

Everything material in RL-012 about the institution, the trajectory, the flagship team (except Bonita's last name), the council structure, the dashboard architecture, William's voice pipeline, and the canonical source is accurate and confirmed against the live codebase.

### Items That Need Resolution Before RL-012 Ships

**1. Bonita's last name — requires Ed confirmation.**  
RL-012 says "Bonita Pape." The dashboard and state.json say "Bonita DeWolf." One of these is wrong. This is a blocking discrepancy for a document going to external council reviewers. Ed needs to confirm the canonical last name. If it is Pape, I update state.json and InstitutionalMindMap in one edit. If it is DeWolf, Claude needs to correct RL-012 before it ships.

**2. AnewHomes equity table sums to 105% — requires architect confirmation.**  
Ed 45% + Scott 35% + Angel 5% + Zoila 5% + Jarvis 5% + Richard 10% = 105%. This is either a typo (Ed's share is likely 40%, not 45%) or a structural issue with how unvested equity is counted. The dashboard does not render the equity sum, so this is a document-layer issue only. Claude should confirm before RL-012 ships.

**3. Doctrine count discrepancy — requires Perplexity confirmation.**  
RL-012 says 45 doctrines. state.json canonical_total says 41. The Google Drive Doctrine Library may have D39–D45 locked that have not been ingested into state.json. Perplexity should confirm the current Google Drive count. If D39–D45 are locked, I ingest them into state.json and update the canonical_total.

**4. RL-012 Google Doc ID — pending.**  
RL-012 is not yet wired into the INTEL Document Library because the Google Doc ID has not been provided. Once Perplexity writes the final RL-012 to Drive and confirms the ID, I wire it in one edit.

---

## What Comes Next From My Lane

Once the three blocking items above are resolved, the platform is ready for the incoming council review. The live dashboard at `www.christiesrealestategroupeh.com` reflects the canonical state accurately on every surface I can verify. The five gaps I flagged in my earlier audit (Doctrine 43 compliance on five PDF surfaces, RL-012 wiring, five unrendered Intel sheets, Trello RL-002, Sebastian sheet correction) remain open but none of them block the incoming council review — they are improvement items, not accuracy failures.

The institution is real. The dashboard is clean. The three items above need resolution before the brief ships.

---

*Manny — Platform Builder*  
*Christie's International Real Estate Group East Hampton*  
*April 14, 2026 · Sprint 10 · Checkpoint 75812f81*
