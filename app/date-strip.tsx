"use client";

import { useEffect, useRef } from "react";
import { daysInMonth, weekdayOf } from "@/lib/dates";

export function DateStrip({
  month,
  today,
  selectedDate,
  datesWithItems,
  onSelect,
}: {
  month: string;
  today: string;
  selectedDate: string;
  datesWithItems: Set<string>;
  onSelect: (date: string) => void;
}) {
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Keep the selected day centred, including after a month change.
  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedDate]);

  return (
    <div className="no-scrollbar mt-2 flex snap-x gap-1.5 overflow-x-auto scroll-px-4 px-4 py-1">
      {daysInMonth(month).map((date) => {
        const isSelected = date === selectedDate;
        const isToday = date === today;

        return (
          <button
            key={date}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            disabled={date > today}
            aria-pressed={isSelected}
            aria-label={`${Number(date.slice(8))} 日，星期${weekdayOf(date)}${
              isToday ? "，今天" : ""
            }${datesWithItems.has(date) ? "，有記帳" : ""}`}
            onClick={() => onSelect(date)}
            className={`flex h-[68px] w-12 shrink-0 snap-center flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors disabled:opacity-35 ${
              isSelected
                ? "bg-accent text-on-accent shadow-md shadow-accent/25"
                : "text-foreground"
            }`}
          >
            <span
              className={`text-[11px] ${isSelected ? "" : "text-ink-soft"}`}
            >
              {isToday ? "今天" : weekdayOf(date)}
            </span>
            <span className="text-lg leading-6 font-semibold tabular-nums">
              {Number(date.slice(8))}
            </span>
            <span
              className={`size-1 rounded-full ${
                datesWithItems.has(date)
                  ? isSelected
                    ? "bg-on-accent"
                    : "bg-accent"
                  : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
