/**
 * Sprint 27 — ROSTER tab GCI corrections
 * Sandy Busch: Column F (Y1 GCI) → $25,000
 * Jan Jaeger:  Column F (Y1 GCI) → $25,000
 * Then recalculate EXISTING AGENTS SUBTOTAL row.
 */
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();

const SHEET_ID = '1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag';
const TAB = 'ROSTER';

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set');
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function main() {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // Step 1: Read the full ROSTER tab to find Sandy and Jan's rows
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A1:Q60`,
  });
  const rows = (res.data.values ?? []);
  console.log(`Read ${rows.length} rows from ROSTER tab`);

  // Find Sandy Busch and Jan Jaeger rows (1-indexed for Sheets API)
  const sandyIdx = rows.findIndex(r => r[0] && r[0].toString().toLowerCase().includes('sandy'));
  const janIdx   = rows.findIndex(r => r[0] && r[0].toString().toLowerCase().includes('jan jaeger'));
  const subtotalIdx = rows.findIndex(r => r[0] && r[0].toString().toUpperCase().includes('SUBTOTAL'));

  if (sandyIdx === -1) throw new Error('Sandy Busch row not found in ROSTER tab');
  if (janIdx   === -1) throw new Error('Jan Jaeger row not found in ROSTER tab');

  console.log(`Sandy Busch found at row ${sandyIdx + 1}: ${JSON.stringify(rows[sandyIdx].slice(0, 8))}`);
  console.log(`Jan Jaeger  found at row ${janIdx + 1}:   ${JSON.stringify(rows[janIdx].slice(0, 8))}`);
  if (subtotalIdx !== -1) {
    console.log(`SUBTOTAL row found at row ${subtotalIdx + 1}: ${JSON.stringify(rows[subtotalIdx].slice(0, 8))}`);
  }

  // Step 2: Update Sandy Busch column F (index 5) → 25000
  const sandySheetRow = sandyIdx + 1; // 1-indexed
  const janSheetRow   = janIdx   + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!F${sandySheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [['25000']] },
  });
  console.log(`✓ Sandy Busch row ${sandySheetRow} column F updated to 25000`);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!F${janSheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [['25000']] },
  });
  console.log(`✓ Jan Jaeger row ${janSheetRow} column F updated to 25000`);

  // Step 3: Re-read and calculate the EXISTING AGENTS SUBTOTAL for column F
  // Find all agent rows between row 3 and the SUBTOTAL row
  const agentRows = rows.slice(2, subtotalIdx !== -1 ? subtotalIdx : rows.length)
    .filter(r => r[0] && !r[0].toString().toUpperCase().includes('SUBTOTAL')
                       && !r[0].toString().toUpperCase().includes('ENGINE')
                       && !r[0].toString().toUpperCase().includes('TOTAL')
                       && !r[0].toString().toUpperCase().includes('HOUSE')
                       && !r[0].toString().toUpperCase().includes('AGENT COUNT')
                       && !r[0].toString().toUpperCase().includes('EXISTING AGENTS'));

  // Use the corrected values for Sandy and Jan
  const subtotalF = agentRows.reduce((sum, r, i) => {
    const rowNum = rows.indexOf(r); // find original row index
    let val = parseFloat(r[5] ?? '0') || 0;
    // Override with corrected values
    if (rowNum === sandyIdx) val = 25000;
    if (rowNum === janIdx)   val = 25000;
    return sum + val;
  }, 0);

  console.log(`Recalculated SUBTOTAL column F: ${subtotalF}`);

  if (subtotalIdx !== -1) {
    const subtotalSheetRow = subtotalIdx + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!F${subtotalSheetRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[subtotalF.toString()]] },
    });
    console.log(`✓ SUBTOTAL row ${subtotalSheetRow} column F updated to ${subtotalF}`);
  } else {
    console.log('⚠ SUBTOTAL row not found — skipping subtotal update');
  }

  // Step 4: Verify by re-reading the updated rows
  const verify = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A${sandySheetRow}:F${sandySheetRow}`,
  });
  console.log(`Verified Sandy: ${JSON.stringify(verify.data.values)}`);

  const verify2 = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A${janSheetRow}:F${janSheetRow}`,
  });
  console.log(`Verified Jan: ${JSON.stringify(verify2.data.values)}`);

  console.log('\n✅ Sprint 27 Item 1 complete — ROSTER corrections applied.');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
