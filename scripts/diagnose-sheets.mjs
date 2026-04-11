/**
 * diagnose-sheets.mjs
 * Diagnostic only — reads raw data from Growth Model v2 OUTPUTS tab
 * and Market Matrix sheet. No writes. No interpretation.
 * Run: node scripts/diagnose-sheets.mjs
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

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
  console.log('DIAGNOSTIC — Growth Model v2 OUTPUTS Tab');
  console.log('Sheet ID: ' + GROWTH_MODEL_SHEET_ID);
  console.log('═══════════════════════════════════════════════════════════\n');

  // ── 1. Read OUTPUTS tab — full range A1:Z30 to capture everything ──────────
  const outputsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: GROWTH_MODEL_SHEET_ID,
    range: 'OUTPUTS!A1:Z30',
  });
  const outputRows = outputsRes.data.values ?? [];

  console.log('RAW OUTPUTS TAB (A1:Z30) — every row exactly as written:\n');
  outputRows.forEach((row, i) => {
    console.log(`Row ${i + 1}: ${JSON.stringify(row)}`);
  });

  console.log('\n───────────────────────────────────────────────────────────');
  console.log('COLUMN HEADERS (Row 1 exactly as written):');
  console.log(JSON.stringify(outputRows[0] ?? []));

  console.log('\n───────────────────────────────────────────────────────────');
  console.log('ROW LABELS (Column A, every row):');
  outputRows.forEach((row, i) => {
    if (row[0]) console.log(`  A${i + 1}: "${row[0]}"`);
  });

  // ── 2. Read VOLUME tab — check for Ed-specific rows ───────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('DIAGNOSTIC — Growth Model v2 VOLUME Tab (A1:AB30)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const volumeRes = await sheets.spreadsheets.values.get({
    spreadsheetId: GROWTH_MODEL_SHEET_ID,
    range: 'VOLUME!A1:AB30',
  });
  const volumeRows = volumeRes.data.values ?? [];

  console.log('ROW LABELS (Column A, every row):');
  volumeRows.forEach((row, i) => {
    if (row[0]) console.log(`  A${i + 1}: "${row[0]}"`);
  });

  console.log('\nCOLUMN HEADERS (Row 1 exactly as written):');
  console.log(JSON.stringify(volumeRows[0] ?? []));

  console.log('\nFull VOLUME tab rows (first 30):');
  volumeRows.forEach((row, i) => {
    console.log(`Row ${i + 1}: ${JSON.stringify(row)}`);
  });

  // ── 3. Read ROSTER tab — check for Ed row ─────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('DIAGNOSTIC — Growth Model v2 ROSTER Tab (A1:Q50)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const rosterRes = await sheets.spreadsheets.values.get({
    spreadsheetId: GROWTH_MODEL_SHEET_ID,
    range: 'ROSTER!A1:Q50',
  });
  const rosterRows = rosterRes.data.values ?? [];

  console.log('ROW LABELS (Column A):');
  rosterRows.forEach((row, i) => {
    if (row[0]) console.log(`  A${i + 1}: "${row[0]}"`);
  });

  // ── 4. Market Matrix — find Hamptons Median ───────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('DIAGNOSTIC — Market Matrix Sheet');
  console.log('Sheet ID: ' + MARKET_MATRIX_SHEET_ID);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Read a wide range to find the Hamptons Median row
  const mmRes = await sheets.spreadsheets.values.get({
    spreadsheetId: MARKET_MATRIX_SHEET_ID,
    range: 'Market Matrix!A1:N30',
  });
  const mmRows = mmRes.data.values ?? [];

  console.log('Full Market Matrix rows (A1:N30):');
  mmRows.forEach((row, i) => {
    console.log(`Row ${i + 1}: ${JSON.stringify(row)}`);
  });

  console.log('\nSearching for "Median" or "Hampton" in any cell:');
  mmRows.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (typeof cell === 'string' && (cell.toLowerCase().includes('median') || cell.toLowerCase().includes('hampton'))) {
        const col = String.fromCharCode(65 + j);
        console.log(`  ${col}${i + 1}: "${cell}"`);
      }
    });
  });

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('DIAGNOSTIC COMPLETE');
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
