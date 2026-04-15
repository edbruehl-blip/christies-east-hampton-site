import { google } from "googleapis";

const SPREADSHEET_ID = "1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag";
const RANGE = "OUTPUTS!A31:I42";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

const auth = getAuth();
const sheets = google.sheets({ version: "v4", auth });

const result = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: RANGE,
  valueRenderOption: "FORMULA",
});

const rows = result.data.values ?? [];
console.log(`Range: ${result.data.range}`);
console.log(`Rows returned: ${rows.length}`);
console.log();

// Full table
const colHeaders = ["A","B","C","D","E","F","G","H","I"];
console.log("ROW\t" + colHeaders.join("\t"));
console.log("─".repeat(160));
rows.forEach((row, i) => {
  const rowNum = 31 + i;
  const padded = [...row, ...Array(9).fill("")].slice(0, 9);
  console.log(`${rowNum}\t${padded.join("\t")}`);
});

console.log();
console.log("=== H (Ed 35%) and I (Ilija 65%) columns only ===");
console.log("─".repeat(160));
rows.forEach((row, i) => {
  const rowNum = 31 + i;
  const padded = [...row, ...Array(9).fill("")].slice(0, 9);
  const h = padded[7];
  const ii = padded[8];
  console.log(`Row ${rowNum}:`);
  console.log(`  H (Ed 35%):    ${h}`);
  console.log(`  I (Ilija 65%): ${ii}`);
  console.log();
});
