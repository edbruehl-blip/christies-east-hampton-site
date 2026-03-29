/**
 * CDN Asset Registry — Christie's East Hampton Dashboard
 * Design System: Navy #1B2A4A · Gold #C8AC78 · Charcoal #384249 · Cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Barlow Condensed (data/UI)
 *
 * ALL image references in the codebase must come from this file.
 * No inline image URLs. No local asset paths.
 * Ed headshot PRIMARY assignment is pending Ed's confirmation — use BACKUP until confirmed.
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz";

// ─── James Christie Portraits ───────────────────────────────────────────────
// Classical oil painting, 18th-century attire, powdered wig
export const JAMES_CHRISTIE_PORTRAIT_PRIMARY =
  `${CDN}/james-christie-portrait-primary_7d03f37e.jpg`;
export const JAMES_CHRISTIE_PORTRAIT_FALLBACK =
  `${CDN}/james-christie-portrait-fallback_b34a2eb4.jpg`;

// ─── Ed Bruehl Headshots ─────────────────────────────────────────────────────
// PRIMARY: pasted_file_vnfACK — awaiting Ed confirmation before wiring into nav/PDF
// BACKUP:  5A89ABA9 — full-body waist-up, same wardrobe
// NOTE: Wire BACKUP into nav/PDF until Ed confirms PRIMARY
export const ED_HEADSHOT_PRIMARY =
  `${CDN}/ed-headshot-primary_6eddf216.jpg`;   // ← PENDING ED CONFIRMATION
export const ED_HEADSHOT_BACKUP =
  `${CDN}/ed-headshot-backup_5ca40c61.jpg`;    // ← USE THIS UNTIL CONFIRMED

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

export const LOGO_C_ICON =
  `${CDN}/logo-c-icon_8b382415.jpg`;           // Favicon / small-format mark

// ─── HOME Tab — Auction Gallery 3×3 ─────────────────────────────────────────
// Nine images selected for maximum Christie's brand authority signal.
// Ordered: institutional first, then luxury goods, then fine wine.

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
    id: "auction-room-illustration",
    src: `${CDN}/gallery-auction-room-illustration_11988d3a.jpg`,
    caption: "Christie's Auction Room, c. 1808",
    category: "heritage",
  },
  {
    id: "exterior-illustration",
    src: `${CDN}/gallery-exterior-illustration_f81413bc.jpg`,
    caption: "Christie & Manson's, King Street, c. 1823",
    category: "heritage",
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
    id: "room-fallback",
    src: `${CDN}/gallery-room-fallback_583e3e6c.jpg`,
    caption: "The Grand Saleroom — Evening Sale",
    category: "institutional",
  },
] as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type GalleryImage = (typeof GALLERY_IMAGES)[number];
