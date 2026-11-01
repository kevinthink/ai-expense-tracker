// Dates are plain "YYYY-MM-DD" strings, matching what is stored on each expense item.

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export function todayInTaipei() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  // Round-tripping rejects overflowing dates such as 2026-02-31.
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().startsWith(value)
  );
}

export function isValidMonth(value: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function isValidYear(value: string) {
  return /^\d{4}$/.test(value);
}

export function daysInMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const dayCount = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return Array.from(
    { length: dayCount },
    (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`,
  );
}

export function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber - 1 + delta, 1))
    .toISOString()
    .slice(0, 7);
}

export function weekdayOf(date: string) {
  return WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
}
