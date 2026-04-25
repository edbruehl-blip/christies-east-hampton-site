/**
 * PageShell — Universal page wrapper primitive
 * Dispatch 37 · Lane 12 · April 24, 2026
 *
 * Provides:
 *   - Navy base (#0D1B2A)
 *   - Painted-room hero overlay at 0.12 opacity (same as AngelLetterPage)
 *   - Standard top padding (pt-0 — tabs own their own top padding)
 *
 * Usage:
 *   <PageShell>
 *     <YourContent />
 *   </PageShell>
 *
 * The overlay is purely decorative — it does not affect layout.
 * All children render on top of the overlay via z-index 1.
 */

const AUCTION_ROOM_BG = 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/DtTxqkdyvvLrygvu.jpg';

interface PageShellProps {
  children: React.ReactNode;
  overlayOpacity?: number; // default 0.12
}

import React from 'react';

export function PageShell({ children, overlayOpacity = 0.12 }: PageShellProps) {
  return (
    <div style={{ position: 'relative', background: '#0D1B2A', minHeight: '100%' }}>
      {/* Painted-room hero overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${AUCTION_ROOM_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed',
          opacity: overlayOpacity,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
