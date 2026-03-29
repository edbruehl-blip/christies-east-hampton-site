/**
 * CDN Asset Registry — Christie's East Hampton Dashboard
 * Design System: Navy #1B2A4A · Gold #C8AC78 · Charcoal #384249 · Cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Barlow Condensed (data/UI)
 *
 * ALL image references in the codebase must come from this file.
 * No inline image URLs. No local asset paths.
 *
 * Ed headshot PRIMARY confirmed by Ed: 5A89ABA9 (navy jacket, dark background)
 * — wired into nav bar and all PDF export headers.
 * Backup crop (pasted_file_vnfACK) is on CDN but NOT wired in.
 *
 * Total assets on CDN: 34 (22 Sprint 2 + 12 Sprint 3)
 * Last updated: Sprint 3 — Ed headshot confirmed, all auction lots uploaded
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz";

// ─── James Christie Portraits ───────────────────────────────────────────────
// Classical oil painting by Thomas Gainsborough, 18th-century attire, powdered wig
// PRIMARY: cleaner crop — wired as HOME hero
// FALLBACK: second crop — kept in reserve
export const JAMES_CHRISTIE_PORTRAIT_PRIMARY =
  `${CDN}/james-christie-portrait-primary_7d03f37e.jpg`;
export const JAMES_CHRISTIE_PORTRAIT_FALLBACK =
  `${CDN}/james-christie-portrait-fallback_b34a2eb4.jpg`;

// ─── Ed Bruehl Headshots ─────────────────────────────────────────────────────
// PRIMARY (confirmed by Ed): 5A89ABA9 — navy jacket, white shirt, dark background
//   → wired into nav bar and all PDF export headers
// BACKUP: pasted_file_vnfACK — alternate crop, same wardrobe
//   → on CDN, NOT wired in
export const ED_HEADSHOT_PRIMARY =
  `${CDN}/ed-headshot-backup_5ca40c61.jpg`;   // ← 5A89ABA9 confirmed PRIMARY
export const ED_HEADSHOT_BACKUP =
  `${CDN}/ed-headshot-primary_6eddf216.jpg`;  // ← pasted_file_vnfACK, not wired

// ─── CIREG Logos ─────────────────────────────────────────────────────────────
// Usage rules:
//   WHITE  → nav bar, dark/navy surfaces, PDF dark headers
//   RED    → brand accent, light cream surfaces
//   BLACK  → PDF exports on cream background, light surfaces
//   C-ICON → favicon, small-format brand mark

export const LOGO_WHITE =
  `${CDN}/logo-white_63e81b59.jpg`;            // Primary: nav bar + dark surfaces
export const LOGO_WHITE_ALT =
  `${CDN}/logo-white-alt_10963de6.jpg`;
export const LOGO_WHITE_ON_BLACK =
  `${CDN}/logo-white-on-black_9afa31a9.jpg`;

export const LOGO_RED =
  `${CDN}/logo-red_61bc5cdd.jpg`;              // Brand accent on cream/light
export const LOGO_RED_ALT =
  `${CDN}/logo-red-alt_d545ce58.jpg`;

export const LOGO_BLACK =
  `${CDN}/logo-black_16119ea4.jpg`;            // PDF exports on cream background
export const LOGO_BLACK_ALT =
  `${CDN}/logo-black-alt_7bde6059.jpg`;
export const LOGO_BLACK_WORDMARK =
  `${CDN}/logo-black-wordmark_fa18bb78.jpg`;
export const LOGO_BLACK_TEXT =
  `${CDN}/logo-black-text_326a469e.jpg`;

export const LOGO_C_ICON =
  `${CDN}/logo-c-icon_8b382415.jpg`;           // Favicon / small-format mark

// ─── HOME Tab — Auction Gallery 3×3 ─────────────────────────────────────────
// Nine images selected for maximum Christie's brand authority signal.
// Order: institutional first → luxury goods → fine wine
// All 16 auction lot images are on CDN; only 9 are wired into the gallery.
// The full set is exported below for future use (IDEAS tab, etc.)

export const GALLERY_IMAGES = [
  {
    id: "building-flags",
    src: `${CDN}/gallery-building-flags_08050a5b.jpg`,
    caption: "Christie's — King Street, London",
    category: "institutional",
  },
  {
    id: "room-primary",
    src: `${CDN}/gallery-room-primary_dc4ebd09.jpg`,
    caption: "The Grand Saleroom, Christie's",
    category: "institutional",
  },
  {
    id: "room-fallback",
    src: `${CDN}/gallery-room-fallback_583e3e6c.jpg`,
    caption: "The Grand Saleroom — Evening Sale",
    category: "institutional",
  },
  {
    id: "hermes-wall",
    src: `${CDN}/gallery-hermes-wall_81628198.jpg`,
    caption: "Hermès — Handbag Auction, Christie's",
    category: "luxury-goods",
  },
  {
    id: "patek-philippe",
    src: `${CDN}/gallery-patek-philippe_7cb822ca.jpg`,
    caption: "Patek Philippe Perpetual Calendar Chronograph",
    category: "watches",
  },
  {
    id: "hermes-birkin-red",
    src: `${CDN}/gallery-hermes-birkin-red_11aeead1.jpg`,
    caption: "Hermès Birkin — Crocodile, Christie's",
    category: "luxury-goods",
  },
  {
    id: "screaming-eagle",
    src: `${CDN}/gallery-screaming-eagle_99606d1b.jpg`,
    caption: "Screaming Eagle — Fine Wine, Christie's",
    category: "fine-wine",
  },
  {
    id: "mouton-rothschild",
    src: `${CDN}/gallery-mouton-rothschild_ea968ea4.jpg`,
    caption: "Château Mouton Rothschild 1995",
    category: "fine-wine",
  },
  {
    id: "wine-petrus",
    src: `${CDN}/gallery-wine-petrus-2000_9e8043ba.jpg`,
    caption: "Pétrus 2000 — Pomerol, Christie's",
    category: "fine-wine",
  },
] as const;

// ─── Full Auction Lot Library (all 16 images on CDN) ─────────────────────────
// Available for IDEAS tab, INTEL tab, or future gallery expansions.
export const AUCTION_LOT_LIBRARY = {
  // Institutional / Heritage
  buildingFlags:         `${CDN}/gallery-building-flags_08050a5b.jpg`,
  roomPrimary:           `${CDN}/gallery-room-primary_dc4ebd09.jpg`,
  roomFallback:          `${CDN}/gallery-room-fallback_583e3e6c.jpg`,
  auctionRoomIllustration: `${CDN}/gallery-auction-room-illustration_11988d3a.jpg`,
  exteriorIllustration:  `${CDN}/gallery-exterior-illustration_f81413bc.jpg`,
  // Luxury Goods
  hermesWall:            `${CDN}/gallery-hermes-wall_81628198.jpg`,
  hermesBirkinRed:       `${CDN}/gallery-hermes-birkin-red_11aeead1.jpg`,
  hermesAuctionWallText: `${CDN}/gallery-hermes-auction-wall-text_063c5db0.jpg`,
  hermesOrangeCollection:`${CDN}/gallery-hermes-orange-collection_0ac7ec5a.jpg`,
  hermesKellyDoll:       `${CDN}/gallery-hermes-kelly-doll_fb5cf047.jpg`,
  hermesBirkinStudio:    `${CDN}/gallery-hermes-birkin-studio_1fb1e3f2.jpg`,
  // Watches
  patekPhilippe:         `${CDN}/gallery-patek-philippe_7cb822ca.jpg`,
  // Fine Wine
  screamingEagle:        `${CDN}/gallery-screaming-eagle_99606d1b.jpg`,
  moutonRothschild:      `${CDN}/gallery-mouton-rothschild_ea968ea4.jpg`,
  wineChateauRayas:      `${CDN}/gallery-wine-chateau-rayas_a7de24e6.jpg`,
  winePetrus2000:        `${CDN}/gallery-wine-petrus-2000_9e8043ba.jpg`,
  wineCellarRacks:       `${CDN}/gallery-wine-cellar-racks_ec25edc3.jpg`,
  wineStoneVault:        `${CDN}/gallery-wine-stone-vault_5fd13d28.jpg`,
  wineChadwickPolo:      `${CDN}/gallery-wine-chadwick-polo_a4585336.jpg`,
  // Other
  guitarsChristies:      `${CDN}/gallery-guitars-christies_e62cf68b.jpg`,
} as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type GalleryImage = (typeof GALLERY_IMAGES)[number];
export type AuctionLotKey = keyof typeof AUCTION_LOT_LIBRARY;
