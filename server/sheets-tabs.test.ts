import { describe, it } from "vitest";
import { google } from "googleapis";

describe("Google Sheets tab discovery", () => {
  it("lists all tabs and reads first 10 rows of Sheet1", async () => {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
    const credentials = JSON.parse(raw);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.get({
      spreadsheetId: "1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M",
      fields: "sheets.properties.title,sheets.properties.sheetId",
    });
    console.log("Sheet tabs found:");
    res.data.sheets?.forEach(s =>
      console.log(`  - "${s.properties?.title}" (id: ${s.properties?.sheetId})`)
    );

    // Read first 10 rows of Sheet1 to understand column structure
    const rowsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: "1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M",
      range: "Sheet1!A1:L10",
    });
    console.log("\nFirst 10 rows of Sheet1:");
    (rowsRes.data.values ?? []).forEach((row, i) =>
      console.log(`  Row ${i + 1}:`, JSON.stringify(row))
    );
  }, 15000);
});
