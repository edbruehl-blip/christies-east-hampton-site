/**
 * Fix the DATE CLOSED column placement.
 *
 * Problem: "April 2, 2026" was written to column M (YOUTUBE LONG) — wrong column.
 * Fix:
 *   1. Clear M4
 *   2. Add "DATE CLOSED" header at U2
 *   3. Write "April 2, 2026" to U4 (2 Old Hollow Road row)
 */
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SHEET_ID = '1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M';

const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

async function fix() {
  // 0. Expand the sheet to 22 columns so column U exists
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheet1 = meta.data.sheets.find(s => s.properties.title === 'Sheet1');
  const sheetId = sheet1.properties.sheetId;
  const currentCols = sheet1.properties.gridProperties.columnCount;
  console.log('Current column count:', currentCols);
  if (currentCols < 22) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [{
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { columnCount: 22 } },
            fields: 'gridProperties.columnCount',
          },
        }],
      },
    });
    console.log('✓ Sheet expanded to 22 columns');
  } else {
    console.log('✓ Sheet already has enough columns');
  }

  // 1. Clear the wrong date from M4 (YOUTUBE LONG column)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!M4',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [['']] },
  });
  console.log('✓ Cleared M4 (wrong date removed from YOUTUBE LONG column)');

  // 2. Add DATE CLOSED header in U2
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!U2',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [['DATE CLOSED']] },
  });
  console.log('✓ Added DATE CLOSED header at U2');

  // 3. Write April 2, 2026 to U4 (2 Old Hollow Road)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!U4',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [['April 2, 2026']] },
  });
  console.log('✓ Written April 2, 2026 to U4 (2 Old Hollow Road — DATE CLOSED)');

  // 4. Verify row 4
  const verify = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A4:U4',
  });
  const row = verify.data.values?.[0] || [];
  console.log('\nRow 4 verified:');
  row.forEach((v, i) => {
    if (v) console.log('  ' + String.fromCharCode(65 + i) + ':', v);
  });

  // 5. Verify header row
  const headers = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A2:U2',
  });
  const headerRow = headers.data.values?.[0] || [];
  console.log('\nHeader row (A2:U2):');
  headerRow.forEach((v, i) => {
    if (v) console.log('  ' + String.fromCharCode(65 + i) + ':', v);
  });
}

fix().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
