/**
 * MASTER_HAMLET_DATA — Single source of truth for all eleven East End hamlets.
 * Every tab, every PDF, every calculator pulls from this file only.
 * Do not modify medians without Ed's explicit approval.
 *
 * Design tokens: navy #1B2A4A · gold #947231 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels)
 *
 * Restaurant schema (3-tier per hamlet — locked Mar 29 2026):
 *   anchor: high-end / destination dining
 *   mid:    mid-tier / casual fine dining
 *   local:  everyday / year-round local (Ed-supplied, one per hamlet)
 *
 * Medians: Verified market intelligence · MLS-backed public records — confirmed April 3, 2026
 * Images: Ed Bruehl original photography — wired April 6, 2026 (replaced Wikimedia)
 * Vibe text: Gemini two-sentence copy — wired April 3, 2026
 */

export type HamletTier = 'Ultra-Trophy' | 'Trophy' | 'Premier' | 'Opportunity';

export interface RestaurantTier {
  anchor: string;   // high-end / destination
  mid: string;      // mid-tier — TBD next pass
  local: string;    // everyday / year-round (Ed-supplied)
}

export interface EeleListing {
  address: string;
  price: string;
  beds: number | null;
  baths: number | null;
  sqft: string;
  url: string;
  placeholder: boolean;
}

export interface HamletData {
  id: string;
  name: string;
  tier: HamletTier;
  medianPrice: number;          // USD
  medianPriceDisplay: string;   // formatted string
  anewScore: number;            // 0–10
  volumeShare: number;          // percentage 0–100
  lastSale: string;             // address of last notable sale
  lastSalePrice: string;        // price of last notable sale
  lastSaleDate: string;         // month + year
  restaurants: RestaurantTier;  // 3-tier model
  zillowUrl: string;
  newsLinks: { label: string; url: string }[];
  photo: string;                // hero photo URL (legacy Unsplash)
  imageUrl: string;             // canonical Wikimedia image URL
  vibeText: string;             // two-sentence Gemini vibe copy
  eeleListings: EeleListing[];  // three EELE cards (TBD placeholders until real data supplied)
  // Geographic center for map pin
  lat: number;
  lng: number;
  // ── Deal Engine anchors (pre-fill Pro Mode drawer on hamlet select) ──────────
  /** Annual appreciation rate for this hamlet (default 0.05 = 5%) */
  appreciation: number;
  /** Expense ratio for NOI calculation (default 0.35 = 35%) */
  expenseRatio: number;
  // ANEW multipliers
  qsHamletMult: number;
  qsHamletTier: number;

  /**
   * CIS data quality caveat — rendered as italic footnote on hamlet card.
   * Only set for hamlets where the CIS score requires a disclosure
   * (e.g., portal-modeled, thin sample, pending audit confirmation).
   * Leave undefined for all other hamlets.
   */
  cisNote?: string;

  /**
   * Live CIS score — displayed as a gold badge on the hamlet matrix card.
   * Set when a live CIS score is available for the hamlet.
   * Leave undefined for all other hamlets.
   * Added April 21 2026 — Dispatch Addendum 2 TS fix.
   */
  liveCis?: number;

  /**
   * SUB-HAMLET SCAFFOLD — DATA LAYER ONLY
   * ─────────────────────────────────────────────────────────────────────────
   * This field is a reserved container for future sub-hamlet granularity
   * (e.g., "EH Village South of Highway" vs. "EH Village North of Highway").
   *
   * RENDERING RULES:
   *   - DO NOT render this field anywhere in the UI
   *   - DO NOT surface this on the /public route
   *   - DO NOT display this on the MARKET tab hamlet cards
   *   - The exact field schema (names, parent-child relationships,
   *     sub-designation labels) will be provided by Perplexity 2 as part
   *     of the CIS matrix deliverable
   *
   * Leave all values as empty arrays until Ed issues GO on the CIS matrix.
   */
  subHamlets?: SubHamletEntry[];
}

/**
 * SUB-HAMLET ENTRY — reserved schema container
 * All fields optional — exact schema TBD per CIS matrix deliverable.
 * DO NOT render, display, or export until Ed issues GO.
 */
export interface SubHamletEntry {
  /** Internal identifier, e.g. "eh-village-south-of-highway" */
  id?: string;
  /** Display name, e.g. "South of the Highway" */
  name?: string;
  /** Parent hamlet ID this sub-hamlet belongs to */
  parentHamletId?: string;
  /** Reserved for CIS matrix sub-designation labels */
  cisSubDesignation?: string;
  /** Reserved for sub-hamlet median price (USD) */
  medianPrice?: number;
  /** Reserved for sub-hamlet CIS score */
  anewScore?: number;
  /** Reserved for additional CIS matrix fields — TBD */
  [key: string]: unknown;
}

// ─── Eleven Hamlets ─────────────────────────────────────────────────────────

export const MASTER_HAMLET_DATA: HamletData[] = [
  {
    id: 'sagaponack',
    name: 'Sagaponack',
    tier: 'Ultra-Trophy',
    medianPrice: 8_040_000,
    medianPriceDisplay: '$8.04M',
    anewScore: 9.4,
    volumeShare: 4,  // ~4% — ~$229.9M of $5.922B (Sagaponack combined)
    lastSale: '123 Ocean Road',
    lastSalePrice: '$19.5M',
    lastSaleDate: 'Feb 2025',
    restaurants: {
      anchor: 'Wölffer Kitchen',
      mid: 'The Seafood Shop',
      local: 'Sagaponack General Store',
    },
    zillowUrl: 'https://www.zillow.com/sagaponack-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/sagaponack-wolffer-vineyard_f309f7a0.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/sagaponack-wolffer-vineyard_f309f7a0.jpg',
    vibeText: 'Where the vineyard meets the Atlantic and the land holds more value per acre than anywhere on the Eastern Seaboard. Sagaponack is not a town — it is a statement about what you believe property should be.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9076,
    lng: -72.2637,
    appreciation: 0.055,
    expenseRatio: 0.35,
    qsHamletMult: 1.18,
    qsHamletTier: 5,
  },
  {
    id: 'east-hampton-village',
    name: 'East Hampton Village',
    tier: 'Ultra-Trophy',
    medianPrice: 5_250_000,
    medianPriceDisplay: '$5.25M',
    anewScore: 9.2,
    volumeShare: 7,  // 7% — $408.9M of $5.922B (verified market intelligence cross-reference)
    lastSale: '8 Lily Pond Lane',
    lastSalePrice: '$9.8M',
    lastSaleDate: 'Jan 2025',
    restaurants: {
      anchor: 'The Palm East Hampton',
      mid: '1770 House',
      local: 'East Hampton Grill',
    },
    zillowUrl: 'https://www.zillow.com/east-hampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/east-hampton-village-main-beach_5716160d.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/east-hampton-village-main-beach_5716160d.jpg',
    vibeText: 'The center of gravity for the East End. East Hampton Village is where the private gallery, the oceanfront estate, and the institutional standard all share the same zip code.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9626,
    lng: -72.1854,
    appreciation: 0.055,
    expenseRatio: 0.35,
    qsHamletMult: 1.15,
    qsHamletTier: 5,
  },
  {
    id: 'bridgehampton',
    name: 'Bridgehampton',
    tier: 'Trophy',
    medianPrice: 4_470_000,
    medianPriceDisplay: '$4.47M',
    anewScore: 9.1,
    volumeShare: 9,  // 9% — $530.9M of $5.922B
    lastSale: '71 Ocean Road',
    lastSalePrice: '$7.2M',
    lastSaleDate: 'Mar 2025',
    restaurants: {
      anchor: 'Almond',
      mid: 'Elaia Estiatorio',
      local: "Bobby Van's",
    },
    zillowUrl: 'https://www.zillow.com/bridgehampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/bridgehampton-beach_e81e7f2f.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/bridgehampton-beach_e81e7f2f.jpg',
    vibeText: 'Where the farm stand sits a quarter mile from the breaking surf and neither one apologizes for the other. Bridgehampton is the bridge between the working land and the wealth that protects it.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9387,
    lng: -72.3065,
    appreciation: 0.05,
    expenseRatio: 0.35,
    qsHamletMult: 1.12,
    qsHamletTier: 4,
  },
  {
    id: 'southampton-village',
    name: 'Southampton Village',
    tier: 'Trophy',
    medianPrice: 4_385_000,
    medianPriceDisplay: '$4.385M',
    anewScore: 9.0,
    volumeShare: 11,  // 11% — $670.4M of $5.922B
    lastSale: '48 Gin Lane',
    lastSalePrice: '$5.6M',
    lastSaleDate: 'Feb 2025',
    restaurants: {
      anchor: 'Sant Ambroeus',
      mid: '75 Main',
      local: 'Le Charlot',
    },
    zillowUrl: 'https://www.zillow.com/southampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/southampton-village-jobs-lane_b32dd92c.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/southampton-village-jobs-lane_b32dd92c.jpg',
    vibeText: 'Old money speaks quietly here. Southampton Village is the East End\'s most governed hamlet — the architecture, the hedgerows, and the social order all follow rules that predate the highway.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.8837,
    lng: -72.3898,
    appreciation: 0.05,
    expenseRatio: 0.35,
    qsHamletMult: 1.10,
    qsHamletTier: 4,
  },
  {
    id: 'water-mill',
    name: 'Water Mill',
    tier: 'Trophy',
    medianPrice: 4_550_000,
    medianPriceDisplay: '$4.55M',
    anewScore: 8.8,
    volumeShare: 7,  // 7% — $405.1M of $5.922B
    lastSale: '91 Flying Point Road',
    lastSalePrice: '$6.4M',
    lastSaleDate: 'Jan 2025',
    restaurants: {
      anchor: 'Suki Zuki',
      mid: 'Bistro Été',
      local: 'Kissaki Hamptons',
    },
    zillowUrl: 'https://www.zillow.com/water-mill-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/water-mill-boardwalk_f48a235e.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/water-mill-boardwalk_f48a235e.jpg',
    vibeText: 'A boardwalk across the marsh and some of the most undervalued acreage on the East End. Water Mill rewards the buyer who sees land before address.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9165,
    lng: -72.3454,
    appreciation: 0.05,
    expenseRatio: 0.35,
    qsHamletMult: 1.08,
    qsHamletTier: 4,
  },
  {
    id: 'sag-harbor',
    name: 'Sag Harbor',
    tier: 'Premier',
    medianPrice: 2_800_000,
    medianPriceDisplay: '$2.80M',
    anewScore: 8.4,
    volumeShare: 5,  // 5% — $315.8M of $5.922B
    lastSale: '15 Bay Street',
    lastSalePrice: '$3.9M',
    lastSaleDate: 'Mar 2025',
    restaurants: {
      anchor: 'Le Bilboquet',
      mid: 'Sen',
      local: 'The American Hotel',
    },
    zillowUrl: 'https://www.zillow.com/sag-harbor-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/sag-harbor-windmill_f12c2f08.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/sag-harbor-windmill_f12c2f08.jpg',
    vibeText: 'The windmill stands where Main Street meets the harbor and the whole village still runs on foot traffic and conversation. Sag Harbor is the East End\'s most walkable hamlet — and the one most likely to surprise you with what sells.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9998,
    lng: -72.2926,
    appreciation: 0.05,
    expenseRatio: 0.35,
    qsHamletMult: 1.04,
    qsHamletTier: 3,
  },
  {
    id: 'amagansett',
    name: 'Amagansett',
    tier: 'Premier',
    medianPrice: 4_350_000,
    medianPriceDisplay: '$4.35M',
    anewScore: 8.9,
    volumeShare: 9,  // 9% — $508.2M of $5.922B
    lastSale: '32 Bluff Road',
    lastSalePrice: '$4.7M',
    lastSaleDate: 'Feb 2025',
    restaurants: {
      anchor: 'il Buco al Mare',
      mid: 'The Lobster Roll',
      local: 'Hampton Chutney',
    },
    zillowUrl: 'https://www.zillow.com/amagansett-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/amagansett-beach_630e2eb6.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/amagansett-beach_630e2eb6.jpg',
    vibeText: 'Sunset over the lifeguard stand and nothing else for miles. Amagansett is the hamlet that still feels like what the entire East End used to be — unhurried, salt-aired, and stubbornly itself.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9826,
    lng: -72.1326,
    appreciation: 0.05,
    expenseRatio: 0.35,
    qsHamletMult: 1.06,
    qsHamletTier: 3,
  },
  {
    // East Hampton North — replaces "East Hampton Town" per P2 directive April 4, 2026
    // Dollar volume: EH Middle ($290.3M) + EH NW ($255.2M) = $545.4M combined
    // Verified market intelligence cross-reference
    id: 'east-hampton-north',
    name: 'East Hampton North',
    tier: 'Premier',
    medianPrice: 2_030_000,
    medianPriceDisplay: '$2.03M',
    anewScore: 8.6,
    volumeShare: 9,  // 9% — $545.4M of $5.922B
    lastSale: '24 N Woods Ln',
    lastSalePrice: '$2.17M',
    lastSaleDate: 'Jan 2025',  // UNLOCKED April 7, 2026 — 24 North Woods Lane, EH 11937. $2,172,500. Source: Redfin (MLS-backed, public records). 3 bed, 2 bath, 1.4 acres, Northwest Woods. Representative of $2.03M hamlet median band.
    restaurants: {
      anchor: "Nick & Toni's",
      mid: "Bostwick's Chowder House",
      local: 'John Papas Cafe',
    },
    zillowUrl: 'https://www.zillow.com/east-hampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/east-hampton-north-sunset_d9c3ca9b.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/east-hampton-north-sunset_d9c3ca9b.jpg',
    vibeText: 'Where wetland light meets open sky. East Hampton North is the quiet side of the township — pastoral, unhurried, and tucked just far enough from the Village to feel like its own world.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9826,
    lng: -72.2100,
    appreciation: 0.045,
    expenseRatio: 0.35,
    qsHamletMult: 1.05,
    qsHamletTier: 3,
  },
  {
    id: 'springs',
    name: 'Springs',
    tier: 'Opportunity',
    medianPrice: 1_580_000,
    medianPriceDisplay: '$1.58M',
    anewScore: 6.8,
    volumeShare: 3,  // 3% — $156.2M of $5.922B
    lastSale: '9 Old Stone Highway',
    lastSalePrice: '$2.1M',
    lastSaleDate: 'Jan 2025',
    restaurants: {
      anchor: 'The Springs Tavern',
      mid: "Bostwick's on the Harbor",
      local: 'Springs Pizzeria',
    },
    zillowUrl: 'https://www.zillow.com/springs-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/springs-marsh_0e828d75.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/springs-marsh_0e828d75.jpg',
    vibeText: 'Jackson Pollock painted here because the light was honest and the rent was low. Springs is still where the dock meets the marsh and the land remembers what it was before the money arrived.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 41.0026,
    lng: -72.1576,
    appreciation: 0.045,
    expenseRatio: 0.35,
    qsHamletMult: 0.92,
    qsHamletTier: 1,
  },
  {
    id: 'montauk',
    name: 'Montauk',
    tier: 'Opportunity',
    medianPrice: 2_240_000,
    medianPriceDisplay: '$2.24M',
    anewScore: 8.2,
    volumeShare: 4,  // 4% — $245.3M of $5.922B
    lastSale: '18 Tara Road',
    lastSalePrice: '$3.99M',
    lastSaleDate: 'Active 2026',
    restaurants: {
      anchor: 'Harvest on Fort Pond',
      mid: "Duryea's",
      local: 'The Hideaway',
    },
    zillowUrl: 'https://www.zillow.com/montauk-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/montauk_lighthouse_8f675846.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/montauk_lighthouse_8f675846.jpg',  // Sprint 16: matched to photo field — Montauk_2b5f2ba8.jpg was not rendering on MARKET tab tiles
    vibeText: 'Where the road ends at the lighthouse and the Atlantic begins. Montauk is raw, unhurried, and unapologetically its own — the East End\'s last wild place.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 41.0559,
    lng: -71.9565,
    appreciation: 0.045,
    expenseRatio: 0.35,
    qsHamletMult: 0.88,
    qsHamletTier: 1,
  },
  {
    id: 'wainscott',
    name: 'Wainscott',
    tier: 'Trophy',
    medianPrice: 3_600_000,
    medianPriceDisplay: '$3.6M',
    anewScore: 8.8,  // CIS 8.8 · Portal-modeled · thin sample 10–20 transactions/yr · Doctrine 16
    cisNote: 'Portal-modeled · Thin sample (10–20 txns/yr) · CIS 8.8 reflects limited transaction depth per Doctrine 16.',
    volumeShare: 2,  // 2% — $91.7M of $5.922B
    lastSale: '115 Beach Lane',
    lastSalePrice: '$59M',
    lastSaleDate: 'Mar 2026',  // UNLOCKED April 7, 2026 — 115 Beach Lane, Wainscott. $59,000,000. Closing: March 17, 2026. Source: The Real Deal, Behind The Hedges. Attribution confirmed.
    restaurants: {
      anchor: 'Bridgehampton Inn Restaurant',
      mid: 'Old Stove Pub',
      local: 'La Capannina',
    },
    zillowUrl: 'https://www.zillow.com/wainscott-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/wainscott-dunes_4b7f6398.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/wainscott-dunes_4b7f6398.jpg',
    vibeText: 'A dune path to the ocean and nothing between you and the horizon. 115 Beach Lane — $59M off-market close, March 2026. Despite a thin sample of 10 to 20 transactions per year, Wainscott has the fewest houses, the highest privacy, and the strongest case for long-term appreciation on the East End.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9448,
    lng: -72.2365,
    appreciation: 0.055,
    expenseRatio: 0.35,
    qsHamletMult: 0.94,
    qsHamletTier: 2,
  },
];

// ─── Montauk: 10th hamlet added per Ed Bruehl direction, April 2026.
// Wainscott: added April 3, 2026 — CIS 8.7 confirmed April 3, 2026, Trophy tier.
// Medians: Verified market intelligence · MLS-backed public records — confirmed April 3, 2026.
// imageUrl + vibeText: wired April 3, 2026.
// Hampton Bays (Cowfish) is not in the ten-hamlet ANEW territory.

// Tier color map — token-driven
export const TIER_COLORS: Record<HamletTier, string> = {
  'Ultra-Trophy': '#947231',   // gold
  'Trophy':       '#1B2A4A',   // navy
  'Premier':      '#384249',   // charcoal
  'Opportunity':  '#7a8a8e',   // muted
};

export const TIER_ORDER: HamletTier[] = ['Ultra-Trophy', 'Trophy', 'Premier', 'Opportunity'];

export function getHamletById(id: string): HamletData | undefined {
  return MASTER_HAMLET_DATA.find(h => h.id === id);
}

export function getHamletsByTier(tier: HamletTier): HamletData[] {
  return MASTER_HAMLET_DATA.filter(h => h.tier === tier);
}
