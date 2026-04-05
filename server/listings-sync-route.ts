/**
 * LISTINGS SYNC ROUTE
 * Sprint 5 — April 1, 2026
 *
 * Fetches Ed Bruehl's active listings from Christie's Real Estate Group API
 * and maps them to the ten EELE hamlets for the MAPS tab.
 *
 * Christie's API endpoint discovered from agent profile page:
 *   /realestate/listingsv2/?usmAgentMlsIds=NY_EELI:530479|NY_ONEKEYMLS:184926|non-mls:530479,184926
 *   &status=Active,PCG&propertyTypes=ne,rentals&sortBy=listPrice,desc&pageSize=50
 *
 * Runs on demand via GET /api/listings/sync
 * Also called by the 6AM daily cron in server/_core/index.ts
 *
 * Returns: { listings: EeleListing[], byHamlet: Record<string, EeleListing[]>, syncedAt: string }
 */

import express from 'express';
import * as cheerio from 'cheerio';

const router = express.Router();

// ─── Christie's API config ────────────────────────────────────────────────────

const CHRISTIES_LISTINGS_URL =
  'https://www.christiesrealestategroup.com/realestate/listingsv2/' +
  '?sortBy=listPrice%2Cdesc' +
  '&pageSize=50' +
  '&usmAgentMlsIds=NY_EELI%3A530479%7CNY_ONEKEYMLS%3A184926%7Cnon-mls%3A530479%2C184926' +
  '&sortPriority=none' +
  '&originatingSystemName=ne%2Cnon-mls' +
  '&status=Active%2CPCG' +
  '&propertyTypes=ne%2Crentals';

const CHRISTIES_BASE = 'https://www.christiesrealestategroup.com';

// ─── Hamlet keyword map ───────────────────────────────────────────────────────
// Maps hamlet IDs (from hamlet-master.ts) to address keywords for classification
// Eleven hamlets — Montauk is its own bucket (Sprint 6, April 2026)

const HAMLET_KEYWORDS: Record<string, string[]> = {
  // NOTE: hamlet IDs must exactly match those in client/src/data/hamlet-master.ts
  // Master IDs: sagaponack, east-hampton-village, bridgehampton, southampton-village,
  //             water-mill, sag-harbor, amagansett, east-hampton-north, wainscott, springs, montauk
  'sagaponack':            ['sagaponack'],
  'bridgehampton':         ['bridgehampton'],
  'water-mill':            ['water mill'],
  'southampton-village':   ['southampton'],
  'sag-harbor':            ['sag harbor'],
  'amagansett':            ['amagansett'],
  'springs':               ['springs'],
  'montauk':               ['montauk'],
  'wainscott':             ['wainscott'],
  // east-hampton-village covers East Hampton Village (south of highway)
  'east-hampton-village':  ['east hampton village'],
  // east-hampton-north covers East Hampton Town / north of highway / Hampton Bays
  'east-hampton-north':    ['east hampton', 'e hampton', 'hampton bays'],
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EeleListing {
  address: string;
  price: string;
  beds: number | null;
  baths: number | null;
  sqft: string;
  url: string;
  placeholder: false;
  hamlet?: string;
  imageUrl?: string;
  propertyType?: string;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseListings(html: string): EeleListing[] {
  const $ = cheerio.load(html);
  const listings: EeleListing[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $('article[data-listing-url]').each((_: number, el: any) => {
    const $el = $(el);

    const relUrl = $el.attr('data-listing-url') || '';
    const url = relUrl.startsWith('http') ? relUrl : `${CHRISTIES_BASE}${relUrl}`;

    // Address
    const area = $el.find('.area').text().trim();
    const addressStreet = $el.find('.address').text().trim();
    const address = addressStreet ? `${addressStreet}, ${area}` : area;

    // Price — prefer the price-value span
    const priceRaw = $el.find('.price-value span:last-child').text().trim();
    const price = priceRaw ? `$${priceRaw}` : $el.find('.price-value').text().trim();

    // Beds / baths / sqft
    const bedsText = $el.find('.bedrooms strong').text().trim();
    const bathsText = $el.find('.bathrooms strong').text().trim();
    const sqftText = $el.find('.squarefeet strong').text().trim();

    const beds = bedsText ? parseInt(bedsText, 10) : null;
    const baths = bathsText ? parseInt(bathsText, 10) : null;
    const sqft = sqftText ? sqftText.replace(/,/g, '') + ' SF' : 'N/A';

    // Image
    const imageUrl = $el.find('img').attr('data-src') || $el.find('img').attr('src') || '';

    // Property type
    const propertyType = $el.find('.listing-property-type').text().trim();

    if (!address) return;

    // Classify hamlet
    const addrLower = address.toLowerCase();
    let hamlet = 'east-hampton-town'; // default
    for (const [hamletId, keywords] of Object.entries(HAMLET_KEYWORDS)) {
      if (keywords.some(kw => addrLower.includes(kw))) {
        hamlet = hamletId;
        break;
      }
    }

    listings.push({
      address,
      price: price || 'Price Upon Request',
      beds,
      baths,
      sqft,
      url,
      placeholder: false,
      hamlet,
      imageUrl,
      propertyType,
    });
  });

  return listings;
}

// ─── In-memory cache ──────────────────────────────────────────────────────────

let cachedListings: EeleListing[] = [];
let lastSyncAt: string | null = null;

// ─── Sync function (exported for cron use) ───────────────────────────────────

export async function syncListings(): Promise<{ listings: EeleListing[]; syncedAt: string }> {
  const res = await fetch(CHRISTIES_LISTINGS_URL, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (compatible; ChristiesEH-Dashboard/5.0)',
    },
  });

  if (!res.ok) {
    throw new Error(`Christie's API returned ${res.status}`);
  }

  const html = await res.text();

  // The page wraps listing JSON inside <main>{"listings":"<article ...escaped...>"}</main>
  // We must extract the JSON from <main>, parse it, then unescape the HTML.
  let listingHtml = html;
  try {
    // Extract content between <main> and </main>
    const mainMatch = html.match(/<main>(\{[\s\S]*?\})<\/main>/);
    if (mainMatch) {
      const json = JSON.parse(mainMatch[1]);
      if (json.listings) {
        // The value is escaped HTML — unescape it
        listingHtml = json.listings
          .replace(/\\\/\//g, '/')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
      }
    } else {
      // Fallback: try parsing the whole response as JSON
      const json = JSON.parse(html);
      if (json.html) listingHtml = json.html;
      else if (json.listings) listingHtml = json.listings;
    }
  } catch {
    // Already raw HTML — parse directly
  }

  const listings = parseListings(listingHtml);
  cachedListings = listings;
  lastSyncAt = new Date().toISOString();

  console.log(`[Listings Sync] ${listings.length} active listings synced at ${lastSyncAt}`);
  return { listings, syncedAt: lastSyncAt };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/listings — return cached listings (or sync if cache is empty)
router.get('/', async (_req, res) => {
  try {
    if (cachedListings.length === 0) {
      await syncListings();
    }

    // Group by hamlet
    const byHamlet: Record<string, EeleListing[]> = {};
    for (const listing of cachedListings) {
      const h = listing.hamlet || 'east-hampton-town';
      if (!byHamlet[h]) byHamlet[h] = [];
      byHamlet[h].push(listing);
    }

    res.json({
      listings: cachedListings,
      byHamlet,
      syncedAt: lastSyncAt,
      total: cachedListings.length,
    });
  } catch (err) {
    console.error('[Listings] GET error:', err);
    res.status(500).json({ error: 'Failed to fetch listings', listings: [], byHamlet: {}, total: 0 });
  }
});

// POST /api/listings/sync — force a fresh sync
router.post('/sync', async (_req, res) => {
  try {
    const result = await syncListings();
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error('[Listings] Sync error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
