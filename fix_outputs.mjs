/**
 * Sprint 11 — Growth Model v2 OUTPUTS Tab Fix
 *
 * Item 1: Overhead = MAX($200,000, GCI × 0.06) for rows 32-42
 *         NOP = GCI - Royalty - AgentSplits - Overhead (formula-driven)
 *         Ed 35% = NOP × 0.35
 *         Ilija 65% = NOP × 0.65
 *
 * Item 2: AnewHomes compounding table at 12.5% from $150K in 2027
 *         Row 50 columns B-K (2026-2035), plus extend to 2036 in col L
 *
 * Authorized by Ed Bruehl — April 14, 2026, 10:27 PM EDT
 * Dispatched by Perplexity (Intelligence Officer)
 */

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

// ─── ITEM 1: OVERHEAD + NOP + SPLIT FORMULAS ─────────────────────────────────
// Row 32 = 2026, Row 33 = 2027, ..., Row 42 = 2036
// Columns: C=GCI, D=Royalty, E=AgentSplits, F=Overhead, G=NOP, H=Ed35%, I=Ilija65%
//
// Formula logic per row N:
//   F = MAX(200000, C_N * 0.06)          ← overhead floor $200K or 6% of GCI
//   G = C_N - D_N - E_N - F_N            ← NOP = GCI - Royalty - Splits - Overhead
//   H = G_N * 0.35                        ← Ed 35%
//   I = G_N * 0.65                        ← Ilija 65%

const overheadNopData = [];
for (let row = 32; row <= 42; row++) {
  overheadNopData.push({
    range: `OUTPUTS!F${row}:I${row}`,
    values: [[
      `=MAX(200000,C${row}*0.06)`,
      `=C${row}-D${row}-E${row}-F${row}`,
      `=G${row}*0.35`,
      `=G${row}*0.65`,
    ]],
  });
}

// ─── ITEM 2: ANEWHOMES COMPOUNDING TABLE ─────────────────────────────────────
// Row 49 = YEAR header row: B=2026, C=2027, D=2028, E=2029, F=2030, G=2031, H=2032, I=2033, J=2034, K=2035
// Row 50 = ED 35% values
//
// Ed's ruling: $150,000 total AnewHomes profit by end 2027, growing 12.5%/yr through 2036
// Total pool = Ed's share / 0.35
//
// Year | Total AnewHomes Profit | Ed 35%
// 2026 | $50,000 (pre-scale)    | $17,500   ← keep existing 2026 value
// 2027 | $150,000               | $52,500
// 2028 | $168,750               | $59,063
// 2029 | $189,844               | $66,445
// 2030 | $213,574               | $74,751
// 2031 | $240,271               | $84,095
// 2032 | $270,305               | $94,607
// 2033 | $304,093               | $106,433
// 2034 | $342,105               | $119,737
// 2035 | $384,868               | $134,704
// 2036 | $432,976               | $151,542

// Check row 49 to confirm column positions for years
// From earlier read: B=2026, C=2027, D=2028, E=2029, F=2030, G=2031, H=2032, I=2033
// Need to check if J=2034, K=2035 exist — if not, add them
// Row 50 currently: B=17500, C=52500, D-K=175000 (flat)

// Ed 35% values per dispatch table
const anewHomesEd = {
  2026: 17500,    // keep existing
  2027: 52500,
  2028: 59063,
  2029: 66445,
  2030: 74751,
  2031: 84095,
  2032: 94607,
  2033: 106433,
  2034: 119737,
  2035: 134704,
  2036: 151542,
};

// Column mapping for row 49/50: B=2026, C=2027, D=2028, E=2029, F=2030, G=2031, H=2032, I=2033, J=2034, K=2035, L=2036
const yearToCol = {
  2026: "B", 2027: "C", 2028: "D", 2029: "E", 2030: "F",
  2031: "G", 2032: "H", 2033: "I", 2034: "J", 2035: "K", 2036: "L",
};

// Build AnewHomes update: update row 50 values and ensure row 49 has year headers for J, K, L
const anewHomesUpdates = [];

// Update year headers for 2034, 2035, 2036 in row 49 (in case they're missing)
anewHomesUpdates.push({
  range: "OUTPUTS!J49:L49",
  values: [[2034, 2035, 2036]],
});

// Update Ed 35% values in row 50
const edValues = Object.entries(anewHomesEd).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
anewHomesUpdates.push({
  range: "OUTPUTS!B50:L50",
  values: [edValues],
});

// ─── BATCH UPDATE ─────────────────────────────────────────────────────────────
const allUpdates = [...overheadNopData, ...anewHomesUpdates];

console.log(`Sending ${allUpdates.length} range updates...`);
allUpdates.forEach(u => console.log(`  ${u.range}: ${JSON.stringify(u.values[0]).substring(0, 80)}`));
console.log();

const response = await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: SPREADSHEET_ID,
  requestBody: {
    valueInputOption: "USER_ENTERED",  // allows formulas to be parsed
    data: allUpdates,
  },
});

console.log(`✓ Batch update complete. ${response.data.totalUpdatedCells} cells updated.`);
console.log();

// ─── VERIFICATION READ ────────────────────────────────────────────────────────
console.log("=== VERIFICATION: Reading back OUTPUTS!A31:I42 (computed values) ===");
const verify = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: "OUTPUTS!A31:I42",
  valueRenderOption: "FORMATTED_VALUE",
});

const rows = verify.data.values ?? [];
const headers = ["Year","Volume","GCI","Royalty","AgentSplits","Overhead","NOP","Ed35%","Ilija65%"];
console.log(headers.map(h => h.padEnd(18)).join(" | "));
console.log("─".repeat(180));
rows.forEach((row, i) => {
  const rowNum = 31 + i;
  const padded = [...row, ...Array(9).fill("")].slice(0, 9);
  console.log(`Row ${rowNum}: ${padded.map(c => String(c).padEnd(18)).join(" | ")}`);
});

console.log();
console.log("=== VERIFICATION: AnewHomes row 50 ===");
const anewVerify = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: "OUTPUTS!A49:L50",
  valueRenderOption: "FORMATTED_VALUE",
});
(anewVerify.data.values ?? []).forEach((row, i) => {
  console.log(`Row ${49 + i}: ${row.join(" | ")}`);
});
