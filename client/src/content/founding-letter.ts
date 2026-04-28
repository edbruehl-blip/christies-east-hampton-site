/**
 * founding-letter.ts — Single source of truth for the Christie's East Hampton founding letter.
 *
 * HOME · Auction-Mag Cover Letter · Canonical · v2
 * Council-locked April 26 2026. Hotfix 41 applied Apr 26 2026 night.
 * Voice Canon applied: zero em-dashes, zero connective hyphens.
 * "Door is always open" removed per Ed's ruling (Apr 26 2026).
 * Sign-off: Ed Bruehl / Managing Director / Christie's International Real Estate Group / East Hampton Flagship
 * No date stamp in sign-off per Hotfix 41 canon lock (sign-offs carry no date).
 * "260 years" → "over 250 years" per Doctrine 13 (Hotfix 41).
 *
 * Import sites:
 *   - client/src/pages/tabs/HomeTab.tsx (Section A hero letter)
 *   - client/src/pages/ReportPage.tsx (Section 1 institutional opening)
 *   - server/tts-route.ts (William TTS — FLAGSHIP WhatsApp keyword)
 *
 * Edit this file to update all three surfaces simultaneously.
 */

export const FOUNDING_PARAGRAPHS: string[] = [
  "Greetings,",
  "Many of you have known me for years. Some remember when I left Morgan Stanley after 9/11 and moved to the East End to raise a family. We came for the land, water, light, pace. We stayed because this place became home.",
  "For twenty years, I've helped families buy, sell, and steward property here. The most important lesson hasn't changed: often, the best advice is don't sell. Hamptons real estate isn't inventory. It's legacy. The asset your grandchildren will thank you for. Hold it. Improve it. Structure it. Let it compound across generations.",
  "That's why Christie's made sense. In 1766, James Christie held his first sale in London on one principle: help people understand the true value of what they own before deciding what to do with it. That's how I've always operated. Do what's right. Think long term. No exceptions.",
  "I am honored to be Managing Director of Christie's International Real Estate Group, East Hampton Flagship, at 26 Park Place. This flagship sits at the intersection of three worlds: Christie's London heritage, our New York auction house, and the Hamptons, one of the most significant luxury markets on earth. Spanning nearly 50 countries and territories, the team we're assembling is built on one standard: service first, your interests first, always.",
  "If you or someone you know is ready to operate at this level, we welcome the conversation.",
  "Christie's auction specialists in fine art, jewelry, watches, wine, and automobiles are part of your team. Art appraisals, art-secured lending, and estate continuity across generations come with the service. Your property doesn't just reach buyers. It reaches collectors.",
  "Each week we record \"Your Hamptons Real Estate Podcast,\" featuring the people shaping this community. Each month we gather to spotlight local artists and mentors whose work deserves a larger stage. Join our list and follow along. Christie's auction previews, quarterly calendars, and private collection events come direct.",
  "The flagship is awakening.",
  "We look forward to you swinging by for a cup of coffee or a Yerba Madre. Whether you're buying, selling, or simply interested in the Hamptons, introduce yourself or bring someone you think would make a great mentor or future podcast guest.",
  "Faithfully forward,",
  "Ed Bruehl",
  "Managing Director · Christie's International Real Estate Group · East Hampton Flagship",
];

/**
 * Flat string version for TTS / plain-text contexts.
 * Paragraphs joined with double newline.
 */
export const FOUNDING_LETTER_TEXT: string = FOUNDING_PARAGRAPHS.join('\n\n');
