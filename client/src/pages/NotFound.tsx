import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0D1B2A',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          margin: '0 16px',
          padding: '48px 40px',
          background: 'rgba(27,42,74,0.88)',
          border: '1px solid rgba(200,172,120,0.35)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: '#947231',
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Christie's East Hampton
        </div>

        <div
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            color: '#FAF8F4',
            fontSize: '4rem',
            fontWeight: 300,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          404
        </div>

        <div
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            color: 'rgba(250,248,244,0.7)',
            fontSize: '1.2rem',
            fontWeight: 400,
            marginBottom: 24,
          }}
        >
          Page Not Found
        </div>

        <p
          style={{
            fontFamily: '"Source Sans 3", sans-serif',
            color: 'rgba(250,248,244,0.5)',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          onClick={() => setLocation("/")}
          style={{
            background: '#947231',
            border: 'none',
            color: '#1B2A4A',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 700,
            padding: '11px 32px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
        >
          ← Return Home
        </button>
      </div>
    </div>
  );
}
