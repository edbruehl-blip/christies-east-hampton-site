import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(__dirname, '..', 'package.json'));
const { google } = require('googleapis');

// Load dotenv
const { config } = require('dotenv');
config({ path: join(__dirname, '..', '.env') });

const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}';
if (raw === '{}') {
  console.error('ERROR: GOOGLE_SERVICE_ACCOUNT_JSON not set in environment');
  process.exit(1);
}

const creds = JSON.parse(raw);
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = '1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag';

try {
  // List worksheets
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const tabs = meta.data.sheets?.map(s => `${s.properties?.title} (id: ${s.properties?.sheetId})`);
  console.log('SUCCESS - Worksheets:', JSON.stringify(tabs, null, 2));

  // Read OUTPUTS tab B32:I46 (volume + NOP cascade + Ed GCI)
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'OUTPUTS!A30:I50',
  });
  console.log('\nOUTPUTS A30:I50:');
  data.data.values?.forEach((row, i) => console.log(`Row ${30 + i}:`, row));
} catch(e) {
  console.error('ERROR:', e.message);
  if (e.message.includes('403') || e.message.includes('permission')) {
    console.error('\nThe sheet is NOT shared with the service account.');
    console.error('Please share it with: christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com');
  }
}
