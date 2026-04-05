/**
 * MASTER_HAMLET_DATA — Single source of truth for all ten South Fork hamlets.
 * Every tab, every PDF, every calculator pulls from this file only.
 * Do not modify medians or CIS scores without Ed's explicit approval.
 *
 * Design tokens: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels)
 *
 * Restaurant schema (3-tier per hamlet — locked Mar 29 2026):
 *   anchor: high-end / destination dining
 *   mid:    mid-tier / casual fine dining
 *   local:  everyday / year-round local (Ed-supplied, one per hamlet)
 *
 * Medians: Saunders 2025 Annual Report — confirmed April 3, 2026
 * Images: Wikimedia Commons (free for commercial use) — wired April 3, 2026
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
  // ANEW multipliers
  qsHamletMult: number;
  qsHamletTier: number;

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

// ─── Ten Hamlets ─────────────────────────────────────────────────────────────

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
      anchor: 'Dopo La Spiaggia',
      mid: 'TBD',
      local: 'Sagg Main Store',
    },
    zillowUrl: 'https://www.zillow.com/sagaponack-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/sagaponack_beach_79562586.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/01_sagaponack_da3d0919.jpg',
    vibeText: 'Agricultural heritage meeting the Atlantic. Deeply personal, quiet luxury away from the summer crowds.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9076,
    lng: -72.2637,
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
    volumeShare: 7,  // 7% — $408.9M of $5.922B (Saunders 2025 + Raveis YE 2025)
    lastSale: '8 Lily Pond Lane',
    lastSalePrice: '$9.8M',
    lastSaleDate: 'Jan 2025',
    restaurants: {
      anchor: "Nick & Toni's",
      mid: 'TBD',
      local: 'TBD',
    },
    zillowUrl: 'https://www.zillow.com/east-hampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/eh_village_main_beach_77916dfb.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/02_east_hampton_village_69834421.jpg',
    vibeText: 'Pristine luxury and immaculate estates. The historical and institutional anchor of the South Fork.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9626,
    lng: -72.1854,
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
      mid: 'TBD',
      local: 'TBD',
    },
    zillowUrl: 'https://www.zillow.com/bridgehampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/bridgehampton_mecox_c2a4b82f.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/03_bridgehampton_cd70aff1.jpg',
    vibeText: 'Sprawling equestrian estates and vineyards. A seamless blend of retained agricultural heritage and refined wealth.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9387,
    lng: -72.3065,
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
      anchor: 'Bespoke',
      mid: 'TBD',
      local: 'TBD',
    },
    zillowUrl: 'https://www.zillow.com/southampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/southampton_coopers_beach_fe6759c5.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/05_southampton_village_da26a626.jpg',
    vibeText: 'Majestic and transformative coastal beauty. The grand, traditional standard of Hamptons estate living.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.8837,
    lng: -72.3898,
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
      anchor: 'Topping Rose House',
      mid: 'TBD',
      local: 'TBD',
    },
    zillowUrl: 'https://www.zillow.com/water-mill-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/water_mill_windmill_8a45de1b.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/04_water_mill_8b4c3753.jpg',
    vibeText: 'Historic rustic charm defined by its working mill and waterfronts. Quiet exclusivity centered around Mecox Bay.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9165,
    lng: -72.3454,
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
      anchor: 'The American Hotel',
      mid: 'TBD',
      local: 'LT Burger',
    },
    zillowUrl: 'https://www.zillow.com/sag-harbor-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/sag_harbor_marina_f2b1b7c1.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/08_sag_harbor_fa9f5673.jpg',
    vibeText: 'Historic yachting center and maritime heart of the Hamptons. Deep-water marinas bordered by walkable, high-end retail.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9998,
    lng: -72.2926,
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
      anchor: "Estia's Little Kitchen",
      mid: 'TBD',
      local: 'TBD',
    },
    zillowUrl: 'https://www.zillow.com/amagansett-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/amagansett_beach_1a94cf78.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/06_amagansett_74af9d55.jpg',
    vibeText: 'Quintessential, relaxed coastal luxury. Classic beach days anchored by immaculate sands and exclusionary privacy.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9826,
    lng: -72.1326,
    qsHamletMult: 1.06,
    qsHamletTier: 3,
  },
  {
    // East Hampton North — replaces "East Hampton Town" per P2 directive April 4, 2026
    // Dollar volume: EH Middle ($290.3M) + EH NW ($255.2M) = $545.4M combined
    // Saunders 2025 + Raveis YE 2025 cross-reference
    id: 'east-hampton-north',
    name: 'East Hampton North',
    tier: 'Premier',
    medianPrice: 2_030_000,
    medianPriceDisplay: '$2.03M',
    anewScore: 8.6,
    volumeShare: 9,  // 9% — $545.4M of $5.922B
    lastSale: 'TBD',
    lastSalePrice: 'TBD',
    lastSaleDate: '',
    restaurants: {
      anchor: 'Rowdy Hall',
      mid: 'TBD',
      local: 'TBD',
    },
    zillowUrl: 'https://www.zillow.com/east-hampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/eh_north_cedar_point_df0d3cd5.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/eh_north_cedar_point_df0d3cd5.jpg',
    vibeText: 'Deep wooded privacy and expansive harbor access. The natural, uncrowded alternative to the village corridors.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9826,
    lng: -72.2100,
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
      anchor: 'TBD',
      mid: 'TBD',
      local: 'Springs Tavern',
    },
    zillowUrl: 'https://www.zillow.com/springs-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/springs_accabonac_eb4003dc.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/10_springs_a5e1792f.jpg',
    vibeText: 'Artistic, intimate, and secluded natural beauty. Quiet Accabonac Creek views totally removed from the highway rush.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 41.0026,
    lng: -72.1576,
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
      anchor: 'Naturally Good',
      mid: 'Harvest on Fort Pond',
      local: 'Duryea\'s Lobster Deck',
    },
    zillowUrl: 'https://www.zillow.com/montauk-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/montauk_lighthouse_8f675846.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/09_montauk_a5e39554.jpg',
    vibeText: 'Dramatic, elemental, and rugged. The iconic end-of-the-world coastal scenery defined by crashing surf and cliffs.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 41.0559,
    lng: -71.9565,
    qsHamletMult: 0.88,
    qsHamletTier: 1,
  },
  {
    id: 'wainscott',
    name: 'Wainscott',
    tier: 'Trophy',
    medianPrice: 3_180_000,
    medianPriceDisplay: '$3.18M',
    anewScore: 8.7,
    volumeShare: 2,  // 2% — $91.7M of $5.922B
    lastSale: '115 Beach Lane',
    lastSalePrice: '$59M',
    lastSaleDate: 'Mar 2026',
    restaurants: {
      anchor: 'Pierre\'s',
      mid: 'Georgica Restaurant',
      local: 'Wainscott General Store',
    },
    zillowUrl: 'https://www.zillow.com/wainscott-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/wainscott_georgica_c2860cc0.jpg',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/07_wainscott_6758074b.jpg',
    vibeText: 'Spectacular isolation and quiet exclusivity. High-hedged privacy shielding the most discrete estates on the East End.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9448,
    lng: -72.2365,
    qsHamletMult: 0.94,
    qsHamletTier: 2,
  },
];

// ─── Montauk: 10th hamlet added per Ed Bruehl direction, April 2026.
// Wainscott: added April 3, 2026 — CIS 8.7 confirmed April 3, 2026, Trophy tier.
// Medians: Saunders 2025 Annual Report — confirmed April 3, 2026.
// imageUrl + vibeText: wired April 3, 2026.
// Hampton Bays (Cowfish) is not in the ten-hamlet ANEW territory.

// Tier color map — token-driven
export const TIER_COLORS: Record<HamletTier, string> = {
  'Ultra-Trophy': '#C8AC78',   // gold
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
