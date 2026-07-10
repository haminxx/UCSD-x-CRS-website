"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log({ email, password });
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen items-center justify-center bg-background px-6 pb-20 pt-32 text-foreground md:pt-40">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Welcome back
            </h1>
            <p className="mt-4 text-sm text-muted-foreground md:text-base">
              Sign in to continue to UCSD x CRS
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-5 rounded-[1.75rem] border border-white/12 bg-[#234a56]/90 p-7 shadow-sm md:p-9"
          >
            <div className="space-y-2.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-white/90"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@ucsd.edu"
                className={cn(
                  "w-full rounded-xl border-0 bg-[#2a5460] px-4 py-3.5 text-sm text-foreground",
                  "placeholder:text-white/40 outline-none transition-[box-shadow]",
                  "focus:ring-2 focus:ring-white/20",
                )}
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white/90"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-white/45 underline-offset-4 hover:text-white/80 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "w-full rounded-xl border-0 bg-[#2a5460] px-4 py-3.5 text-sm text-foreground",
                  "placeholder:text-white/40 outline-none transition-[box-shadow]",
                  "focus:ring-2 focus:ring-white/20",
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-3 h-12 w-full rounded-full bg-white text-base text-[#193c47] hover:bg-white/90"
            >
              Log in
            </Button>

            <div className="pt-3 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-4 h-12 w-full rounded-full border-white/20 bg-transparent text-base text-foreground hover:bg-white/5"
              >
                <Link href="#">Create an Account</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
