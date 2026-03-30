import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { z } from "zod";

// ─── Founding letter text (matches ReportPage.tsx paragraphs) ─────────────────
const FOUNDING_LETTER = `Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.

The South Fork is not a market. It is a territory — nine distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.

This platform exists to carry the Christie's standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.

The ANEW framework is not a sales tool. It is a discipline. Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate.

The nine hamlets of the South Fork represent the most concentrated wealth corridor in the northeastern United States. East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton. Sag Harbor. Amagansett. Springs. Montauk. Each one has a story. Each one has a price. Each one has a buyer.

Christie's East Hampton is not a brokerage. It is a standard. The auction house has been the authority on provenance, value, and discretion for 260 years. That authority now extends to the South Fork.

The families who built this territory deserve representation that matches the weight of their decisions. Not a pitch. Not a presentation. A system. A process that has been tested, scored, and proven.

Every export from this platform — every market report, every deal brief, every CMA — carries the Christie's name because it has earned the right to carry it. The standard is not aspirational. It is operational.

Not a pitch. A system. Not a promise. A process that has been tested, scored, and proven.`;

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
          text: FOUNDING_LETTER,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs API error ${response.status}: ${errText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      return { audio: base64, mimeType: "audio/mpeg" };
    }),

    // Lightweight ping to validate the API key is set (used in tests)
    ping: publicProcedure.query(() => {
      return { configured: !!ENV.elevenLabsApiKey };
    }),
  }),
});

export type AppRouter = typeof appRouter;
