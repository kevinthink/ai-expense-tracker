import { io } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { todayInTaipei } from "@/lib/dates";
import { ExpenseApp } from "./expense-app";

export default function Home() {
  return (
    <Suspense fallback={<div className="h-dvh bg-header" />}>
      <App />
    </Suspense>
  );
}

async function App() {
  // "Today" must come from the request, not from the prerendered shell.
  await io();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <ExpenseApp today={todayInTaipei()} userName={user.name} />;
}
