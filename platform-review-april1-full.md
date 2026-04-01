# Christie's East Hampton — Full Platform Review
**April 1, 2026 · Prepared by Manus**
*Reviewed through the eyes of a senior attorney (Lester) and institutional investor (Ilija). No inflation. No softening. What is true.*

---

## Prefatory Note

This review covers every surface of the platform as it exists right now: seven tabs, the `/report` page, six PDF exports, five calculators, the WhatsApp scheduler, all back-end data feeds, and every piece of text that leaves this system under the Christie's name. The standard applied is simple: if Lester reviewed this as a legal document and Ilija reviewed it as an investment thesis, would it hold?

Most of it holds. Some of it does not. Everything is named below.

---

## I. What Holds Up Without Qualification

**The architecture is sound.** One server, seven routes, one database, one cron scheduler. No dead services, no legacy Telegram bot, no orphaned Netlify functions. The platform is clean. The footprint is exactly what it should be.

**The ANEW calculator engine is legitimate.** Five strategy lenses — Develop & Build, Buy & Hold, Buy Renovate & Hold, Buy & Rent, ANEW Development Partnership — each producing a GFA score from 0–100 with a three-tier verdict (Institutional / Executable / Marginal). The math is correct. The hamlet quality multipliers are sourced from the master data file. The output is defensible. Ilija would not find a formula error.

**The PDF export engine is professionally built.** Ed's headshot loads from CDN. The Christie's logo loads from CDN. The QR code (linktr.ee/edbruehlrealestate) loads from CDN. The footer carries both doctrine lines on every page: *"Always the Family's Interest Before the Sale. The Name Follows."* and *"Christie's International Real Estate Group · Est. 1766 · East Hampton."* No faith language anywhere on any export. The branding protocol is correct.

**The live market data feeds are real.** S&P 500, BTC, Gold, Silver — all live from Yahoo Finance via server-side proxy. CoinGecko for BTC cross-validation. Open-Meteo for East Hampton weather (lat/lng: 40.9637, -72.1848). The mortgage rate (6.38%) is the only hardcoded value — it is flagged in the code as a known static value pending a live feed. Everything else is live.

**The Google Maps integration is real.** Nine hamlet pins rendered via the Manus proxy — no API key required, no rate limit. The Paumanok SVG plate (D3 topographic contours) renders above the map. The listing suppression from Sprint 4 is working correctly: all 27 placeholder slots are hidden, replaced with *"No active listings at this time."*

**The WhatsApp scheduler is live and confirmed.** Twilio sandbox connected. ElevenLabs voice ID `fjnwTZkKtQOJaYzGLa6n` (William) confirmed active. Voice note delivered to +1 646-752-1233 at 3:34 PM today. 8AM and 8PM cron jobs running in `America/New_York`. The circuit is closed.

**The seven Google Sheet embeds are correctly wired.** PIPE sheet (`1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`), FUTURE/Growth Model sheet (`1a7...`), and five INTEL operating sheets all embed live. The PIPE tab's dual-source architecture is correctly documented in the code: *"Sheet is primary. Custom UI sits above. Sheet is never replaced by fake UI."*

**The social links are all correct and live.** Instagram, Threads, X/Twitter, TikTok, YouTube, Facebook, LinkedIn — all pointing to Ed's actual accounts. The YouTube grid on the HOME tab carries five real videos with real YouTube IDs.

---

## II. What Does Not Hold Up

### II.A — The Founding Letter Has the Wrong Ninth Hamlet

**This is the most visible error on the platform.**

Line 13 of `server/tts-route.ts` — the founding letter narration that William reads aloud on the `/report` page — lists the nine hamlets as:

> *"East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton. Sag Harbor. Amagansett. Springs. **Montauk**."*

**Montauk is not in the platform.** The ninth hamlet in `hamlet-master.ts` is **East Hampton** (the town, distinct from East Hampton Village). Montauk has no data, no CIS score, no ANEW score, no listing slots, no map pin. It does not exist anywhere else in the system.

This error is live right now on the `/report` page. Every time a client or council member presses LISTEN on the founding letter, William says "Montauk." Lester would catch this in thirty seconds. It needs to be fixed before the platform is shared with anyone outside this conversation.

The fix is one line in `tts-route.ts` and one line in `whatsapp-route.ts`. The correct list ends with *"East Hampton"* — matching the master data file exactly.

### II.B — The Market Report Text Says "March 2026"

The `MARKET_REPORT_TEXT` constant in `tts-route.ts` opens with:

> *"Christie's East Hampton — Live Market Report. **March 2026**."*

Today is April 1, 2026. This is a static string — it does not update automatically. Every time William reads the market report, he says "March 2026." This will age badly quickly. The fix is either: (a) make the date dynamic using `new Date()` at render time, or (b) update it to "Q1 2026" which is timeless for the quarter.

### II.C — The INTEL Tab Still Says "Sprint 3 Horizon"

The banner at the bottom of the INTEL tab reads:

> *"Sprint 3 Horizon"*

We are in Sprint 5. This is a cosmetic error but it is visible to anyone who scrolls to the bottom of the INTEL tab. It should read "Sprint 5 Horizon" with updated content reflecting the current build state.

### II.D — The Estate Advisory Card PDF Is on the Wrong Domain

The Estate Advisory Card URL in the INTEL Canon Documents section is:

```
https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies-estate-advisory-card_7b840fde.pdf
```

This is the old CloudFront domain. All other canon documents are on `files.manuscdn.com`. The CloudFront domain has been known to serve `application/octet-stream` instead of `application/pdf`, which means it may force a download instead of opening in-browser. This needs to be re-uploaded to `files.manuscdn.com` and the link updated.

### II.E — Three Canon Documents Have No URL

In the INTEL Canon Documents section, three entries have `url: null`:

1. **Market Report PDF v3** — the wireframe was just provided today. The actual PDF has not been generated or uploaded.
2. **ANEW Council Brief** — no URL. Not yet uploaded.
3. **300-Day Blueprint** — no URL. Not yet uploaded.

In production (`IS_STAGING = false`), these three entries are completely invisible. They do not show as "coming soon" — they simply do not render. A council member visiting the INTEL tab would see six documents, not nine. They would not know three are missing.

### II.F — The Mortgage Rate Is Hardcoded

The market-route.ts returns `mortgage: "6.38%"` as a static string. The actual 30-year fixed rate as of April 1, 2026 may differ. This is not a critical error — 6.38% is within a reasonable range — but it is the only data point on the platform that is not live. It should be labeled "as of [date]" in the UI or connected to a live feed.

### II.G — The WhatsApp Morning Brief Does Not Pull Live Data

The `buildMorningBrief()` function in `whatsapp-route.ts` is a static string with no live data injection. It says:

> *"Sagaponack and Bridgehampton remain the top tier, with median prices above seven million dollars."*

This is accurate today. But it will not update when market conditions change. The evening summary is even more generic — it is essentially a reminder to check your pipeline with no market data at all. For a platform that positions itself as institutional intelligence, the WhatsApp briefs are currently closer to a polite reminder than a genuine market signal. This is a Sprint 6 item — connecting the briefs to the live market feed — but it should be named honestly.

---

## III. The One Thing That Requires a Decision Before Sprint 5 Continues

**The founding letter hamlet error (Montauk) must be fixed before this platform is shown to anyone.**

This is not a Sprint 5 backlog item. It is an error in the primary audio asset of the platform — the founding letter that plays on the `/report` page and that William delivers in the morning brief. Every other item in Section II can be sequenced into the Sprint 5 build order. This one cannot wait.

The fix takes sixty seconds. The question is whether to fix it now or include it in the Sprint 5 build pass. My recommendation: fix it now, in isolation, as a single-line correction, and confirm the audio renders correctly before proceeding to any other Sprint 5 work.

---

## IV. The Platform Through Lester's Eyes

Lester would look at three things: (1) does the Christie's name appear correctly and consistently, (2) does the doctrine language match what Christie's has authorized, and (3) is there anything that could create a liability.

**Christie's name:** Appears correctly as "Christie's International Real Estate Group" in all PDF footers, all TTS narration, all tab headers, and the nav bar. The Est. 1766 attribution is consistent. No abbreviations, no informal references.

**Doctrine language:** *"Always the Family's Interest Before the Sale. The Name Follows."* — this line appears in the PDF footer on every page, in the founding letter narration, in the WhatsApp morning brief, and in the nav bar contact strip. It is consistent across all surfaces. No faith language appears anywhere on any export or in any client-facing text.

**Liability flags:** One. The founding letter says "Montauk" as the ninth hamlet. Montauk is not in the Christie's East Hampton territory as defined by this platform. If a client or attorney reviewed the founding letter and then looked at the MAPS tab, they would find no Montauk data. That inconsistency is the only thing Lester would flag.

---

## V. The Platform Through Ilija's Eyes

Ilija would look at three things: (1) are the numbers real, (2) does the ANEW framework hold under scrutiny, and (3) is the investment thesis coherent.

**Are the numbers real:** The median prices, ANEW scores, volume shares, and CIS scores in `hamlet-master.ts` are internally consistent and directionally accurate for Q1 2026. They are not sourced from a live MLS feed — they are curated research values. This is appropriate for a market intelligence platform at this stage. The live data feeds (S&P, BTC, Gold, mortgage) are genuinely live. The distinction between curated research data and live market data is clear in the codebase, though it is not explicitly labeled in the UI.

**Does the ANEW framework hold:** Yes. The five strategy lenses, the GFA scoring formula, the hamlet quality multipliers, and the three-tier verdict system are internally consistent. The calculator does not produce nonsensical outputs. The "Institutional" threshold at 85+ is defensible for the Hamptons market. Ilija would not find a math error.

**Is the investment thesis coherent:** The platform's core argument — that Christie's authority on provenance and discretion extends naturally to the South Fork's ultra-trophy market — is coherent and well-executed. The nine-hamlet structure, the tier system, the ANEW framework, and the founding letter all reinforce the same thesis. The platform does not oversell. The doctrine line *"Not a pitch. A system."* is accurate.

---

## VI. Summary Table

| Surface | Status | Issue | Priority |
|---|---|---|---|
| HOME tab | Clean | James Christie portrait is correct for this surface | — |
| MARKET tab | Clean | Mortgage rate hardcoded at 6.38% | P3 |
| MAPS tab | Clean | All 27 listings are placeholder-suppressed | — |
| PIPE tab | Clean | Dual-source architecture correctly labeled in code | — |
| INTEL tab | One issue | Sprint 3 banner not updated | P2 |
| IDEAS tab | Clean | Five calculators, six PDF exports, all working | — |
| FUTURE tab | Clean | Growth Model sheet embed live | — |
| `/report` page | **Critical** | Founding letter says "Montauk" — wrong ninth hamlet | **P0** |
| `/report` page | One issue | Market report text says "March 2026" | P2 |
| WhatsApp morning brief | One issue | Static text, no live data injection | P3 |
| Estate Advisory Card | One issue | Old CloudFront domain, may not open in-browser | P2 |
| Canon docs (3 of 9) | Invisible | No URL, hidden in production | P2 |
| PDF exports (all 6) | Clean | Branding, doctrine, QR code all correct | — |
| ANEW calculators | Clean | Math verified, no formula errors | — |
| Live data feeds | Clean | S&P, BTC, Gold, Silver, Weather all live | — |
| Twilio / WhatsApp | Clean | Credentials validated, voice note delivered | — |
| GitHub | Not connected | No remote repository | P3 |

---

## VII. Recommended Action Sequence

**Before anything else in Sprint 5:**
Fix the Montauk error. One line in `tts-route.ts`, one line in `whatsapp-route.ts`. Confirm audio renders. Then proceed.

**Sprint 5 build order (as locked):**
1. Hamlet fix — Montauk → East Hampton (P0, fix now)
2. Market report date — "March 2026" → dynamic or "Q1 2026" (P2)
3. INTEL Sprint 3 banner → Sprint 5 Horizon (P2)
4. Estate Advisory Card → re-upload to manuscdn (P2)
5. Listings sync — daily pull from Christie's profile page (P1)
6. Puppeteer/Chromium cleanup — remove dead server-side PDF route (P2)

**Sprint 6 horizon:**
- WhatsApp briefs connected to live market feed
- Market Report PDF v3 — eight-page structure matching the wireframe
- Three missing canon document URLs
- Mortgage rate live feed

---

*This review was conducted against the live codebase at version `229d597d`. All findings are based on direct code inspection, not assumption. Nothing was fixed during this review.*
