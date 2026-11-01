"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { fullPageRedirect } from "@/lib/full-page-redirect";

const inputClass =
  "min-h-12 w-full rounded-xl border border-line bg-card px-4 text-base outline-none focus:border-chart";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(new FormData(event.currentTarget)),
        ),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        setIsLoading(false);
        return;
      }
      fullPageRedirect("/");
    } catch {
      setError("無法連線到伺服器，請稍後再試");
      setIsLoading(false);
    }
  }

  return (
    <section
      id="auth"
      aria-labelledby="auth-title"
      className="scroll-mt-6 rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8"
    >
      <h2 id="auth-title" className="text-2xl font-semibold tracking-wide">
        {isRegister ? "建立帳號" : "歡迎回來"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {isRegister && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            名稱
            <input
              name="name"
              autoComplete="name"
              maxLength={50}
              required
              className={inputClass}
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          密碼
          <input
            name="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 8 : undefined}
            maxLength={128}
            required
            className={inputClass}
          />
          {isRegister && (
            <span className="font-normal text-ink-soft">至少 8 個字元</span>
          )}
        </label>
        {isRegister && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            驗證碼
            <input
              name="code"
              autoComplete="off"
              autoCapitalize="none"
              required
              className={inputClass}
            />
          </label>
        )}

        <div aria-live="polite" className="text-sm">
          {error && (
            <p role="alert" className="text-danger">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="min-h-12 rounded-full bg-accent font-medium text-on-accent shadow-md shadow-accent/25 disabled:opacity-40"
        >
          {isLoading ? "處理中…" : isRegister ? "註冊" : "登入"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-soft">
        {isRegister ? "已經有帳號了？" : "還沒有帳號？"}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="ml-1 inline-block py-2 font-medium text-accent-ink underline"
        >
          {isRegister ? "登入" : "註冊"}
        </Link>
      </p>
    </section>
  );
}
