import { GoogleAuth } from '../node_modules/google-auth-library/build/src/index.js';
import { google } from '../node_modules/googleapis/build/src/index.js';

const MARKET_MATRIX_ID = '176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g';

async function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  const creds = JSON.parse(raw);
  return new GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

function parseDollar(raw) {
  if (!raw) return 0;
  const n = parseFloat(String(raw).replace(/[$,\s]/g, ''));
  return isNaN(n) ? 0 : n;
}

async function main() {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: MARKET_MATRIX_ID,
    range: "'Market Matrix'!B23",
  });
  
  const raw = res.data.values?.[0]?.[0];
  console.log('Raw B23 value:', JSON.stringify(raw));
  
  const value = parseDollar(raw);
  console.log('Parsed value:', value);
  
  const formatted = new Intl.NumberFormat('en-US', { 
    style: 'currency', currency: 'USD', maximumFractionDigits: 0 
  }).format(value);
  console.log('Formatted:', formatted);
  console.log('\nWire Five result:', JSON.stringify({ value, formatted }));
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
