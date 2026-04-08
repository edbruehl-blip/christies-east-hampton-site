/**
 * CDN Asset Registry — Christie's East Hampton Dashboard
 * Design System: Navy #1B2A4A · Gold #C8AC78 · Charcoal #384249 · Cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Barlow Condensed (data/UI)
 *
 * ALL image references in the codebase must come from this file.
 * No inline image URLs. No local asset paths.
 *
 * CDN: files.manuscdn.com — serves image/jpeg MIME type (browser-renderable)
 * Previous d2xsxph8kpxj0f.cloudfront.net URLs served application/octet-stream
 * and were rejected by browsers. All URLs replaced with manuscdn.com equivalents.
 *
 * Ed headshot PRIMARY confirmed by Ed: 5A89ABA9 (navy jacket, dark background)
 * — wired into nav bar and all PDF export headers.
 * Backup crop (pasted_file_vnfACK) is on CDN but NOT wired in.
 *
 * Total assets on CDN: 34 (34/34 success, Sprint 3 re-upload)
 */

const CDN = "https://files.manuscdn.com/user_upload_by_module/session_file/115914870";

// ─── James Christie Portraits ───────────────────────────────────────────────
// Classical oil painting by Thomas Gainsborough (c.1778), National Portrait Gallery
// James Christie — founder, Christie's, Est. 1766
// Powdered wig, brown coat, red draped background — face clearly legible
// Uploaded Sprint V1-close: CVWbttyPodJyWigp.jpg — confirmed image/jpeg 200
export const JAMES_CHRISTIE_PORTRAIT_PRIMARY =
  `${CDN}/CVWbttyPodJyWigp.jpg`;   // ← Gainsborough oil portrait — face, tight crop
export const JAMES_CHRISTIE_PORTRAIT_FALLBACK =
  `${CDN}/CVWbttyPodJyWigp.jpg`;   // ← Same confirmed file (saleroom images retired)

// ─── Ed Bruehl Headshots ─────────────────────────────────────────────────────
// PRIMARY (confirmed by Ed): 5A89ABA9 — navy jacket, white shirt, dark background
//   → wired into nav bar and all PDF export headers
// BACKUP: pasted_file_vnfACK — alternate crop, same wardrobe
//   → on CDN, NOT wired in
export const ED_HEADSHOT_PRIMARY =
  'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/ed-headshot-primary_0f6df1af.jpg';   // ← 5A89ABA9 confirmed PRIMARY — permanent webdev CDN (re-uploaded Sprint 24)
export const ED_HEADSHOT_BACKUP =
  `${CDN}/mwkFCPLJUOiqVvyC.jpg`;  // ← pasted_file_vnfACK, not wired

// ─── CIREG Logos ─────────────────────────────────────────────────────────────
// Usage rules:
//   WHITE  → nav bar, dark/navy surfaces, PDF dark headers
//   RED    → brand accent, light cream surfaces
//   BLACK  → PDF exports on cream background, light surfaces
//   C-ICON → favicon, small-format brand mark

// ── Official CIREG Brand PNGs (transparent background — browser-safe) ──────────
// Source: Christie's International Real Estate Group brand CDN
// These are the CANONICAL logo URLs per brand guidelines.
// WHITE PNG → nav bar, dark/navy surfaces (transparent bg, white text)
// BLACK PNG → PDF exports on cream background (transparent bg, black text)
export const LOGO_WHITE =
  `https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png`;  // Official CIREG white lockup
export const LOGO_BLACK =
  `https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png`;  // Official CIREG black lockup

// ── JPG variants on manuscdn.com (white bg — use only where bg matches) ────────
export const LOGO_WHITE_JPG =
  `${CDN}/PThZZiXUXghWnEeT.jpg`;            // White text, white bg — NOT for nav
export const LOGO_WHITE_ALT =
  `${CDN}/EFOavnLBLAvavldg.jpg`;
export const LOGO_WHITE_ON_BLACK =
  `${CDN}/YOwMYzbgJiWGbsWq.jpg`;

export const LOGO_RED =
  `${CDN}/ROeeHKWyKNTqQgTZ.jpg`;              // Brand accent on cream/light
export const LOGO_RED_ALT =
  `${CDN}/lLysXoGnPcHXMeZm.jpg`;

export const LOGO_BLACK_ALT =
  `${CDN}/zJtBLNOLqolMeyNW.jpg`;
export const LOGO_BLACK_WORDMARK =
  `${CDN}/yMZhozOAfqnrLZdg.jpg`;
export const LOGO_BLACK_TEXT =
  `${CDN}/xvstFoOZCNPSAfYX.jpg`;

export const LOGO_C_ICON =
  `${CDN}/VsoahQzCoNIkSauO.jpg`;           // Favicon / small-format mark

// ─── HOME Tab — Auction Gallery 3×3 ─────────────────────────────────────────
// Nine images selected for maximum Christie's brand authority signal.
// Order: institutional first → luxury goods → fine wine

export const GALLERY_IMAGES = [
  {
    id: "building-flags",
    src: `${CDN}/xxnqbHbKnDJGuFwB.jpg`,
    caption: "Christie's — King Street, London",
    category: "institutional",
  },
  {
    id: "room-primary",
    src: `${CDN}/DtTxqkdyvvLrygvu.jpg`,
    caption: "The Grand Saleroom, Christie's",
    category: "institutional",
  },
  {
    id: "room-fallback",
    src: `${CDN}/RTJNoOCaJmYcVUzG.jpg`,
    caption: "The Grand Saleroom — Evening Sale",
    category: "institutional",
  },
  {
    id: "hermes-wall",
    src: `${CDN}/eAJQMsvhfrxtjUtt.jpg`,
    caption: "Hermès — Handbag Auction, Christie's",
    category: "luxury-goods",
  },
  {
    id: "patek-philippe",
    src: `${CDN}/FEYzaQxxqwMzIPvC.jpg`,
    caption: "Patek Philippe Perpetual Calendar Chronograph",
    category: "watches",
  },
  {
    id: "hermes-birkin-red",
    src: `${CDN}/MvBrahkOPVlSsipT.jpg`,
    caption: "Hermès Birkin — Crocodile, Christie's",
    category: "luxury-goods",
  },
  {
    id: "screaming-eagle",
    src: `${CDN}/CnSqjXdhQIjCrfVW.jpg`,
    caption: "Screaming Eagle — Fine Wine, Christie's",
    category: "fine-wine",
  },
  {
    id: "mouton-rothschild",
    src: `${CDN}/hHpbMVHRlCXtKdha.jpg`,
    caption: "Château Mouton Rothschild 1995",
    category: "fine-wine",
  },
  {
    id: "wine-petrus",
    src: `${CDN}/nBluJChkmiDPIpaz.jpg`,
    caption: "Pétrus 2000 — Pomerol, Christie's",
    category: "fine-wine",
  },
] as const;

// ─── Full Auction Lot Library (all 16 images on CDN) ─────────────────────────
// Available for IDEAS tab, INTEL tab, or future gallery expansions.
export const AUCTION_LOT_LIBRARY = {
  // Institutional / Heritage
  buildingFlags:           `${CDN}/xxnqbHbKnDJGuFwB.jpg`,
  roomPrimary:             `${CDN}/DtTxqkdyvvLrygvu.jpg`,
  roomFallback:            `${CDN}/RTJNoOCaJmYcVUzG.jpg`,
  auctionRoomIllustration: `${CDN}/PvzuUCeMdcVZXLsR.jpg`,
  exteriorIllustration:    `${CDN}/wMRKMQYRitwrdEuU.jpg`,
  // Luxury Goods
  hermesWall:              `${CDN}/eAJQMsvhfrxtjUtt.jpg`,
  hermesBirkinRed:         `${CDN}/MvBrahkOPVlSsipT.jpg`,
  hermesAuctionWallText:   `${CDN}/RuVZippdjdTEEYYi.jpg`,
  hermesOrangeCollection:  `${CDN}/ZEJqskJjrAxwISUL.jpg`,
  hermesKellyDoll:         `${CDN}/xlrPXkeSxTJIvgDs.jpg`,
  hermesBirkinStudio:      `${CDN}/ZXmJuXXDMZLzlAPh.jpg`,
  // Watches
  patekPhilippe:           `${CDN}/FEYzaQxxqwMzIPvC.jpg`,
  // Fine Wine
  screamingEagle:          `${CDN}/CnSqjXdhQIjCrfVW.jpg`,
  moutonRothschild:        `${CDN}/hHpbMVHRlCXtKdha.jpg`,
  wineChateauRayas:        `${CDN}/pwfaPIhZeqsmkPyy.jpg`,
  winePetrus2000:          `${CDN}/nBluJChkmiDPIpaz.jpg`,
  wineCellarRacks:         `${CDN}/kVaXZcJRyJjmZGOk.jpg`,
  wineStoneVault:          `${CDN}/pjRdgyhLjxgRDzok.jpg`,
  wineChadwickPolo:        `${CDN}/CcVAmnXNjCxkPxpg.jpg`,
  // Other
  guitarsChristies:        `${CDN}/XXbGPykZEtGeduDk.jpg`,
} as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type GalleryImage = (typeof GALLERY_IMAGES)[number];
export type AuctionLotKey = keyof typeof AUCTION_LOT_LIBRARY;
