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

const result = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: "OUTPUTS!A31:I42",
  valueRenderOption: "FORMULA",
});

const rows = result.data.values ?? [];
console.log("Full OUTPUTS!A31:I42 with all columns (FORMULA render):");
console.log();
const headers = ["A(Year)","B(Volume)","C(GCI)","D(Royalty)","E(AgentSplits)","F(Overhead)","G(NOP)","H(Ed35%)","I(Ilija65%)"];
console.log(headers.map(h => h.padEnd(20)).join(" | "));
console.log("─".repeat(200));
rows.forEach((row, i) => {
  const rowNum = 31 + i;
  const padded = [...row, ...Array(9).fill("")].slice(0, 9);
  console.log(`Row ${rowNum}: ${padded.map(c => String(c).padEnd(20)).join(" | ")}`);
});
