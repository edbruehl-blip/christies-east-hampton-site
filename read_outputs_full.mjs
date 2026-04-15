import { google } from "googleapis";

const SPREADSHEET_ID = "1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const auth = getAuth();
const sheets = google.sheets({ version: "v4", auth });

// First, list all sheets to confirm tab names
const meta = await sheets.spreadsheets.get({
  spreadsheetId: SPREADSHEET_ID,
  fields: "sheets.properties",
});
console.log("=== SHEET TABS ===");
meta.data.sheets.forEach(s => {
  console.log(`  ${s.properties.index}: "${s.properties.title}" (id: ${s.properties.sheetId})`);
});
console.log();

// Read a wider range of OUTPUTS to understand the full structure
const result = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: "OUTPUTS!A1:J60",
  valueRenderOption: "FORMULA",
});

const rows = result.data.values ?? [];
console.log(`=== OUTPUTS!A1:J60 — ${rows.length} rows ===`);
rows.forEach((row, i) => {
  const rowNum = i + 1;
  const padded = [...row, ...Array(10).fill("")].slice(0, 10);
  console.log(`${String(rowNum).padStart(3)}: ${padded.map(c => String(c).padEnd(35)).join(" | ")}`);
});
