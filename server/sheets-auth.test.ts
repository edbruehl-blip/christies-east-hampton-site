/**
 * sheets-auth.test.ts
 * Validates that GOOGLE_SERVICE_ACCOUNT_JSON is set, parses correctly,
 * and can authenticate against the Google Sheets API.
 *
 * NOTE: This test requires the sheet to be shared with the service account.
 * Sheet ID: 1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M
 */

import { describe, it, expect } from "vitest";
import { google } from "googleapis";

const SHEET_ID = "1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M";

describe("Google Sheets service account auth", () => {
  it("GOOGLE_SERVICE_ACCOUNT_JSON is set and valid JSON", () => {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    expect(raw, "GOOGLE_SERVICE_ACCOUNT_JSON must be set").toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.type).toBe("service_account");
    expect(parsed.client_email).toContain("christies-eh-sheets");
    expect(parsed.private_key).toContain("BEGIN PRIVATE KEY");
  });

  it("can create a Google Auth client from the credentials", () => {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
    const credentials = JSON.parse(raw);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    expect(auth).toBeTruthy();
  });

  it(
    "can read the Pipeline sheet metadata (requires sheet shared with service account)",
    async () => {
      const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
      const credentials = JSON.parse(raw);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const sheets = google.sheets({ version: "v4", auth });
      const res = await sheets.spreadsheets.get({
        spreadsheetId: SHEET_ID,
        fields: "spreadsheetId,properties.title",
      });
      expect(res.data.spreadsheetId).toBe(SHEET_ID);
      console.log("Sheet title:", res.data.properties?.title);
    },
    15000
  );
});
