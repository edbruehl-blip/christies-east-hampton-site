/**
 * FloatingDashboardIntro — Fixed bottom-right button, all pages.
 * Opens /letters/flagship — the live Flambeaux-treated Flagship Letter.
 * Cream paper, Cormorant Garamond, Christie's black logo, signature block.
 * Gold background #C8AC78, charcoal text #384249, small caps, open icon.
 * Minimum 44px tap target. Works identically on mobile and laptop.
 *
 * Print identity: canonical Flambeaux treatment (checkpoint 57ad6371+).
 * Three letter surfaces share this identity:
 *   /letters/flagship  — Flagship AI Letter
 *   /letters/christies — Christie's Letter to the Families
 *   INTRO button       — opens /letters/flagship (this component)
 */

export function FloatingDashboardIntro() {
  const handleClick = () => {
    window.open('/letters/flagship', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        boxShadow: '0 4px 16px rgba(27,42,74,0.30)',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={handleClick}
        aria-label="Open Dashboard Introduction Letter"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          minHeight: 32,
          padding: '5px 10px',
          background: '#C8AC78',
          color: '#384249',
          border: 'none',
          borderRadius: 0,
          cursor: 'pointer',
          fontFamily: '"Barlow Condensed", sans-serif',
          fontVariant: 'small-caps',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.2s',
        }}
      >
        {/* Open-in-new-tab icon */}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span>Intro</span>
      </button>
    </div>
  );
}
