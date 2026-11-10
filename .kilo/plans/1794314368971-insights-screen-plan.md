# Insights Screen Implementation Plan

## Overview
Build a polished, brand-native Insights screen showing monthly spending overview with summary metric cards and interactive charts, inspired by the "Monthly Insights.jpg" design. Screen is protected (requires authentication) and uses existing mock data initially.

---

## Goals
- **Conversion-focused**: Clear value demonstration for subscription tracking
- **Clarity**: Scannable metrics, intuitive charts, minimal cognitive load
- **Trust**: Consistent brand identity, professional data presentation, secure feel
- **Performance**: Smooth animations, lazy-loaded charts, responsive interactions

---

## Scope

### In Scope
- Insights tab screen (`src/app/(tabs)/insights.tsx`) - complete rewrite
- Summary metric cards (4-card grid): Total Spent, Avg/Subscription, Upcoming Renewals, Projected Savings
- Interactive charts: Bar chart (monthly spend) + Line chart (spending trend)
- Time period selector: This Month / Last Month / Last 3 Months
- Empty state with "Add Subscriptions" CTA
- Reusable chart components
- Type-safe data helpers for metrics computation

### Out of Scope
- Real backend/API integration (mock data only for v1)
- Export/share functionality
- Custom date range picker
- Push notifications for insights
- Historical data beyond 3 months

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Chart library | `react-native-chart-kit` | Popular, RN-compatible, supports bar/line combo, good performance |
| Data source | Mock data from `constants/data.ts` | Fast iteration, no backend dependency |
| Auth | Protected (existing pattern) | Consistent with Home/Subscriptions/Settings tabs |
| State management | React `useState` + `useMemo` | Simple, no extra dependencies |
| Time periods | Preset segmented control | Matches design, simpler UX |
| Empty state | Add subscription CTA | Drives conversion to core action |

---

## File Changes

### New Files
```
src/components/insights/
├── MetricCard.tsx              # Individual metric display card
├── PeriodSelector.tsx          # This Month / Last Month / 3 Months segmented control
├── SpendingBarChart.tsx        # Bar chart for monthly spending
├── SpendingTrendChart.tsx      # Line chart for spending trend
├── InsightsEmptyState.tsx      # Empty state with Add Subscription CTA
└── index.ts                    # Barrel exports

src/lib/
├── insights.ts                 # Metric computation helpers (pure functions)
└── chart-config.ts             # Chart styling configuration (colors, grids, etc.)
```

### Modified Files
```
src/app/(tabs)/insights.tsx     # Complete rewrite - main screen composition
src/constants/data.ts           # Add helper to compute insights from mock data (or new insights data)
package.json                    # Add react-native-chart-kit + react-native-svg dependencies
```

---

## Component Architecture

```
InsightsScreen (insights.tsx)
├── Auth protection (via tabs layout)
├── PeriodSelector (controlled)
├── MetricCardsGrid (4 cards)
│   ├── MetricCard: Total Spent
│   ├── MetricCard: Avg per Subscription
│   ├── MetricCard: Upcoming Renewals
│   └── MetricCard: Projected Savings
├── ChartsSection
│   ├── SpendingBarChart (monthly bars)
│   └── SpendingTrendChart (trend line)
└── InsightsEmptyState (conditional)
```

---

## Data Flow

1. **Period Selection** → `PeriodSelector` updates `selectedPeriod` state
2. **Metrics Computation** → `useMemo(() => computeMetrics(subscriptions, selectedPeriod), [subscriptions, selectedPeriod])`
3. **Chart Data** → `useMemo(() => transformForCharts(subscriptions, selectedPeriod), [subscriptions, selectedPeriod])`
4. **Render** → Cards + Charts receive computed data as props

### Mock Data Structure (from `constants/data.ts`)
```typescript
// Existing: HOME_SUBSCRIPTIONS, SUBSCRIPTIONS arrays
// Compute from: price, billing, currency, renewalDate, status
```

### Computed Metrics (per period)
```typescript
interface InsightMetrics {
  totalSpent: number;           // Sum of all active subscription costs in period
  avgPerSubscription: number;   // totalSpent / activeCount
  upcomingRenewals: number;     // Sum of next renewal amounts (next 30 days)
  projectedSavings: number;     // Estimated savings from paused/cancelled subs
}
```

---

## UI/UX Specifications

### Color Palette (from theme)
- Background: `#fff9e3` (bg-background)
- Primary text: `#081126` (primary)
- Accent: `#ea7a53` (accent) - chart primary, CTAs
- Success: `#16a34a` (success) - positive metrics
- Subscription: `#8fd1bd` (subscription) - secondary chart
- Muted: `#f6eecf` (muted) - card backgrounds
- Border: `rgba(0,0,0,0.1)` (border)

### Typography
- Metric value: `text-3xl font-sans-extrabold` (primary)
- Metric label: `text-sm font-sans-medium` (muted-foreground)
- Section titles: `text-xl font-sans-bold` (primary)
- Period selector: `text-sm font-sans-semibold`

### Spacing
- Screen padding: `p-5` (20px)
- Card gap: `gap-4` (16px)
- Section gap: `my-6` (24px)
- Chart height: `h-64` (256px) each

### Metric Cards (2x2 Grid)
```
┌─────────────────┬─────────────────┐
│  Total Spent    │  Avg/Sub        │
│  $2,489.48      │  $311.19        │
│  This month     │  8 active       │
├─────────────────┼─────────────────┤
│  Upcoming       │  Savings        │
│  $42.99         │  $240.00        │
│  3 renewing     │  2 paused       │
└─────────────────┴─────────────────┘
```

### Charts
- **Bar Chart**: Monthly spending (X: months, Y: amount), accent bars
- **Line Chart**: Spending trend (X: months, Y: cumulative), subscription color line
- Both: responsive, touch tooltips, animated entry

### Period Selector
- Segmented control: `[This Month] [Last Month] [Last 3 Months]`
- Active: `bg-accent text-background`
- Inactive: `bg-muted text-primary`

### Empty State
```
┌─────────────────────────────┐
│   📊                        │
│   No subscriptions yet      │
│   Add your first subscription│
│   to see spending insights  │
│                             │
│   [ Add Subscription ]      │
└─────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Setup & Dependencies
1. Install `react-native-chart-kit` and `react-native-svg`
2. Run `npx expo install react-native-chart-kit react-native-svg`
3. Verify TypeScript types available

### Phase 2: Core Utilities
1. Create `src/lib/insights.ts` with pure computation functions:
   - `computeMetrics(subscriptions, period): InsightMetrics`
   - `getChartData(subscriptions, period): ChartDataPoint[]`
   - `formatCurrency(amount, currency): string` (reuse from utils)
2. Create `src/lib/chart-config.ts` with shared chart styling

### Phase 3: Reusable Components
1. `MetricCard.tsx` - Props: `label`, `value`, `subLabel`, `icon?`, `trend?`
2. `PeriodSelector.tsx` - Props: `value`, `onChange`, `options`
3. `SpendingBarChart.tsx` - Props: `data`, `height`, `animate`
4. `SpendingTrendChart.tsx` - Props: `data`, `height`, `animate`
5. `InsightsEmptyState.tsx` - Props: `onAddPress`

### Phase 4: Main Screen
1. Rewrite `src/app/(tabs)/insights.tsx`:
   - Import subscriptions from constants (or context later)
   - State: `selectedPeriod`, `expandedCardId?`
   - Memoized metrics + chart data
   - Conditional render: EmptyState vs Dashboard
   - Compose: PeriodSelector → MetricCardsGrid → ChartsSection

### Phase 5: Polish & Polish
1. Entry animations (fade-in stagger for cards, chart draw animation)
2. Chart tooltips on press
3. Pull-to-refresh (optional, for future real data)
4. Accessibility labels on all interactive elements
5. Dark mode support (verify colors work)

### Phase 6: Validation
1. Run `npm run typecheck`
2. Run `npm run lint`
3. Test on iOS/Android simulators
4. Verify empty state, 1 sub, multiple subs scenarios

---

## Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| No subscriptions | Show `InsightsEmptyState` with Add CTA |
| All subscriptions paused/cancelled | Show $0 metrics, note "No active subscriptions" |
| Single subscription | Avg/Sub = Total, handle division by zero |
| Data loading (future API) | Skeleton loaders for cards/charts |
| Chart library error | Graceful fallback: "Chart unavailable" with retry |

---

## Dependencies to Add

```json
{
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "^15.8.0"
}
```

> Note: Use `npx expo install` to get SDK-compatible versions.

---

## Testing Checklist

- [ ] Screen renders without crash (signed in)
- [ ] Redirects to sign-in when not authenticated
- [ ] Period selector updates metrics & charts
- [ ] Metric cards display correct computed values
- [ ] Bar chart renders with correct data
- [ ] Line chart renders with correct data
- [ ] Empty state shows when no subscriptions
- [ ] Add Subscription CTA opens modal
- [ ] TypeScript passes (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] Works on iOS and Android

---

## Future Enhancements (Post-v1)

- Real backend integration with user-specific data
- Custom date range picker
- Export to PDF/CSV
- Category breakdown pie chart
- Budget setting & alerts
- Year-over-year comparison
- Push notifications for unusual spending
- Widget support (iOS/Android)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Chart kit version conflicts | Use `npx expo install`, test early |
| Performance with many subscriptions | Memoize computations, virtualize if needed |
| Mock data not representative | Create varied test data in constants |
| Dark mode color issues | Test both themes, use semantic colors |

---

## Rollout Plan

1. **Local dev** → Feature complete, tested
2. **PR** → Code review, CI passes
3. **Preview build** → EAS preview for stakeholder review
4. **Production** → EAS build → App Store / Play Store

---

## Success Metrics

- Screen load time < 300ms (mock data)
- Chart render < 200ms
- Zero TypeScript/lint errors
- Accessibility audit passes
- Design matches brand guidelines