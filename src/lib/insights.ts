import { icons } from "@/constants/icons";

export interface DailySpending {
  day: string;
  amount: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ExpenseHistoryItem {
  id: string;
  name: string;
  icon: any;
  date: string;
  amount: number;
  currency?: string;
  frequency: string;
  backgroundColor: string;
  iconBackgroundColor: string;
}

export interface InsightMetrics {
  totalSpent: number;
  avgPerSubscription: number;
  upcomingRenewals: number;
  projectedSavings: number;
}

export interface MonthlyInsightsData {
  month: string;
  totalExpenses: number;
  changePercentage: string;
  weeklySpending: DailySpending[];
  history: ExpenseHistoryItem[];
}

export const DEFAULT_WEEKLY_SPENDING: DailySpending[] = [
  { day: "Mon", amount: 36 },
  { day: "Tue", amount: 31 },
  { day: "Wed", amount: 23 },
  { day: "Thr", amount: 40 },
  { day: "Fri", amount: 34 },
  { day: "Sat", amount: 21 },
  { day: "Sun", amount: 24 },
];

export const DEFAULT_EXPENSE_HISTORY: ExpenseHistoryItem[] = [
  {
    id: "claude",
    name: "Claude",
    icon: icons.claude,
    date: "June 25, 12:00",
    amount: 9.84,
    currency: "USD",
    frequency: "per month",
    backgroundColor: "#f6cd4a",
    iconBackgroundColor: "#fde888",
  },
  {
    id: "canva",
    name: "Canva",
    icon: icons.canva,
    date: "June 30, 16:00",
    amount: 43.89,
    currency: "USD",
    frequency: "per month",
    backgroundColor: "#8fd1bd",
    iconBackgroundColor: "#a5dfcf",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    icon: icons.dropbox,
    date: "June 18, 09:30",
    amount: 16.96,
    currency: "USD",
    frequency: "per month",
    backgroundColor: "#fff8e7",
    iconBackgroundColor: "#f6eecf",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: icons.spotify,
    date: "June 12, 14:15",
    amount: 76.77,
    currency: "USD",
    frequency: "per 3 months",
    backgroundColor: "#fff8e7",
    iconBackgroundColor: "#f6eecf",
  },
  {
    id: "figma",
    name: "Figma",
    icon: icons.figma,
    date: "June 05, 11:00",
    amount: 19.23,
    currency: "USD",
    frequency: "per month",
    backgroundColor: "#fff8e7",
    iconBackgroundColor: "#f6eecf",
  },
];

export const MONTHLY_INSIGHTS: MonthlyInsightsData = {
  month: "March 2026",
  totalExpenses: 424.63,
  changePercentage: "+12%",
  weeklySpending: DEFAULT_WEEKLY_SPENDING,
  history: DEFAULT_EXPENSE_HISTORY,
};

export const computeMetrics = (
  subscriptions: Subscription[] = [],
): InsightMetrics => {
  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const pausedOrCancelled = subscriptions.filter(
    (s) => s.status === "paused" || s.status === "cancelled",
  );

  const totalSpent = activeSubs.reduce((acc, sub) => acc + sub.price, 0);
  const avgPerSubscription =
    activeSubs.length > 0 ? totalSpent / activeSubs.length : 0;
  const upcomingRenewals = activeSubs.reduce(
    (acc, sub) => acc + (sub.price < 50 ? sub.price : 0),
    0,
  );
  const projectedSavings = pausedOrCancelled.reduce(
    (acc, sub) => acc + sub.price,
    0,
  );

  return {
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    avgPerSubscription: parseFloat(avgPerSubscription.toFixed(2)),
    upcomingRenewals: parseFloat(upcomingRenewals.toFixed(2)),
    projectedSavings: parseFloat(projectedSavings.toFixed(2)),
  };
};
