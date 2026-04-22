/**
 * Ed's Corkboard v2 — Native React component
 * Rebuilt from eds_corkboard_v2_591571f9.html — Apr 22 2026
 * No iframe / CDN dependency. Always renders.
 */

const C = {
  gold: '#c8ac78',
  goldDark: '#a88f5f',
  charcoal: '#384249',
  cream: '#f8f4ed',
  paper: '#fffdf7',
  deepRed: '#8b2635',
  stone: '#e8dcc0',
  line: '#b9a87f',
};

const s = {
  panel: {
    background: C.paper,
    border: `1px solid ${C.line}`,
    padding: 11,
  } as React.CSSProperties,
  panelH3: {
    fontSize: 11,
    letterSpacing: '0.22em',
    color: C.deepRed,
    borderBottom: `1px solid ${C.gold}`,
    paddingBottom: 5,
    marginBottom: 8,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    fontFamily: 'Georgia, serif',
  } as React.CSSProperties,
  subLabel: {
    fontSize: 8.5,
    letterSpacing: '0.2em',
    color: C.goldDark,
    margin: '8px 0 4px 0',
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    borderTop: `1px dotted ${C.gold}`,
    paddingTop: 6,
    fontFamily: 'Georgia, serif',
  } as React.CSSProperties,
};

function Row({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 8, padding: '2.5px 0', fontSize: 10, alignItems: 'baseline', fontFamily: 'Georgia, serif' }}>
      <span style={{ color: C.deepRed, fontWeight: 700, letterSpacing: '0.05em' }}>{name}</span>
      <span style={{ color: C.charcoal, fontSize: 9.5 }}>{desc}</span>
    </div>
  );
}

export function EdCorkboard() {
  return (
    <div style={{
      background: C.cream,
      color: C.charcoal,
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: 11,
      lineHeight: 1.4,
      padding: '0.35in',
      maxWidth: '14in',
      margin: '0 auto',
    }}>

      {/* HEADER */}
      <header style={{ borderBottom: `2px solid ${C.gold}`, paddingBottom: 8, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: C.charcoal, lineHeight: 1.6 }}>
          <strong style={{ color: C.deepRed }}>CHRISTIE'S</strong><br />
          INTERNATIONAL REAL ESTATE GROUP<br />
          EAST HAMPTON · 26 PARK PLACE
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 400, letterSpacing: '0.35em', color: C.deepRed, fontFamily: 'Georgia, serif' }}>ED'S CORKBOARD</h1>
          <div style={{ fontSize: 10, color: C.goldDark, letterSpacing: '0.3em', marginTop: 4, fontStyle: 'italic' }}>
            Nouns, not numbers · One page · Internal only
          </div>
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.15em', color: C.charcoal, textAlign: 'right', lineHeight: 1.6 }}>
          <strong style={{ color: C.deepRed }}>v2</strong> · April 19, 2026<br />
          Council edits applied<br />
          T-10 days to public launch
        </div>
      </header>

      {/* PRINCIPLES BAND */}
      <section style={{
        background: C.stone,
        padding: '7px 14px',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: 10.5,
        letterSpacing: '0.1em',
        borderTop: `1px solid ${C.gold}`,
        borderBottom: `1px solid ${C.gold}`,
        marginBottom: 10,
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <span><strong style={{ color: C.deepRed, fontStyle: 'italic' }}>JESUS FIRST</strong></span>
        <span><strong style={{ color: C.deepRed, fontStyle: 'italic' }}>The Christie's Standard</strong> · Since 1766</span>
        <span><strong style={{ color: C.deepRed, fontStyle: 'italic' }}>The Richard Rule</strong> · Operate from what is real</span>
        <span><strong style={{ color: C.deepRed, fontStyle: 'italic' }}>The Hagler Standard</strong> · Train in the dark</span>
      </section>

      {/* MAIN: WHO DOES WHAT | TEN COMMANDMENTS */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 14, marginBottom: 10 }}>

        {/* WHO DOES WHAT */}
        <div style={s.panel}>
          <h3 style={s.panelH3}>Who Does What</h3>
          <div style={{ ...s.subLabel, borderTop: 'none', paddingTop: 0, marginTop: 0 }}>The Team</div>
          <Row name="Ed" desc="Operator. Ruling. Deals. Rainmaker." />
          <Row name="Jarvis" desc="COO. Agendas. Minutes. Referrals. Maidstone." />
          <Row name="Angel" desc="Execution. Operations. Apr 25." />
          <Row name="Zoila" desc="Office Director. Producing broker. May 4." />
          <Row name="Scott" desc="AnewHomes build partner. Jun 1." />
          <Row name="Richard" desc="Counsel. AnewHomes co-founder. Banker model." />
          <div style={s.subLabel}>The Council (Cortex)</div>
          <Row name="Claude" desc="Architect. Wireframes. Scribe. Brain on paper." />
          <Row name="Perplexity" desc="Intelligence. Data. Managing editor." />
          <Row name="Manny" desc="Builder. Server-side truth. Code." />
          <Row name="ChatGPT" desc="Pressure-test. Strategy." />
          <Row name="Grok" desc="Challenge. Stress-test." />
          <Row name="Gemini" desc="Local intelligence. Granular." />
        </div>

        {/* TEN COMMANDMENTS */}
        <div style={{
          background: C.paper,
          border: `2px solid ${C.deepRed}`,
          padding: '12px 14px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 4, left: 4, right: 4, bottom: 4,
            border: `1px solid ${C.gold}`,
            pointerEvents: 'none',
          }} />
          <h3 style={{
            textAlign: 'center',
            borderBottom: `1px solid ${C.gold}`,
            paddingBottom: 6,
            marginBottom: 9,
            fontSize: 13,
            letterSpacing: '0.3em',
            color: C.deepRed,
            position: 'relative',
            zIndex: 1,
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
          }}>The Ten Commandments</h3>
          <ol style={{ listStyle: 'none', padding: 0, position: 'relative', zIndex: 1 }}>
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
              'AnewHomes locked at seven. Ed, Scott, Richard, Jarvis, Angel, Zoila, Pool.',
            ].map((cmd, i) => (
              <li key={i} style={{
                padding: '4px 2px',
                fontSize: 11,
                borderBottom: i < 9 ? `1px dotted ${C.stone}` : 'none',
                display: 'grid',
                gridTemplateColumns: '30px 1fr',
                gap: 6,
                alignItems: 'baseline',
                fontFamily: 'Georgia, serif',
              }}>
                <span style={{ color: C.goldDark, fontWeight: 700, fontSize: 10.5, textAlign: 'right' }}>
                  {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i]}.
                </span>
                <span>{cmd}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LADDERS: CIREG | CPS-1 | CIRE */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'stretch', marginBottom: 10 }}>
        <div style={{ background: C.paper, border: `1px solid ${C.gold}`, padding: '10px 12px', borderLeft: `4px solid ${C.gold}` }}>
          <div style={{ fontSize: 13, letterSpacing: '0.25em', color: C.deepRed, fontWeight: 700, marginBottom: 3, fontFamily: 'Georgia, serif' }}>CIREG</div>
          <div style={{ fontSize: 9, color: C.goldDark, fontStyle: 'italic', marginBottom: 6, letterSpacing: '0.08em' }}>Regional Demonstration</div>
          <div style={{ fontSize: 10, color: C.charcoal, lineHeight: 1.45 }}>East Hampton flagship. $75M in 2026. $3B by 2036 across three offices. Where rigor is proved.</div>
        </div>

        <div style={{
          background: C.deepRed,
          color: C.cream,
          padding: '12px 14px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: 180,
          position: 'relative',
        }}>
          <div style={{ fontSize: 16, letterSpacing: '0.25em', fontWeight: 700, color: C.gold, marginBottom: 4, fontFamily: 'Georgia, serif' }}>CPS-1</div>
          <div style={{
            fontSize: 10, letterSpacing: '0.15em', fontStyle: 'italic',
            borderTop: `1px solid ${C.gold}`, borderBottom: `1px solid ${C.gold}`,
            padding: '5px 0', margin: '5px 0', color: C.cream,
          }}>Ed is the node</div>
          <div style={{ fontSize: 9, lineHeight: 1.35, marginTop: 4, color: C.stone, fontStyle: 'italic' }}>
            "The juice that greases the gear." UHNW buyers meet new product in any market Christie's operates.
          </div>
        </div>

        <div style={{ background: C.paper, border: `1px solid ${C.gold}`, padding: '10px 12px', borderLeft: `4px solid ${C.gold}` }}>
          <div style={{ fontSize: 13, letterSpacing: '0.25em', color: C.deepRed, fontWeight: 700, marginBottom: 3, fontFamily: 'Georgia, serif' }}>CIRE</div>
          <div style={{ fontSize: 9, color: C.goldDark, fontStyle: 'italic', marginBottom: 6, letterSpacing: '0.08em' }}>Global Destination</div>
          <div style={{ fontSize: 10, color: C.charcoal, lineHeight: 1.45 }}>Christie's International Real Estate. London, Paris, Amsterdam, Caribbean. Where reunification with the auction house becomes undeniable.</div>
        </div>
      </section>

      {/* NUMBERS BAND */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
        {[
          { value: '$4.57M', label: 'Closed · First 100 Days' },
          { value: '$13.62M', label: 'Exclusive Active' },
          { value: '$75M', label: '2026 Baseline' },
          { value: '$3B', label: '2036 Horizon' },
        ].map(({ value, label }) => (
          <div key={label} style={{ background: C.charcoal, color: C.cream, padding: '10px 12px', textAlign: 'center', borderLeft: `4px solid ${C.gold}` }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, letterSpacing: '0.03em', fontFamily: 'Georgia, serif' }}>{value}</div>
            <div style={{ fontSize: 8.5, letterSpacing: '0.22em', marginTop: 3, textTransform: 'uppercase', color: C.stone }}>{label}</div>
          </div>
        ))}
      </section>

      {/* BOTTOM: SITE MAP | CALENDAR | WHALES + CONTACT */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 0.9fr', gap: 12 }}>

        {/* SITE MAP */}
        <div style={s.panel}>
          <h3 style={s.panelH3}>The Site · christiesrealestategroupeh.com</h3>
          <div style={{ ...s.subLabel, borderTop: 'none', paddingTop: 0, marginTop: 0 }}>Five Tabs + HOME (via logo)</div>
          {[
            ['HOME', 'Flagship letter · live ticker · PDF + AUDIO'],
            ['MARKET', '11 hamlets · ANEW scores · live data'],
            ['MAPS', 'Territory · deal engine · 5 lenses'],
            ['PIPE', 'Live deal engine · Office Pipeline sheet'],
            ['FUTURE', 'Ascension arc · pro forma · partner cards'],
            ['INTEL', 'Miro · Trello · Calendar · Corkboard · 13 sheets'],
          ].map(([tab, desc]) => (
            <div key={tab} style={{ display: 'grid', gridTemplateColumns: '58px 1fr', gap: 6, padding: '2px 0', fontSize: 9.5, alignItems: 'baseline', fontFamily: 'Georgia, serif' }}>
              <span style={{ color: C.deepRed, fontWeight: 700, letterSpacing: '0.05em' }}>{tab}</span>
              <span>{desc}</span>
            </div>
          ))}
          <div style={s.subLabel}>Seven Routes</div>
          <div style={{ fontSize: 9, color: C.charcoal, lineHeight: 1.5, marginTop: 2, fontFamily: 'Georgia, serif' }}>
            <strong style={{ color: C.deepRed }}>/report</strong> · <strong style={{ color: C.deepRed }}>/letters/flagship</strong> · <strong style={{ color: C.deepRed }}>/letters/christies</strong> · <strong style={{ color: C.deepRed }}>/letters/angel</strong> · <strong style={{ color: C.deepRed }}>/architecture-of-wealth</strong> · <strong style={{ color: C.deepRed }}>/cards/uhnw-path</strong> · <strong style={{ color: C.deepRed }}>/pro-forma</strong>
          </div>
        </div>

        {/* CALENDAR + DATES */}
        <div style={s.panel}>
          <h3 style={s.panelH3}>The Calendar</h3>
          {[
            { day: 'MONDAY · Operator Room', time: '70 minutes · Ed, Jarvis, Angel', desc: 'Deals, money, decisions. The money room.' },
            { day: 'WEDNESDAY · Institution Room', time: '95 minutes · + Zoila + brokers', desc: 'Culture, caravan, rhythm. The institution room.' },
          ].map(({ day, time, desc }) => (
            <div key={day} style={{ borderLeft: `3px solid ${C.gold}`, padding: '3px 0 3px 10px', marginBottom: 6, fontFamily: 'Georgia, serif' }}>
              <div style={{ fontWeight: 700, color: C.deepRed, fontSize: 10.5, letterSpacing: '0.1em' }}>{day}</div>
              <div style={{ fontSize: 9, color: C.goldDark, fontStyle: 'italic' }}>{time}</div>
              <div style={{ fontSize: 9.5, color: C.charcoal, marginTop: 1 }}>{desc}</div>
            </div>
          ))}
          <div style={s.subLabel}>Team Dates</div>
          {[
            ['Angel Day One', 'April 25'],
            ['Public launch', 'April 29'],
            ['Zoila starts', 'May 4'],
            ['Scott starts', 'June 1'],
            ['Zoila vesting cliff', 'Nov 4'],
          ].map(([who, when]) => (
            <div key={who} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, padding: '2.5px 0', fontSize: 9.5, alignItems: 'baseline', borderBottom: `1px dotted ${C.stone}`, fontFamily: 'Georgia, serif' }}>
              <span style={{ color: C.charcoal }}>{who}</span>
              <span style={{ color: C.deepRed, fontWeight: 700, letterSpacing: '0.05em' }}>{when}</span>
            </div>
          ))}
        </div>

        {/* WHALES + CONTACT */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: 8 }}>
          <div style={s.panel}>
            <h3 style={s.panelH3}>Key Relationships</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[['Lily', ''], ['Ilija', ''], ['Rick', 'Moeser'], ['Melissa', 'True']].map(([name, last]) => (
                <li key={name} style={{ padding: '2px 0', fontSize: 10, color: C.charcoal, display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'Georgia, serif' }}>
                  <span style={{ color: C.gold, fontSize: 7 }}>◆</span>
                  <strong style={{ color: C.deepRed }}>{name}</strong>{last ? <span>&nbsp;{last}</span> : null}
                </li>
              ))}
            </ul>
          </div>

          <div style={s.panel}>
            <h3 style={{ ...s.panelH3, fontSize: 10 }}>Contact</h3>
            <div style={{ fontSize: 9.5, lineHeight: 1.6, color: C.charcoal, fontFamily: 'Georgia, serif' }}>
              <strong style={{ color: C.deepRed }}>Ed Bruehl</strong> · Managing Director<br />
              26 Park Place, East Hampton, NY 11937<br />
              <strong style={{ color: C.deepRed }}>646-752-1233</strong><br />
              edbruehl@christiesrealestategroup.com<br />
              <span style={{ fontSize: 8.5, color: C.goldDark, letterSpacing: '0.1em', fontStyle: 'italic' }}>linktr.ee/edbruehlrealestate</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontStyle: 'italic', color: C.deepRed, letterSpacing: '0.2em', fontSize: 11, paddingTop: 6, borderTop: `1px solid ${C.gold}`, fontFamily: 'Georgia, serif' }}>
            Soli Deo Gloria.
          </div>
        </div>

      </section>
    </div>
  );
}
