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
 *   U = DATE CLOSED          ← close dates go here (column 21, index 20)
 *   V = PROPERTY REPORT DATE  ← Pierre Debbas property report date (column 22, index 21)
 *   W = PROPERTY REPORT LINK  ← Pierre Debbas property report link (column 23, index 22)
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
    range: `${TAB}!A:W`,  // A through W (23 columns)
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
  propertyReportDate: string; // V: Pierre Debbas property report date
  propertyReportLink: string; // W: Pierre Debbas property report link
  isSectionHeader: boolean; // true for rows like "BUY-SIDE DEALS"
  category: string; // section header label this deal falls under (e.g. "ACTIVE LISTINGS")
}

export async function readPipelineDeals(): Promise<PipelineDeal[]> {
  const rows = await readPipelineRows();
  const rawDeals: PipelineDeal[] = [];
  let currentCategory = '';

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
    if (isSectionHeader) currentCategory = address;

    rawDeals.push({
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
      dateClosed:          row[20]?.trim() ?? "",  // Column U (index 20)
      propertyReportDate:  row[21]?.trim() ?? "",  // Column V (index 21)
      propertyReportLink:  row[22]?.trim() ?? "",  // Column W (index 22)
      isSectionHeader,
      category: isSectionHeader ? address : currentCategory,
    });
  }

  // De-duplicate non-header rows by address (last occurrence wins — preserves most recent status/category)
  // Addresses that appear in multiple sections (e.g. Pending + Quiet) are collapsed to one row.
  const lastSeen = new Map<string, PipelineDeal>();
  for (const d of rawDeals) {
    if (!d.isSectionHeader) lastSeen.set(d.address.toLowerCase(), d);
  }
  const dedupedKeys = new Set<string>();
  const finalDeals: PipelineDeal[] = [];
  for (const d of rawDeals) {
    if (d.isSectionHeader) {
      finalDeals.push(d);
    } else {
      const key = d.address.toLowerCase();
      const canonical = lastSeen.get(key);
      if (canonical && !dedupedKeys.has(key)) {
        dedupedKeys.add(key);
        finalDeals.push(canonical); // insert the last-seen version at first-occurrence position
      }
    }
  }
  return finalDeals;
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

// ─── Update Property Report columns (V + W) by address ─────────────────────────
// Column V = PROPERTY REPORT DATE (index 21), Column W = PROPERTY REPORT LINK (index 22)
export async function updatePropertyReport(
  address: string,
  reportDate: string,
  reportLink: string
): Promise<{ success: boolean; rowNumber: number | null }> {
  const rowNumber = await findRowByAddress(address);
  if (rowNumber === null) return { success: false, rowNumber: null };

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!V${rowNumber}:W${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[reportDate, reportLink]] },
  });

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

// ─── Market Matrix Sheet ─────────────────────────────────────────────────────
const MARKET_MATRIX_SHEET_ID = "176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g";
const MARKET_MATRIX_TAB = "Market Matrix";

export interface MarketMatrixHamlet {
  hamlet: string;
  cisScore: number;
  median2025: string;       // e.g. "$5,250,000"
  dollarVolumeShare: string; // e.g. "7%"
  dollarVolume2025: string;  // e.g. "$408,910,000"
  sales2025: number;
  direction4Year: string;   // "Up" | "Down" | "Flat"
  schoolDistrict: string;
  median2022: string;
  median2023: string;
  median2024: string;
}

export async function readMarketMatrixRows(): Promise<MarketMatrixHamlet[]> {
  const sheets = getSheetsClient();
  let rows: string[][];
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: MARKET_MATRIX_SHEET_ID,
      range: `${MARKET_MATRIX_TAB}!A7:K18`, // Row 7 = headers, rows 8-18 = 11 hamlets
    });
    rows = (res.data.values as string[][]) ?? [];
  } catch {
    return [];
  }
  // Row 0 is the header row — skip it
  const dataRows = rows.slice(1);
  return dataRows
    .filter(r => r && r[0] && r[0].trim())
    .map(r => ({
      hamlet:            r[0]  ?? '',
      cisScore:          parseFloat(r[1] ?? '0') || 0,
      median2025:        r[2]  ?? '',
      dollarVolumeShare: r[3]  ?? '',
      dollarVolume2025:  r[4]  ?? '',
      sales2025:         parseInt(r[5] ?? '0', 10) || 0,
      direction4Year:    r[6]  ?? '',
      schoolDistrict:    r[7]  ?? '',
      median2022:        r[8]  ?? '',
      median2023:        r[9]  ?? '',
      median2024:        r[10] ?? '',
    }));
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
  lastTouch: string;   // Column P — last contact date
  cadence: string;     // Column Q — contact cadence
}

export async function readIntelWebRows(): Promise<IntelWebEntity[]> {
  const sheets = getSheetsClient();
  let rows: string[][];
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: INTEL_WEB_SHEET_ID,
      range: `${INTEL_WEB_TAB}!A:Q`,
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
      lastTouch:       r[15] ?? '',
      cadence:         r[16] ?? '',
    }));
}

// ─── Growth Model v2 Sheet ────────────────────────────────────────────────────
// Sheet ID: 1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag
// Tabs: ROSTER, ASSUMPTIONS, LEADERBOARD, OUTPUTS, CONTACTS_STAGING
// Auth: service account (publicProcedure — no session cookie required)

const GROWTH_MODEL_SHEET_ID = "1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag";

export interface GrowthModelOutputRow {
  year: number;
  agents: number;
  existingGci: number;
  targetedGci: number;
  organicGci: number;
  totalGci: number;
  houseTake: number;
  avgPerAgent: number;
}

export interface GrowthModelAgent {
  name: string;
  office: string;
  role: string;
  status: string;
  startYear: number;
  year1Gci: number;
  gci2026: number;
  gci2027: number;
  gci2028: number;
  gci2029: number;
  gci2030: number;
  gci2031: number;
  split: string;
  notes: string;
}

export interface GrowthModelData {
  outputs: GrowthModelOutputRow[];
  agents: GrowthModelAgent[];
  assumptions: { parameter: string; value: string }[];
  totalGci2026: number;
  houseTake2026: number;
  agentCount2026: number;
}

export async function readGrowthModelData(): Promise<GrowthModelData> {
  const sheets = getSheetsClient();

  const empty: GrowthModelData = {
    outputs: [],
    agents: [],
    assumptions: [],
    totalGci2026: 0,
    houseTake2026: 0,
    agentCount2026: 0,
  };

  try {
    // Read OUTPUTS tab (rows 1-10, cols A-H)
    const outputsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: GROWTH_MODEL_SHEET_ID,
      range: "OUTPUTS!A1:H10",
    });
    const outputRows = (outputsRes.data.values as string[][]) ?? [];
    // Row 0 = title, Row 1 = headers, Rows 2-7 = data years
    const outputs: GrowthModelOutputRow[] = outputRows
      .slice(2)
      .filter(r => r && r[0] && !isNaN(parseFloat(r[0])))
      .map(r => ({
        year:          parseInt(r[0], 10),
        agents:        parseInt(r[1] ?? '0', 10) || 0,
        existingGci:   parseFloat(r[2] ?? '0') || 0,
        targetedGci:   parseFloat(r[3] ?? '0') || 0,
        organicGci:    parseFloat(r[4] ?? '0') || 0,
        totalGci:      parseFloat(r[5] ?? '0') || 0,
        houseTake:     parseFloat(r[6] ?? '0') || 0,
        avgPerAgent:   parseFloat(r[7] ?? '0') || 0,
      }));

    // Read ROSTER tab (rows 1-45, cols A-Q)
    const rosterRes = await sheets.spreadsheets.values.get({
      spreadsheetId: GROWTH_MODEL_SHEET_ID,
      range: "ROSTER!A1:Q45",
    });
    const rosterRows = (rosterRes.data.values as string[][]) ?? [];
    // Row 0 = title, Row 1 = headers, Row 2+ = data
    const agents: GrowthModelAgent[] = rosterRows
      .slice(2)
      .filter(r => r && r[0] && r[2] && r[3] && !r[0].includes('SUBTOTAL') && !r[0].includes('ENGINE') && !r[0].includes('TOTAL') && !r[0].includes('HOUSE') && !r[0].includes('AGENT COUNT') && !r[0].includes('EXISTING AGENTS'))
      .map(r => ({
        name:      r[0]  ?? '',
        office:    r[1]  ?? '',
        role:      r[2]  ?? '',
        status:    r[3]  ?? '',
        startYear: parseInt(r[4] ?? '0', 10) || 0,
        year1Gci:  parseFloat(r[5] ?? '0') || 0,
        gci2026:   parseFloat(r[8]  ?? '0') || 0,
        gci2027:   parseFloat(r[9]  ?? '0') || 0,
        gci2028:   parseFloat(r[10] ?? '0') || 0,
        gci2029:   parseFloat(r[11] ?? '0') || 0,
        gci2030:   parseFloat(r[12] ?? '0') || 0,
        gci2031:   parseFloat(r[13] ?? '0') || 0,
        split:     r[14] ?? '',
        notes:     r[16] ?? '',
      }));

    // Read ASSUMPTIONS tab
    const assumptionsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: GROWTH_MODEL_SHEET_ID,
      range: "ASSUMPTIONS!A1:C10",
    });
    const assumptionRows = (assumptionsRes.data.values as string[][]) ?? [];
    const assumptions = assumptionRows
      .slice(2)
      .filter(r => r && r[0] && r[1])
      .map(r => ({ parameter: r[0] ?? '', value: String(r[1] ?? '') }));

    // Summary values from OUTPUTS
    const row2026 = outputs.find(o => o.year === 2026);

    return {
      outputs,
      agents,
      assumptions,
      totalGci2026:   row2026?.totalGci   ?? 0,
      houseTake2026:  row2026?.houseTake  ?? 0,
      agentCount2026: row2026?.agents     ?? 0,
    };
  } catch {
    return empty;
  }
}

// ─── Growth Model v2 — VOLUME tab ────────────────────────────────────────────
// Reads the VOLUME tab: agent, role, status, start year, projected/actual per year
// Sales volume only. No GCI. This is the single source for the FUTURE tab agent table.

export interface VolumeAgent {
  name: string;
  role: string;
  status: string;
  startYear: string;
  proj2026: number;
  act2026: number;
  projGci2026: number;
  actGci2026: number;
  proj2027: number;
  act2027: number;
  projGci2027: number;
  actGci2027: number;
  proj2028: number;
  act2028: number;
  projGci2028: number;
  actGci2028: number;
}

export interface VolumeTotal {
  proj2026: number;
  act2026: number;
  projGci2026: number;
  actGci2026: number;
  proj2027: number;
  act2027: number;
  projGci2027: number;
  actGci2027: number;
  proj2028: number;
  act2028: number;
  projGci2028: number;
  actGci2028: number;
  proj2029: number;
  act2029: number;
  proj2030: number;
  act2030: number;
  proj2031: number;
  act2031: number;
}

function parseDollar(s: string | undefined): number {
  if (!s) return 0;
  return parseInt(s.replace(/[$,TBD\s]/g, '') || '0', 10) || 0;
}

export async function readGrowthModelVolume(): Promise<{ agents: VolumeAgent[]; total: VolumeTotal }> {
  const empty = {
    agents: [],
    total: {
      proj2026: 0, act2026: 0, projGci2026: 0, actGci2026: 0,
      proj2027: 0, act2027: 0, projGci2027: 0, actGci2027: 0,
      proj2028: 0, act2028: 0, projGci2028: 0, actGci2028: 0,
      proj2029: 0, act2029: 0,
      proj2030: 0, act2030: 0,
      proj2031: 0, act2031: 0,
    },
  };
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    // Columns A–V: 4 meta cols + 2 data cols per year (proj vol, act vol) × 6 years
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: GROWTH_MODEL_SHEET_ID,
      range: 'VOLUME!A1:V20',
    });
    const rows = res.data.values ?? [];
    if (rows.length < 2) return empty;

    const agents: VolumeAgent[] = [];
    let total: VolumeTotal = {
      proj2026: 0, act2026: 0, projGci2026: 0, actGci2026: 0,
      proj2027: 0, act2027: 0, projGci2027: 0, actGci2027: 0,
      proj2028: 0, act2028: 0, projGci2028: 0, actGci2028: 0,
      proj2029: 0, act2029: 0,
      proj2030: 0, act2030: 0,
      proj2031: 0, act2031: 0,
    };

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || !r[0]) continue;
      const name = String(r[0]).trim();
      // Skip total row and upside row
      if (name.startsWith('TOTAL') || name.startsWith('2026 Broker')) continue;
      // Skip notes row (very long string)
      if (name.length > 60) continue;

      // Column layout (0-indexed):
      // 0=Name 1=Role 2=Status 3=StartYear
      // 4=ProjVol2026 5=ActVol2026 6=ProjGCI2026 7=ActGCI2026
      // 8=ProjVol2027 9=ActVol2027 10=ProjGCI2027 11=ActGCI2027
      // 12=ProjVol2028 13=ActVol2028 14=ProjGCI2028 15=ActGCI2028
      agents.push({
        name,
        role: r[1] ? String(r[1]).trim() : '',
        status: r[2] ? String(r[2]).trim() : '',
        startYear: r[3] ? String(r[3]).trim() : '',
        proj2026:    parseDollar(r[4]),
        act2026:     parseDollar(r[5]),
        projGci2026: parseDollar(r[6]),
        actGci2026:  parseDollar(r[7]),
        proj2027:    parseDollar(r[8]),
        act2027:     parseDollar(r[9]),
        projGci2027: parseDollar(r[10]),
        actGci2027:  parseDollar(r[11]),
        proj2028:    parseDollar(r[12]),
        act2028:     parseDollar(r[13]),
        projGci2028: parseDollar(r[14]),
        actGci2028:  parseDollar(r[15]),
      });
    }

    // Find TOTAL row
    // VOLUME tab column layout (0-indexed):
    // 0=Name 1=Role 2=Status 3=Start
    // 4=ProjVol2026 5=ActVol2026 6=ProjGCI2026 7=ActGCI2026
    // 8=ProjVol2027 9=ActVol2027 10=ProjGCI2027 11=ActGCI2027
    // 12=ProjVol2028 13=ActVol2028 14=ProjGCI2028 15=ActGCI2028
    // 16=ProjVol2029 17=ActVol2029
    // 18=ProjVol2030 19=ActVol2030
    // 20=ProjVol2031 21=ActVol2031
    const totalRow = rows.find(r => r && String(r[0]).startsWith('TOTAL'));
    if (totalRow) {
      total = {
        proj2026:    parseDollar(totalRow[4]),
        act2026:     parseDollar(totalRow[5]),
        projGci2026: parseDollar(totalRow[6]),
        actGci2026:  parseDollar(totalRow[7]),
        proj2027:    parseDollar(totalRow[8]),
        act2027:     parseDollar(totalRow[9]),
        projGci2027: parseDollar(totalRow[10]),
        actGci2027:  parseDollar(totalRow[11]),
        proj2028:    parseDollar(totalRow[12]),
        act2028:     parseDollar(totalRow[13]),
        projGci2028: parseDollar(totalRow[14]),
        actGci2028:  parseDollar(totalRow[15]),
        proj2029:    parseDollar(totalRow[16]),
        act2029:     parseDollar(totalRow[17]),
        proj2030:    parseDollar(totalRow[18]),
        act2030:     parseDollar(totalRow[19]),
        proj2031:    parseDollar(totalRow[20]),
        act2031:     parseDollar(totalRow[21]),
      };
    }

    return { agents, total };
  } catch {
    return empty;
  }
}
