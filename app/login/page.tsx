"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
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
        <form
          onSubmit={handleSubmit}
          className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-2xl border border-white/12 bg-[#121a20] p-0.5 shadow-md shadow-black/40"
        >
          <div className="p-8 pb-7 md:p-9 md:pb-8">
            <div>
              <Link
                href="/"
                aria-label="UCSD x CRS home"
                className="mx-auto block w-fit"
              >
                <Image
                  src="/images/ucsd-x-crs-logo-footer.png"
                  alt="UCSD x CRS"
                  width={1024}
                  height={588}
                  className="h-9 w-auto object-contain"
                  priority
                />
              </Link>
              <h1 className="mt-6 text-center text-xl font-semibold tracking-tight">
                Sign in to UCSD x CRS
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Welcome back! Sign in to continue
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/90"
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
                    "w-full rounded-xl border-0 bg-[#1a242c] px-4 py-3 text-sm text-foreground",
                    "placeholder:text-white/40 outline-none transition-[box-shadow]",
                    "focus:ring-2 focus:ring-white/20",
                  )}
                />
              </div>

              <div className="space-y-2">
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
                    Forgot your Password?
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
                    "w-full rounded-xl border-0 bg-[#1a242c] px-4 py-3 text-sm text-foreground",
                    "placeholder:text-white/40 outline-none transition-[box-shadow]",
                    "focus:ring-2 focus:ring-white/20",
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-1 h-11 w-full rounded-full bg-white text-base text-[#0a1218] hover:bg-white/90"
              >
                Log in
              </Button>
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#0e161c] px-8 py-5 text-center md:px-9">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-3 h-11 w-full rounded-full border-white/20 bg-transparent text-base text-foreground hover:bg-white/5"
            >
              <Link href="#">Create an Account</Link>
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
