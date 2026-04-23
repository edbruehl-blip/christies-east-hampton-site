/**
 * founding-letter.ts — Single source of truth for the Christie's East Hampton founding letter.
 *
 * Neighborhood Letter v15 — council-locked April 21 2026
 * Renders unsigned. No "Ed Bruehl," no "Managing Director" in the letter body.
 *
 * Import sites:
 *   - client/src/pages/tabs/HomeTab.tsx (Section A hero letter)
 *   - client/src/pages/ReportPage.tsx (Section 1 institutional opening)
 *   - server/tts-route.ts (William TTS — FLAGSHIP WhatsApp keyword)
 *
 * Edit this file to update all three surfaces simultaneously.
 */

export const FOUNDING_PARAGRAPHS: string[] = [
  "Many of you have known me for years. Some remember when I left Morgan Stanley after 9/11 and moved to the East End to raise a family. We came for the land, the water, and the pace. We stayed because this place became home.",
  "For twenty years, I've been helping families buy and sell — but mostly steward — property here. The lesson, over and over, is simple. The families who love this place most are the ones who protect it first. Real estate on the East End is not inventory. For our families, it is legacy. The asset your grandchildren will thank you for.",
  "My favorite piece of advice, after all these years: never sell Hamptons real estate. Hold it. Improve it. Structure it. Pass it down. Let it compound across generations. If the timing is truly right to sell, we prepare it properly, market it professionally, and price it to win or continue holding.",
  "I underwrite property the way I once analyzed portfolios on Wall Street. Replacement cost, comparable performance, exit scenarios. Most agents price on emotion. We help families understand value first, and sell only when it is the best long-term strategy.",
  "That instinct led me to Christie's. James Christie, in 1766, held his first sale in London on one idea — and it became the standard that has carried his name forward ever since. Help people understand the true value of what they own before deciding what to do with it. He did not build an auction house. He built a way of handling objects, and families, and homes that has carried over 250 years.",
  "I am grateful to be chosen as Managing Director of Christie's International Real Estate Group, East Hampton Flagship, at 26 Park Place. From here, three worlds converge. Christie's London heritage. Our Rockefeller Center NYC auction house. And the Hamptons, one of the most significant luxury markets on earth. Across 1,000 offices in 52 countries, the rule is simple. Service first. Your interests first. Always.",
  "What the Standard brings begins where most real estate conversations end. Art appraisals. Art-secured lending. Estate continuity across generations. Specialists in fine art, jewelry, watches, wine, and automobiles join your team. When you sell, your property reaches collectors. When you buy, our global network brings new product home. But mostly, the work is stewardship.",
  "Christie's auction house events are more accessible than most people realize. NYC auctions, private sales, and collector evenings come right to your inbox when you join our list. And right here in East Hampton, we host our own. Each week we record the Hamptons Real Estate Podcast, featuring the people shaping this community. Each month we gather to spotlight local artists and mentors whose work deserves a larger stage.",
  "I am honored to carry the Christie's Standard forward here, with energy and care — intelligent, compassionate, patient counsel for the families of the East End who prefer to be understood before they're advised. The flagship is awakening.",
  "We look forward to seeing you soon. Stop by 26 Park Place — next to John Papas — for coffee or a conversation. The door is always open.",
];

/**
 * Flat string version for TTS / plain-text contexts.
 * Paragraphs joined with double newline.
 */
export const FOUNDING_LETTER_TEXT: string = FOUNDING_PARAGRAPHS.join('\n\n');
