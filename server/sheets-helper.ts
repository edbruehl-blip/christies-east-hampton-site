/**
 * sheets-helper.ts — Google Sheets API service account integration
 *
 * Auth: Service account JSON stored in GOOGLE_SERVICE_ACCOUNT_JSON env var.
 * The sheet must be shared with the service account email (Editor access).
 *
 * Sheet ID (locked): 1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M
 *
 * Real column map (Sheet1, row 2 is header row):
 *   A = ADDRESS
 *   B = TOWN
 *   C = TYPE
 *   D = PRICE
 *   E = STATUS          ← status updates go here
 *   F = AGENT
 *   G = SIDE
 *   H = ERS / EBB SIGNED
 *   I = EELI LINK
 *   J = SIGNS
 *   K = PHOTOS
 *   L = ZILLOW SHOWCASE
 *   M = DATE CLOSED     ← we append this column for close dates
 */

import { google } from "googleapis";

const SHEET_ID = "1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M";
const TAB = "Sheet1";

// ─── Auth ─────────────────────────────────────────────────────────────────────
function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

// ─── Read all rows from the Pipeline sheet ────────────────────────────────────
export async function readPipelineRows(): Promise<string[][]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:M`,
  });
  return (res.data.values as string[][]) ?? [];
}

// ─── Parse rows into structured deal objects ──────────────────────────────────
export interface PipelineDeal {
  rowNumber: number; // 1-indexed sheet row
  address: string;
  town: string;
  type: string;
  price: string;
  status: string;
  agent: string;
  side: string;
  ersSigned: string;
  eeliLink: string;
  signs: string;
  photos: string;
  zillowShowcase: string;
  dateClosed: string;
  isSectionHeader: boolean; // true for rows like "BUY-SIDE DEALS"
}

export async function readPipelineDeals(): Promise<PipelineDeal[]> {
  const rows = await readPipelineRows();
  const deals: PipelineDeal[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const address = row[0]?.trim() ?? "";
    if (!address) continue;

    // Section headers have address text but no price/status
    const hasPrice = !!row[3]?.trim();
    const isSectionHeader = !hasPrice && address.toUpperCase() === address;

    deals.push({
      rowNumber: i + 1,
      address,
      town: row[1]?.trim() ?? "",
      type: row[2]?.trim() ?? "",
      price: row[3]?.trim() ?? "",
      status: row[4]?.trim() ?? "",
      agent: row[5]?.trim() ?? "",
      side: row[6]?.trim() ?? "",
      ersSigned: row[7]?.trim() ?? "",
      eeliLink: row[8]?.trim() ?? "",
      signs: row[9]?.trim() ?? "",
      photos: row[10]?.trim() ?? "",
      zillowShowcase: row[11]?.trim() ?? "",
      dateClosed: row[12]?.trim() ?? "",
      isSectionHeader,
    });
  }

  return deals;
}

// ─── Find a row by address (column A) and return its row number (1-indexed) ──
export async function findRowByAddress(address: string): Promise<number | null> {
  const rows = await readPipelineRows();
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0]?.toLowerCase().trim() === address.toLowerCase().trim()) {
      return i + 1; // 1-indexed for Sheets API
    }
  }
  return null;
}

// ─── Update a specific cell ───────────────────────────────────────────────────
export async function updateCell(range: string, value: string): Promise<void> {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[value]] },
  });
}

// ─── Update status only (by address) ─────────────────────────────────────────
// Column E = STATUS (index 4), Column M = DATE CLOSED (index 12)
export async function updatePipelineStatus(
  address: string,
  status: string,
  dateClosed?: string
): Promise<{ success: boolean; rowNumber: number | null }> {
  const rowNumber = await findRowByAddress(address);
  if (rowNumber === null) return { success: false, rowNumber: null };

  const sheets = getSheetsClient();

  // Update STATUS in column E
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!E${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[status]] },
  });

  // Write DATE CLOSED in column M if provided
  if (dateClosed) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!M${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[dateClosed]] },
    });
  }

  return { success: true, rowNumber };
}

// ─── Append a new deal row ────────────────────────────────────────────────────
export async function appendPipelineRow(deal: {
  address: string;
  town?: string;
  type?: string;
  price?: string;
  status?: string;
  agent?: string;
  side?: string;
  ersSigned?: string;
  eeliLink?: string;
  signs?: string;
  photos?: string;
  zillowShowcase?: string;
  dateClosed?: string;
}): Promise<{ rowNumber: number }> {
  const sheets = getSheetsClient();

  const values = [
    deal.address,
    deal.town ?? "",
    deal.type ?? "",
    deal.price ?? "",
    deal.status ?? "",
    deal.agent ?? "",
    deal.side ?? "",
    deal.ersSigned ?? "",
    deal.eeliLink ?? "",
    deal.signs ?? "",
    deal.photos ?? "",
    deal.zillowShowcase ?? "",
    deal.dateClosed ?? "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:M`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });

  const allRows = await readPipelineRows();
  return { rowNumber: allRows.length };
}
