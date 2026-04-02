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
 * EELE listings: TBD placeholders — real data pending. Do not block MAPS.
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
  photo: string;                // hero photo URL
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
    medianPrice: 7_500_000,
    medianPriceDisplay: '$7.5M',
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
    medianPrice: 5_100_000,
    medianPriceDisplay: '$5.1M',
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
    medianPrice: 3_550_000,
    medianPriceDisplay: '$3.55M',
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
    medianPrice: 4_200_000,
    medianPriceDisplay: '$4.2M',
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
    medianPrice: 2_850_000,
    medianPriceDisplay: '$2.85M',
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
    medianPrice: 4_250_000,
    medianPriceDisplay: '$4.25M',
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
    medianPrice: 1_350_000,
    medianPriceDisplay: '$1.35M',
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
    anewScore: 8.2,  // CIS 8.2 — Source: Saunders Q4 2025
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
];
// ─── Montauk: 10th hamlet added per Ed Bruehl direction, April 2026.
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
