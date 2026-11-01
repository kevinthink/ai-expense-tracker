export type ExpenseItem = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  userName: string;
};

export const HOME_CURRENCY = "TWD";

export function formatMoney(amount: number, currency: string) {
  const value = amount.toLocaleString("zh-TW", { maximumFractionDigits: 2 });
  return currency === HOME_CURRENCY ? `$${value}` : `${currency} ${value}`;
}

// Currencies are never added together: there is no exchange rate to convert with.
export function totalsByCurrency(items: ExpenseItem[]) {
  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(item.currency, (totals.get(item.currency) ?? 0) + item.amount);
  }
  return totals;
}

export function monthTotals(items: ExpenseItem[], year: string) {
  const totals = Array.from({ length: 12 }, (_, index) => ({
    month: `${year}-${String(index + 1).padStart(2, "0")}`,
    amount: 0,
  }));
  for (const item of items) {
    totals[Number(item.date.slice(5, 7)) - 1].amount += item.amount;
  }
  return totals;
}

export function categoryTotals(items: ExpenseItem[]) {
  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
  }
  return [...totals]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}
