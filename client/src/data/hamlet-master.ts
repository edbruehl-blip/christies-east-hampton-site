/**
 * MASTER_HAMLET_DATA — Single source of truth for all nine South Fork hamlets.
 * Every tab, every PDF, every calculator pulls from this file only.
 * Do not modify medians or ANEW scores without Ed's explicit approval.
 *
 * Design tokens: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels)
 */

export type HamletTier = 'Ultra-Trophy' | 'Trophy' | 'Premier' | 'Opportunity';

export interface EeleListing {
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  url: string;
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
  bestRestaurant: string;       // hardcoded per spec
  zillowUrl: string;
  newsLinks: { label: string; url: string }[];
  photo: string;                // hero photo URL
  eeleListings: EeleListing[];  // three EELE active listings
  // Geographic center for map pin
  lat: number;
  lng: number;
  // ANEW multipliers
  qsHamletMult: number;
  qsHamletTier: number;
}

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
    bestRestaurant: 'Sagg Main Store',
    zillowUrl: 'https://www.zillow.com/sagaponack-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '7 Sagg Main Street', price: '$8,950,000', beds: 5, baths: 5, sqft: '4,800', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '45 Ocean Road', price: '$14,500,000', beds: 6, baths: 7, sqft: '6,200', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '12 Gibson Lane', price: '$6,250,000', beds: 4, baths: 4, sqft: '3,600', url: 'https://www.christiesrealestategroup.com/search#' },
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
    bestRestaurant: 'Nick & Toni\'s',
    zillowUrl: 'https://www.zillow.com/east-hampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '14 Apaquogue Road', price: '$7,200,000', beds: 5, baths: 5, sqft: '4,200', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '3 Georgica Close Road', price: '$11,500,000', beds: 7, baths: 8, sqft: '7,100', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '22 Hunting Lane', price: '$4,950,000', beds: 4, baths: 4, sqft: '3,400', url: 'https://www.christiesrealestategroup.com/search#' },
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
    bestRestaurant: 'Pierre\'s',
    zillowUrl: 'https://www.zillow.com/bridgehampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '2488 Montauk Highway', price: '$5,750,000', beds: 5, baths: 6, sqft: '4,900', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '18 Hildreth Lane', price: '$8,900,000', beds: 6, baths: 7, sqft: '5,800', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '55 Ocean Road', price: '$4,250,000', beds: 4, baths: 4, sqft: '3,200', url: 'https://www.christiesrealestategroup.com/search#' },
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
    bestRestaurant: 'Sant Ambroeus',
    zillowUrl: 'https://www.zillow.com/southampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '30 Gin Lane', price: '$6,500,000', beds: 6, baths: 6, sqft: '5,100', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '12 First Neck Lane', price: '$3,950,000', beds: 4, baths: 4, sqft: '3,800', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '7 Meadow Lane', price: '$9,200,000', beds: 7, baths: 8, sqft: '6,400', url: 'https://www.christiesrealestategroup.com/search#' },
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
    bestRestaurant: 'Topping Rose House',
    zillowUrl: 'https://www.zillow.com/water-mill-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '2 Halsey Lane', price: '$4,750,000', beds: 5, baths: 5, sqft: '4,100', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '77 Flying Point Road', price: '$7,800,000', beds: 6, baths: 7, sqft: '5,600', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '14 Cobb Road', price: '$3,200,000', beds: 4, baths: 3, sqft: '2,900', url: 'https://www.christiesrealestategroup.com/search#' },
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
    bestRestaurant: 'The American Hotel',
    zillowUrl: 'https://www.zillow.com/sag-harbor-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '8 Glover Street', price: '$2,950,000', beds: 4, baths: 3, sqft: '2,600', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '24 Madison Street', price: '$4,100,000', beds: 5, baths: 4, sqft: '3,400', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '3 Hempstead Street', price: '$1,995,000', beds: 3, baths: 2, sqft: '1,900', url: 'https://www.christiesrealestategroup.com/search#' },
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
    bestRestaurant: 'Lobster Roll (Lunch)',
    zillowUrl: 'https://www.zillow.com/amagansett-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '14 Bluff Road', price: '$5,200,000', beds: 5, baths: 5, sqft: '4,300', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '7 Indian Wells Highway', price: '$3,750,000', beds: 4, baths: 4, sqft: '3,100', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '22 Atlantic Avenue', price: '$6,800,000', beds: 6, baths: 6, sqft: '5,200', url: 'https://www.christiesrealestategroup.com/search#' },
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
    bestRestaurant: 'Rowdy Hall',
    zillowUrl: 'https://www.zillow.com/east-hampton-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '18 Hands Creek Road', price: '$3,450,000', beds: 4, baths: 4, sqft: '3,200', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '5 Baiting Hollow Road', price: '$2,750,000', beds: 3, baths: 3, sqft: '2,400', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '40 Toilsome Lane', price: '$4,900,000', beds: 5, baths: 5, sqft: '4,600', url: 'https://www.christiesrealestategroup.com/search#' },
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
    bestRestaurant: 'Springs Tavern',
    zillowUrl: 'https://www.zillow.com/springs-ny/',
    newsLinks: [
      { label: 'WSJ Hamptons', url: 'https://www.wsj.com/real-estate/luxury-homes/hamptons' },
      { label: 'Curbed NY', url: 'https://ny.curbed.com/hamptons' },
      { label: 'NY Times RE', url: 'https://www.nytimes.com/section/realestate' },
    ],
    photo: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
    eeleListings: [
      { address: '22 Old Stone Highway', price: '$1,450,000', beds: 3, baths: 2, sqft: '1,800', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '5 Neck Path', price: '$2,200,000', beds: 4, baths: 3, sqft: '2,600', url: 'https://www.christiesrealestategroup.com/search#' },
      { address: '14 Fireplace Road', price: '$1,750,000', beds: 3, baths: 3, sqft: '2,100', url: 'https://www.christiesrealestategroup.com/search#' },
    ],
    lat: 41.0026,
    lng: -72.1576,
    qsHamletMult: 0.92,
    qsHamletTier: 1,
  },
];

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
