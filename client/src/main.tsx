import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  // Never redirect on /report — market report is accessible without auth
  if (window.location.pathname.startsWith('/report')) return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// ─── Suppress platform attribution badge (shadow DOM) ───────────────────────
// The badge lives inside manus-content-root > footer-watermark (both shadow DOM)
// CSS cannot pierce shadow boundaries, so we use a MutationObserver to hide the
// host element as soon as it appears in the DOM.
function suppressManusWatermark() {
  const hide = (el: Element) => {
    (el as HTMLElement).style.cssText =
      'display:none!important;visibility:hidden!important;opacity:0!important;' +
      'pointer-events:none!important;position:absolute!important;' +
      'width:0!important;height:0!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;';
  };
  const check = () => {
    const mcr = document.querySelector('manus-content-root');
    if (mcr) {
      hide(mcr);
      const fw = mcr.shadowRoot?.querySelector('footer-watermark');
      if (fw) hide(fw);
    }
    document.querySelectorAll('footer-watermark').forEach(hide);
  };
  check();
  const obs = new MutationObserver(check);
  obs.observe(document.body, { childList: true, subtree: true });
  // Also run after a short delay in case the element is injected late
  setTimeout(check, 500);
  setTimeout(check, 1500);
  setTimeout(check, 3000);
}
suppressManusWatermark();

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
