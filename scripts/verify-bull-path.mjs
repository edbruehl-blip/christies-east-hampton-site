import { google } from 'googleapis';

const SHEET_ID = '1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M';

async function main() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Read all rows from the pipeline sheet
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:Z',
  });

  const rows = res.data.values || [];
  console.log(`Total rows: ${rows.length}`);
  console.log('Headers:', rows[0]);

  // Find 191 Bull Path
  const bullPath = rows.filter(r => r.some(cell =>
    typeof cell === 'string' && cell.toLowerCase().includes('bull path')
  ));

  if (bullPath.length === 0) {
    console.log('NOT FOUND: No row containing "bull path"');
  } else {
    console.log(`\nFound ${bullPath.length} row(s) with "bull path":`);
    bullPath.forEach((row, i) => {
      console.log(`Row ${i + 1}:`, JSON.stringify(row));
    });
  }
}

main().catch(console.error);
