/**
 * INTEL TAB — Document Library, SOPs, Council Briefs, and Midnight Close.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data) · Barlow Condensed (labels)
 *
 * Document Library sections (in order):
 *   1. Canon PDFs (9 assets — pinned first)
 *   2. Org Chart & Hierarchy
 *   3. Market Report
 *   4. Constitution & SOPs
 *   5. Council Briefs
 *   6. Attorney Database
 *   7. Adam Kalb IBC Materials
 */

import { MatrixCard } from '@/components/MatrixCard';
import { usePdfAssets } from '@/hooks/usePdfAssets';

// ─── Document Library Sections ────────────────────────────────────────────────

interface DocItem {
  id: string;
  label: string;
  description: string;
  url: string | null;
  pinned?: boolean;
}

const ORG_CHART_DOCS: DocItem[] = [
  {
    id: 'org-chart',
    label: "Christie's East Hampton · Institutional Hierarchy · March 2026",
    description: "Full organizational hierarchy from James Christie through the Auction House and Real Estate Division to the East Hampton team. Approved by Claude, Grok, and ChatGPT.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/TtcjzvhlJtbopxGm.html',
    pinned: true,
  },
];

const MARKET_REPORT_DOCS: DocItem[] = [
  {
    id: 'market-report-p3-5',
    label: "Christie's Hamptons Market Report · Pages 3–5 · March 2026",
    description: "Hamlet-by-hamlet analysis: East Hampton Village, The Springs, Sag Harbor, Bridgehampton, Water Mill, Wainscott, Amagansett, Montauk, Southampton Village. Pages 1–2 coming next pass.",
    url: null,
    pinned: true,
  },
];

const CONSTITUTION_DOCS: DocItem[] = [
  {
    id: 'constitution',
    label: "Christie's East Hampton · Constitution & Operating Principles",
    description: "The founding operating principles, team covenant, and institutional standards governing the East Hampton flagship.",
    url: null,
  },
  {
    id: 'sops',
    label: "Standard Operating Procedures · Full Library",
    description: "Complete SOP library covering client intake, listing protocol, deal management, morning brief, and team communication standards.",
    url: null,
  },
];

const COUNCIL_BRIEF_DOCS: DocItem[] = [
  {
    id: 'council-brief-march-2026',
    label: "Council Brief · March 2026",
    description: "Monthly strategic brief for the AI Council — market conditions, pipeline status, growth model update, and 300-day arc progress.",
    url: null,
  },
  {
    id: 'council-brief-feb-2026',
    label: "Council Brief · February 2026",
    description: "February 2026 strategic brief — foundation month review.",
    url: null,
  },
];

const ATTORNEY_DOCS: DocItem[] = [
  {
    id: 'attorney-database',
    label: "Attorney Database · East Hampton & South Fork",
    description: "Curated list of real estate attorneys, estate attorneys, and transaction counsel serving the South Fork market. Maintained by Ed Bruehl.",
    url: null,
  },
];

const IBC_DOCS: DocItem[] = [
  {
    id: 'ibc-overview',
    label: "Adam Kalb · IBC Materials · Overview",
    description: "International Business Council materials provided by Adam Kalb. Covers IBC structure, membership, and Christie's East Hampton integration strategy.",
    url: null,
  },
  {
    id: 'ibc-brief',
    label: "Adam Kalb · IBC Brief",
    description: "Detailed IBC brief and action items for Christie's East Hampton flagship participation.",
    url: null,
  },
];

// ─── Document Card ────────────────────────────────────────────────────────────

const IS_STAGING =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('netlify') ||
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('manus.computer'));

function DocCard({ doc }: { doc: DocItem }) {
  const isLive = doc.url !== null;
  const showPending = IS_STAGING && !isLive;

  if (!IS_STAGING && !isLive) return null; // suppress in production

  return (
    <MatrixCard variant={doc.pinned ? 'active' : 'default'} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem', lineHeight: 1.35 }}>
            {doc.label}
          </div>
          <div className="mt-1.5 text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
            {doc.description}
          </div>
        </div>
        <div className="shrink-0">
          {isLive ? (
            <a
              href={doc.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em' }}
            >
              {doc.url?.endsWith('.html') ? 'Open Document' : 'Open PDF'}
            </a>
          ) : showPending ? (
            <span
              className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', background: 'rgba(27,42,74,0.06)', color: '#7a8a8e', letterSpacing: '0.16em' }}
            >
              Staging
            </span>
          ) : null}
        </div>
      </div>
    </MatrixCard>
  );
}

function DocSection({ title, docs }: { title: string; docs: DocItem[] }) {
  const visible = IS_STAGING ? docs : docs.filter(d => d.url !== null);
  if (visible.length === 0) return null;
  return (
    <div className="mb-10">
      <div className="uppercase mb-4" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
        {title}
      </div>
      <div className="flex flex-col gap-3">
        {visible.map(doc => <DocCard key={doc.id} doc={doc} />)}
      </div>
    </div>
  );
}

// ─── Canon PDF Section ────────────────────────────────────────────────────────

function CanonPdfSection() {
  const { visibleAssets, isStaging } = usePdfAssets();
  return (
    <div className="mb-10">
      <div className="uppercase mb-4" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
        Canon Documents
      </div>
      <div className="flex flex-col gap-3">
        {visibleAssets.map(asset => (
          <MatrixCard key={asset.id} variant="default" className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem' }}>
                  {asset.label}
                </div>
                <div className="mt-1 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                  {asset.filename}
                </div>
              </div>
              <div className="shrink-0">
                {asset.url ? (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
                    style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em' }}
                  >
                    Open PDF
                  </a>
                ) : isStaging ? (
                  <span
                    className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest"
                    style={{ fontFamily: '"Barlow Condensed", sans-serif', background: 'rgba(27,42,74,0.06)', color: '#7a8a8e', letterSpacing: '0.16em' }}
                  >
                    Staging
                  </span>
                ) : null}
              </div>
            </div>
          </MatrixCard>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IntelTab() {
  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>Intelligence · Documents · SOPs</div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>Intel</h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>
          Canon documents, operating procedures, council briefs, and institutional intelligence.
        </p>
      </div>

      <div className="px-6 py-8" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Org Chart & Hierarchy — pinned first */}
        <DocSection title="Org Chart & Hierarchy" docs={ORG_CHART_DOCS} />

        {/* Market Report — pinned second */}
        <DocSection title="Market Report" docs={MARKET_REPORT_DOCS} />

        {/* Canon PDFs */}
        <CanonPdfSection />

        {/* Constitution & SOPs */}
        <DocSection title="Constitution & SOPs" docs={CONSTITUTION_DOCS} />

        {/* Council Briefs */}
        <DocSection title="Council Briefs" docs={COUNCIL_BRIEF_DOCS} />

        {/* Attorney Database */}
        <DocSection title="Attorney Database" docs={ATTORNEY_DOCS} />

        {/* Adam Kalb IBC Materials */}
        <DocSection title="Adam Kalb · IBC Materials" docs={IBC_DOCS} />

      </div>
    </div>
  );
}
