import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();

const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
const sheets = google.sheets({ version: 'v4', auth });

const SHEET_ID = '1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0';

const res = await sheets.spreadsheets.values.get({
  spreadsheetId: SHEET_ID,
  range: `Intelligence Web!A1:Z1`,
});
const headers = res.data.values?.[0] ?? [];
console.log('Column count:', headers.length);
headers.forEach((h: string, i: number) => {
  const col = String.fromCharCode(65 + i);
  console.log(`  ${col} (${i}): ${h}`);
});

const data = await sheets.spreadsheets.values.get({
  spreadsheetId: SHEET_ID,
  range: `Intelligence Web!A2:Z4`,
});
const rows = (data.data.values ?? []) as string[][];
console.log('\nFirst 3 data rows (cols P-Z):');
rows.forEach((r, i) => {
  console.log(`  Row ${i+2}: P=${r[15]||''} | Q=${r[16]||''} | R=${r[17]||''}`);
});
