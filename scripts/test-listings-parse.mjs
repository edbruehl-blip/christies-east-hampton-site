/**
 * Test script: verify the fixed listings parser works on the cached HTML page.
 * Run: node scripts/test-listings-parse.mjs
 */
import { load } from 'cheerio';
import { readFileSync } from 'fs';

const html = readFileSync('/tmp/listings_page.html', 'utf8');

// Extract JSON from <main>
const mainMatch = html.match(/<main>(\{[\s\S]*?\})<\/main>/);
if (!mainMatch) {
  console.error('ERROR: No <main> JSON block found in page');
  process.exit(1);
}

const json = JSON.parse(mainMatch[1]);
console.log('JSON keys:', Object.keys(json));

if (!json.listings) {
  console.error('ERROR: No listings key in JSON');
  process.exit(1);
}

// Unescape the HTML
const unescaped = json.listings
  .replace(/\\\//g, '/')
  .replace(/\\"/g, '"')
  .replace(/\\\\/g, '\\');

console.log('Unescaped HTML length:', unescaped.length);

// Parse with cheerio
const $ = load(unescaped);
const articles = $('article[data-listing-url]');
console.log(`\nArticles found: ${articles.length}`);

articles.each((i, el) => {
  const $el = $(el);
  const area = $el.find('.area').text().trim();
  const addr = $el.find('.address').text().trim();
  const address = addr ? `${addr}, ${area}` : area;
  const price = $el.find('.price-value span:last-child').text().trim();
  const beds = $el.find('.bedrooms strong').text().trim();
  const baths = $el.find('.bathrooms strong').text().trim();
  const sqft = $el.find('.squarefeet strong').text().trim();
  const imgUrl = $el.find('img').attr('data-src') || $el.find('img').attr('src') || '';
  const propType = $el.find('.listing-property-type').text().trim();
  const listingUrl = $el.attr('data-listing-url') || '';
  console.log(`  ${i+1}. ${address}`);
  console.log(`     $${price} | ${beds} bed / ${baths} bath | ${sqft || 'N/A'} SF | ${propType}`);
  console.log(`     URL: ${listingUrl}`);
  console.log(`     Image: ${imgUrl.substring(0, 60)}...`);
});
