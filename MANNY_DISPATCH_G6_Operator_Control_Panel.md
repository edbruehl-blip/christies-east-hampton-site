# Manny Dispatch — G6 Operator Control Panel (FUTURE tab)
Date: April 20, 2026
Priority: P0 — ships today, not Tuesday
Requested by: Ed
Lane: Claude (architect) → Manny (builder)

## The ask
Make the Operator Control Panel a permanent surface on the live dashboard. Not a one-off. Not a PDF. A real component on the FUTURE tab that Ed can pull up and walk Jarvis through at any time. Part of the permanent system.

## What it is
Five adjustable inputs (commission rate, royalty, agent split, overhead base, Ed NOP share) that drive an 11-year proforma tied to canonical Growth Model v2 volumes ($75M 2026 → $3.0B 2036). Summary metrics up top. Full proforma table below. Everything recalculates live as the user drags a slider.

At canonical defaults, the model surfaces:
- 2036 combined volume: $3.00B
- 2036 Ed total take: $6.51M
- 11-year Ed cumulative: $37.4M

All numbers tie to the OUTPUTS tab of Growth Model v2 (ID 1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag). Verified April 20, 2026.

## Placement — FUTURE tab
Between the Ascension Arc chart legend and the Assumptions Block.

## Integration
File: `src/components/OperatorControlPanel.tsx`

Import in FutureTab.tsx:
```tsx
import OperatorControlPanel from './OperatorControlPanel';
```

Render between Ascension Arc and Assumptions Block:
```tsx
<AscensionArcChart ... />
<ChartLegend ... />
<OperatorControlPanel />
<AssumptionsBlock ... />
```

No new dependencies. Uses React 19 useState + useMemo only. Styled with existing Tailwind 4 utilities. CIREG gold hardcoded to #c8ac78. Matches dark navy FUTURE tab palette.

## Access
Inherits FUTURE tab auth gate. Open until May 26, behind gate after. No separate password logic.

## Verification checklist
- Default values render 2036 combined = $3.00B, Ed total 2036 = $6.51M, 11-yr cumulative = $37.4M
- Moving Ed NOP slider auto-rebalances Ilija share (complement)
- Reset button appears only when any input is off-canonical
- Table columns align across all 11 years
- Mobile: horizontal scroll works on proforma table
- No console errors, TypeScript clean

## What this replaces
Nothing. Additive. The Pro Forma PDF stays. The Ascension Arc chart stays. The partner cards stay.

## What this enables
Ed walks Jarvis through the full model on screen anytime. Stress-testing happens live, not in a spreadsheet session.

Soli Deo Gloria.
