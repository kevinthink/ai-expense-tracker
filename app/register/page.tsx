import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { LandingPage } from "../landing-page";

export const metadata: Metadata = { title: "註冊 | AI 記帳本" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-dvh bg-header" />}>
      <Register />
    </Suspense>
  );
}

async function Register() {
  if (await getCurrentUser()) redirect("/");
  return <LandingPage mode="register" />;
}
