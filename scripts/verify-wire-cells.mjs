/**
 * verify-wire-cells.mjs
 * Verify exact cells referenced in Perplexity's wiring directive before wiring.
 * Run: node scripts/verify-wire-cells.mjs
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

const GROWTH_MODEL_SHEET_ID = '1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag';
const MARKET_MATRIX_SHEET_ID = '176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g';

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set');
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

async function main() {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WIRE VERIFICATION — Checking exact cells from Perplexity directive');
  console.log('═══════════════════════════════════════════════════════════\n');

  // ── OUTPUTS tab: rows 28-45, cols A-G to find B32-B39, E32-F39 ─────────────
  console.log('1. OUTPUTS tab rows 28-45 (looking for B32-B39, E32-F39):');
  const outputsExtended = await sheets.spreadsheets.values.get({
    spreadsheetId: GROWTH_MODEL_SHEET_ID,
    range: 'OUTPUTS!A28:G45',
  });
  const outRows = outputsExtended.data.values ?? [];
  outRows.forEach((row, i) => {
    const rowNum = 28 + i;
    console.log(`  Row ${rowNum}: ${JSON.stringify(row)}`);
  });

  // ── VOLUME tab: Row 2 (Ed Bruehl) GCI columns ──────────────────────────────
  console.log('\n2. VOLUME tab Row 2 (Ed Bruehl) — full row:');
  const volumeRow2 = await sheets.spreadsheets.values.get({
    spreadsheetId: GROWTH_MODEL_SHEET_ID,
    range: 'VOLUME!A2:AB2',
  });
  const volRow = volumeRow2.data.values?.[0] ?? [];
  console.log(`  Full row: ${JSON.stringify(volRow)}`);
  console.log(`  Col G (2026 Proj GCI, index 6): "${volRow[6]}"`);
  console.log(`  Col H (2026 Act GCI, index 7): "${volRow[7]}"`);

  // ── Market Matrix B23 ───────────────────────────────────────────────────────
  console.log('\n3. Market Matrix B23 (Hamptons Median):');
  const mmB23 = await sheets.spreadsheets.values.get({
    spreadsheetId: MARKET_MATRIX_SHEET_ID,
    range: "'Market Matrix'!A20:C25",
  });
  const mmRows = mmB23.data.values ?? [];
  mmRows.forEach((row, i) => {
    const rowNum = 20 + i;
    console.log(`  Row ${rowNum}: ${JSON.stringify(row)}`);
  });

  // ── OUTPUTS tab: check if rows 32-39 exist at all ──────────────────────────
  console.log('\n4. OUTPUTS tab full extent — how many rows total?');
  const outputsFull = await sheets.spreadsheets.values.get({
    spreadsheetId: GROWTH_MODEL_SHEET_ID,
    range: 'OUTPUTS!A1:A50',
  });
  const allOutRows = outputsFull.data.values ?? [];
  console.log(`  Total rows with data in column A: ${allOutRows.length}`);
  allOutRows.forEach((row, i) => {
    if (row[0]) console.log(`  A${i + 1}: "${row[0]}"`);
  });

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('VERIFICATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
