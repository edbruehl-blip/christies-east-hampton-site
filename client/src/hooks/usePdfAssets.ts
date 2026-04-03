/**
 * usePdfAssets — Canon PDF Asset Hook
 *
 * Manages the nine canon PDF assets for Christie's East Hampton.
 * Rule: In production, either the asset is live and linked, or the entry
 * is suppressed entirely. No user-visible "Asset Pending" language in production.
 * "Asset Pending" states are acceptable on staging only.
 */

export interface PdfAsset {
  id: string;
  label: string;
  filename: string;
  url: string | null;  // null = not yet uploaded
  canon: boolean;
  requiredThisSprint: boolean;
}

// The nine canon assets. URLs are null until Ed supplies the files.
// When a file is uploaded to CDN, update the url field here.
export const CANON_PDF_ASSETS: PdfAsset[] = [
  {
    id: "anew-council-brief",
    label: "ANEW Homes Council Brief",
    filename: "ANEW_Homes_Council_Brief.pdf",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
  {
    id: "system-map",
    label: "System Map v4.1",
    filename: "Christies_EH_System_Map_v41.pdf",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
  {
    id: "mission-model",
    label: "Mission & Model",
    filename: "Christies_EH_Mission_Model.pdf",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
  {
    id: "blueprint-300",
    label: "300-Day Blueprint",
    filename: "Blueprint_300Day_v3_v4612.pdf",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
  {
    id: "morning-brief-print",
    label: "Morning Brief (Print)",
    filename: "Morning_Brief_Print.pdf",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
  {
    id: "mission-model-condensed",
    label: "Mission & Model (Condensed)",
    filename: "Mission_Model_Condensed.pdf",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
  {
    id: "blueprint-condensed",
    label: "Blueprint (Condensed)",
    filename: "Blueprint_Condensed.pdf",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
  {
    id: "james-christie-letter",
    label: "James Christie Letter",
    filename: "James_Christie_Letter.pdf",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
  {
    id: "pdf-arsenal",
    label: "PDF Arsenal",
    filename: "PDF_Arsenal.html",
    url: null,
    canon: true,
    requiredThisSprint: true,
  },
];

const IS_STAGING =
  typeof window !== "undefined" &&
  (window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("manus.computer") ||
    window.location.hostname.includes("manus.space"));

/**
 * Returns only the assets that are safe to render in the current environment.
 *
 * - Staging: returns all assets (with url=null for pending ones)
 * - Production: returns only assets where url is non-null
 */
export function usePdfAssets() {
  const allAssets = CANON_PDF_ASSETS;

  const visibleAssets = IS_STAGING
    ? allAssets
    : allAssets.filter((a) => a.url !== null);

  const pendingAssets = allAssets.filter((a) => a.url === null);
  const liveAssets = allAssets.filter((a) => a.url !== null);

  return {
    allAssets,
    visibleAssets,
    pendingAssets,
    liveAssets,
    isStaging: IS_STAGING,
    pendingCount: pendingAssets.length,
    liveCount: liveAssets.length,
  };
}
