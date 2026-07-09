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
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-6 pb-16 pt-28 md:pt-36">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Welcome back
            </h1>
            <p className="mt-3 text-sm text-neutral-600 md:text-base">
              Sign in to continue to UCSD x CRS
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-4 rounded-[1.75rem] border border-black/10 bg-[#ebe8e1]/80 p-6 shadow-sm md:p-8"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-800"
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
                  "w-full rounded-xl border-0 bg-[#f7f5f0] px-4 py-3.5 text-sm text-neutral-900",
                  "placeholder:text-neutral-500 outline-none transition-[box-shadow]",
                  "focus:ring-2 focus:ring-neutral-900/10",
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-800"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-neutral-500 underline-offset-4 hover:text-neutral-800 hover:underline"
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
                  "w-full rounded-xl border-0 bg-[#f7f5f0] px-4 py-3.5 text-sm text-neutral-900",
                  "placeholder:text-neutral-500 outline-none transition-[box-shadow]",
                  "focus:ring-2 focus:ring-neutral-900/10",
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-2 h-12 w-full rounded-full text-base"
            >
              Log in
            </Button>

            <div className="pt-2 text-center">
              <p className="text-sm text-neutral-600">Don&apos;t have an account?</p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-3 h-12 w-full rounded-full border-neutral-900/20 bg-transparent text-base hover:bg-neutral-900/5"
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
