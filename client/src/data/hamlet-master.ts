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
    volumeShare: 4,
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
    photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sagaponack_NY_Post_Office.jpg/1200px-Sagaponack_NY_Post_Office.jpg',
    vibeText: 'Sagaponack is the most expensive zip code in America — a quiet, oceanfront enclave of hedge-fund estates and celebrity compounds behind privet hedges. Its median sale price consistently leads the entire Hamptons market, drawing buyers who require absolute privacy and proximity to the Atlantic.',
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
    medianPrice: 5_150_000,
    medianPriceDisplay: '$5.15M',
    anewScore: 9.2,
    volumeShare: 12,
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
    photo: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Hook_Windmill%2C_East_Hampton%2C_NY.jpg/1200px-Hook_Windmill%2C_East_Hampton%2C_NY.jpg',
    vibeText: 'East Hampton Village is the cultural and commercial heart of the South Fork — Main Street boutiques, the Hook Windmill, and Georgica Pond define a village that has attracted artists, writers, and collectors for over a century. Its tree-lined streets and historic architecture make it the most recognizable address in the Hamptons.',
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
    volumeShare: 8,
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
    photo: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Bridgehampton_Presbyterian_Church.jpg/1200px-Bridgehampton_Presbyterian_Church.jpg',
    vibeText: 'Bridgehampton sits at the geographic center of the South Fork, where horse farms, ocean-view estates, and the iconic Presbyterian Church steeple coexist in a hamlet that has never lost its agricultural character. It is the quiet alternative to East Hampton Village for buyers who want the same ocean proximity without the foot traffic.',
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
    volumeShare: 14,
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
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Agawam_Park_Southampton_NY.jpg/1200px-Agawam_Park_Southampton_NY.jpg',
    vibeText: 'Southampton Village is the oldest English settlement in New York State, anchored by Gin Lane estates and the Southampton Arts Center in a village that balances old-money heritage with a thriving contemporary art scene. Its broad, tree-canopied streets and proximity to Cooper\'s Beach make it the definitive address on the North Fork side of the South Fork.',
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
    volumeShare: 7,
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
    photo: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Water_Mill_NY.jpg/1200px-Water_Mill_NY.jpg',
    vibeText: 'Water Mill is named for its 1644 grist mill — still standing — and remains one of the most quietly prestigious addresses on the South Fork, favored by collectors and financiers who prefer acreage over visibility. Its median price has climbed steadily as buyers seek larger lots between Bridgehampton and Southampton.',
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
    volumeShare: 11,
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
    photo: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sag_Harbor_Main_Street_Historic_District.jpg/1200px-Sag_Harbor_Main_Street_Historic_District.jpg',
    vibeText: 'Sag Harbor is the most authentically American village on the East End — a former whaling capital with a Main Street Historic District that has attracted writers, artists, and intellectuals for generations. Its year-round community, independent bookstore, and working waterfront give it a character that seasonal Hamptons villages cannot replicate.',
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
    volumeShare: 9,
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
    photo: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Amagansett_U.S._Life-Saving_Station.jpg/1200px-Amagansett_U.S._Life-Saving_Station.jpg',
    vibeText: 'Amagansett is the last village before the ocean takes over — a hamlet of surfers, chefs, and collectors who chose proximity to Atlantic Avenue Beach over the social circuit of East Hampton Village. Its median price has surpassed many Trophy hamlets, driven by buyers who value its low density and direct beach access.',
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
    id: 'east-hampton',
    name: 'East Hampton',
    tier: 'Premier',
    medianPrice: 3_200_000,
    medianPriceDisplay: '$3.2M',
    anewScore: 8.6,
    volumeShare: 18,
    lastSale: '114 Two Holes of Water Road',
    lastSalePrice: '$3.2M',
    lastSaleDate: 'Mar 2025',
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
    photo: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Hook_Windmill%2C_East_Hampton%2C_NY.jpg/1200px-Hook_Windmill%2C_East_Hampton%2C_NY.jpg',
    vibeText: 'East Hampton Town encompasses the broader township beyond the Village — a mix of residential neighborhoods, nature preserves, and working farms that represents the largest volume market on the South Fork. It is the entry point for buyers who want the East Hampton address at a more accessible price point.',
    eeleListings: [
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
      { address: 'TBD', price: 'TBD', beds: null, baths: null, sqft: 'TBD', url: 'https://www.christiesrealestategroup.com/search#', placeholder: true },
    ],
    lat: 40.9626,
    lng: -72.1854,
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
    volumeShare: 17,
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
    photo: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Pollock-Krasner_House_and_Study_Center.jpg/1200px-Pollock-Krasner_House_and_Study_Center.jpg',
    vibeText: 'Springs is where Jackson Pollock and Lee Krasner lived and worked, and it remains the most authentic artistic community on the East End — a year-round neighborhood of working artists, tradespeople, and longtime locals who have resisted the seasonal transformation of neighboring hamlets. Its median price represents the best value proposition on the South Fork for buyers who understand its cultural significance.',
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
    volumeShare: 9,
    lastSale: 'TBD',
    lastSalePrice: 'TBD',
    lastSaleDate: 'Q1 2026',
    restaurants: {
      anchor: 'Naturally Good',
      mid: 'TBD',
      local: 'TBD',
    },
    zillowUrl: 'https://www.zillow.com/montauk-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Montauk_Point_Lighthouse_2018.jpg/1200px-Montauk_Point_Lighthouse_2018.jpg',
    vibeText: 'Montauk is the end of the line — a fishing village turned surf destination where the 1796 lighthouse marks the eastern tip of Long Island and the beginning of the Atlantic. Its buyer profile has shifted dramatically toward younger UHNW purchasers drawn by the raw landscape, the surfing culture, and the deliberate absence of the Hamptons social circuit.',
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
    volumeShare: 4,
    lastSale: 'TBD',
    lastSalePrice: 'TBD',
    lastSaleDate: 'Q1 2026',
    restaurants: {
      anchor: 'TBD',
      mid: 'TBD',
      local: 'TBD',
    },
    zillowUrl: 'https://www.zillow.com/wainscott-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Wainscott_Windmill.jpg/1200px-Wainscott_Windmill.jpg',
    vibeText: 'Wainscott is the smallest and least-trafficked hamlet on the South Fork — a sliver of farmland and oceanfront between East Hampton Village and Sagaponack that offers the same ocean access at a fraction of the notoriety. Buyers here are typically repeat Hamptons purchasers who have outgrown the social scene and want acreage, privacy, and a direct path to the beach.',
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
