import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();

const GROWTH = '1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag';
const MM = '176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g';

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  return new google.auth.GoogleAuth({ credentials: JSON.parse(raw), scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
}

async function main() {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // Ed profit pool — columns E and F of rows 32-39
  const pool = await sheets.spreadsheets.values.get({ spreadsheetId: GROWTH, range: 'OUTPUTS!A32:G39' });
  console.log('\nOUTPUTS rows 32-39 (A through G — profit pool table):');
  (pool.data.values ?? []).forEach((r, i) => console.log(`  Row ${32+i}: ${JSON.stringify(r)}`));

  // Ed personal GCI rows 44-52
  const edGci = await sheets.spreadsheets.values.get({ spreadsheetId: GROWTH, range: 'OUTPUTS!A44:H52' });
  console.log('\nOUTPUTS rows 44-52 (Ed personal GCI section):');
  (edGci.data.values ?? []).forEach((r, i) => console.log(`  Row ${44+i}: ${JSON.stringify(r)}`));

  // Market Matrix B23
  const mm = await sheets.spreadsheets.values.get({ spreadsheetId: MM, range: "'Market Matrix'!A22:C24" });
  console.log('\nMarket Matrix rows 22-24 (B23 area):');
  (mm.data.values ?? []).forEach((r, i) => console.log(`  Row ${22+i}: ${JSON.stringify(r)}`));
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
