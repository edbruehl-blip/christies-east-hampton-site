import { google } from 'googleapis';

const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

const check = await sheets.spreadsheets.values.get({
  spreadsheetId: '1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag',
  range: 'ROSTER!A8:Q8',
});
console.log('Row 8 before update:', JSON.stringify(check.data.values?.[0]?.slice(0, 6)));

await sheets.spreadsheets.values.update({
  spreadsheetId: '1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag',
  range: 'ROSTER!Q8',
  valueInputOption: 'RAW',
  requestBody: { values: [['Salary from Ilija — not production GCI']] },
});
console.log('Updated ROSTER Q8: Salary from Ilija — not production GCI');
