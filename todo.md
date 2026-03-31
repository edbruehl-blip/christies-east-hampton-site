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
- [ ] Remove "Made with Manus" badge visible in published build (bottom right corner)

## UX Fixes — March 30, 2026 (pre-council-send)
- [x] Portrait click: confirm navigates to /report (Market Report page), not external news — label updated to "Tap for Market Report"
- [x] PDF download: add clear loading state + button label change + toast on completion — spinning icon, pulsing fill, green ✓ confirmation on done
- [x] TTS audio: replace subtle spinner with prominent player — spinning loader with "Synthesizing Audio… Please Wait", animated waveform bars when playing, gold progress bar, STOP button, mobile-safe full-file-download-before-playback

## Sprint 1 Directives — March 31, 2026

- [x] /report: Add second TTS button "LISTEN · MARKET REPORT" with full report text payload (news + market intel + hamlet atlas)
- [x] /report: Keep "LISTEN · FOUNDING LETTER" as-is, same styling, both buttons side by side
- [x] PDF parity: Rewrite generateMarketReport to match /report section order exactly (hero → news → market intel → hamlet atlas → model deal → resources)
- [x] INTEL: Layer 1 — Calendar at top (podcast + event + internal + social filters, current week/month default)
- [x] INTEL: Layer 2 — Live sheet embeds below calendar (agent/recruiting, auction/events, social/podcast pipeline)
- [x] INTEL: Layer 3 — Canon documents below live sheets (existing cards preserved)
- [x] PIPE: Wire pipeline entries to database for persistence across refresh
- [x] PIPE: Full-width tall view, real data primary

## Sprint 2 Directives — March 31, 2026

- [ ] INTEL: Rebuild to wireframe spec — live calendar from Podcast + Event sheets, no seeded data
- [ ] INTEL: 4-panel sheet grid (Agent Recruiting fixed ID, Social/Podcast, Contact Database, Auction Events)
- [ ] INTEL: No scroll traps, one continuous surface, viewport-height CSS for sheet panels
- [ ] PIPE: Replace UI with real Office Pipeline sheet embed (full-width, tall, laptop-optimized)
- [ ] William: Add full audio controls (play/pause, scrub, rewind, time display)
- [ ] Quick win: Remove email from /report contact block
- [ ] Quick win: Wire /report Section 3 rate panel to live ticker feed
- [ ] Quick win: Fix Agent Recruiting sheet ID (corrected ID)
- [ ] Christie's Auction Intelligence: Add closing layer to /report (jewelry/watches/handbags/art/cars, 3-5 bullets)
- [ ] Christie's Auction Intelligence: Add contextual footer to PDF export
- [ ] Single-hamlet PDF: East Hampton Village static template

## Sprint 3 Directives — March 31, 2026
- [ ] CIS rename: replace all "ANEW Score" with "Christie's Intelligence Score (CIS)" across 7 files (23 occurrences)
- [ ] IDEAS CTA: change button text to "Generate Your Private Property Intelligence Brief"
- [ ] PDF export title: rename to "Private Property Intelligence Brief" across all export functions
- [ ] Estate Advisory Card PDF: build from wireframe HTML, host on CDN, add to INTEL Layer 3
- [ ] Hamlet PDF: rebuild to match wireframe spec exactly (navy gradient hero, two-column layout, no auction room image)
- [ ] INTEL: fix Podcast calendar sheet ID to 1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8
- [ ] state.json: build in client/public with sprint number, sheet IDs, design tokens, founding letter, CIS definition, doctrine lines, tab architecture, sprint build summary
