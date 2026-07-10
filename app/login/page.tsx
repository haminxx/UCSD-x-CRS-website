"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { PageEnter } from "@/components/page-motion";
import { cn } from "@/lib/utils";

/**
 * Login page — compact card UI (cn + useState pattern) over a blurred
 * home-video background that gently follows the cursor.
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const frame = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        // subtle parallax — a few percent of viewport
        setOffset({ x: nx * 18, y: ny * 12 });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log({ email, password });
  }

  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-foreground md:pt-40">
        {/* Blurred home video — follows cursor slightly */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-[-8%] will-change-transform transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.12)`,
            }}
          >
            <video
              className="size-full object-cover"
              src="/videos/ucsdxcrs.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <div className="absolute inset-0 bg-[#0a1218]/55 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
        </div>

        <PageEnter className="relative z-10 w-full max-w-sm">
          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex w-full flex-col items-center gap-4 rounded-2xl border border-white/12",
              "bg-[#121a20]/88 p-6 shadow-2xl shadow-black/40 backdrop-blur-md md:p-8",
            )}
          >
            <Link href="/" aria-label="UCSD x CRS home" className="mb-1">
              <Image
                src="/images/ucsd-x-crs-logo-footer.png"
                alt="UCSD x CRS"
                width={1024}
                height={588}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>

            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="-mt-2 text-center text-sm text-muted-foreground">
              Sign in to continue to UCSD x CRS
            </p>

            <div className="mt-2 w-full space-y-4">
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
                    "w-full rounded-lg border-0 bg-white/8 px-4 py-3 text-sm text-foreground",
                    "placeholder:text-white/35 outline-none transition-[box-shadow]",
                    "focus:ring-2 focus:ring-white/25",
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
                    "w-full rounded-lg border-0 bg-white/8 px-4 py-3 text-sm text-foreground",
                    "placeholder:text-white/35 outline-none transition-[box-shadow]",
                    "focus:ring-2 focus:ring-white/25",
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-1 h-11 w-full rounded-lg bg-white text-base font-semibold text-[#0a1218] hover:bg-white/90"
              >
                Log in
              </Button>
            </div>

            <div className="mt-2 w-full border-t border-white/10 pt-5 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-3 h-11 w-full rounded-lg border-white/20 bg-transparent text-base hover:bg-white/5"
              >
                <Link href="#">Create an Account</Link>
              </Button>
            </div>
          </form>
        </PageEnter>
      </main>
    </>
  );
}
