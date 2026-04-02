/**
 * server/market-route.ts
 * GET /api/market-data
 *
 * Server-side proxy for Yahoo Finance + CoinGecko.
 * Bypasses CORS restrictions that block direct browser requests.
 * Returns all ticker values in a single JSON payload.
 */
import type { Express } from "express";

interface YFResult {
  price: number;
  change: number;
}

async function fetchYF(symbol: string): Promise<YFResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MarketProxy/1.0)",
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const j = await res.json() as Record<string, unknown>;
    const result = (j as { chart?: { result?: Array<{ meta?: Record<string, number> }> } })?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice ?? meta.previousClose;
    const prev = meta.chartPreviousClose ?? meta.previousClose;
    const change = prev ? ((price - prev) / prev) * 100 : 0;
    return { price, change };
  } catch {
    return null;
  }
}

async function fetchBTC(): Promise<{ price: number; change: number } | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
      { signal: AbortSignal.timeout(8000) }
    );
    const j = await res.json() as { bitcoin?: { usd?: number; usd_24h_change?: number } };
    const price = j?.bitcoin?.usd;
    const change = j?.bitcoin?.usd_24h_change ?? 0;
    if (!price) return null;
    return { price, change };
  } catch {
    return null;
  }
}

// ─── Mortgage rate cache ─────────────────────────────────────────────────────
// FRED series MORTGAGE30US — Freddie Mac PMMS, updated weekly on Thursdays.
// Cache for 24 hours to avoid hammering the endpoint on every page load.
let mortgageCache: { rate: string; fetchedAt: number } = {
  rate: "6.38%",   // last known value — overwritten on first successful fetch
  fetchedAt: 0,
};

async function fetchMortgageRate(): Promise<string> {
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();
  if (now - mortgageCache.fetchedAt < CACHE_TTL_MS) {
    return mortgageCache.rate;
  }
  try {
    // FRED public CSV endpoint — no API key required
    const url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=MORTGAGE30US";
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MarketProxy/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`FRED responded ${res.status}`);
    const csv = await res.text();
    // CSV format: DATE,VALUE\n2024-01-04,6.62\n...
    const lines = csv.trim().split("\n");
    // Last non-empty line with a numeric value
    for (let i = lines.length - 1; i >= 1; i--) {
      const parts = lines[i].split(",");
      const val = parseFloat(parts[1]);
      if (!isNaN(val)) {
        const formatted = `${val.toFixed(2)}%`;
        mortgageCache = { rate: formatted, fetchedAt: now };
        return formatted;
      }
    }
    throw new Error("No valid rate found in FRED CSV");
  } catch (err) {
    console.warn("[market-route] FRED mortgage fetch failed, using cached value:", err);
    // Return stale cache or last known fallback — never return null
    return mortgageCache.rate;
  }
}

export function registerMarketRoute(app: Express) {
  app.get("/api/market-data", async (_req, res) => {
    try {
      // Fetch all in parallel
      const [sp, gold, silver, vix, tyx, btc] = await Promise.all([
        fetchYF("%5EGSPC"),   // S&P 500
        fetchYF("GC%3DF"),    // Gold futures
        fetchYF("SI%3DF"),    // Silver futures
        fetchYF("%5EVIX"),    // VIX
        fetchYF("%5ETYX"),    // 30Y Treasury yield
        fetchBTC(),           // Bitcoin
      ]);

      const payload: Record<string, string | null> = {
        sp500: sp
          ? `${sp.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${sp.change >= 0 ? "+" : ""}${sp.change.toFixed(2)}%)`
          : null,
        gold: gold
          ? `$${gold.price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} /oz (${gold.change >= 0 ? "+" : ""}${gold.change.toFixed(2)}%)`
          : null,
        silver: silver
          ? `$${silver.price.toFixed(2)} /oz (${silver.change >= 0 ? "+" : ""}${silver.change.toFixed(2)}%)`
          : null,
        vix: vix
          ? `${vix.price.toFixed(2)} (${vix.change >= 0 ? "+" : ""}${vix.change.toFixed(2)}%)`
          : null,
        treasury: tyx
          ? `${tyx.price.toFixed(2)}%`
          : null,
        btc: btc
          ? `$${btc.price.toLocaleString("en-US", { maximumFractionDigits: 0 })} (${btc.change >= 0 ? "+" : ""}${btc.change.toFixed(2)}%)`
          : null,
        // 30Y Fixed Mortgage — Freddie Mac PMMS via FRED (series MORTGAGE30US, 24h cache)
        mortgage: await fetchMortgageRate(),
        updatedAt: new Date().toISOString(),
      };

      res.json(payload);
    } catch (err) {
      console.error("[market-route] error:", err);
      res.status(500).json({ error: "market data unavailable" });
    }
  });
}
