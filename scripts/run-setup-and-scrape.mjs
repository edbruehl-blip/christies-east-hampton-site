/**
 * run-setup-and-scrape.mjs
 * Replicates two Apps Script functions:
 *   1. setupEventCalendarHeaders() — ensures column headers on Event Calendar sheet
 *   2. scrapeChristiesAuctions()   — fetches christies.com/en/calendar, writes NY sales to sheet
 *
 * Run: node scripts/run-setup-and-scrape.mjs
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const EVENT_SHEET_ID = '1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s';
const TAB = 'Event Calendar';
const CHRISTIES_CALENDAR_URL = 'https://www.christies.com/en/calendar';

const HEADERS = ['Start Date', 'Event Name', 'Description', 'Sync Status', 'Sale Type', 'End Date', 'Source'];

function fmt(d) {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function tabRange(range) {
  return `'${TAB}'!${range}`;
}

async function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

// ─── Step 1: Setup headers ────────────────────────────────────────────────────

async function setupEventCalendarHeaders(sheets) {
  console.log('\n─── Step 1: setupEventCalendarHeaders ───');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: EVENT_SHEET_ID,
    range: tabRange('A1:G1'),
  });
  const firstRow = res.data.values?.[0] ?? [];
  const hasHeaders = firstRow[0] && String(firstRow[0]).trim() !== '';

  if (!hasHeaders) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: EVENT_SHEET_ID,
      range: tabRange('A1:G1'),
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    });
    console.log('✓ Headers written to row 1:', HEADERS.join(' | '));
  } else {
    let patched = 0;
    for (let i = 0; i < HEADERS.length; i++) {
      if (!firstRow[i] || String(firstRow[i]).trim() === '') {
        const col = String.fromCharCode(65 + i);
        await sheets.spreadsheets.values.update({
          spreadsheetId: EVENT_SHEET_ID,
          range: tabRange(`${col}1`),
          valueInputOption: 'RAW',
          requestBody: { values: [[HEADERS[i]]] },
        });
        console.log(`  Patched column ${col}: ${HEADERS[i]}`);
        patched++;
      }
    }
    if (patched === 0) {
      console.log('✓ Headers already present — no changes needed');
      console.log('  Current row 1:', firstRow.join(' | '));
    }
  }
}

// ─── Step 2: Scrape Christie's auctions ───────────────────────────────────────

async function scrapeChristiesAuctions(sheets) {
  console.log('\n─── Step 2: scrapeChristiesAuctions ───');

  // Use curl (more reliable than Node fetch for this site in sandbox)
  console.log('  Fetching christies.com/en/calendar via curl...');
  let html;
  try {
    html = execSync(
      `curl -s --max-time 60 -L -A "Mozilla/5.0" "${CHRISTIES_CALENDAR_URL}"`,
      { maxBuffer: 10 * 1024 * 1024, timeout: 65000 }
    ).toString();
  } catch (e) {
    console.error('✗ curl failed:', e.message);
    return;
  }
  console.log('  Page fetched — length:', html.length, 'chars');

  // Extract JSON data block
  // Structure: chrComponents.calendar = { data: {...} }
  // The outer wrapper is a JS object literal (not JSON); the data: value IS valid JSON.
  const calMarker = 'chrComponents.calendar = {';
  const calStart = html.indexOf(calMarker);
  if (calStart === -1) { console.error('✗ chrComponents.calendar not found in HTML'); return; }

  // Find the outer JS object brace
  const outerBraceStart = html.indexOf('{', calStart + calMarker.length - 1);

  // Find "data: {" inside the outer block
  const dataLabel = 'data: ';
  const dataLabelPos = html.indexOf(dataLabel, outerBraceStart);
  if (dataLabelPos === -1) { console.error('✗ data: label not found'); return; }
  const jsonStart = html.indexOf('{', dataLabelPos + dataLabel.length);
  if (jsonStart === -1) { console.error('✗ JSON object brace not found'); return; }

  // Brace-count to find the end of the JSON object
  let depth = 0;
  let jsonEnd = jsonStart;
  for (let i = jsonStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) { jsonEnd = i + 1; break; }
    }
  }

  let calData;
  try { calData = JSON.parse(html.substring(jsonStart, jsonEnd)); }
  catch (e) { console.error('✗ JSON parse failed:', e.message); return; }

  const events = calData.events || [];
  console.log('  Total events on christies.com:', events.length);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const nyEvents = events.filter(e =>
    e.location_txt && e.location_txt.toLowerCase().includes('new york')
  );
  console.log('  New York events:', nyEvents.length);

  // Read existing sheet to avoid duplicates
  const existingRes = await sheets.spreadsheets.values.get({
    spreadsheetId: EVENT_SHEET_ID,
    range: tabRange('A:G'),
  });
  const existingRows = existingRes.data.values ?? [];
  const existingTitles = new Set();
  for (let i = 1; i < existingRows.length; i++) {
    if (existingRows[i][6] === 'CHRISTIES_SCRAPE') {
      existingTitles.add(String(existingRows[i][1] ?? '').trim());
    }
  }
  console.log('  Existing CHRISTIES_SCRAPE entries:', existingTitles.size);

  const rowsToAppend = [];
  let skipped = 0;

  for (const sale of nyEvents) {
    const title = sale.title_txt ? sale.title_txt.trim() : '';
    if (!title || existingTitles.has(title)) { skipped++; continue; }

    let startDate;
    try { startDate = new Date(sale.start_date); if (isNaN(startDate.getTime())) continue; }
    catch { continue; }

    let endDate;
    try { endDate = sale.end_date ? new Date(sale.end_date) : startDate; }
    catch { endDate = startDate; }
    if (endDate < today) { skipped++; continue; }

    const subtitle = sale.subtitle_txt || '';
    const url = sale.landing_url || '';
    const description = [subtitle, url].filter(Boolean).join(' · ');
    const typeText = (sale.type_txt || sale.sale_type || '').toLowerCase();
    const saleType = typeText.includes('online') ? 'Online Auction' : 'Live Auction';

    rowsToAppend.push([fmt(startDate), title, description, '', saleType, fmt(endDate), 'CHRISTIES_SCRAPE']);
    existingTitles.add(title);
    console.log(`  + ${title} (${fmt(startDate)}) [${saleType}]`);
  }

  if (rowsToAppend.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: EVENT_SHEET_ID,
      range: tabRange('A:G'),
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: rowsToAppend },
    });
    console.log(`✓ Appended ${rowsToAppend.length} new NY auction rows`);
  } else {
    console.log('✓ No new rows to add (all already present or skipped)');
  }
  console.log(`  Skipped: ${skipped}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  await setupEventCalendarHeaders(sheets);
  await scrapeChristiesAuctions(sheets);

  console.log('\n✓ Steps 1 & 2 complete.');
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
