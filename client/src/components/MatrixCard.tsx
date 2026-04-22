/**
 * MatrixCard — Single canonical card component for Christie's East Hampton
 *
 * Design System: Navy #1B2A4A · Gold #947231 · Charcoal #384249 · Cream #FAF8F4
 * Serif for headlines. Condensed sans for labels/values. No inline styles. No exceptions.
 *
 * Variants:
 *   default   — standard white card with subtle shadow
 *   active    — gold left border (featured / in-play listing)
 *   alert     — amber left border (DOM 45–89 days)
 *   critical  — red left border (DOM 90+ days)
 *   navy      — navy background (section headers, summary cards)
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type MatrixCardVariant = "default" | "active" | "alert" | "critical" | "navy";

interface MatrixCardProps {
  variant?: MatrixCardVariant;
  label?: string;
  headline?: string;
  value?: string | number;
  subtext?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function MatrixCard({
  variant = "default",
  label,
  headline,
  value,
  subtext,
  badge,
  actions,
  children,
  className,
  style,
  onClick,
}: MatrixCardProps) {
  const variantClass = {
    default:  "matrix-card",
    active:   "matrix-card matrix-card--active",
    alert:    "matrix-card matrix-card--alert",
    critical: "matrix-card matrix-card--critical",
    navy:     "matrix-card bg-[var(--color-navy)] border-[var(--color-navy)] text-[var(--color-cream)]",
  }[variant];

  return (
    <div
      className={cn(variantClass, onClick && "cursor-pointer", className)}
      style={style}
      onClick={onClick}
    >
      {/* Label row */}
      {(label || badge) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span
              className={cn(
                "matrix-card__label",
                variant === "navy" && "text-[var(--color-gold)]"
              )}
            >
              {label}
            </span>
          )}
          {badge && <div>{badge}</div>}
        </div>
      )}

      {/* Headline */}
      {headline && (
        <div
          className={cn(
            "matrix-card__headline",
            variant === "navy" && "text-[var(--color-cream)]"
          )}
        >
          {headline}
        </div>
      )}

      {/* Value */}
      {value !== undefined && (
        <div
          className={cn(
            "matrix-card__value",
            variant === "navy" && "text-[var(--color-cream)]"
          )}
        >
          {value}
        </div>
      )}

      {/* Subtext */}
      {subtext && (
        <div
          className={cn(
            "matrix-card__sub",
            variant === "navy" && "text-[rgba(250,248,244,0.6)]"
          )}
        >
          {subtext}
        </div>
      )}

      {/* Slot content */}
      {children && <div className="mt-3">{children}</div>}

      {/* Actions row */}
      {actions && (
        <div className="mt-4 pt-3 border-t border-[var(--color-border-line)] flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   StatusBadge — inline badge component used inside MatrixCards
   ---------------------------------------------------------------- */
interface StatusBadgeProps {
  variant: "active" | "alert" | "critical" | "success" | "neutral";
  children: ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>
      {children}
    </span>
  );
}
