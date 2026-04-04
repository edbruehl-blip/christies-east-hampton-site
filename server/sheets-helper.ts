/**
 * sheets-helper.ts — Google Sheets API service account integration
 *
 * Auth: Service account JSON stored in GOOGLE_SERVICE_ACCOUNT_JSON env var.
 * The sheet must be shared with the service account email (Editor access).
 *
 * Sheet ID (locked): 1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M
 *
 * Real column map (Sheet1, row 2 is header row, row 1 is blank):
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
 *   M = YOUTUBE LONG
 *   N = YOUTUBE SHORT
 *   O = BROCHURE LINK
 *   P = E-BLAST
 *   Q = FEEDS
 *   R = AUCTION?
 *   S = PRIVATE COLLECTOR
 *   T = ACCESS (KEY)
 *   U = DATE CLOSED     ← close dates go here (column 21, index 20)
 *
 * Row structure:
 *   Row 1 = blank
 *   Row 2 = column headers
 *   Row 3+ = data rows (section headers like "BUY-SIDE DEALS" interspersed)
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
    range: `${TAB}!A:U`,  // A through U (21 columns)
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

    // Skip the header row (row 2, index 1 — contains "ADDRESS", "TOWN", etc.)
    if (address === "ADDRESS") continue;

    // Section headers have address text but no price/status
    const hasPrice = !!row[3]?.trim();
    const isSectionHeader = !hasPrice && address.toUpperCase() === address;

    deals.push({
      rowNumber: i + 1,
      address,
      town:           row[1]?.trim()  ?? "",
      type:           row[2]?.trim()  ?? "",
      price:          row[3]?.trim()  ?? "",
      status:         row[4]?.trim()  ?? "",
      agent:          row[5]?.trim()  ?? "",
      side:           row[6]?.trim()  ?? "",
      ersSigned:      row[7]?.trim()  ?? "",
      eeliLink:       row[8]?.trim()  ?? "",
      signs:          row[9]?.trim()  ?? "",
      photos:         row[10]?.trim() ?? "",
      zillowShowcase: row[11]?.trim() ?? "",
      // Columns M–T (indices 12–19) are media/marketing fields — not surfaced in the UI
      dateClosed:     row[20]?.trim() ?? "",  // Column U (index 20)
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
// Column E = STATUS (index 4), Column U = DATE CLOSED (index 20)
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

  // Write DATE CLOSED in column U if provided
  if (dateClosed) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!U${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[dateClosed]] },
    });
  }

  return { success: true, rowNumber };
}

// ─// ─── Append a new deal row ────────────────────────────────────────────
// Writes A–L + U (address through Zillow Showcase + Date Closed) — media columns M–T left blank
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

  // Build a 21-column row (A–U), leaving media columns M–T blank
  const values = new Array(21).fill("");
  values[0]  = deal.address;
  values[1]  = deal.town            ?? "";
  values[2]  = deal.type            ?? "";
  values[3]  = deal.price           ?? "";
  values[4]  = deal.status          ?? "";
  values[5]  = deal.agent           ?? "";
  values[6]  = deal.side            ?? "";
  values[7]  = deal.ersSigned       ?? "";
  values[8]  = deal.eeliLink        ?? "";  // Column I
  values[9]  = deal.signs           ?? "";  // Column J
  values[10] = deal.photos          ?? "";  // Column K
  values[11] = deal.zillowShowcase  ?? "";  // Column L
  values[20] = deal.dateClosed      ?? "";  // Column Umn U

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:U`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });

  const allRows = await readPipelineRows();
  return { rowNumber: allRows.length };
}

// ─── Intelligence Web Sheet ───────────────────────────────────────────────────
const INTEL_WEB_SHEET_ID = "1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0";
const INTEL_WEB_TAB = "Intelligence Web";

export interface IntelWebEntity {
  entityName: string;
  entityType: string;  // WHALE | RECRUIT | COMPETITOR | PARTNER | INSTITUTION | MEDIA
  tier: string;        // TIER 1 | TIER 2 | ARCHETYPE | WATCH | ACTIVE | ATTORNEY
  currentFirm: string;
  territory: string;
  connection1: string;
  connection2: string;
  connection3: string;
  connectionType: string;
  status: string;
  lastIntelDate: string;
  notes: string;
  owner: string;
  archetypeMatch: string;
  audience: string;    // Audience column (multi-value tags: Jarvis_Top_Agents, Whale_Intelligence, Auction_Referrals)
}

export async function readIntelWebRows(): Promise<IntelWebEntity[]> {
  const sheets = getSheetsClient();
  let rows: string[][];
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: INTEL_WEB_SHEET_ID,
      range: `${INTEL_WEB_TAB}!A:O`,
    });
    rows = (res.data.values as string[][]) ?? [];
  } catch {
    return [];
  }
  // Row 1 = headers, skip it
  const dataRows = rows.slice(1);
  return dataRows
    .filter(r => r && r[0] && r[0].trim())
    .map(r => ({
      entityName:      r[0]  ?? '',
      entityType:      r[1]  ?? '',
      tier:            r[2]  ?? '',
      currentFirm:     r[3]  ?? '',
      territory:       r[4]  ?? '',
      connection1:     r[5]  ?? '',
      connection2:     r[6]  ?? '',
      connection3:     r[7]  ?? '',
      connectionType:  r[8]  ?? '',
      status:          r[9]  ?? '',
      lastIntelDate:   r[10] ?? '',
      notes:           r[11] ?? '',
      owner:           r[12] ?? '',
      archetypeMatch:  r[13] ?? '',
      audience:        r[14] ?? '',
    }));
}
