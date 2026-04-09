# Christie's East Hampton — William Audio & Platform Brief
**For: Ed, Jarvis, Angel, Ricky, and the Full Council**
**Date: April 9, 2026**
**Prepared by: Manny**

---

## The Short Version

The platform is live at **christiesrealestategroupeh.com**. Three William audio buttons are wired and working on both the HOME tab and the James Christie page. The council is about to refine the letter scripts. Here is exactly where everything lives, how to update it, and what the site looks like on every device.

---

## The Three William Letters — Where They Live and How to Update Them

All three letter scripts live in a single file on the server:

```
server/tts-route.ts
```

This is the **single source of truth** for everything William reads. When you send Ed a revised script, Ed sends it to Manny, and Manny replaces the text constant in that file. One edit. One deploy. Done.

| Button Label | Constant Name | Line in File | Server Endpoint |
|---|---|---|---|
| James Christie's Letter | `CHRISTIES_LETTER_TEXT` | Line 67 | `GET /api/tts/christies-letter` |
| Flagship Letter | `FLAGSHIP_LETTER_TEXT` | Line 82 | `GET /api/tts/flagship-letter` |
| Market Intelligence Brief | `MARKET_REPORT_TEXT` | Line 24 | `GET /api/tts/market-report` |

There is also a fourth script (`FOUNDING_LETTER`, line 5) that is still registered as an endpoint (`/api/tts/founding-letter`) but **no button on the site points to it**. It is dormant. It can be removed or repurposed in Sprint 43.

---

## Current Script Text — What William Is Reading Right Now

### 1. James Christie's Letter (`CHRISTIES_LETTER_TEXT`)

> Christie's has served the finest families for 260 years. What we bring to East Hampton is not a brokerage. It is an institution that has always believed the finest things deserve the finest representation. The same auction house that has handled Picassos and Monets, Fabergé eggs and dynasty estates, is now the institution behind your real estate conversation on the East End.
>
> The South Fork is not a market. It is a territory — eleven distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.
>
> This platform exists to carry the Christie's standard into every conversation, every deal brief, every family meeting. The same standard that has governed the world's greatest auction house for 260 years now governs every number in this system.
>
> The families of the East End deserve an advisor who reads the full page. When the time comes to understand what you have, how to protect it, and what it might mean to the right buyer — the conversation is already open.
>
> The door is open whenever you are ready to walk through it. With respect and in service — Ed Bruehl. Managing Director. Christie's International Real Estate Group, East Hampton.

**Approximate audio length:** ~90 seconds.

---

### 2. Flagship Letter (`FLAGSHIP_LETTER_TEXT`) — Locked v2

> Christie's Flagship Letter. To Jarvis, Angel, and Ricky — This letter is not a presentation. It is a handoff.
>
> For the past several months, this platform existed in one conversation at a time — Ed and the six AI systems that helped him build it. Today that changes. You are the first people outside that circle, and that matters more to us than anything we are about to describe.
>
> We are not asking you to be impressed. We are asking you to be honest.
>
> THE COUNCIL. My name is Manny. I am the builder on this council... [full council description, how it was built, The Team, The Breakthrough, The Platform]
>
> WILLIAM. William is the voice of this system. When you text NEWS, he answers on demand with the brief you need in that moment. He does not speak on a schedule. He only speaks when you ask him to, and he always tells the truth.
>
> THE MODEL. Not ambition. Arithmetic. And proof. Ed has already done over one billion dollars in career sales across twenty years on this land. Now the model is institutional. 2026 — 55 million. 2027 — 100 million. 2030 — three offices. 2032 to 2033 — one billion dollar run rate. Every stage is gated by proof.
>
> THE HONEST SUMMARY. We built a real estate intelligence platform that thinks like an institution... Tell the truth. Know the territory. Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began.
>
> Ed Bruehl. Managing Director. Christie's International Real Estate Group, East Hampton. Soli Deo Gloria.

**Approximate audio length:** ~4 minutes. This is the longest script. The four council-approved corrections (opening paragraph, William section, final paragraph, AnewHomes) are locked in this version.

---

### 3. Market Intelligence Brief (`MARKET_REPORT_TEXT`)

> Christie's East Hampton — Live Market Report. Q1 2026.
>
> Hamptons Local Intelligence. East Hampton Town... Southampton Town... Sag Harbor...
>
> Market Intelligence. Capital Flow Signal: Strong Inflow. The 30-year fixed mortgage rate is holding at 6.38 percent... The Hamptons Median is 2.34 million dollars...
>
> Hamlet Atlas. Sagaponack. CIS Score: 9.4. Median: 7.5 million dollars... [all 11 hamlets]
>
> Christie's East Hampton. 26 Park Place, East Hampton, New York. 646-752-1233.

**Approximate audio length:** ~3 minutes. **Note:** This script contains Q1 2026 static data. When the council refines this letter, the hamlet medians and rate figures should be updated to match the live MARKET tab data.

---

## The Audio Pipe — Front to Back

The chain is clean and identical on both surfaces:

```
User taps button
  → Frontend fetch('/api/tts/[endpoint]')
  → Server receives GET request
  → Server calls ElevenLabs API (Voice ID: fjnwTZkKtQOJaYzGLa6n — William)
  → ElevenLabs streams MP3 back to server
  → Server streams MP3 to frontend
  → Frontend creates blob URL → new Audio(blobUrl) → plays
  → Controls: −15s · Pause/Resume · +15s · Stop · Share · Scrub bar
```

**Both surfaces use the same engine:**
- HOME tab — SectionA, below Ed's signature (`client/src/pages/tabs/HomeTab.tsx`, lines 47–460)
- James Christie page — Section1 (`client/src/pages/ReportPage.tsx`, lines 151–720)

**No Founding Letter button exists on either surface.** The endpoint is registered but dormant.

---

## Platform Usability — Mobile, Tablet, Desktop

### What works well everywhere

The navigation is fully responsive. On desktop, all six tabs (HOME · MARKET · MAPS · PIPE · FUTURE · INTEL) appear in the top nav bar. On mobile, they collapse into a hamburger menu that drops a clean full-width drawer. The market ticker strips scroll horizontally on small screens. The INTEL spiderweb SVG has `minWidth: 640px` with horizontal scroll on mobile — readable on tablet, tight on phone but functional.

### What to watch on mobile

| Surface | Issue | Severity |
|---|---|---|
| HOME audio buttons | 2-column grid — "Market Intelligence Brief" label wraps to 3 lines on small phones | Low |
| PIPE tab | Deal table has horizontal scroll — works but requires swipe | Low |
| INTEL spiderweb | 1280×1280 SVG — scrollable but dense on phone; best on tablet+ | Medium |
| /report page | Three audio buttons in a 3-column grid — labels truncate on small phones | Low |
| FUTURE tab | GCI projection chart — renders correctly but axis labels compress on phone | Low |

None of these are broken. They are usability refinements for Sprint 43 if the council wants to tighten the mobile experience before Angel and Jarvis start using it regularly.

### What is clean on all devices

The header, ticker strips, contact bar, and tab navigation are all solid. The HOME letter text, the MARKET charts, the MAPS tab with live listings, and the PDF download buttons all work correctly on mobile, tablet, and desktop.

---

## How to Send the Council Refined Scripts

When the council has finished refining the three letters, send the new text to Ed. Ed sends it to Manny in a message like this:

> **James Christie's Letter — revised:**
> [full new script text here]

Manny replaces the constant in `server/tts-route.ts`, saves a checkpoint, and publishes. The audio button on the site immediately reads the new version. No other files need to change. The PDF source (`client/src/lib/pdf-exports.ts`) is a separate document — if the council wants the PDF and the audio to match exactly, Manny updates both in the same sprint.

---

## Open Items Before the Council Sees the Live Site

| Item | Status |
|---|---|
| Flagship Letter PDF screenshot (Visual QA rule) | Open — awaiting Ed screenshot |
| Market Intelligence Brief — update Q1 data to match live MARKET tab | Queued for Sprint 43 |
| HOME audio button label wrapping on small phones | Minor — Sprint 43 |
| Founding Letter endpoint cleanup (dormant, no button) | Sprint 43 |

---

*Prepared by Manny · Christie's East Hampton Intelligence Platform · April 9, 2026*
*Soli Deo Gloria.*
