/**
 * sheets-write.test.ts
 * Live write test: update "2 Old Hollow Road" → Status: Closed, Date Closed: April 2, 2026
 * Run once; verifies the column mapping is correct before wiring the UI.
 */

import { describe, it, expect } from "vitest";
import { updatePipelineStatus, readPipelineDeals } from "./sheets-helper";

describe("Google Sheets live write", () => {
  it("updates 2 Old Hollow Road to Closed with April 2, 2026 date", async () => {
    const result = await updatePipelineStatus(
      "2 Old Hollow Road",
      "Closed",
      "April 2, 2026"
    );

    console.log("Write result:", JSON.stringify(result));
    expect(result.success).toBe(true);
    expect(result.rowNumber).not.toBeNull();
    console.log(`Updated row ${result.rowNumber} in Sheet1`);

    // Verify the write by reading back the row
    const deals = await readPipelineDeals();
    const deal = deals.find(d => d.address.toLowerCase().includes("old hollow"));
    console.log("Verified deal:", JSON.stringify(deal));
    expect(deal?.status).toBe("Closed");
    expect(deal?.dateClosed).toBe("April 2, 2026");
  }, 20000);
});
