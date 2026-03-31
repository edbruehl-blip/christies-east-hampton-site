# Christie's East Hampton Dashboard — TODO

## Completed
- [x] 7-tab dashboard architecture (HOME, MARKET, MAPS, IDEAS, PIPE, FUTURE, INTEL)
- [x] CIREG logo (white, brightness filter) in nav header
- [x] James Christie portrait (Gainsborough oil, National Portrait Gallery) — gold border
- [x] Founding letter above the fold on HOME tab (two-column layout)
- [x] LISTEN · FOUNDING LETTER button wired to ElevenLabs TTS (Voice ID fjnwTZkKtQOJaYzGLa6n, eleven_multilingual_v2)
- [x] Dedicated Express route /api/tts/founding-letter (bypasses tRPC timeout)
- [x] DOWNLOAD MARKET REPORT button — client-side jsPDF (5-page export, no server dependency)
- [x] Made with Manus badge suppressed via CSS
- [x] Market ticker server-side proxy /api/market-data (bypasses Yahoo Finance CORS)
- [x] All 6 financial feeds live: S&P 500, Gold, Silver, VIX, 30Y Treasury, Bitcoin
- [x] 30Y Fixed Mortgage updated to 6.38% (Freddie Mac weekly average)
- [x] Last Updated timestamp added to primary data strip
- [x] Failed feeds hidden (null → no render) instead of showing dashes
- [x] Site published to christies-dash-acqj9wc4.manus.space

## Pending
- [ ] Custom domain activation: christiesrealestategroupeh.com (DNS CNAME set, awaiting Manus Settings → Domains panel)
- [ ] PIPE tab wired to Google Sheet (scaffold complete, awaiting sheet tab inventory)
- [ ] Consider upgrading TTS model to eleven_v3 for more expressive delivery
- [x] Remove Made with Manus badge completely (all pages, desktop + mobile) — confirmed zero badge elements in DOM; CSS suppression already working
- [x] Clean up FUTURE tab GCI chart (spacing, alignment, professional finish) — taller bars, proper Y-axis gridlines, legend, agent count labels
- [ ] Confirm both domains added: christiesrealestategroupeh.com + www.christiesrealestategroupeh.com
- [x] Checkpoint and publish for Angel review — version 49ef300f

## Final Compiled Directive — March 30, 2026

- [ ] Publish Manus build and add both domains (christiesrealestategroupeh.com + www)
- [ ] Confirm Netlify backup URL preserved before DNS cutover
- [x] Remove all Manus vendor attribution from public-facing surfaces — ManusDialog login text neutralized; CSS suppression confirmed; debug collector is dev-only
- [x] Rebuild MARKET donut/ring around nine hamlets only — nine-hamlet volume-share SVG donut, tier-colored segments, labeled, no macro data
- [x] Re-art-direct PDF Market Report — page 1 mirrors website hero, page 2 two-column ticker+table, pages 3–4 hamlet card grid with tier badges and ANEW bars
- [ ] Post-Angel: PIPE persistence (database)
- [ ] Post-Angel: INTEL operational calendar (podcast + event sheets)
- [ ] Post-Angel: favicon / public brand hygiene (Christie's mark)
- [ ] Post-Angel: PDF parity with website
- [ ] Post-Angel: FUTURE refinement
- [ ] Post-Angel: MAPS / MARKET visual refinement

## Final Compiled Directive v2 — March 30, 2026

- [x] FUTURE tab: add 2026 scorecard (52 podcasts, 12 collector events, 12 agents, 12 raving fans) + tighten spacing
- [x] Confirm all vendor attribution removed (desktop, mobile, staging, PDF) — zero visible Manus text in DOM or PDF output
- [ ] Confirm hamlet donut live (nine segments, labeled, volume share %)
- [ ] Publish build and add both domains: christiesrealestategroupeh.com + www
- [ ] Return: HOME screenshot on live domain + FUTURE screenshot
