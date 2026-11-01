import { categoryStyle } from "@/lib/category-style";
import { weekdayOf } from "@/lib/dates";
import {
  type ExpenseItem,
  formatMoney,
  totalsByCurrency,
} from "@/lib/expense-summary";

export function DayList({
  date,
  today,
  items,
  isLoading,
}: {
  date: string;
  today: string;
  items: ExpenseItem[];
  isLoading: boolean;
}) {
  const [, month, day] = date.split("-").map(Number);
  const total = [...totalsByCurrency(items)]
    .map(([currency, amount]) => formatMoney(amount, currency))
    .join(" + ");

  return (
    <section
      aria-busy={isLoading}
      className={`transition-opacity ${isLoading ? "opacity-60" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-4 px-1 pb-3">
        <h2 className="font-semibold">
          {date === today ? "今天，" : ""}
          {month} 月 {day} 日（{weekdayOf(date)}）
        </h2>
        {total && <p className="text-right font-semibold">{total}</p>}
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-line rounded-3xl bg-card px-4 shadow-card">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3.5">
              <span
                aria-hidden
                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${categoryStyle(item.category).badge}`}
              >
                {item.category.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.description}</p>
                <p className="truncate text-[13px] text-ink-soft">
                  {item.category} · {item.userName}
                </p>
              </div>
              <p className="font-semibold whitespace-nowrap tabular-nums">
                {formatMoney(item.amount, item.currency)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-14 text-center text-ink-soft">
          {isLoading ? "載入中…" : "這天還沒有記帳"}
        </p>
      )}
    </section>
  );
}
