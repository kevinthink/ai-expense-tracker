import Link from "next/link";
import { categoryStyle } from "@/lib/category-style";
import { formatMoney, HOME_CURRENCY } from "@/lib/expense-summary";
import { AuthForm } from "./auth-form";
import { Petals } from "./petals";

const SAMPLE_ITEMS = [
  { description: "午餐", category: "餐飲", amount: 120, author: "小明" },
  { description: "捷運", category: "交通", amount: 35, author: "小明" },
];

const FEATURES = [
  {
    title: "自動整理",
    body: "AI 從一句話裡找出品項、金額、日期和類別，不用逐欄填寫。",
    icon: (
      <>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <path d="m12 8 1.200 2.800L16 12l-2.800 1.200L12 16l-1.200-2.800L8 12l2.800-1.200z" />
      </>
    ),
  },
  {
    title: "多人共同記帳",
    body: "大家共用同一本帳，每筆都會標示是誰記的，一看就清楚。",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.500" />
        <path d="M3 20c.5-3.500 2.800-5.500 6-5.500s5.500 2 6 5.500" />
        <path d="M16 4.800a3.500 3.500 0 0 1 0 6.400M18 14.800c1.700.8 2.700 2.600 3 5.200" />
      </>
    ),
  },
  {
    title: "月與年統計",
    body: "自動加總每月、每年的花費，看出錢主要花在哪些類別。",
    icon: (
      <>
        <path d="M4 20h16" />
        <path d="M7 16v-5M12 16V6M17 16v-8" />
      </>
    ),
  },
];

export function LandingPage({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-surface">
      <div className="relative isolate overflow-hidden">
        <Petals placement="landing" />

        <nav
          aria-label="帳號"
          className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-3 sm:px-8"
        >
          <Link href="/login" className="py-3 text-lg font-semibold">
            AI 記帳本
          </Link>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Link
              href="/login"
              aria-current={mode === "login" ? "page" : undefined}
              className="px-3 py-3 aria-[current=page]:text-accent-ink aria-[current=page]:underline"
            >
              登入
            </Link>
            <Link
              href="/register"
              aria-current={mode === "register" ? "page" : undefined}
              className="px-3 py-3 aria-[current=page]:text-accent-ink aria-[current=page]:underline"
            >
              註冊
            </Link>
          </div>
        </nav>

        <header className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-8 pb-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16 lg:pt-14 lg:pb-24">
          <div>
            <p className="text-sm font-medium text-accent-ink">
              多人共同的 AI 記帳本
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl lg:leading-[1.15]">
              說一句話，
              <br />
              帳就記好了
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              輸入「午餐 120 元，捷運 35 元」，AI
              會自動拆成一筆筆帳目並完成分類。和一起生活的人共用同一本帳，花費一目了然。
            </p>
          </div>
          <AuthForm mode={mode} />
        </header>
      </div>

      <main>
        <section className="bg-header py-14 lg:py-20">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                從一句話到一筆帳
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
                不用選類別、不用切換欄位。像傳訊息一樣寫下花費，整理的工作交給
                AI。
              </p>
            </div>

            <figure className="rounded-3xl border border-line bg-card p-4 shadow-card sm:p-6">
              <div className="rounded-full border border-line bg-surface px-5 py-3">
                午餐 120 元，捷運 35 元
              </div>
              <div
                aria-hidden
                className="flex justify-center py-3 text-chart"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </div>
              <ul className="divide-y divide-line">
                {SAMPLE_ITEMS.map((item) => (
                  <li
                    key={item.description}
                    className="flex items-center gap-3 py-3"
                  >
                    <span
                      aria-hidden
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${categoryStyle(item.category).badge}`}
                    >
                      {item.category.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-[13px] text-ink-soft">
                        {item.category} · {item.author}
                      </p>
                    </div>
                    <p className="font-semibold tabular-nums">
                      {formatMoney(item.amount, HOME_CURRENCY)}
                    </p>
                  </li>
                ))}
              </ul>
              <figcaption className="pt-2 text-center text-[13px] text-ink-soft">
                畫面示意
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-tight">
            記帳該有的，都替你想好了
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-3xl border border-line bg-card p-6 shadow-card"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.800"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                    aria-hidden
                  >
                    {feature.icon}
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  {feature.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-8 lg:pb-20">
          <div className="flex flex-col items-center gap-5 rounded-3xl bg-accent-soft px-6 py-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              現在就記下第一筆
            </h2>
            <a
              href="#auth"
              className="flex min-h-12 items-center rounded-full bg-accent px-8 font-medium text-on-accent shadow-md shadow-accent/25"
            >
              {mode === "register" ? "建立帳號" : "登入開始記帳"}
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-line py-6 text-center text-sm text-ink-soft">
        AI 記帳本
      </footer>
    </div>
  );
}
