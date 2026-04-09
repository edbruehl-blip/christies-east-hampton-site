/**
 * HAMLET_BOUNDARIES — Approximate polygon boundaries for all 10 East End hamlets.
 * Used by MapsTab PaumanokPlate to render semi-transparent overlay polygons on the
 * Google Maps satellite view. Coordinates are [lng, lat] per GeoJSON spec.
 *
 * Source: Geographic extents derived from USGS/Census hamlet boundaries + local knowledge.
 * These are approximate convex-hull polygons — not legal parcel boundaries.
 * Update with official GeoJSON when supplied by Ed.
 *
 * Design tokens: navy fill rgba(27,42,74,0.22) · gold stroke #C8AC78 · stroke weight 2
 */

export interface HamletBoundary {
  id: string;
  name: string;
  // Array of [lat, lng] pairs forming a closed polygon
  coords: [number, number][];
}

export const HAMLET_BOUNDARIES: HamletBoundary[] = [
  {
    id: 'sagaponack',
    name: 'Sagaponack',
    coords: [
      [40.9200, -72.2900],
      [40.9200, -72.2400],
      [40.8950, -72.2400],
      [40.8950, -72.2900],
      [40.9200, -72.2900],
    ],
  },
  {
    id: 'east-hampton-village',
    name: 'East Hampton Village',
    coords: [
      [40.9750, -72.2100],
      [40.9750, -72.1650],
      [40.9500, -72.1650],
      [40.9500, -72.2100],
      [40.9750, -72.2100],
    ],
  },
  {
    id: 'bridgehampton',
    name: 'Bridgehampton',
    coords: [
      [40.9600, -72.3450],
      [40.9600, -72.2750],
      [40.9200, -72.2750],
      [40.9200, -72.3450],
      [40.9600, -72.3450],
    ],
  },
  {
    id: 'southampton-village',
    name: 'Southampton Village',
    coords: [
      [40.9100, -72.4300],
      [40.9100, -72.3700],
      [40.8650, -72.3700],
      [40.8650, -72.4300],
      [40.9100, -72.4300],
    ],
  },
  {
    id: 'water-mill',
    name: 'Water Mill',
    coords: [
      [40.9400, -72.3800],
      [40.9400, -72.3200],
      [40.9000, -72.3200],
      [40.9000, -72.3800],
      [40.9400, -72.3800],
    ],
  },
  {
    id: 'sag-harbor',
    name: 'Sag Harbor',
    coords: [
      [41.0250, -72.3200],
      [41.0250, -72.2700],
      [40.9800, -72.2700],
      [40.9800, -72.3200],
      [41.0250, -72.3200],
    ],
  },
  {
    id: 'amagansett',
    name: 'Amagansett',
    coords: [
      [41.0000, -72.1600],
      [41.0000, -72.1050],
      [40.9650, -72.1050],
      [40.9650, -72.1600],
      [41.0000, -72.1600],
    ],
  },
  {
    id: 'east-hampton',
    name: 'East Hampton Town',
    coords: [
      [41.0300, -72.2300],
      [41.0300, -72.1600],
      [40.9800, -72.1600],
      [40.9800, -72.2300],
      [41.0300, -72.2300],
    ],
  },
  {
    id: 'springs',
    name: 'Springs',
    coords: [
      [41.0350, -72.1900],
      [41.0350, -72.1300],
      [40.9900, -72.1300],
      [40.9900, -72.1900],
      [41.0350, -72.1900],
    ],
  },
  {
    id: 'montauk',
    name: 'Montauk',
    coords: [
      [41.0850, -72.0200],
      [41.0850, -71.8600],
      [41.0250, -71.8600],
      [41.0250, -72.0200],
      [41.0850, -72.0200],
    ],
  },
  {
    id: 'wainscott',
    name: 'Wainscott',
    coords: [
      [40.9650, -72.2650],
      [40.9650, -72.2150],
      [40.9250, -72.2150],
      [40.9250, -72.2650],
      [40.9650, -72.2650],
    ],
  },
];
