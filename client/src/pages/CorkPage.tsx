/**
 * /cork — Christie's Flagship Corkboard (Live Route)
 *
 * Six-quadrant operational layout with three live wires:
 *   Q3 Pipeline top line  → pipe.getKpis (activeTotalM, dealCount)
 *   Q5 Calendar countdown → Wednesday Circuit (same logic as IntelTab)
 *   Q6 Focus top-2        → pipe.sheetDeals filtered Active/In Contract/Closed, sortOrder DESC
 *
 * Copy fixes applied per D23 Work Order Apr 26 2026:
 *   - Q1: "Pulse (daily)" removed; clockwise instruction updated
 *   - Q2: Top 3 for Angel → "today" (not "April 2026")
 *   - Q4: NYC Contacts → "NYC Contacts · 3 to recruit Q2"
 *   - North Star band right-side redundancy trimmed
 *
 * Dynamic as-of timestamp footer matches /pipe style.
 */
import React, { useMemo } from 'react';
import { trpc } from '@/lib/trpc';

// ─── Design tokens (same as EdCorkboard) ─────────────────────────────────────
const C = {
  gold: '#c8ac78',
  goldDark: '#a88f5f',
  cream: '#FAF8F4',
  deepRed: '#8b2635',
  navy: '#1B2A4A',
  darkSurface: 'rgba(27,42,74,0.55)',
  darkBorder: 'rgba(200,172,120,0.18)',
  darkBg: '#0D1B2A',
  line: 'rgba(200,172,120,0.25)',
};

const s = {
  panel: {
    background: C.darkSurface,
    border: `1px solid ${C.darkBorder}`,
    padding: '12px 14px',
    height: '100%',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  panelH3: {
    fontSize: 10,
    letterSpacing: '0.28em',
    color: C.gold,
    borderBottom: `1px solid rgba(200,172,120,0.3)`,
    paddingBottom: 5,
    marginBottom: 9,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    fontFamily: 'Georgia, serif',
    margin: '0 0 9px 0',
  } as React.CSSProperties,
  item: {
    padding: '3px 0',
    fontSize: 9.5,
    color: 'rgba(250,248,244,0.85)',
    fontFamily: 'Georgia, serif',
    lineHeight: 1.45,
    display: 'flex',
    gap: 6,
    alignItems: 'flex-start',
  } as React.CSSProperties,
  bullet: {
    color: C.gold,
    fontSize: 7,
    marginTop: 3,
    flexShrink: 0,
  } as React.CSSProperties,
  subLabel: {
    fontSize: 8,
    letterSpacing: '0.22em',
    color: '#a88f5f',
    margin: '8px 0 4px 0',
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    borderTop: `1px dotted rgba(200,172,120,0.3)`,
    paddingTop: 5,
    fontFamily: 'Georgia, serif',
  } as React.CSSProperties,
};

function Bullet({ text, sub }: { text: string; sub?: string }) {
  return (
    <div style={s.item}>
      <span style={s.bullet}>◆</span>
      <span>
        <span style={{ color: 'rgba(250,248,244,0.9)' }}>{text}</span>
        {sub && <span style={{ color: C.goldDark, fontSize: 8.5, display: 'block' }}>{sub}</span>}
      </span>
    </div>
  );
}

// ─── Wednesday Circuit Countdown (same logic as IntelTab) ────────────────────
function WednesdayCountdown() {
  const { daysUntil, nextDate, isToday } = useMemo(() => {
    const now = new Date();
    const seriesStart = new Date('2026-05-06T00:00:00');
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let target = new Date(seriesStart);
    if (today >= seriesStart) {
      target = new Date(today);
      const dow = target.getDay();
      const daysToWed = (3 - dow + 7) % 7;
      target.setDate(target.getDate() + daysToWed);
    }
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const dateStr = target.toLocaleDateString('en-US', {
      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
    });
    return { daysUntil: diffDays, nextDate: dateStr, isToday: diffDays === 0 };
  }, []);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      background: 'rgba(200,172,120,0.08)',
      border: '1px solid rgba(200,172,120,0.25)',
      padding: '6px 12px',
      marginTop: 8,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ textAlign: 'center', minWidth: 40 }}>
        <div style={{ color: C.gold, fontSize: isToday ? '1.2rem' : '1.6rem', fontWeight: 700, lineHeight: 1, fontFamily: 'Georgia, serif' }}>
          {isToday ? 'TODAY' : daysUntil}
        </div>
        {!isToday && (
          <div style={{ color: 'rgba(200,172,120,0.6)', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>
            days
          </div>
        )}
      </div>
      <div style={{ width: 1, height: 28, background: 'rgba(200,172,120,0.2)' }} />
      <div>
        <div style={{ color: C.goldDark, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>
          Wednesday Circuit
        </div>
        <div style={{ color: 'rgba(250,248,244,0.75)', fontSize: 8.5, fontFamily: 'Georgia, serif' }}>
          {nextDate}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CorkPage() {
  // Live wire 1: Q3 Pipeline KPIs
  const { data: kpis } = trpc.pipe.getKpis.useQuery();
  // Live wire 3: Q6 Focus top-2 deals
  const { data: dealsData } = trpc.pipe.sheetDeals.useQuery();

  // Q6: Filter Active / In Contract / Closed, take top 2 by rowNumber DESC
  const focusDeals = useMemo(() => {
    if (!dealsData?.deals) return [];
    const FOCUS_STATUSES = ['active', 'in contract', 'closed'];
    return dealsData.deals
      .filter(d => !d.isSectionHeader && FOCUS_STATUSES.includes((d.status || '').toLowerCase()))
      .sort((a, b) => b.rowNumber - a.rowNumber)
      .slice(0, 2);
  }, [dealsData]);

  const asOf = useMemo(() => {
    return new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: 'America/New_York',
    }) + ' ET';
  }, []);

  return (
    <div style={{
      background: C.darkBg,
      minHeight: '100vh',
      color: C.cream,
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: 11,
      lineHeight: 1.4,
      padding: '0.35in',
    }}>
      <div style={{ maxWidth: '14in', margin: '0 auto' }}>

        {/* HEADER */}
        <header style={{
          borderBottom: `2px solid ${C.gold}`,
          paddingBottom: 8,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          marginBottom: 10,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(250,248,244,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: C.gold }}>CHRISTIE'S</strong><br />
            INTERNATIONAL REAL ESTATE GROUP<br />
            EAST HAMPTON · 26 PARK PLACE
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 22, fontWeight: 400, letterSpacing: '0.25em', color: C.gold, fontFamily: 'Georgia, serif', margin: 0 }}>
              CHRISTIE&rsquo;S FLAGSHIP CORKBOARD
            </h1>
            <div style={{ fontSize: 10, color: C.goldDark, letterSpacing: '0.3em', marginTop: 4, fontStyle: 'italic' }}>
              Nouns, not numbers · One page · Internal only
            </div>
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(250,248,244,0.7)', textAlign: 'right', lineHeight: 1.6 }}>
            Updated April 29, 2026 · Public Launch<br />
            Six-quadrant operational layout<br />
            christiesrealestategroupeh.com
          </div>
        </header>

        {/* PRINCIPLES BAND */}
        <section style={{
          background: 'rgba(200,172,120,0.07)',
          padding: '7px 14px',
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: 10.5,
          letterSpacing: '0.1em',
          borderTop: `1px solid rgba(200,172,120,0.25)`,
          borderBottom: `1px solid rgba(200,172,120,0.25)`,
          marginBottom: 12,
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <span><strong style={{ color: C.gold, fontStyle: 'italic' }}>JESUS FIRST</strong></span>
          <span style={{ color: 'rgba(250,248,244,0.8)' }}>
            <strong style={{ color: C.gold, fontStyle: 'italic' }}>The Christie's Standard</strong> · Since 1766
          </span>
          <span style={{ color: 'rgba(250,248,244,0.8)' }}>
            <strong style={{ color: C.gold, fontStyle: 'italic' }}>The Richard Rule</strong> · Operate from what is real
          </span>
          <span style={{ color: 'rgba(250,248,244,0.8)' }}>
            <strong style={{ color: C.gold, fontStyle: 'italic' }}>The Hagler Standard</strong> · Train in the dark
          </span>
        </section>

        {/* SIX QUADRANTS — 3×2 grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 0 }}>

          {/* Q1 — START HERE (copy fix: clockwise instruction updated, "Pulse (daily)" removed) */}
          <div style={{ ...s.panel, borderLeft: `4px solid ${C.deepRed}`, background: 'rgba(139,38,53,0.18)' }}>
            <h3 style={{ ...s.panelH3, color: C.cream }}>⓪ START HERE</h3>
            <div style={{ fontSize: 9, color: 'rgba(250,248,244,0.7)', lineHeight: 1.55, marginBottom: 6, fontStyle: 'italic' }}>— How to read this board —</div>
            <Bullet text="The Mind Map lives in Trello" sub="Layer 1 — the cause-and-effect shape" />
            <Bullet text="The 13 Sheets live in Drive" sub="Layer 3 — the operational surface" />
            <Bullet text="The Corkboard lives here" sub="The one-page daily snapshot" />
            <Bullet text="The Live Site" sub="christiesrealestategroupeh.com — the public face" />
            <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, margin: '6px 0 4px', letterSpacing: '0.08em' }}>
              THE LIVE URL IS THE SOURCE OF TRUTH.
            </div>
            <Bullet text="Ed thirty-five · Ilija sixty-five" sub="Two parties at the pool" />
            <Bullet text="The platform is the pitch" sub="No decks" />
            {/* Copy fix: removed "Pulse (daily)" from clockwise instruction */}
            <div style={{ fontSize: 8.5, color: 'rgba(250,248,244,0.6)', marginTop: 6, lineHeight: 1.5, fontStyle: 'italic' }}>
              Read clockwise: Standard → Pipeline → Network → Calendar → Focus → North Star
            </div>
            <div style={{ fontSize: 8.5, color: 'rgba(250,248,244,0.82)', marginTop: 8, lineHeight: 1.65, fontStyle: 'italic', borderTop: '1px solid rgba(148,114,49,0.22)', paddingTop: 7 }}>
              "We underwrite homes the way a banker underwrites a portfolio — replacement cost, comparable performance, exit scenarios. We serve families who prefer to be understood before they are advised. We hold before we sell. We carry the Christie's Standard forward — over 250 years of it — in every conversation."
            </div>
          </div>

          {/* Q2 — THE STANDARD (copy fix: Angel "today" not "April 2026") */}
          <div style={{ ...s.panel, borderLeft: `4px solid ${C.deepRed}` }}>
            <h3 style={s.panelH3}>① The Christie's Standard</h3>
            <Bullet text="Numbers Box" sub="Closings · pipeline value · active count" />
            <Bullet text="Top 3 for Ed" sub="Highest-leverage actions today" />
            {/* Copy fix: "April 2026" → "today" */}
            <Bullet text="Top 3 for Angel" sub="Angel active · today" />
            <Bullet text="Waiting On" sub="Counterparties · attorneys · banks" />
            <Bullet text="Touch Minimums" sub="3 seller touches · 2 buyer touches · 1 recruit" />
          </div>

          {/* Q3 — THE PIPELINE (live wire: pipe.getKpis) */}
          <div style={{ ...s.panel, borderLeft: `4px solid ${C.gold}` }}>
            <h3 style={s.panelH3}>
              ② The Pipeline{' '}
              <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Weekly</span>
            </h3>
            {/* Live wire 1: Q3 Pipeline top line */}
            {kpis ? (
              <div style={{
                background: 'rgba(200,172,120,0.08)',
                border: '1px solid rgba(200,172,120,0.2)',
                padding: '6px 10px',
                marginBottom: 8,
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{ color: C.gold, fontSize: 14, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                    {kpis.activeTotalM}
                  </div>
                  <div style={{ color: 'rgba(250,248,244,0.55)', fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Active Volume
                  </div>
                </div>
                <div>
                  <div style={{ color: C.gold, fontSize: 14, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                    {kpis.dealCount}
                  </div>
                  <div style={{ color: 'rgba(250,248,244,0.55)', fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Active Deals
                  </div>
                </div>
                <div>
                  <div style={{ color: C.gold, fontSize: 14, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                    {kpis.exclusiveTotalM}
                  </div>
                  <div style={{ color: 'rgba(250,248,244,0.55)', fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Exclusive Active
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'rgba(250,248,244,0.4)', fontSize: 9, marginBottom: 8 }}>Loading pipeline…</div>
            )}
            <Bullet text="Active Listings" sub="Price · DOM · next action" />
            <Bullet text="Buy Side" sub="Active buyers · search criteria · urgency" />
            <Bullet text="Auction House Intros" sub="Christie's referrals in motion" />
            <Bullet text="ANEW Projects" sub="AnewHomes pipeline · Scott + Richard" />
          </div>

          {/* Q4 — THE NETWORK (copy fix: NYC Contacts → "NYC Contacts · 3 to recruit Q2") */}
          <div style={{ ...s.panel, borderLeft: `4px solid ${C.navy}` }}>
            <h3 style={s.panelH3}>
              ③ The Network{' '}
              <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Monthly</span>
            </h3>
            <Bullet text="Key Relationships" sub="Lily · Ilija Pavlovic · Rick Moeser · Melissa True" />
            {/* Copy fix: "Finance · law · art world" → "NYC Contacts · 3 to recruit Q2" */}
            <Bullet text="NYC Contacts" sub="3 to recruit Q2" />
            <Bullet text="Attorneys" sub="Deal counsel · estate counsel · referral partners" />
            <Bullet text="Recruit Targets" sub="Next agent · timeline · approach" />
          </div>

          {/* Q5 — THE CALENDAR (live wire: Wednesday Circuit countdown) */}
          <div style={{ ...s.panel, borderLeft: `4px solid ${C.gold}` }}>
            <h3 style={s.panelH3}>
              ④ The Calendar{' '}
              <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Monthly</span>
            </h3>
            <Bullet text="Headline Events" sub="Christie's auction dates · Hamptons circuit" />
            <Bullet text="Private Collector Series" sub="Monthly UHNW touchpoint events" />
            <Bullet text="Wednesday Circuit" sub="Recurring · brokers + culture + rhythm" />
            {/* Live wire 2: Wednesday Circuit countdown */}
            <WednesdayCountdown />
            <div style={s.subLabel}>Team Dates</div>
            {[
              ['Angel active', 'April 2026'],
              ['Public Launch', 'April 29'],
              ['Zoila starts', 'May 4'],
              ['Scott starts', 'June 1'],
            ].map(([who, when]) => (
              <div key={who} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 6,
                padding: '2px 0',
                fontSize: 9,
                borderBottom: `1px dotted rgba(200,172,120,0.2)`,
                fontFamily: 'Georgia, serif',
              }}>
                <span style={{ color: 'rgba(250,248,244,0.85)' }}>{who}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{when}</span>
              </div>
            ))}
          </div>

          {/* Q6 — THE FOCUS (live wire: top-2 deals from pipe.sheetDeals) */}
          <div style={{ ...s.panel, borderLeft: `4px solid ${C.deepRed}` }}>
            <h3 style={s.panelH3}>
              ⑤ The Focus{' '}
              <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Current</span>
            </h3>
            {/* Live wire 3: top-2 deals */}
            {focusDeals.length > 0 ? (
              focusDeals.map((deal, i) => (
                <div key={deal.address} style={{
                  background: 'rgba(200,172,120,0.06)',
                  border: '1px solid rgba(200,172,120,0.15)',
                  padding: '5px 8px',
                  marginBottom: 5,
                }}>
                  <div style={{ color: C.gold, fontWeight: 700, fontSize: 9.5, fontFamily: 'Georgia, serif' }}>
                    Deal Priority #{i + 1}
                  </div>
                  <div style={{ color: 'rgba(250,248,244,0.9)', fontSize: 9, marginTop: 2 }}>
                    {deal.address}{deal.town ? ` · ${deal.town}` : ''}
                  </div>
                  <div style={{ color: C.goldDark, fontSize: 8, marginTop: 1 }}>
                    {deal.status}{deal.price ? ` · ${deal.price}` : ''}
                  </div>
                </div>
              ))
            ) : (
              <>
                <Bullet text="Deal Priority #1" sub="25 Horseshoe Road · in contract" />
                <Bullet text="Deal Priority #2" sub="2 Old Hollow Road · closed April 2" />
              </>
            )}
            <Bullet text="Intelligence Signal" sub="Inventory tightening · buyer urgency rising" />
            <Bullet text="Institutional Lens" sub="UHNW buyer pipeline · CPS-1 node active" />
          </div>

        </section>

        {/* NORTH STAR DOCTRINE — narrow red bar (copy fix: right-side redundancy trimmed) */}
        <div style={{
          background: C.deepRed,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 10,
          border: `1px solid rgba(139,38,53,0.6)`,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 9, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'nowrap' }}>
            ⑥ North Star
          </span>
          <span style={{ fontSize: 10, color: 'rgba(250,248,244,0.9)', fontStyle: 'italic', flex: 1, minWidth: 200 }}>
            "Seventy-five million to three billion. Three offices. One trajectory."
          </span>
          {/* Copy fix: trimmed right-side redundancy — kept only the essential anchor */}
          <span style={{ fontSize: 9, color: 'rgba(250,248,244,0.7)', whiteSpace: 'nowrap' }}>
            Ed thirty-five · Ilija sixty-five
          </span>
        </div>

        {/* NUMBERS BAND — KPIs */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
          {[
            { value: '$4.57M', label: 'Closed · First 100 Days' },
            { value: '$13.62M', label: 'Exclusive Active' },
            { value: '$75M', label: '2026 Baseline' },
            { value: '$3B', label: '2036 Horizon' },
          ].map(({ value, label }) => (
            <div key={label} style={{
              background: 'rgba(27,42,74,0.7)',
              color: C.cream,
              padding: '10px 12px',
              textAlign: 'center',
              border: `1px solid rgba(200,172,120,0.2)`,
              borderLeft: `4px solid ${C.gold}`,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, letterSpacing: '0.03em', fontFamily: 'Georgia, serif' }}>
                {value}
              </div>
              <div style={{ fontSize: 8.5, letterSpacing: '0.22em', marginTop: 3, textTransform: 'uppercase', color: 'rgba(250,248,244,0.6)' }}>
                {label}
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER: Ten Commandments + Council + Contact */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
          <div style={s.panel}>
            <h3 style={s.panelH3}>The Ten Commandments</h3>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'The live URL is the source of truth.',
                'Tell the truth. Know the territory. Sit on the same side as the family.',
                'Every number has a named source. No invented figures.',
                'Ed thirty-five. Ilija sixty-five. Two parties at the pool.',
                'Seventy-five million to three billion. Three offices. One trajectory.',
                'The platform is the pitch. No decks.',
                'Nothing to Manny without a Claude wireframe.',
                'The operator is the gate. Ed signs off or it does not ship.',
                'No competitor names on any public surface.',
                'AnewHomes locked at seven. Ed, Richard, Scott, Jarvis, Angel, Zoila, Founder-Held.',
              ].map((cmd, i) => (
                <li key={i} style={{
                  padding: '3px 2px',
                  fontSize: 9.5,
                  borderBottom: i < 9 ? `1px dotted rgba(200,172,120,0.2)` : 'none',
                  display: 'grid',
                  gridTemplateColumns: '26px 1fr',
                  gap: 5,
                  alignItems: 'baseline',
                  fontFamily: 'Georgia, serif',
                }}>
                  <span style={{ color: C.goldDark, fontWeight: 700, fontSize: 9, textAlign: 'right' }}>
                    {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i]}.
                  </span>
                  <span style={{ color: 'rgba(250,248,244,0.85)' }}>{cmd}</span>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={s.panel}>
              <h3 style={{ ...s.panelH3, fontSize: 10 }}>The Council (Cortex)</h3>
              {[
                ['Architect (Claude)', 'Wireframes. Doctrine. Scribe.'],
                ['Intelligence (Perp)', 'Data. Audit. Editor.'],
                ['Developer (Manny)', 'Builder. Server-side truth.'],
                ['Visual Gate (Chat)', 'Pressure-test. Strategy.'],
                ['Rules (Ed)', 'Operator. Gate. Final ruling.'],
              ].map(([name, role]) => (
                <div key={name} style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: 6,
                  padding: '2px 0',
                  fontSize: 9,
                  fontFamily: 'Georgia, serif',
                }}>
                  <span style={{ color: C.gold, fontWeight: 700 }}>{name}</span>
                  <span style={{ color: 'rgba(250,248,244,0.75)' }}>{role}</span>
                </div>
              ))}
            </div>
            <div style={s.panel}>
              <h3 style={{ ...s.panelH3, fontSize: 10 }}>Contact</h3>
              <div style={{ fontSize: 9.5, lineHeight: 1.6, color: 'rgba(250,248,244,0.85)', fontFamily: 'Georgia, serif' }}>
                <strong style={{ color: C.gold }}>Ed Bruehl</strong> · Managing Director<br />
                26 Park Place, East Hampton, NY 11937<br />
                <strong style={{ color: C.gold }}>646-752-1233</strong><br />
                edbruehl@christiesrealestategroup.com
              </div>
            </div>
          </div>
        </section>

        {/* DYNAMIC AS-OF TIMESTAMP FOOTER — matches /pipe style */}
        <div style={{
          marginTop: 12,
          paddingTop: 8,
          borderTop: `1px solid rgba(200,172,120,0.2)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 8,
          color: 'rgba(250,248,244,0.45)',
          letterSpacing: '0.12em',
          fontFamily: 'Georgia, serif',
        }}>
          <span>CHRISTIE'S FLAGSHIP CORKBOARD · INTERNAL ONLY</span>
          <span>As of {asOf} · Live wires: Q3 Pipeline · Q5 Calendar · Q6 Focus</span>
          <span>christiesrealestategroupeh.com/cork</span>
        </div>

      </div>
    </div>
  );
}
