import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { z } from "zod";
import { getDb } from "./db";
import { pipeline } from "../drizzle/schema";
import { readPipelineDeals, appendPipelineRow, updatePipelineStatus } from "./sheets-helper";
import { eq, asc } from "drizzle-orm";

// ─── Founding letter text (matches ReportPage.tsx paragraphs) ─────────────────
const FOUNDING_LETTER = `Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.

The South Fork is not a market. It is a territory — ten distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.

This platform exists to carry the Christie's standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.

The Christie’s Intelligence Score is not a sales tool. It is a discipline. Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate.

The ten hamlets of the South Fork represent the most concentrated wealth corridor in the northeastern United States. East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton Village. Sag Harbor. Amagansett. Springs. East Hampton Town. Montauk. Each one has a story. Each one has a price. Each one has a buyer.

Christie's East Hampton is not a brokerage. It is a standard. The auction house has been the authority on provenance, value, and discretion for 260 years. That authority now extends to the South Fork.

The families who built this territory deserve representation that matches the weight of their decisions. Not a pitch. Not a presentation. A system. A process that has been tested, scored, and proven.

Every export from this platform — every market report, every deal brief, every CMA — carries the Christie's name because it has earned the right to carry it. The standard is not aspirational. It is operational.

Not a pitch. A system. Not a promise. A process that has been tested, scored, and proven.`;

// ─── Market Report narration text (mirrors /report page sections 2–4) ─────────
const MARKET_REPORT_TEXT = `Hamptons Local Intelligence. East End. Current Affairs. Q1 2026.

East Hampton Town. The East Hampton Town Board approved a new affordable housing overlay district along Springs Fireplace Road, adding 48 units of workforce housing. The Planning Board is reviewing a 12-lot subdivision on Accabonac Road with a public hearing scheduled for April. The East Hampton School District reported a 4.2 percent enrollment increase — the largest in a decade — driven by year-round residency growth.

Southampton Town. Southampton Town extended its moratorium on new short-term rental permits through December 2026, citing neighborhood character concerns in Bridgehampton and Water Mill. The Bridgehampton Commons redevelopment proposal — mixed-use retail and residential — received preliminary approval. Southampton Village is advancing a twelve million dollar Main Street infrastructure upgrade.

Sag Harbor. The Sag Harbor Village Board approved the Watchcase Factory residential conversion final phase, adding 22 luxury units to the historic complex. The Sag Harbor Cinema restoration is on schedule for a summer 2026 reopening. The village is reviewing a proposal to expand the waterfront park along Long Wharf.

Market Intelligence. Capital Flow Signal: Strong Inflow. Institutional and family office capital is flowing at elevated levels into the South Fork market as of Q1 2026.

Rate Environment. The 30-year fixed mortgage rate is 6.38 percent, per Freddie Mac. The 10-year Treasury yield is 4.81 percent. The VIX volatility index is at 30.61, indicating elevated macro uncertainty. The Hamptons median sale price is 2.34 million dollars, up 7 percent year over year in Q1 2026.

Hamlet Atlas. Ten hamlets. South Fork. Christie's Intelligence Score classification.

Sagaponack. CIS score: 9.4 out of 10. Median price: 7.5 million dollars. Volume share: 4 percent. Year over year: plus 4 percent.

East Hampton Village. CIS score: 9.2 out of 10. Median price: 5.15 million dollars. Volume share: 12 percent. Year over year: plus 12 percent.

Bridgehampton. CIS score: 9.1 out of 10. Median price: 5.1 million dollars. Volume share: 8 percent. Year over year: plus 8 percent.

Southampton Village. CIS score: 9.0 out of 10. Median price: 3.55 million dollars. Volume share: 14 percent. Year over year: plus 14 percent.

Amagansett. CIS score: 8.9 out of 10. Median price: 4.25 million dollars. Volume share: 9 percent. Year over year: plus 9 percent.

Water Mill. CIS score: 8.8 out of 10. Median price: 4.2 million dollars. Volume share: 7 percent. Year over year: plus 7 percent.

East Hampton Town. CIS score: 8.6 out of 10. Median price: 3.2 million dollars. Volume share: 18 percent. Year over year: plus 18 percent.

Sag Harbor. CIS score: 8.4 out of 10. Median price: 2.85 million dollars. Volume share: 11 percent. Year over year: plus 11 percent.

Montauk. CIS score: 8.2 out of 10. Median price: 2.24 million dollars. Volume share: 9 percent. Year over year: plus 6 percent. The eastern anchor of the South Fork.

Springs. CIS score: 6.8 out of 10. Median price: 1.35 million dollars. Volume share: 17 percent. Year over year: plus 17 percent.

We look forward to seeing you at 26 Park Place — here to serve you the way James Christie did, since 1766.`;

// ─── ElevenLabs TTS helper ─────────────────────────────────────────────────────
async function callElevenLabs(text: string): Promise<{ audio: string; mimeType: string }> {
  const apiKey = ENV.elevenLabsApiKey;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");
  const VOICE_ID = "fjnwTZkKtQOJaYzGLa6n";
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.55, similarity_boost: 0.75 },
    }),
    signal: AbortSignal.timeout(90000),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${errText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return { audio: base64, mimeType: "audio/mpeg" };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── TTS proxy — ElevenLabs Voice ID fjnwTZkKtQOJaYzGLa6n ──────────────────
  tts: router({
    foundingLetter: publicProcedure.mutation(async () => {
      return callElevenLabs(FOUNDING_LETTER);
    }),

    marketReport: publicProcedure.mutation(async () => {
      return callElevenLabs(MARKET_REPORT_TEXT);
    }),

    // Lightweight ping to validate the API key is set (used in tests)
    ping: publicProcedure.query(() => {
      return { configured: !!ENV.elevenLabsApiKey };
    }),
  }),

  // ─── Pipeline CRUD ──────────────────────────────────────────────────────────
  pipe: router({
    // Read live deals directly from the Google Sheet (single source of truth)
    sheetDeals: publicProcedure.query(async () => {
      try {
        const deals = await readPipelineDeals();
        return { deals, error: null };
      } catch (err: any) {
        return { deals: [], error: err.message ?? 'Failed to read sheet' };
      }
    }),

    // Write a status update directly to the Google Sheet
    updateSheetStatus: publicProcedure
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

    // Append a new deal row to the Google Sheet
    appendSheet: publicProcedure
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

    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(pipeline).orderBy(asc(pipeline.sortOrder), asc(pipeline.createdAt));
    }),

    upsert: publicProcedure
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

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db.delete(pipeline).where(eq(pipeline.id, input.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
