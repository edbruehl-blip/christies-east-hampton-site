import { google } from 'googleapis';

const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
const sheets = google.sheets({ version: 'v4', auth });

// The Hamptons Outreach Intelligence sheet — check if it has an org chart tab
const SHEET_ID = '1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI';

try {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  console.log('Sheet title:', meta.data.properties.title);
  console.log('Tabs:', meta.data.sheets.map(s => s.properties.title).join(', '));

  // Read all tabs
  for (const tab of meta.data.sheets) {
    const tabName = tab.properties.title;
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `'${tabName}'!A1:Z20`,
    });
    console.log(`\n=== Tab: ${tabName} ===`);
    console.log(JSON.stringify(r.data.values?.slice(0, 10), null, 2));
  }
} catch (e) {
  console.error('Error:', e.message);
}
