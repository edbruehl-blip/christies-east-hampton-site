/**
 * Perplexity API credentials validation test
 * Confirms PERPLEXITY_API_KEY is present and returns a valid response.
 */
import { describe, it, expect } from "vitest";
import "dotenv/config";

describe("Perplexity API credentials", () => {
  it("PERPLEXITY_API_KEY is set in environment", () => {
    const key = process.env.PERPLEXITY_API_KEY;
    expect(key, "PERPLEXITY_API_KEY must be set").toBeTruthy();
    expect(key!.length, "PERPLEXITY_API_KEY must be at least 10 chars").toBeGreaterThan(10);
  });

  it("Perplexity API returns a valid response for a simple prompt", async () => {
    const key = process.env.PERPLEXITY_API_KEY;
    if (!key) {
      throw new Error("PERPLEXITY_API_KEY not set — cannot test");
    }

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          { role: "user", content: "Reply with exactly the word: CONFIRMED" },
        ],
        max_tokens: 10,
        temperature: 0,
      }),
    });

    expect(response.status, `Perplexity API returned ${response.status}`).toBe(200);

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices?.[0]?.message?.content ?? "";
    expect(content.length, "Response content should not be empty").toBeGreaterThan(0);
  }, 30_000); // 30s timeout for live API call
});
