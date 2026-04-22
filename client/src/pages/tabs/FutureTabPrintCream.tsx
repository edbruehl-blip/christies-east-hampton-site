/**
 * FutureTabPrintCream.tsx — REFERENCE IMPLEMENTATION
 * Christie's East Hampton Flagship · /future?pdf=1 · Cream print mirror
 * Author: Claude (Architect) · April 22 2026
 *
 * This component renders ONLY when ?pdf=1 is active. It is the print mirror
 * of the FUTURE tab in cream substrate, composed from five council-approved
 * wireframes:
 *   Page 1: FINAL_v7_2_arc_pdf.html + FINAL_v15 cream half
 *   Page 2: FINAL_v14_3b_page2_cream.html + FINAL_v16_levers_cream.html + FINAL_v17_client_resource_cream.html
 *
 * No screen chrome. No nav. No tabs. No INTRO/WILLIAM buttons. No ticker.
 * Two pages, <section> per page, CSS page-break-after forces Letter pagination.
 *
 * PALETTE (canonical, locked):
 *   Cream substrate:   #faf7f1
 *   Parchment wash:    #efe6d1   (card-header fill only)
 *   Museum mat:        #2c2c2a   (frame around arc chart only)
 *   Navy titles:       #1a3a5c
 *   Gold accents:      #947231
 *   Body text on cream: #111
 *   Body text on parchment: #2a2a2a
 *
 * DATA:
 *   Arc chart: trpc.future.ascensionArc.useQuery (five-layer stack preserved)
 *   Partner cards: hardcoded to match FINAL_v14_3b_page2_cream.html.
 *     These values are already verified against production at checkpoint ae4ee6b5.
 *     Perp will port to live OUTPUTS wires in a follow-up ticket.
 */

import React, { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components (idempotent — safe to call multiple times)
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CREAM       = '#faf7f1';
const PARCHMENT   = '#efe6d1';
const MUSEUM_MAT  = '#2c2c2a';
const NAVY        = '#1a3a5c';
const GOLD        = '#947231';
const INK         = '#111';
const INK_SOFT    = '#2a2a2a';
const INK_FAINT   = '#3a3a3a';
const INK_SUBTLE  = '#5a5a5a';
const INK_ACCENT  = '#5a5041';

// Chart bar colors — unchanged from screen, kept for chart recognizability in print
const COLOR_EH_FLAGSHIP = '#9e1b32'; // burgundy
const COLOR_SH_FLAGSHIP = '#1a3a5c'; // navy
const COLOR_WH_FLAGSHIP = '#947231'; // gold
// '#c8946b' and '#6b2838' deleted — Ed ruling April 22 2026.
// AnewHomes and CPS1 are revenue streams, not office volumes.
// They live on partner cards (§ and ‡ markers) and in footnotes.

const SERIF = 'Georgia, serif';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function FutureTabPrintCream() {
  return (
    <div style={{ background: CREAM, fontFamily: SERIF, color: INK }}>
      <Page1 />
      <Page2 />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1: Arc chart + 100-day cards
// ═══════════════════════════════════════════════════════════════════════════════

function Page1() {
  return (
    <section
      className="pfc-page pfc-page-1"
      style={{ background: CREAM, padding: '18px 14px 16px', pageBreakAfter: 'always', breakAfter: 'page' }}
    >
      <BrandBand />
      <ArcChartCream />
      <ChartLegend />
      <BrandSignature />
      <HundredDayCards />
      <PageNumber>Page 1 of 2</PageNumber>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Brand band (top of each page) — single header, not three
// ───────────────────────────────────────────────────────────────────────────────

function BrandBand() {
  return (
    <div style={{
      textAlign: 'center',
      fontSize: 8.5,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: INK,
      paddingBottom: 6,
      borderBottom: `1px solid ${GOLD}`,
      marginBottom: 12,
    }}>
      Christie's · International Real Estate Group · East Hampton · Est. 1766
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Arc chart — port of FINAL_v7_2_arc_pdf.html
// Museum mat frame (charcoal #2c2c2a) wraps cream card with chart inside
// ───────────────────────────────────────────────────────────────────────────────

function ArcChartCream() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { data: arcData } = trpc.future.ascensionArc.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const init = () => {
      if (!canvasRef.current) {
        setTimeout(init, 50);
        return;
      }
      // Destroy any existing chart instance before creating a new one
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      // Data matches FINAL_v7_2_arc_pdf.html exactly.
      // When Perp wires live OUTPUTS sheet values, replace the hardcoded arrays
      // with arcData.ehTotal, arcData.shHampton, arcData.whHampton, etc.
      const years = ['2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036'];
      // Canonical three-office volume series. Verified against CHART_DATA tab of OUTPUTS sheet
      // (Perplexity audit, April 22 2026 · 36/36 zero drift).
      // AnewHomes and CPS1 are revenue streams, not office volumes — they live on partner cards
      // (§ and ‡ markers) and in footnotes. Ed ruling April 22 2026.
      const ehTotal = [20, 75, 125.9, 211.7, 295.5, 410.7, 566.6, 597.6, 676.3, 784.9, 932.6, 1133.3];
      const shHampton = [0, 0, 0, 42.1, 161.4, 285.2, 422.1, 507.4, 607.3, 698.4, 821.6, 987.8];
      const whHampton = [0, 0, 0, 0, 0, 56.7, 230.5, 352.3, 452.4, 592.9, 737.8, 878.9];
      const totalByYear = years.map((_, i) => ehTotal[i] + shHampton[i] + whHampton[i]);

      const fmt = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(2)}B` : `$${Math.round(v)}M`;

      const totalLabelsPlugin = {
        id: 'pfc-total-labels',
        afterDatasetsDraw(chart: any) {
          const { ctx, scales: { x, y } } = chart;
          ctx.save();
          ctx.fillStyle = INK_FAINT;
          ctx.font = 'bold 11px Georgia, serif';
          ctx.textAlign = 'center';
          totalByYear.forEach((t, i) => {
            ctx.fillText(fmt(t), x.getPixelForValue(i), y.getPixelForValue(t) - 8);
          });
          ctx.restore();
        },
      };

      chartInstanceRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            { data: ehTotal,    backgroundColor: COLOR_EH_FLAGSHIP, borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
            { data: shHampton,  backgroundColor: COLOR_SH_FLAGSHIP, borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
            { data: whHampton,  backgroundColor: COLOR_WH_FLAGSHIP, borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              stacked: true, beginAtZero: true, max: 3500,
              ticks: {
                color: INK_FAINT,
                font: { size: 12, family: 'Georgia, serif', weight: 'bold' as const },
                padding: -38, mirror: true, z: 10,
                callback: (v: any) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'B' : v + 'M'}`,
              },
              grid: { color: 'rgba(148,114,49,0.15)' },
              border: { color: 'rgba(148,114,49,0.5)' },
            },
            x: {
              stacked: true,
              ticks: { color: INK_FAINT, font: { size: 13, family: 'Georgia, serif', weight: 'bold' as const }, padding: 8 },
              grid: { display: false },
              border: { color: 'rgba(148,114,49,0.5)' },
            },
          },
        },
        plugins: [totalLabelsPlugin],
      });
    };
    init();
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [arcData]);

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ background: MUSEUM_MAT, padding: 10, borderRadius: 10 }}>
        <div style={{ background: CREAM, border: '2px solid #000', padding: '14px 18px 18px' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
            <div style={{
              fontSize: 20,
              letterSpacing: 5,
              color: INK,
              fontFamily: SERIF,
            }}>
              CHRISTIE'S EAST HAMPTON FLAGSHIP
            </div>
            <div style={{
              fontSize: 13,
              letterSpacing: 2,
              color: INK_SUBTLE,
              fontFamily: SERIF,
              marginTop: 3,
              fontStyle: 'italic',
            }}>
              Ascension Arc · 2026 through 2036 and beyond
            </div>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 440, marginTop: 4 }}>
            <canvas ref={canvasRef} role="img" aria-label="Five-band cream ascension arc chart" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Chart legend — five swatches in two rows
// ───────────────────────────────────────────────────────────────────────────────

function ChartLegend() {
  const Swatch = ({ color }: { color: string }) => (
    <span style={{ width: 13, height: 13, background: color, border: '1px solid #000', display: 'inline-block' }} />
  );
  const row: React.CSSProperties = {
    display: 'flex', justifyContent: 'center', gap: 28,
    fontSize: 11, color: INK_FAINT, fontFamily: SERIF,
  };
  const item: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 7 };
  return (
    <div style={{ padding: '13px 0', borderTop: '1px solid #c9bf9f', borderBottom: '1px solid #c9bf9f', margin: '16px 0 0' }}>
      <div style={row}>
        <span style={item}><Swatch color={COLOR_EH_FLAGSHIP} /> East Hampton Flagship</span>
        <span style={item}><Swatch color={COLOR_SH_FLAGSHIP} /> Southampton Flagship · 2028</span>
        <span style={item}><Swatch color={COLOR_WH_FLAGSHIP} /> Westhampton Flagship · 2030</span>
      </div>
      {/* Second legend row (AnewHomes + CPS1) deleted — Ed ruling April 22 2026. Three-office only. */}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Brand signature — CHRISTIE'S INTERNATIONAL REAL ESTATE · SINCE 1766
// ───────────────────────────────────────────────────────────────────────────────

function BrandSignature() {
  return (
    <div style={{ marginTop: 18, textAlign: 'center', padding: '12px 0' }}>
      <div style={{ fontSize: 13, color: INK, fontFamily: SERIF, letterSpacing: 5 }}>
        CHRISTIE'S INTERNATIONAL REAL ESTATE
      </div>
      <div style={{ fontSize: 10, color: INK_SUBTLE, fontFamily: SERIF, letterSpacing: 3, marginTop: 5, fontStyle: 'italic' }}>
        Art · Beauty · Provenance
      </div>
      <div style={{ fontSize: 12, color: GOLD, fontFamily: SERIF, letterSpacing: 7, marginTop: 6, fontWeight: 600 }}>
        SINCE 1766
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// 100-day cards — port of FINAL_v15 cream half (classes pg-c / card-c / ch-c / cb-c)
// Four cards, 4-column grid, cream substrate, parchment headers, charcoal body
// ───────────────────────────────────────────────────────────────────────────────

type HundredDayCardProps = {
  label: string;           // "1st 100 Days"
  status: string;          // "Done"
  dates: string;           // "Dec 2025 – Mar 2026"
  accent: string;          // left border color
  shareholder: string;
  client: string;
  team: string;
};

const HUNDRED_DAY_CARDS: HundredDayCardProps[] = [
  {
    label: '1st 100 Days',
    status: 'Done',
    dates: 'Dec 2025 – Mar 2026',
    accent: '#9a9a9a',
    shareholder: '$4.57M closed. 9 Daniels Hole Road $2.47M. 2 Old Hollow $2.10M. Dashboard live Day 1.',
    client: 'AnewHomes proven at $2.47M. Every deal scored before the first showing.',
    team: '26 Park Place operational. Open before the sign went up.',
  },
  {
    label: '2nd 100 Days',
    status: 'Doing',
    dates: 'Mar – Apr 29, 2026',
    accent: GOLD,
    shareholder: '$19.72M in exclusive listings. 25 Horseshoe Road $5.75M in contract. 191 Bull Path $3.60M active.',
    client: "Schneps Media pilot in motion. Dan's Papers channel in play. NYC outreach through Melissa True, Rockefeller and Flatiron desks.",
    team: 'Angel Day One April 25. Zoila start May 4. Flagship relaunch April 29.',
  },
  {
    label: '3rd 100 Days',
    status: 'Incoming',
    dates: 'Apr 29 – Aug 2026',
    accent: '#c8946b',
    shareholder: '$75M 2026 trajectory. First Wednesday Caravan live. East End flagship presence.',
    client: "Daily intelligence briefing in market. Every listing at Christie's standard.",
    team: '5 agents on live OS. Scott joins June 1. Southampton pre-launch in motion.',
  },
  {
    label: 'Ascension',
    status: 'Vision',
    dates: '2027 – 2036',
    accent: NAVY,
    shareholder: '$3.00B three-office combined 2036. 36 elite producers at maturity. Profit sharing opens Year 2 (2027).',
    client: "Global Christie's brand. Legacy practice. Not a brokerage.",
    team: 'Three offices fully staffed by 2031. Team complete. Steady growth carries through 2036.',
  },
];

function HundredDayCards() {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 9 }}>
        {HUNDRED_DAY_CARDS.map((c, i) => <HundredDayCard key={i} {...c} />)}
      </div>
    </div>
  );
}

function HundredDayCard({ label, status, dates, accent, shareholder, client, team }: HundredDayCardProps) {
  return (
    <div style={{ border: '2px solid #000', borderLeft: `5px solid ${accent}`, background: CREAM, overflow: 'hidden' }}>
      <div style={{ background: PARCHMENT, padding: '8px 10px 8px', borderBottom: `1px solid ${GOLD}` }}>
        <div style={{ fontSize: 8.5, letterSpacing: 1.8, color: GOLD, fontWeight: 500, marginBottom: 3, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 12, letterSpacing: 1.5, color: NAVY, fontWeight: 500, textTransform: 'uppercase', lineHeight: 1.1 }}>{status}</div>
        <div style={{ fontSize: 7.5, color: INK_ACCENT, fontStyle: 'italic', marginTop: 3, letterSpacing: 0.3 }}>{dates}</div>
      </div>
      <div style={{ padding: '9px 10px 10px' }}>
        <Section heading="Shareholder" body={shareholder} />
        <Section heading="Client" body={client} />
        <Section heading="Team" body={team} />
      </div>
    </div>
  );
}

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 7, letterSpacing: 1.4, color: GOLD, fontWeight: 500, marginBottom: 2, textTransform: 'uppercase' }}>{heading}</div>
      <div style={{ fontSize: 8.5, lineHeight: 1.48, color: INK_SOFT }}>{body}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2: Partner cards + Levers + Footnotes + UHNW card
// ═══════════════════════════════════════════════════════════════════════════════

function Page2() {
  return (
    <section
      className="pfc-page pfc-page-2"
      style={{ background: CREAM, padding: '22px 14px 16px', pageBreakBefore: 'always', breakBefore: 'page' }}
    >
      <BrandBand />
      <div style={{ textAlign: 'center', fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', color: NAVY, fontWeight: 500, padding: '2px 0 10px', borderBottom: `1px solid ${GOLD}`, marginBottom: 12 }}>
        Partnership Projections · 2026 – 2036
      </div>
      <PartnerCardGrid />
      <ChartLegend />
      <ModelAssumptionLevers />
      <CanonicalFootnotes />
      <BrandSignature />
      <UHNWCardLink />
      <PageNumber>Page 2 of 2</PageNumber>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Partner cards — port of FINAL_v14_3b_page2_cream.html
// 7 cards, 3-column grid, canonical OUTPUTS values verified against checkpoint ae4ee6b5
// ───────────────────────────────────────────────────────────────────────────────

type Row = {
  label: string;
  values: string[];        // [2026, 2027, 2028, 2036]
  borderColor: string;
};

type PartnerCard = {
  name: string;
  title: string;
  nestNote?: string;       // italic line under title (Zoila only)
  rows: Row[];
  total: { label: string; values: string[] };
  footnotes: string[];     // e.g. ["CPS1 + CIRE Node visibility only — not included in total"]
  excludeHeader?: boolean; // if true, no "Stream / 2026 / 2027 / 2028 / 2036" column headers
};

const PARTNER_CARDS: PartnerCard[] = [
  // ── COLUMN 1 ────────────────────────────────────────────────────────────────
  {
    name: 'Edward Bruehl',
    title: 'Broker – Managing Director',
    rows: [
      { label: "Ed's Team GCI (reference)",    values: ['$600K',   '$720K',  '$864K',  '$3.60M'],  borderColor: COLOR_EH_FLAGSHIP },
      { label: 'Personal GCI',                  values: ['$420K',   '$504K',  '$605K',  '$2.60M'],  borderColor: COLOR_EH_FLAGSHIP },
      { label: 'AnewHomes 35% * §',             values: ['$17.5K',  '$52.5K', '$59K',   '$151K'],   borderColor: '#c8946b' },
      { label: 'CIREG Profit Share 29.75% *',   values: ['$52K',    '$128K',  '$287K',  '$3.39M'],  borderColor: '#6b2838' },
      { label: 'CPS1 + CIRE Node ‡',            values: ['$100K',   '$250K',  '$500K',  '$1.13M'],  borderColor: '#6b2838' },
    ],
    total: { label: 'All Streams Total', values: ['$489.5K', '$684.5K', '$951K', '$6.14M'] },
    footnotes: [
      "Ed's Team GCI reference only — not included in total",
      'CPS1 + CIRE Node visibility only — not included in total',
    ],
  },
  {
    name: 'Ilija Pavlovic',
    title: 'Franchise Principal · CIREG Tri-State',
    rows: [
      { label: 'CIREG Profit Share 65% **',     values: ['$114K',   '$279K',  '$627K',  '$7.4M'],   borderColor: '#6b2838' },
      { label: 'CPS1 + CIRE Node ‡',            values: ['$100K',   '$250K',  '$500K',  '$1.13M'],  borderColor: '#6b2838' },
    ],
    total: { label: 'All Streams Total', values: ['$114K', '$279K', '$627K', '$7.4M'] },
    footnotes: ['CPS1 + CIRE Node visibility only — not included in total'],
  },
  // ── COLUMN 2 ────────────────────────────────────────────────────────────────
  {
    name: 'Angel Theodore',
    title: 'Agent – Marketing Coordinator',
    nestNote: 'Nest salary $70K/yr · through Q1 2027',
    rows: [
      { label: 'Personal GCI',                  values: ['$17.5K',  '$84K',   '$100.8K','$433K+'],  borderColor: COLOR_EH_FLAGSHIP },
      { label: 'Nest Salary °',                 values: ['$70K',    '$17.5K', '—',      '—'],       borderColor: '#c8946b' },
      { label: 'AnewHomes 5% §',                values: ['$2.5K',   '$7.5K',  '$8.4K',  '$21.6K'],  borderColor: '#c8946b' },
      { label: "Ed's Team GCI Override 5%",     values: ['$30K',    '$36K',   '$43K',   '$186K'],   borderColor: '#9a9a9a' },
      { label: 'CIREG Profit Share 1.75%',      values: ['$3K',     '$8K',    '$17K',   '$200K'],   borderColor: '#6b2838' },
      { label: 'CPS1 + CIRE Node ‡',            values: ['$100K',   '$250K',  '$500K',  '$1.13M'],  borderColor: '#6b2838' },
    ],
    total: { label: 'All Streams Total', values: ['$123K', '$152.5K', '$168.2K', '$840.6K+'] },
    footnotes: ['CPS1 + CIRE Node visibility only — not included in total'],
  },
  {
    name: 'Jarvis Slade',
    title: 'Agent – COO',
    rows: [
      { label: 'Personal GCI',                  values: ['$140K',   '$168K',  '$201.6K','$868K+'],  borderColor: COLOR_EH_FLAGSHIP },
      { label: 'AnewHomes 5% §',                values: ['$2.5K',   '$7.5K',  '$8.4K',  '$21.6K'],  borderColor: '#c8946b' },
      { label: "Ed's Team GCI Override 5%",     values: ['$30K',    '$36K',   '$43K',   '$186K'],   borderColor: '#9a9a9a' },
      { label: 'CIREG Profit Share 1.75%',      values: ['$3K',     '$8K',    '$17K',   '$200K'],   borderColor: '#6b2838' },
      { label: 'CPS1 + CIRE Node ‡',            values: ['$100K',   '$250K',  '$500K',  '$1.13M'],  borderColor: '#6b2838' },
    ],
    total: { label: 'All Streams Total', values: ['$175.5K', '$219.5K', '$270K', '$1.28M'] },
    footnotes: ['CPS1 + CIRE Node visibility only — not included in total'],
  },
  // ── COLUMN 3 ────────────────────────────────────────────────────────────────
  {
    name: 'Zoila Ortega Astor †',
    title: 'Broker/Agent – Office Director',
    nestNote: 'Nest salary $70K/yr · Start May 4 2026',
    rows: [
      { label: 'Personal GCI',                  values: ['$17.5K',  '$105K',  '$126K',  '$542K+'],  borderColor: COLOR_EH_FLAGSHIP },
      { label: 'Nest Salary °',                 values: ['$46.7K',  '$17.5K', '—',      '—'],       borderColor: '#c8946b' },
      { label: 'AnewHomes 5% † §',              values: ['$0',      '$7.5K',  '$8.4K',  '$21.6K'],  borderColor: '#c8946b' },
      { label: "Ed's Team GCI Override †",      values: ['$30K',    '$9K',    '—',      '—'],       borderColor: '#9a9a9a' },
      { label: 'CIREG Profit Share 1.75% †',    values: ['$0',      '$8K',    '$17K',   '$200K'],   borderColor: '#6b2838' },
      { label: 'CPS1 + CIRE Node ‡',            values: ['$100K',   '$250K',  '$500K',  '$1.13M'],  borderColor: '#6b2838' },
    ],
    total: { label: 'All Streams Total', values: ['$94.2K', '$147K', '$151.4K', '$763.6K+'] },
    footnotes: ['CPS1 + CIRE Node visibility only — not included in total'],
  },
  {
    name: 'Scott Smith *',
    title: 'Agent – AnewHomes Co. Partner',
    rows: [
      { label: 'Personal GCI',                  values: ['$35K',    '$84K',   '$100.8K','$324K+'],  borderColor: COLOR_EH_FLAGSHIP },
      { label: 'AnewHomes 35% §',               values: ['$17.5K',  '$52.5K', '$59K',   '$151K'],   borderColor: '#c8946b' },
    ],
    total: { label: 'All Streams Total', values: ['$52.5K', '$136.5K', '$159.8K', '$475K+'] },
    footnotes: [],
  },
  {
    name: 'Richard Bruehl',
    title: 'Strategic Advisor – AnewHomes Co. Partner',
    rows: [
      { label: 'AnewHomes 10% §',               values: ['$5K',     '$15K',   '$16.9K', '$43.3K'],  borderColor: '#c8946b' },
    ],
    total: { label: 'All Streams Total', values: ['$5K', '$15K', '$16.9K', '$43.3K'] },
    footnotes: [],
  },
];

function PartnerCardGrid() {
  // 3-column layout matching v14_3b: col1 = [Ed, Ilija], col2 = [Angel, Jarvis], col3 = [Zoila, Scott, Richard]
  const col1 = [PARTNER_CARDS[0], PARTNER_CARDS[1]];
  const col2 = [PARTNER_CARDS[2], PARTNER_CARDS[3]];
  const col3 = [PARTNER_CARDS[4], PARTNER_CARDS[5], PARTNER_CARDS[6]];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)', gap: 7, marginBottom: 11 }}>
      <Column cards={col1} />
      <Column cards={col2} />
      <Column cards={col3} />
    </div>
  );
}

function Column({ cards }: { cards: PartnerCard[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0, justifyContent: 'center' }}>
      {cards.map((card, i) => <PartnerCardView key={i} card={card} />)}
    </div>
  );
}

function PartnerCardView({ card }: { card: PartnerCard }) {
  return (
    <div style={{ border: '2px solid #000', background: CREAM, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
      <div style={{ background: PARCHMENT, padding: '5px 8px 4px', borderBottom: `1px solid ${GOLD}` }}>
        <div style={{ letterSpacing: 1.8, fontSize: 10.5, textTransform: 'uppercase', fontWeight: 500, lineHeight: 1.15 }}>{card.name}</div>
        <div style={{ fontSize: 8.5, color: INK_ACCENT, fontStyle: 'italic', marginTop: 1, lineHeight: 1.25 }}>{card.title}</div>
        {card.nestNote && (
          <div style={{ fontSize: 7.5, color: '#7a6b4a', fontStyle: 'italic', marginTop: 2, lineHeight: 1.25 }}>{card.nestNote}</div>
        )}
      </div>
      <div style={{ padding: '6px 7px 7px' }}>
        <RowHeader />
        {card.rows.map((r, i) => <TableRow key={i} row={r} />)}
        <TotalRow total={card.total} />
        {card.footnotes.map((fn, i) => (
          <div key={i} style={{ fontSize: 6.5, color: INK_ACCENT, fontStyle: 'italic', padding: '2px 0 0 4px', lineHeight: 1.3 }}>
            {fn}
          </div>
        ))}
      </div>
    </div>
  );
}

function RowHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '1.5px 0 1.5px 4px', lineHeight: 1.2,
      fontSize: 6.5, letterSpacing: 0.5, textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 2,
      borderLeft: '2px solid transparent' }}>
      <div style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap' }}>Stream</div>
      <div style={{ width: 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>2026</div>
      <div style={{ width: 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>2027</div>
      <div style={{ width: 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>2028</div>
      <div style={{ width: 36, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>2036</div>
    </div>
  );
}

function TableRow({ row }: { row: Row }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '1.5px 0 1.5px 4px',
      lineHeight: 1.2, fontSize: 9, borderLeft: `2px solid ${row.borderColor}`, marginTop: 0.5 }}>
      <div style={{ flex: 1, minWidth: 0, wordBreak: 'keep-all' }}>{row.label}</div>
      {row.values.map((v, i) => (
        <div key={i} style={{ width: i === 3 ? 36 : 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, color: INK_FAINT, fontStyle: 'italic' }}>{v}</div>
      ))}
    </div>
  );
}

function TotalRow({ total }: { total: { label: string; values: string[] } }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '4px 0 1px 4px',
      marginTop: 3, borderTop: '1px solid #000', fontSize: 9.5, fontWeight: 500 }}>
      <div style={{ flex: 1, minWidth: 0, wordBreak: 'keep-all' }}>{total.label}</div>
      {total.values.map((v, i) => (
        <div key={i} style={{ width: i === 3 ? 36 : 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, color: GOLD, fontStyle: 'normal', fontWeight: 500 }}>{v}</div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Model Assumption Levers — port of FINAL_v16_levers_cream.html
// STATIC: no sliders in print. Thin gold tracks with static markers.
// ───────────────────────────────────────────────────────────────────────────────

function ModelAssumptionLevers() {
  return (
    <div style={{ border: '2px solid #000', background: CREAM, marginTop: 16 }}>
      <div style={{ background: PARCHMENT, padding: '9px 12px 8px', borderBottom: `1px solid ${GOLD}` }}>
        <div style={{ letterSpacing: 5, fontSize: 15, textTransform: 'uppercase', fontWeight: 500, textAlign: 'center', color: NAVY }}>
          Model Assumption Levers
        </div>
        <div style={{ fontSize: 9, color: INK_ACCENT, fontStyle: 'italic', textAlign: 'center', marginTop: 3, letterSpacing: 1 }}>
          Three live levers · Output summary
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, padding: '14px 14px 10px' }}>
        <Lever label="Top Producers / Office"     value="12 PPL"  position={40} />
        <Lever label="Projected GCI Commission"   value="2.00%"   position={25} />
        <Lever label="Pros Starting Production"   value="$500K"   position={16.7} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, padding: '6px 10px 10px' }}>
        <Output label="Flagship 3-Yr Cumulative" value="$413M" />
        <Output label="2029 Flagship Cumulative" value="$708M" />
        <Output label="2036 Combined Volume"     value="$3.00B" />
      </div>
    </div>
  );
}

function Lever({ label, value, position }: { label: string; value: string; position: number }) {
  return (
    <div style={{ padding: '6px 10px 8px', display: 'flex', flexDirection: 'column', gap: 5, borderBottom: '1px solid rgba(148,114,49,0.4)', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ fontSize: 7.5, letterSpacing: 1, color: GOLD, textTransform: 'uppercase', lineHeight: 1.25 }}>{label}</div>
        <div style={{ fontSize: 14, color: INK, fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{value}</div>
      </div>
      <div style={{ width: '100%', height: 2, background: 'rgba(148,114,49,0.25)', margin: '4px 0 0', borderRadius: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', width: 10, height: 10, background: GOLD, borderRadius: '50%', border: '1px solid #000', left: `${position}%` }} />
      </div>
    </div>
  );
}

function Output({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: NAVY, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, minWidth: 0 }}>
      <div style={{ fontSize: 7, letterSpacing: 1, color: '#c9bf9f', textTransform: 'uppercase', lineHeight: 1.2 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#ebe6db', fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Canonical footnotes — verbatim copy from v14_3b
// ───────────────────────────────────────────────────────────────────────────────

function CanonicalFootnotes() {
  const cellStyle: React.CSSProperties = { padding: 0 };
  const headingStyle: React.CSSProperties = { fontSize: 8.5, letterSpacing: 1.2, textTransform: 'uppercase', color: NAVY, fontWeight: 500, marginBottom: 3 };
  const bodyStyle: React.CSSProperties = { fontSize: 8, color: INK_SOFT, lineHeight: 1.4 };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, padding: 11, borderTop: '1px solid rgba(148,114,49,0.3)' }}>
        <div style={cellStyle}>
          <div style={headingStyle}>* Governing Principle</div>
          <div style={bodyStyle}>
            Not yet contractual. Profit pool = GCI less 5% royalty, 70% agent splits, and overhead. Flagship team takes 35% (Ed 29.75%, Angel 1.75%, Jarvis 1.75%, Zoila 1.75%). Franchise takes 65%. 20% year-over-year, uncapped.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>† Zoila Vesting</div>
          <div style={bodyStyle}>
            AnewHomes 5% and CIREG Profit Share 1.75% vest over six months from May 4 2026. Cliff November 4 2026. Activates 2027 forward. Ed's Team GCI Override applies 2026 and Q1 2027 only.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>‡ CPS1 + CIRE Node Pipeline</div>
          <div style={bodyStyle}>
            Flagship-sourced developer pipeline routed through Flagship ICA. UHNW buyers meet new product in any Christie's market. Ramps $100K (2026) to $1M (2030), then 2% steady-state. Visibility only — not additive to totals. Full doctrine: Christie's East Hampton Canonical Reference Library.
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, padding: '0 11px 11px' }}>
        <div style={cellStyle}>
          <div style={headingStyle}>** Ilija Franchise Principal</div>
          <div style={bodyStyle}>
            CIREG Profit Share 65% captures full partnership take. 5% Christie's master royalty is Ilija's cost on his side of the partnership. Not surfaced on any partner card.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>° Nest Salary</div>
          <div style={bodyStyle}>
            Pro-rated through Q1 2027 producer transition. Angel: $70K/yr full 2026, $17.5K Q1 2027 only. Zoila: $46.7K pro-rated from May 4 2026, $17.5K Q1 2027 only.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>§ AnewHomes Co.</div>
          <div style={bodyStyle}>
            Ed Bruehl's vertically-integrated build platform with Scott Smith as Build Partner (June 1 2026 start), Richard Bruehl as Strategic Advisor, and flagship team carrying equity. Growth trajectory: $50K 2026 · $150K 2027 · 12.5% CAGR 2028-2036 (company total $433K by 2036). Conservative base case pending post-June 1 doctrine review with Scott. Full doctrine: Christie's East Hampton Canonical Reference Library.
          </div>
        </div>
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// UHNW Wealth Path Card — port of FINAL_v17_client_resource_cream.html
// Static reference card with canonical URL visible as text
// ───────────────────────────────────────────────────────────────────────────────

function UHNWCardLink() {
  return (
    <div style={{ background: CREAM, padding: '14px 14px 16px', height: 'fit-content', minHeight: 'auto', marginTop: 12 }}>
      <div style={{ border: '2px solid #000', background: CREAM, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: 0, overflow: 'hidden' }}>
        <div style={{ background: PARCHMENT, padding: '12px 16px 12px', borderRight: `1px solid ${GOLD}`, flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 7.5, letterSpacing: 1.8, textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 4 }}>Client Resource</div>
          <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: NAVY, fontWeight: 500, lineHeight: 1.2 }}>UHNW Wealth Path Card</div>
          <div style={{ fontSize: 9, color: INK_ACCENT, fontStyle: 'italic', marginTop: 4, lineHeight: 1.3, letterSpacing: 0.3 }}>The Christie's Standard applied to UHNW family wealth stewardship.</div>
        </div>
        <div style={{ padding: '12px 18px 12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
          <div style={{ fontSize: 7, letterSpacing: 1.4, textTransform: 'uppercase', color: GOLD, fontWeight: 500 }}>Open Card</div>
          <div style={{ fontSize: 9, color: NAVY, letterSpacing: 0.3, fontWeight: 500 }}>
            <span style={{ color: GOLD }}>→ </span>
            christiesrealestategroupeh.com/cards/uhnw-path
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Page number — bottom right of each page
// ───────────────────────────────────────────────────────────────────────────────

function PageNumber({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'right', fontSize: 7.5, letterSpacing: 1.5, color: INK_SUBTLE, marginTop: 10 }}>
      {children}
    </div>
  );
}
