import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("tts.ping", () => {
  it("returns configured: true when ELEVENLABS_API_KEY is set", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.tts.ping();
    expect(result.configured).toBe(true);
  });
});
