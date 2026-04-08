/**
 * PrivateTabGate — Auth gate removed April 8, 2026 (council directive)
 *
 * Platform is open for review phase. This component is now a transparent
 * passthrough — all content renders without authentication check.
 *
 * Gate restores before: podcast, Dan's Papers, client presentations, wider distribution.
 * One directive to Manny and the gate comes back in ten minutes.
 */
import type { ReactNode } from "react";

interface PrivateTabGateProps {
  children: ReactNode;
  tabLabel: string;
}

export function PrivateTabGate({ children }: PrivateTabGateProps) {
  return <>{children}</>;
}
