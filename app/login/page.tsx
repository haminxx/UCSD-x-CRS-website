"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { BackgroundAutoplayVideo } from "@/components/background-autoplay-video";
import { SiteHeader } from "@/components/site-header";
import { PageEnter } from "@/components/page-motion";
import { cn } from "@/lib/utils";
import {
  createStaffAccount,
  recoverStaffPassword,
  signInStaff,
} from "@/lib/staff-auth";

type PortalView = "signin" | "register" | "recovery";

const inputClass = cn(
  "mt-3 w-full border-0 border-b border-[#F2F0EF]/35 bg-transparent px-0 pb-3",
  "font-mono text-sm text-[#F2F0EF]/90 placeholder:text-[#F2F0EF]/30",
  "outline-none ring-0 focus:border-[#F2F0EF]/80 select-text",
);

const labelClass =
  "font-mono text-[11px] tracking-[0.2em] text-[#F2F0EF]/45 uppercase";

const actionLinkClass =
  "cursor-grab font-mono text-[11px] tracking-[0.16em] text-[#F2F0EF]/45 uppercase transition hover:text-[#F2F0EF]/80 active:cursor-grabbing";

/**
 * Staff Portal — sign in, create account (UCSD email + invite code), password recovery.
 */
export default function LoginPage() {
  const [view, setView] = useState<PortalView>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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

  function resetForm() {
    setError(null);
    setMessage(null);
  }

  function switchView(next: PortalView) {
    setView(next);
    setError(null);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
    if (next === "signin") setInviteCode("");
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetForm();
    setBusy(true);
    const result = await signInStaff(email, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage(`Access granted. Welcome, ${result.email}.`);
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetForm();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const result = await createStaffAccount(email, password, inviteCode);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("Account created. You can sign in now.");
    setView("signin");
    setPassword("");
    setConfirmPassword("");
    setInviteCode("");
  }

  async function handleRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetForm();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const result = await recoverStaffPassword(email, inviteCode, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("Password updated. Sign in with your new password.");
    setView("signin");
    setPassword("");
    setConfirmPassword("");
    setInviteCode("");
  }

  const title =
    view === "register"
      ? { line1: "CREATE", line2: "ACCOUNT" }
      : view === "recovery"
        ? { line1: "SECURE", line2: "RECOVERY" }
        : { line1: "STAFF", line2: "PORTAL" };

  const submitLabel =
    view === "register"
      ? "Create account"
      : view === "recovery"
        ? "Reset password"
        : "Initialize stream";

  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-28 text-[#F2F0EF] md:pt-32">
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-[-8%] will-change-transform transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.12)`,
            }}
          >
            <BackgroundAutoplayVideo
              src="/videos/ucsdxcrs-v4.mp4"
              className="size-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[6px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[42%] h-[28rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F2F0EF]/6 blur-3xl"
        />

        <PageEnter className="relative z-10 w-full max-w-md">
          <form
            onSubmit={
              view === "register"
                ? handleRegister
                : view === "recovery"
                  ? handleRecovery
                  : handleSignIn
            }
            className="flex flex-col"
          >
            <p className={labelClass}>System node: UCSDxCRS</p>
            <h1 className="mt-4 text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
              <span className="block">{title.line1}</span>
              <span className="block">{title.line2}</span>
            </h1>

            {message ? (
              <p className="mt-6 font-mono text-xs leading-relaxed tracking-wide text-[#78dcca]">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="mt-6 font-mono text-xs leading-relaxed tracking-wide text-[#ff9d77]">
                {error}
              </p>
            ) : null}

            <div className="mt-16 space-y-10">
              <label className="block">
                <span className={labelClass}>UCSD email</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@ucsd.edu"
                  className={inputClass}
                />
              </label>

              {view === "register" || view === "recovery" ? (
                <label className="block">
                  <span className={labelClass}>Invite code</span>
                  <input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="CRS-STAFF-2026"
                    className={inputClass}
                    autoComplete="off"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className={labelClass}>
                  {view === "recovery" ? "New sequence key" : "Sequence key"}
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    view === "signin"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={inputClass}
                />
              </label>

              {view === "register" || view === "recovery" ? (
                <label className="block">
                  <span className={labelClass}>Confirm sequence key</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={inputClass}
                  />
                </label>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-12 w-full cursor-grab rounded-full bg-[#182B49] py-4 text-sm font-bold tracking-[0.14em] text-[#F2F0EF] uppercase transition hover:bg-[#121F38] active:cursor-grabbing disabled:opacity-60"
            >
              {busy ? "Processing…" : submitLabel}
            </button>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              {view === "signin" ? (
                <>
                  <button
                    type="button"
                    onClick={() => switchView("recovery")}
                    className={actionLinkClass}
                  >
                    Encrypted recovery
                  </button>
                  <button
                    type="button"
                    onClick={() => switchView("register")}
                    className={actionLinkClass}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => switchView("signin")}
                  className={actionLinkClass}
                >
                  Back to sign in
                </button>
              )}
            </div>
          </form>
        </PageEnter>
      </main>
    </>
  );
}
