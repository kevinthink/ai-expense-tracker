"use client";

import { type FormEvent, useState } from "react";
import { fullPageRedirect } from "@/lib/full-page-redirect";

export function ExpenseForm({
  date,
  onSaved,
}: {
  date: string;
  onSaved: (savedDate: string) => void;
}) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, date }),
      });
      if (response.status === 401) {
        fullPageRedirect("/login");
        return;
      }
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }
      setText("");
      setMessage(`已記下 ${data.items.length} 筆`);
      // The text may name its own date ("昨天…"), so show where it was saved.
      onSaved(data.items[0].date);
    } catch {
      setError("無法連線到伺服器，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="shrink-0 px-3 pb-3">
      <div aria-live="polite" className="px-2 text-[13px]">
        {error && (
          <p role="alert" className="pb-2 text-danger">
            {error}
          </p>
        )}
        {message && <p className="pb-2 text-accent-ink">{message}</p>}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1 rounded-full border border-line bg-card py-1 pr-1 pl-4 shadow-card focus-within:border-accent"
      >
        <input
          aria-label="記一筆"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setMessage("");
          }}
          placeholder="午餐 120 元，捷運 35 元"
          maxLength={1000}
          enterKeyHint="send"
          required
          // Below 16px, iOS Safari zooms the page when the field gets focus.
          className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-ink-soft"
        />
        <button
          type="submit"
          aria-label={isLoading ? "分析中" : "分析並儲存"}
          disabled={isLoading || !text.trim()}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent disabled:opacity-40"
        >
          {isLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden
            >
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
