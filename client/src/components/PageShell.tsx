/**
 * PageShell.tsx — Universal auction-house hero background shell.
 *
 * ShellWrapper Doctrine (Lane 5 · Council Final Apr 23 2026):
 * Every major route wraps in this primitive. One Christie's environment.
 * No blue slabs. No cream/gray fallback sections outside this shell.
 *
 * Routes: HOME · MARKET · MAPS · PIPE · FUTURE · INTEL · REPORT
 *
 * Usage:
 *   <PageShell>
 *     <SectionFrame eyebrow="..." title="...">...</SectionFrame>
 *   </PageShell>
 */

import { type ReactNode } from 'react';
import { GALLERY_IMAGES } from '@/lib/cdn-assets';

interface PageShellProps {
  children: ReactNode;
  /** Overlay opacity 0-1. Defaults to 0.91 (matches HomeTab hero). */
  overlayOpacity?: number;
  /** Additional styles for the outer wrapper. */
  style?: React.CSSProperties;
}

export function PageShell({
  children,
  overlayOpacity = 0.91,
  style,
}: PageShellProps) {
  const auctionRoomSrc =
    GALLERY_IMAGES.find((g) => g.id === 'room-primary')?.src ??
    GALLERY_IMAGES[0]?.src ??
    '';

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0D1B2A',
        ...style,
      }}
    >
      {/* Auction-room background image */}
      {auctionRoomSrc && (
        <img
          src={auctionRoomSrc}
          alt=""
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Dark scrim */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: `rgba(13,27,42,${overlayOpacity})`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

export default PageShell;
