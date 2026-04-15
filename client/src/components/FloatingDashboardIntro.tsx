/**
 * FloatingDashboardIntro — Fixed bottom-right button, all pages.
 * Opens the Flagship Letter as a printable HTML in a new tab.
 * Gold background #C8AC78, charcoal text #384249, small caps, open icon.
 * Minimum 44px tap target. Works identically on mobile and laptop.
 */

export function FloatingDashboardIntro() {
  const FLAGSHIP_LETTER_URL =
    'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/flagship_letter_export_v1_771b2086.html';

  const handleClick = () => {
    // Use location.href to avoid popup blockers that block window.open
    window.location.href = FLAGSHIP_LETTER_URL;
  };

  return (
    <div
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
