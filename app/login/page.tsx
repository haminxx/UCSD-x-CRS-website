"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { PageEnter } from "@/components/page-motion";
import { cn } from "@/lib/utils";

/**
 * Login — line-based “neural access” layout (no card), over a lightly
 * blurred home video that follows the cursor.
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-28 text-[#F5F0E6] md:pt-32">
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-[-8%] will-change-transform transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.12)`,
            }}
          >
            <video
              className="size-full object-cover"
              src="/videos/ucsdxcrs-v4.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          {/* Lighter blur so the video stays more visible */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[6px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />
        </div>

        {/* Soft ambient blob behind the form */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[42%] h-[28rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5F0E6]/6 blur-3xl"
        />

        <PageEnter className="relative z-10 w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#F5F0E6]/45 uppercase">
              System node: UCSDxCRS
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
              <span className="block">TEAM</span>
              <span className="block">ACCESS</span>
            </h1>

            <div className="mt-16 space-y-10">
              <label className="block">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#F5F0E6]/45 uppercase">
                  User identity
                </span>
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
                    "mt-3 w-full border-0 border-b border-[#F5F0E6]/35 bg-transparent px-0 pb-3",
                    "font-mono text-sm text-[#F5F0E6]/90 placeholder:text-[#F5F0E6]/30",
                    "outline-none ring-0 focus:border-[#F5F0E6]/80",
                  )}
                />
              </label>

              <label className="block">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#F5F0E6]/45 uppercase">
                  Sequence key
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={cn(
                    "mt-3 w-full border-0 border-b border-[#F5F0E6]/35 bg-transparent px-0 pb-3",
                    "font-mono text-sm text-[#F5F0E6]/90 placeholder:text-[#F5F0E6]/30",
                    "outline-none ring-0 focus:border-[#F5F0E6]/80",
                  )}
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-12 w-full rounded-full bg-[#182B49] py-4 text-sm font-bold tracking-[0.14em] text-[#F5F0E6] uppercase transition hover:bg-[#121F38]"
            >
              Initialize stream
            </button>

            <div className="mt-10 flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.16em] text-[#F5F0E6]/45 uppercase">
              <Link href="#" className="transition hover:text-[#F5F0E6]/80">
                Encrypted recovery
              </Link>
              <Link href="#" className="transition hover:text-[#F5F0E6]/80">
                Create an Account
              </Link>
            </div>
          </form>
        </PageEnter>
      </main>
    </>
  );
}
