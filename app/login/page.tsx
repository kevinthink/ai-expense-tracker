import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { LandingPage } from "../landing-page";

export const metadata: Metadata = { title: "登入 | AI 記帳本" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-dvh bg-header" />}>
      <Login />
    </Suspense>
  );
}

async function Login() {
  if (await getCurrentUser()) redirect("/");
  return <LandingPage mode="login" />;
}
