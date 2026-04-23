import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { z } from "zod";
import { getDb } from "./db";
import { pipeline, dailyBrief } from "../drizzle/schema";
import { readPipelineDeals, appendPipelineRow, updatePipelineStatus, updatePropertyReport, readIntelWebRows, readMarketMatrixRows, readGrowthModelData, readGrowthModelVolume, getPipelineKpis, readAscensionArcData, readHamptonsMedian, readHeadcountTable, readMilestones, readPartnerCards } from './sheets-helper';
import { generateProFormaPDF } from './proforma-generator';
import { beehiivSubscribe, beehiivGetStats, sendTestEmail } from './newsletter';
import { syncListings } from './listings-sync-route';
import { FLAGSHIP_LETTER_TEXT, CHRISTIES_LETTER_TEXT } from './letter-content';
import { dealEngineRouter } from './routers/dealEngine';
import { eq, asc } from "drizzle-orm";


// ─── AUTH MODEL — READ THIS BEFORE ANY HARDENING PASS ────────────────────────
//
// TWO AUTH LAYERS EXIST IN THIS ROUTER. DO NOT CONFLATE THEM.
//
// 1. SERVICE ACCOUNT AUTH (Google Sheets reads)
//    Procedures: pipe.sheetDeals, intel.webEntities, market.dataTimestamp
//    Auth layer: GOOGLE_SERVICE_ACCOUNT_JSON (server-side, automatic, no cookie)
//    Rule: MUST be publicProcedure. The service account IS the credential.
//          Promoting these to protectedProcedure blocks the call before the
//          service account runs — the Sheet never loads. Session cookie irrelevant.
//
// 2. SESSION AUTH (write operations + internal DB reads)
//    Procedures: pipe.updateSheetStatus, pipe.appendSheet, pipe.list,
//                pipe.upsert, pipe.delete, pipe.importFromProfile,
//                newsletter.getStats
//    Auth layer: Manus OAuth session cookie (ctx.user must be present)
//    Rule: MUST be protectedProcedure. Ed must be logged in to write.
//
// ─────────────────────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,
  dealEngine: dealEngineRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),


  // ─── Pipeline CRUD ──────────────────────────────────────────────────────────
  pipe: router({
    // Read live deals directly from the Google Sheet (single source of truth)
    // Auth: GOOGLE_SERVICE_ACCOUNT_JSON is the auth layer — no session cookie required.
    // The service account credential handles Google Sheets access server-side.
    // Write procedures (updateSheetStatus, appendSheet) remain protectedProcedure.
    // Live pipeline KPIs for PDF export injection (Sprint 41)
    getKpis: publicProcedure.query(async () => {
      return await getPipelineKpis();
    }),

    sheetDeals: publicProcedure.query(async () => {
      try {
        const deals = await readPipelineDeals();
        return { deals, error: null };
      } catch (err: any) {
        return { deals: [], error: err.message ?? 'Failed to read sheet' };
      }
    }),

    // Write a status update directly to the Google Sheet
    // P5: protected — write access is internal only
    updateSheetStatus: protectedProcedure
      .input(z.object({
        address: z.string().min(1),
        status: z.string().min(1),
        date: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await updatePipelineStatus(input.address, input.status, input.date);
        if (!result.success) throw new Error(`Row not found for address: ${input.address}`);
        return result;
      }),

    // Update Property Report Date + Link (columns V + W) for a deal
    // P5: protected — write access is internal only (Angel manages entries)
    updatePropertyReport: protectedProcedure
      .input(z.object({
        address: z.string().min(1),
        reportDate: z.string().min(1),
        reportLink: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        const result = await updatePropertyReport(input.address, input.reportDate, input.reportLink);
        if (!result.success) throw new Error(`Row not found for address: ${input.address}`);
        return result;
      }),

    // Append a new deal row to the Google Sheet
    // P5: protected — write access is internal only
    appendSheet: protectedProcedure
      .input(z.object({
        address: z.string().min(1),
        town: z.string().optional(),
        type: z.string().optional(),
        price: z.string().optional(),
        status: z.string().optional(),
        agent: z.string().optional(),
        side: z.string().optional(),
        ersSigned: z.string().optional(),
        eeliLink: z.string().optional(),
        signs: z.string().optional(),
        photos: z.string().optional(),
        zillowShowcase: z.string().optional(),
        dateClosed: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await appendPipelineRow(input);
        return result;
      }),

    // P5: protected — pipeline DB list is internal only
    list: protectedProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(pipeline).orderBy(asc(pipeline.sortOrder), asc(pipeline.createdAt));
    }),

    // P5: protected — pipeline DB upsert is internal only
    upsert: protectedProcedure
      .input(z.object({
        id: z.number().optional(),
        address: z.string().min(1),
        hamlet: z.string().min(1),
        type: z.string().default('Listing'),
        status: z.string().default('Prospect'),
        askPrice: z.string().default(''),
        dom: z.number().default(0),
        notes: z.string().default(''),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        if (id) {
          await db.update(pipeline).set(data).where(eq(pipeline.id, id));
          return { id };
        } else {
          const [result] = await db.insert(pipeline).values(data);
          return { id: (result as { insertId: number }).insertId };
        }
      }),

    // P5: protected — pipeline DB delete is internal only
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db.delete(pipeline).where(eq(pipeline.id, input.id));
        return { success: true };
      }),

    /**
     * Import from Profile — scrape Christie's profile page, compare addresses to
     * the existing Sheet, and append any new listings as Active deal rows.
     * Returns { imported, skipped, listings } so the UI can show a summary.
     */
    // P5: protected — import from profile is internal only
    importFromProfile: protectedProcedure
      .mutation(async () => {
        // 1. Scrape live listings
        const { listings } = await syncListings();
        if (listings.length === 0) {
          return { imported: 0, skipped: 0, listings: [] as string[] };
        }
        // 2. Read existing Sheet to detect duplicates
        const existingDeals = await readPipelineDeals();
        const existingAddresses = new Set(
          existingDeals
            .filter(d => !d.isSectionHeader)
            .map(d => d.address.toLowerCase().trim())
        );
        // 3. Append new listings only
        const TOWN_MAP: Record<string, string> = {
          'sagaponack': 'Sagaponack',
          'east-hampton-village': 'East Hampton',
          'bridgehampton': 'Bridgehampton',
          'southampton-village': 'Southampton',
          'water-mill': 'Water Mill',
          'sag-harbor': 'Sag Harbor',
          'amagansett': 'Amagansett',
          'east-hampton': 'East Hampton',
          'springs': 'Springs',
          'montauk': 'Montauk',
          'wainscott': 'Wainscott',
        };
        const imported: string[] = [];
        const skipped: string[] = [];
        for (const listing of listings) {
          const addrKey = listing.address.toLowerCase().trim();
          if (existingAddresses.has(addrKey)) {
            skipped.push(listing.address);
            continue;
          }
          const town = TOWN_MAP[listing.hamlet ?? ''] ?? listing.hamlet ?? '';
          await appendPipelineRow({
            address: listing.address,
            town,
            type: listing.propertyType || 'Residential',
            price: listing.price,
            status: 'Active',
            agent: 'Ed Bruehl',
            side: 'Listing',
            ersSigned: '',
            eeliLink: listing.url,
            signs: '',
            photos: '',
            zillowShowcase: '',
            dateClosed: '',
          });
          imported.push(listing.address);
        }
        return { imported: imported.length, skipped: skipped.length, listings: imported };
      }),
  }),

  // ─── Intelligence Web ─────────────────────────────────────────────────────
  intel: router({
    /**
     * Read all entities from the Intelligence Web Google Sheet.
     * Returns full list; client filters by entityType/tier for each tab.
     */
    // Auth: GOOGLE_SERVICE_ACCOUNT_JSON is the auth layer — no session cookie required.
    // The service account credential handles Intelligence Web Sheet access server-side.
    // See AUTH MODEL comment block above for the full rationale.
    webEntities: publicProcedure.query(async () => {
      try {
        const entities = await readIntelWebRows();
        return { entities, error: null };
      } catch (err: any) {
        return { entities: [], error: err.message ?? 'Failed to read Intelligence Web sheet' };
      }
    }),
    /**
     * Fetch a 30-day news snippet for a named entity via Perplexity.
     * Used by the Institutional Mind Map hover tooltip to surface live intelligence.
     * Returns a 1-2 sentence summary or null if no news found.
     * publicProcedure: no session cookie required — Perplexity API key is the credential.
     *
     * Sprint 16: server-side in-memory cache (5 min TTL) prevents redundant Perplexity calls
     * when multiple users hover the same node, or the same user revisits the tooltip.
     * Cache is keyed by normalized entity name and survives across requests within a process.
     */
    entityNews: publicProcedure
      .input(z.object({ entityName: z.string().min(1).max(120) }))
      .query(async ({ input }) => {
        // ─── Server-side news cache (5-minute TTL, in-process) ─────────────────────────
        const NEWS_CACHE_TTL_MS = 5 * 60 * 1000;
        type NewsCacheEntry = { news: string | null; error: string | null; cachedAt: number };
        const newsCache: Map<string, NewsCacheEntry> =
          ((globalThis as any).__entityNewsCache ??= new Map<string, NewsCacheEntry>());
        const cacheKey = input.entityName.toLowerCase().trim();
        const cached = newsCache.get(cacheKey);
        if (cached && Date.now() - cached.cachedAt < NEWS_CACHE_TTL_MS) {
          return { news: cached.news, error: cached.error };
        }
        // ────────────────────────────────────────────────────────────────────────────
        try {
          const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${ENV.perplexityApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'sonar',
              messages: [
                {
                  role: 'system',
                  content: 'You are a concise intelligence briefing system. Return exactly 1-2 sentences. Named sources only. No speculation. If no news in the last 30 days, return exactly: No recent news.',
                },
                {
                  role: 'user',
                  content: `What is the most significant news about ${input.entityName} in the last 30 days? Real estate, business, or professional news only. Named sources only.`,
                },
              ],
              max_tokens: 120,
              temperature: 0.1,
            }),
            signal: AbortSignal.timeout(15000),
          });
          if (!response.ok) {
            const result = { news: null, error: 'Perplexity unavailable' };
            newsCache.set(cacheKey, { ...result, cachedAt: Date.now() });
            return result;
          }
          const data = await response.json() as { choices: Array<{ message: { content: string } }> };
          const content = data.choices[0]?.message?.content?.trim() ?? '';
          if (!content || content === 'No recent news.') {
            const result = { news: null, error: null };
            newsCache.set(cacheKey, { ...result, cachedAt: Date.now() });
            return result;
          }
          const result = { news: content, error: null };
          newsCache.set(cacheKey, { ...result, cachedAt: Date.now() });
          return result;
        } catch (err: any) {
          return { news: null, error: err.message ?? 'Failed to fetch news' };
        }
      }),
  }),
  // ─── Market data ───────────────────────────────────────────────────────────────────────────────────────
  market: router({
    /**
     * Read all 11 hamlet rows from the Market Matrix Google Sheet.
     * Auth: GOOGLE_SERVICE_ACCOUNT_JSON (service account) — publicProcedure.
     * See AUTH MODEL comment block above.
     */
    hamletMatrix: publicProcedure.query(async () => {
      try {
        const hamlets = await readMarketMatrixRows();
        return { hamlets, error: null };
      } catch (err: any) {
        return { hamlets: [], error: (err as Error).message ?? 'Failed to read Market Matrix sheet' };
      }
    }),

    /**
     * Returns the live 30Y fixed mortgage rate from FRED (Freddie Mac PMMS).
     * Same source as the nav bar ticker. 24-hour cache.
     */
    mortgageRate: publicProcedure.query(async () => {
      try {
        const { fetchMortgageRate } = await import('./market-route');
        const { rate, date } = await fetchMortgageRate();
        return { rate, date, error: null as string | null };
      } catch (err: any) {
        return { rate: '6.38%', date: '', error: (err as Error).message ?? 'FRED unavailable' };
      }
    }),
    /**
     * Wire Five: Returns the live Hamptons Median from Market Matrix B23.
     * Sheet: 176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g
     * When Perplexity updates B23, this value updates automatically on next query.
     */
    hamptonsMedian: publicProcedure.query(async () => {
      return await readHamptonsMedian();
    }),

    /**
     * Returns the live 10-Year Treasury yield (^TNX) from Yahoo Finance.
     * Used in MARKET tab Rate Environment sidebar alongside mortgage rate.
     * Cached via market-route fetchYF (no server-side cache — live on each query).
     */
    treasuryRate: publicProcedure.query(async () => {
      try {
        const { fetchYF } = await import('./market-route');
        const result = await fetchYF('%5ETNX'); // 10-Year Treasury Note Yield
        if (!result) return { rate: '4.51%', change: null, error: null as string | null };
        return {
          rate: `${result.price.toFixed(2)}%`,
          change: result.change,
          error: null as string | null,
        };
      } catch (err: any) {
        return { rate: '4.51%', change: null, error: (err as Error).message ?? 'Treasury data unavailable' };
      }
    }),

    dataTimestamp: publicProcedure.query(async () => {
      try {
        const { readPipelineDeals } = await import('./sheets-helper');
        const deals = await readPipelineDeals();
        return {
          timestamp: new Date().toISOString(),
          dealCount: deals.length,
          error: null as string | null,
        };
      } catch (err: any) {
        return {
          timestamp: null as string | null,
          dealCount: 0,
          error: (err as Error).message ?? 'Sheets unavailable',
        };
      }
    }),
  }),

  /**
   * FUTURE tab — Growth Model v2 live data
   * Auth layer: GOOGLE_SERVICE_ACCOUNT_JSON (service account reads Growth Model v2 sheet)
   * Rule: publicProcedure — no session cookie required for sheet reads
   */
  future: router({
    growthModel: publicProcedure
      .query(async () => {
        return readGrowthModelData();
      }),
    // SERVICE ACCOUNT AUTH — reads VOLUME tab (sales volume projected/actual per agent)
    // publicProcedure: service account authenticates with Google Sheets, no session cookie needed
    volumeData: publicProcedure
      .query(async () => {
        return readGrowthModelVolume();
      }),
    // Wire One–Four: Ascension Arc live data from OUTPUTS + VOLUME tabs
    // Returns office volume, net profit pool (Ed 35% / Ilija 65%), Ed GCI, actual volume per year
    ascensionArc: publicProcedure
      .query(async () => {
        return readAscensionArcData();
      }),
    // Wire Six: Profit Pool live from OUTPUTS G32:G42
    // Returns year, netProfit, edPool (35%), ilijaPool (65%), officeVolume for 2026–2036 (11 years)
    // Source: Growth Model v2 OUTPUTS tab, column G, rows 32–42 (same read as ascensionArc)
    profitPool: publicProcedure
      .query(async () => {
        const arc = await readAscensionArcData();
        return arc.years.map(y => ({
          year: y.year,
          netProfit: y.netProfit,
          edPool: y.edPool,
          ilijaPool: y.ilijaPool,
          officeVolume: y.officeVolume,
        }));
      }),
    // Generate the 4-page institutional pro forma PDF
    // Returns base64-encoded PDF bytes for client-side download
    generateProForma: publicProcedure
      .mutation(async () => {
        const pdfBuffer = await generateProFormaPDF();
        return { pdf: pdfBuffer.toString('base64') };
      }),

    // Build 1 · Endpoint 1: Headcount Scaling Table
    // Source: OUTPUTS!A74:E85 — Year | EH | SH | WH | Total
    // Fallback: hardcoded canonical values if sheet unavailable
    headcountTable: publicProcedure
      .query(async () => {
        return readHeadcountTable();
      }),

    // Build 1 · Endpoint 2: 100-Day Milestone Cards
    // Source: OUTPUTS!A67:C71 — closedVolume, activePipeline, volumeTarget, agentsOnOS
    // Fallback: hardcoded canonical values if sheet unavailable
    milestones: publicProcedure
      .query(async () => {
        return readMilestones();
      }),

    // Build 1 · Endpoint 3: Partner Stream Cards
    // Source: ROSTER!A2:N16 — named producers GCI by year
    // Fallback: hardcoded canonical values if sheet unavailable
    partnerCards: publicProcedure
      .query(async () => {
        return readPartnerCards();
      }),
  }),

  flagship: router({
    /**
     * Serve the Flagship AI-Letter text to the /letters/flagship live URL renderer.
     * Public procedure — the page is internal-only by design (confidential banner).
     */
    getLetter: publicProcedure
      .query(() => ({
        text: FLAGSHIP_LETTER_TEXT,
        updatedAt: new Date().toISOString(),
      })),

    /**
     * Serve the Christie's Letter to the Families text to the /letters/christies live URL renderer.
     * Public procedure — the letter is the institutional introduction to new families.
     */
    getChristiesLetter: publicProcedure
      .query(() => ({
        text: CHRISTIES_LETTER_TEXT,
        updatedAt: new Date().toISOString(),
      })),
  }),

  newsletter: router({
    /**
     * Subscribe an email to the Christie's East Hampton newsletter via Beehiiv.
     */
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await beehiivSubscribe({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          utmSource: 'christies-eh-dashboard',
        });
        return result;
      }),

    /**
     * Get Beehiiv subscriber stats for dashboard display.
     */
    // P5: protected — subscriber stats are internal only
    getStats: protectedProcedure
      .query(async () => {
        return beehiivGetStats();
      }),

    /**
     * Send a test email to confirm Gmail SMTP is configured correctly.
     */
    sendTestEmail: publicProcedure
      .input(z.object({ to: z.string().email() }))
      .mutation(async ({ input }) => {
        return sendTestEmail(input.to);
      }),
  }),

  // ─── Brief Router (Task 7 · Today's Brief surface · Apr 22 2026) ────────────────
  brief: router({
    /**
     * Get today's brief (most recent row from daily_brief table).
     * publicProcedure — content is non-sensitive.
     */
    getToday: publicProcedure.query(async () => {
      try {
        const db = await getDb();
        if (!db) return null;
        const all = await db.select().from(dailyBrief).orderBy(dailyBrief.briefDate);
        if (all.length === 0) return null;
        return all[all.length - 1];
      } catch {
        return null;
      }
    }),

    /**
     * Upsert today's brief content.
     * Called by the William 5:55 AM pipeline.
     */
    upsert: publicProcedure
      .input(z.object({
        briefDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        hamptons:  z.string().min(1),
        markets:   z.string().min(1),
        art:       z.string().min(1),
        audioUrl:  z.string().url().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db
          .insert(dailyBrief)
          .values({
            briefDate:   input.briefDate,
            hamptons:    input.hamptons,
            markets:     input.markets,
            art:         input.art,
            audioUrl:    input.audioUrl ?? null,
            generatedAt: new Date(),
          })
          .onDuplicateKeyUpdate({
            set: {
              hamptons:    input.hamptons,
              markets:     input.markets,
              art:         input.art,
              audioUrl:    input.audioUrl ?? null,
              generatedAt: new Date(),
            },
          });
        return { ok: true, briefDate: input.briefDate };
      }),
  }),
});

export type AppRouter = typeof appRouter;
