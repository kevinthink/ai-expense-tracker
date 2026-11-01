"use client";

import { useEffect, useMemo, useState } from "react";
import { daysInMonth, shiftMonth } from "@/lib/dates";
import type { ExpenseItem } from "@/lib/expense-summary";
import { fullPageRedirect } from "@/lib/full-page-redirect";
import { DateStrip } from "./date-strip";
import { DayList } from "./day-list";
import { ExpenseForm } from "./expense-form";
import { Petals } from "./petals";
import { MonthlyChart, StatsBreakdown, StatsHero } from "./stats-view";

type Tab = "day" | "stats";
type StatsRange = "month" | "year";

type PeriodResult = {
  requestKey: string;
  period: string;
  items: ExpenseItem[];
  error?: string;
};

export function ExpenseApp({
  today,
  userName,
}: {
  today: string;
  userName: string;
}) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [tab, setTab] = useState<Tab>("day");
  const [statsRange, setStatsRange] = useState<StatsRange>("month");
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<PeriodResult | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const month = selectedDate.slice(0, 7);
  const year = selectedDate.slice(0, 4);
  const currentMonth = today.slice(0, 7);
  const currentYear = today.slice(0, 4);
  const isYearView = tab === "stats" && statsRange === "year";
  const period = isYearView ? year : month;
  const requestKey = `${period}#${version}`;

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/expenses?period=${period}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 401) {
          fullPageRedirect("/login");
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setResult({ requestKey, period, items: data.items });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setResult({
          requestKey,
          period,
          items: [],
          error: "無法載入記帳資料",
        });
      });

    return () => controller.abort();
  }, [period, requestKey]);

  const isLoading = result?.requestKey !== requestKey;
  // Keep showing this period's rows during a refresh, but never another period's.
  const items = useMemo(
    () => (result?.period === period ? result.items : []),
    [result, period],
  );
  const dayItems = items.filter((item) => item.date === selectedDate);
  const datesWithItems = useMemo(
    () => new Set(items.map((item) => item.date)),
    [items],
  );

  async function logout() {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      fullPageRedirect("/login");
    } catch {
      setIsLoggingOut(false);
      window.alert("登出失敗，請稍後再試");
    }
  }

  function selectMonth(next: string) {
    setSelectedDate(next === currentMonth ? today : daysInMonth(next).at(-1)!);
  }

  function goToPeriod(delta: number) {
    if (isYearView) {
      selectMonth(`${Number(year) + delta}-12`);
    } else {
      selectMonth(shiftMonth(month, delta));
    }
  }

  return (
    <div className="relative isolate mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-surface sm:shadow-2xl">
      <Petals placement="page" />
      <header className="relative z-10 shrink-0 overflow-hidden rounded-b-[28px] bg-header shadow-card pt-[max(env(safe-area-inset-top),12px)] pb-4">
        <Petals placement="header" />
        <div className="flex items-center justify-between gap-3 px-4 text-[13px] text-ink-soft">
          <span className="min-w-0 truncate">{userName}</span>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={logout}
            className="min-h-11 shrink-0 px-2 font-medium disabled:opacity-40"
          >
            登出
          </button>
        </div>
        <div className="flex items-center justify-between px-2">
          <IconButton
            label={isYearView ? "上一年" : "上個月"}
            onClick={() => goToPeriod(-1)}
          >
            <path d="m15 5-7 7 7 7" />
          </IconButton>
          <h1 className="text-[17px] font-semibold tracking-wide">
            {year} 年{!isYearView && ` ${Number(month.slice(5))} 月`}
          </h1>
          <IconButton
            label={isYearView ? "下一年" : "下個月"}
            disabled={isYearView ? year >= currentYear : month >= currentMonth}
            onClick={() => goToPeriod(1)}
          >
            <path d="m9 5 7 7-7 7" />
          </IconButton>
        </div>

        {tab === "day" ? (
          <DateStrip
            month={month}
            today={today}
            selectedDate={selectedDate}
            datesWithItems={datesWithItems}
            onSelect={setSelectedDate}
          />
        ) : (
          <>
            <div className="mx-6 mt-1 grid grid-cols-2 rounded-full bg-card/70 p-1 text-sm font-medium">
              {(["month", "year"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  aria-pressed={statsRange === range}
                  onClick={() => setStatsRange(range)}
                  className={`min-h-9 rounded-full transition-colors ${
                    statsRange === range ? "bg-accent text-on-accent" : ""
                  }`}
                >
                  {range === "month" ? "月統計" : "年統計"}
                </button>
              ))}
            </div>
            <StatsHero
              items={items}
              period={period}
              today={today}
              isLoading={isLoading}
            />
          </>
        )}
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {result?.error && !isLoading ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p role="alert" className="text-danger">
              {result.error}
            </p>
            <button
              type="button"
              onClick={() => setVersion((value) => value + 1)}
              className="min-h-11 rounded-full bg-accent-soft px-5 font-medium text-accent-ink"
            >
              重新載入
            </button>
          </div>
        ) : tab === "day" ? (
          <DayList
            date={selectedDate}
            today={today}
            items={dayItems}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex flex-col gap-5">
            {isYearView && (
              <MonthlyChart
                items={items}
                year={year}
                today={today}
                isLoading={isLoading}
                onSelectMonth={(next) => {
                  selectMonth(next);
                  setStatsRange("month");
                }}
              />
            )}
            <StatsBreakdown items={items} isLoading={isLoading} />
          </div>
        )}
      </main>

      {tab === "day" && (
        <ExpenseForm
          date={selectedDate}
          onSaved={(savedDate) => {
            setSelectedDate(savedDate);
            setVersion((value) => value + 1);
          }}
        />
      )}

      <nav
        aria-label="主要頁面"
        className="grid shrink-0 grid-cols-2 border-t border-line bg-card pb-[env(safe-area-inset-bottom)]"
      >
        <TabButton
          label="記帳"
          isActive={tab === "day"}
          onClick={() => setTab("day")}
        >
          <path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z" />
          <path d="M9 9h6M9 13h6" />
        </TabButton>
        <TabButton
          label="統計"
          isActive={tab === "stats"}
          onClick={() => setTab("stats")}
        >
          <path d="M4 20h16" />
          <path d="M7 16v-5M12 16V6M17 16v-8" />
        </TabButton>
      </nav>
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full active:bg-foreground/10 disabled:opacity-30"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
  children,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
      className={`flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
        isActive ? "text-accent-ink" : "text-ink-soft"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
        aria-hidden
      >
        {children}
      </svg>
      {label}
    </button>
  );
}
