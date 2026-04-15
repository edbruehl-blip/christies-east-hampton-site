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

// Read rows 1-60, columns A-L to see full structure
const result = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: "OUTPUTS!A1:L60",
  valueRenderOption: "FORMULA",
});

const rows = result.data.values ?? [];
console.log(`Total rows: ${rows.length}`);
console.log();

// Print every row with its row number
rows.forEach((row, i) => {
  const rowNum = i + 1;
  // Show first 4 columns clearly to identify structure
  const a = String(row[0] ?? "").substring(0, 40);
  const b = String(row[1] ?? "").substring(0, 40);
  const c = String(row[2] ?? "").substring(0, 40);
  const f = String(row[5] ?? "").substring(0, 40); // Column F = overhead
  const g = String(row[6] ?? "").substring(0, 40); // Column G = NOP
  const h = String(row[7] ?? "").substring(0, 40); // Column H = Ed
  const ii = String(row[8] ?? "").substring(0, 40); // Column I = Ilija
  if (a || b) {
    console.log(`Row ${String(rowNum).padStart(2)}: A="${a}" | B="${b}" | C="${c}" | F="${f}" | G="${g}" | H="${h}" | I="${ii}"`);
  }
});
