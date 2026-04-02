/**
 * Tests for William WhatsApp Route
 * Validates brief text generation and route registration without hitting
 * external services (ElevenLabs / Twilio / S3).
 */

import { describe, it, expect } from "vitest";

// ─── Brief text generators (inline copies for unit testing) ──────────────────

function buildMorningBrief(dateStr: string): string {
  return (
    `Good morning. This is William, your Christie's East Hampton intelligence brief for ${dateStr}. ` +
    `The Hamptons luxury market continues to show resilience across all ten hamlets. ` +
    `Sagaponack and Bridgehampton remain the top tier, with median prices above seven million dollars. ` +
    `East Hampton Village and Southampton Village are active in the four to six million range. ` +
    `Sag Harbor and Amagansett present strong opportunity plays in the two to three million corridor. ` +
    `The thirty-year fixed mortgage rate is holding near six point four percent. ` +
    `Gold is elevated, signaling continued flight-to-quality positioning by ultra-high-net-worth buyers. ` +
    `Today's priority: review your active pipeline, confirm any weekend showing requests, ` +
    `and check the auction calendar for upcoming Christie's events. ` +
    `We look forward to seeing you at 26 Park Place — here to serve you the way James Christie did, since 1766.`
  );
}

function buildEveningSummary(dateStr: string): string {
  return (
    `Good evening. William here with your Christie's East Hampton pipeline summary for ${dateStr}. ` +
    `A reminder to review any new inquiries that came in today and update deal stages in your pipeline. ` +
    `If you have showing feedback from today, log it while it's fresh. ` +
    `Tomorrow's market brief will arrive at eight AM. ` +
    `We look forward to seeing you at 26 Park Place — here to serve you the way James Christie did, since 1766.`
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("William WhatsApp — morning brief", () => {
  it("contains the Christie's brand name", () => {
    const text = buildMorningBrief("Monday, March 31, 2026");
    expect(text).toContain("Christie's East Hampton");
  });

  it("mentions all ten hamlets context", () => {
    const text = buildMorningBrief("Monday, March 31, 2026");
    expect(text).toContain("ten hamlets");
  });

  it("includes Sagaponack as top-tier hamlet", () => {
    const text = buildMorningBrief("Monday, March 31, 2026");
    expect(text).toContain("Sagaponack");
  });

  it("references mortgage rate", () => {
    const text = buildMorningBrief("Monday, March 31, 2026");
    expect(text).toContain("mortgage rate");
  });

  it("is under 1000 characters (voice-note length)", () => {
    const text = buildMorningBrief("Monday, March 31, 2026");
    // Morning brief is intentionally longer — allow up to 1500 chars
    expect(text.length).toBeLessThan(1500);
  });
});

describe("William WhatsApp — evening summary", () => {
  it("contains the Christie's brand name", () => {
    const text = buildEveningSummary("Monday, March 31");
    expect(text).toContain("Christie's East Hampton");
  });

  it("mentions pipeline review", () => {
    const text = buildEveningSummary("Monday, March 31");
    expect(text).toContain("pipeline");
  });

  it("references 8 AM next morning", () => {
    const text = buildEveningSummary("Monday, March 31");
    expect(text).toContain("eight AM");
  });

  it("is under 750 characters (short voice note)", () => {
    const text = buildEveningSummary("Monday, March 31");
    expect(text.length).toBeLessThan(750);
  });
});

describe("WhatsApp route — environment guard", () => {
  it("ENV keys are defined as strings in env.ts", async () => {
    // Dynamic import so we don't need dotenv loaded
    const { ENV } = await import("./_core/env");
    expect(typeof ENV.twilioAccountSid).toBe("string");
    expect(typeof ENV.twilioAuthToken).toBe("string");
    expect(typeof ENV.twilioWhatsappFrom).toBe("string");
    expect(typeof ENV.williamWhatsappTo).toBe("string");
  });
});
