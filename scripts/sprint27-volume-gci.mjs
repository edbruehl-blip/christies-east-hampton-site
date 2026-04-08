/**
 * Sprint 27 — VOLUME tab GCI column addition
 * Adds Projected GCI and Actual GCI columns after each year's volume pair.
 * New layout: Proj Vol, Act Vol, Proj GCI, Act GCI per year (2026-2031)
 * 
 * Strategy: Instead of inserting columns (which shifts existing data),
 * we append 12 new columns to the right and update the header row.
 * The server code will then read the new 4-column-per-year layout.
 * 
 * New column layout (0-indexed):
 *   0=Agent, 1=Role, 2=Status, 3=Start
 *   4=2026ProjVol, 5=2026ActVol, 6=2026ProjGCI, 7=2026ActGCI
 *   8=2027ProjVol, 9=2027ActVol, 10=2027ProjGCI, 11=2027ActGCI
 *   12=2028ProjVol, 13=2028ActVol, 14=2028ProjGCI, 15=2028ActGCI
 *   16=2029ProjVol, 17=2029ActVol, 18=2029ProjGCI, 19=2029ActGCI
 *   20=2030ProjVol, 21=2030ActVol, 22=2030ProjGCI, 23=2030ActGCI
 *   24=2031ProjVol, 25=2031ActVol, 26=2031ProjGCI, 27=2031ActGCI
 * 
 * BUT: Current sheet has 16 cols in order: A-D meta, E-P = 2026-2031 vol pairs
 * We need to REORGANIZE: move data to new layout with GCI columns interspersed.
 * 
 * Simpler approach: Read all data, rebuild with 4-col-per-year layout, write back.
 */
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();

const SHEET_ID = '1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag';
const TAB = 'VOLUME';

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

  // Step 1: Read current VOLUME tab (all data)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A1:P25`,
  });
  const rows = (res.data.values ?? []);
  console.log(`Read ${rows.length} rows from VOLUME tab`);
  console.log('Header row:', JSON.stringify(rows[0]));

  // Step 2: Build new header row with GCI columns interspersed
  // Current: [Agent, Role, Status, Start, 2026Proj, 2026Act, 2027Proj, 2027Act, ...]
  // New:     [Agent, Role, Status, Start, 2026ProjVol, 2026ActVol, 2026ProjGCI, 2026ActGCI, ...]
  const years = [2026, 2027, 2028, 2029, 2030, 2031];
  const newHeader = [
    'Agent', 'Role', 'Status', 'Start',
    ...years.flatMap(y => [
      `${y} Projected Volume`,
      `${y} Actual Volume`,
      `${y} Projected GCI`,
      `${y} Actual GCI`,
    ])
  ];
  console.log('New header:', JSON.stringify(newHeader));

  // Step 3: Rebuild each data row — insert 0 for GCI columns after each vol pair
  // Current column mapping: cols 4-5 = 2026, 6-7 = 2027, 8-9 = 2028, 10-11 = 2029, 12-13 = 2030, 14-15 = 2031
  const newRows = [newHeader];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) {
      newRows.push(Array(28).fill(''));
      continue;
    }
    const meta = [r[0] ?? '', r[1] ?? '', r[2] ?? '', r[3] ?? ''];
    const yearData = years.flatMap((y, yi) => {
      const baseIdx = 4 + yi * 2;
      const projVol = r[baseIdx]     ?? '0';
      const actVol  = r[baseIdx + 1] ?? '0';
      return [projVol, actVol, '0', '0']; // GCI starts at 0
    });
    newRows.push([...meta, ...yearData]);
  }

  // Step 4: Clear the tab and write new data
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A1:Z30`,
  });
  console.log('Cleared VOLUME tab');

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: newRows },
  });
  console.log(`Written ${newRows.length} rows to VOLUME tab`);

  // Step 5: Verify by reading back the header
  const verify = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A1:AB1`,
  });
  console.log('Verified header:', JSON.stringify(verify.data.values?.[0]));
  console.log('\n✅ Sprint 27 Item 2 complete — VOLUME GCI columns added.');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
