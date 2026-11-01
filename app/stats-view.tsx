import { categoryStyle } from "@/lib/category-style";
import { daysInMonth } from "@/lib/dates";
import {
  categoryTotals,
  type ExpenseItem,
  formatMoney,
  HOME_CURRENCY,
  monthTotals,
  totalsByCurrency,
} from "@/lib/expense-summary";

export function StatsHero({
  items,
  period,
  today,
  isLoading,
}: {
  items: ExpenseItem[];
  period: string;
  today: string;
  isLoading: boolean;
}) {
  const isYear = period.length === 4;
  const isCurrent = today.startsWith(period);
  const asOf = `${Number(today.slice(5, 7))}/${Number(today.slice(8))}`;
  let elapsed: number;
  if (isYear) {
    elapsed = isCurrent ? Number(today.slice(5, 7)) : 12;
  } else {
    elapsed = isCurrent ? Number(today.slice(8)) : daysInMonth(period).length;
  }

  const totals = totalsByCurrency(items);
  const homeTotal = totals.get(HOME_CURRENCY) ?? 0;
  const foreignTotals = [...totals].filter(
    ([currency]) => currency !== HOME_CURRENCY,
  );

  return (
    <div
      aria-busy={isLoading}
      className={`px-6 pt-3 transition-opacity ${isLoading ? "opacity-60" : ""}`}
    >
      <p className="text-[13px] text-ink-soft">
        {isCurrent
          ? `${isYear ? "今年" : "本月"}截至 ${asOf} 花費`
          : `${isYear ? "全年" : "當月"}花費`}
      </p>
      <p className="mt-0.5 text-5xl font-semibold tracking-tight text-accent-ink">
        {formatMoney(homeTotal, HOME_CURRENCY)}
      </p>
      <dl className="mt-3 flex gap-8 text-sm">
        <div>
          <dt className="text-[13px] text-ink-soft">
            {isYear ? "月均" : "日均"}
          </dt>
          <dd className="font-medium">
            {formatMoney(Math.round(homeTotal / elapsed), HOME_CURRENCY)}
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-ink-soft">筆數</dt>
          <dd className="font-medium">{items.length} 筆</dd>
        </div>
      </dl>
      {foreignTotals.length > 0 && (
        <p className="mt-3 text-[13px] text-ink-soft">
          另有{" "}
          {foreignTotals
            .map(([currency, amount]) => formatMoney(amount, currency))
            .join("、")}
          ，未換算、不計入上方金額
        </p>
      )}
    </div>
  );
}

export function MonthlyChart({
  items,
  year,
  today,
  isLoading,
  onSelectMonth,
}: {
  items: ExpenseItem[];
  year: string;
  today: string;
  isLoading: boolean;
  onSelectMonth: (month: string) => void;
}) {
  const months = monthTotals(
    items.filter((item) => item.currency === HOME_CURRENCY),
    year,
  );
  const highest = months.reduce((top, row) =>
    row.amount > top.amount ? row : top,
  );

  return (
    <section
      aria-busy={isLoading}
      className={`transition-opacity ${isLoading ? "opacity-60" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-4 px-1 pb-3">
        <h2 className="font-semibold">每月花費</h2>
        {highest.amount > 0 && (
          <p className="text-[13px] text-ink-soft">
            最高 {Number(highest.month.slice(5))} 月{" "}
            {formatMoney(highest.amount, HOME_CURRENCY)}
          </p>
        )}
      </div>
      <div className="grid grid-cols-12 rounded-3xl bg-card px-3 pt-4 pb-2 shadow-card">
        {months.map(({ month, amount }) => {
          const label = `${Number(month.slice(5))} 月`;

          return (
            <button
              key={month}
              type="button"
              disabled={month > today.slice(0, 7)}
              aria-label={`${label} ${formatMoney(amount, HOME_CURRENCY)}，查看該月統計`}
              title={`${label} ${formatMoney(amount, HOME_CURRENCY)}`}
              onClick={() => onSelectMonth(month)}
              className="group flex flex-col items-center gap-1.5 rounded-lg disabled:opacity-40"
            >
              <span className="flex h-28 w-full items-end justify-center border-b border-line">
                {amount > 0 && (
                  <span
                    className="w-2.5 rounded-t bg-chart group-active:opacity-70"
                    style={{
                      height: `${Math.max((amount / highest.amount) * 100, 3)}%`,
                    }}
                  />
                )}
              </span>
              <span className="text-[11px] text-ink-soft tabular-nums">
                {Number(month.slice(5))}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function StatsBreakdown({
  items,
  isLoading,
}: {
  items: ExpenseItem[];
  isLoading: boolean;
}) {
  const homeItems = items.filter((item) => item.currency === HOME_CURRENCY);
  const rows = categoryTotals(homeItems);
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <section
      aria-busy={isLoading}
      className={`transition-opacity ${isLoading ? "opacity-60" : ""}`}
    >
      <h2 className="px-1 pb-3 font-semibold">各項花費</h2>

      {rows.length > 0 ? (
        <ul className="flex flex-col gap-4 rounded-3xl bg-card p-4 shadow-card">
          {rows.map(({ category, amount }) => {
            const share = (amount / total) * 100;

            return (
              <li key={category}>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{category}</span>
                  <span className="text-[13px] text-ink-soft tabular-nums">
                    {share < 1 ? "<1" : Math.round(share)}%
                  </span>
                  <span className="ml-auto font-semibold tabular-nums">
                    {formatMoney(amount, HOME_CURRENCY)}
                  </span>
                </div>
                <div aria-hidden className="mt-2 h-1.5 rounded-full bg-line">
                  <div
                    className={`h-full rounded-full ${categoryStyle(category).bar}`}
                    style={{ width: `${share}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-14 text-center text-ink-soft">
          {isLoading ? "載入中…" : "這段期間還沒有記帳"}
        </p>
      )}
    </section>
  );
}
