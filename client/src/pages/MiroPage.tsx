/**
 * MiroPage.tsx — /miro
 * Flagship Mind Map — Christie's East Hampton Operating System Map
 *
 * P12: Built per Dispatch 40. Mounted Christie's object (navy 3D frame, gold rule).
 * Embed-Existence Rule: if iframe fails, show navy/gold fallback card with "Open Miro Board" button.
 * No home fallthrough. No blank frame.
 *
 * Miro board: https://miro.com/app/board/uXjVGj6Oc40=/
 * Live embed: https://miro.com/app/live-embed/uXjVGj6Oc40=/
 */
import { useState } from 'react';

const NAVY  = '#1B2A4A';
const GOLD  = '#947231';
const CREAM = '#FAF8F4';

const MIRO_EMBED_URL = 'https://miro.com/app/live-embed/uXjVGj6Oc40=/';
const MIRO_BOARD_URL = 'https://miro.com/app/board/uXjVGj6Oc40=/';

export default function MiroPage() {
  const [embedFailed, setEmbedFailed] = useState(false);

  return (
    <div style={{ background: NAVY, minHeight: '100vh', fontFamily: '"Cormorant Garamond", serif' }}>

      {/* ── HEADER BAR ── */}
      <header style={{
        background: NAVY,
        borderBottom: `1px solid rgba(148,114,49,0.35)`,
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: GOLD,
            fontSize: 9,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            marginBottom: 3,
          }}>
            Christie's East Hampton · Internal
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            color: CREAM,
            fontWeight: 400,
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            margin: 0,
            letterSpacing: '0.04em',
          }}>
            Flagship Mind Map
          </h1>
        </div>
        <a
          href={MIRO_BOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: GOLD,
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: `1px solid rgba(148,114,49,0.5)`,
            padding: '6px 16px',
            transition: 'all 0.2s',
          }}
        >
          Open in Miro ↗
        </a>
      </header>

      {/* ── GOLD RULE ── */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.5 }} />

      {/* ── LABEL BAND ── */}
      <div style={{
        padding: '8px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        borderBottom: `1px solid rgba(148,114,49,0.15)`,
      }}>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: 'rgba(148,114,49,0.7)',
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}>
          The Christie's East Hampton Operating System Map
        </span>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: 'rgba(250,248,244,0.35)',
          fontSize: 9,
          letterSpacing: '0.14em',
        }}>
          Brokerage · AnewHomes · Auction Referrals · Advisory · Media · Events
        </span>
      </div>

      {/* ── MOUNTED FRAME (3D Mounted-Object Rule D8) ── */}
      <div style={{
        maxWidth: 1400,
        margin: '24px auto',
        padding: '0 24px 32px',
      }}>
        <div style={{
          background: 'rgba(10,16,30,0.8)',
          border: `1px solid rgba(148,114,49,0.4)`,
          boxShadow: `
            0 0 0 1px rgba(148,114,49,0.15),
            0 4px 8px rgba(0,0,0,0.4),
            0 12px 40px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(148,114,49,0.1)
          `,
          padding: 4,
          position: 'relative',
        }}>
          {/* Inner gold rule top */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(148,114,49,0.6), transparent)`,
            marginBottom: 4,
          }} />

          {!embedFailed ? (
            <iframe
              src={MIRO_EMBED_URL}
              title="Christie's East Hampton Flagship Mind Map"
              width="100%"
              style={{
                height: 'calc(100vh - 220px)',
                minHeight: 500,
                border: 'none',
                display: 'block',
                background: NAVY,
              }}
              allowFullScreen
              onError={() => setEmbedFailed(true)}
            />
          ) : (
            /* Fallback card — Embed-Existence Rule */
            <div style={{
              height: 'calc(100vh - 220px)',
              minHeight: 500,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(27,42,74,0.7)',
              gap: 24,
            }}>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: GOLD,
                fontSize: 11,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
              }}>
                Flagship Mind Map
              </div>
              <div style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: 'rgba(250,248,244,0.6)',
                fontSize: '1rem',
                fontStyle: 'italic',
                textAlign: 'center',
                maxWidth: 400,
                lineHeight: 1.7,
              }}>
                The Christie's East Hampton Operating System Map covers brokerage, AnewHomes, auction referrals, advisory, media, and events.
              </div>
              <a
                href={MIRO_BOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  background: GOLD,
                  color: NAVY,
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '12px 32px',
                  fontWeight: 700,
                  display: 'inline-block',
                }}
              >
                Open Miro Board ↗
              </a>
            </div>
          )}

          {/* Inner gold rule bottom */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(148,114,49,0.6), transparent)`,
            marginTop: 4,
          }} />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid rgba(148,114,49,0.2)`,
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: 'rgba(148,114,49,0.5)',
          fontSize: 8,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          Christie's East Hampton · Flagship Mind Map · Internal
        </span>
        <span style={{
          fontFamily: '"Cormorant Garamond", serif',
          color: 'rgba(250,248,244,0.3)',
          fontSize: 9,
          fontStyle: 'italic',
          letterSpacing: '0.1em',
        }}>
          Art · Beauty · Provenance · Since 1766
        </span>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: 'rgba(148,114,49,0.5)',
          fontSize: 8,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          christiesrealestategroupeh.com/miro
        </span>
      </footer>

    </div>
  );
}
