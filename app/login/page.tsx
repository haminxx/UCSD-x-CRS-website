"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
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

const VIEW_ORDER: Record<PortalView, number> = {
  signin: 0,
  register: 1,
  recovery: -1,
};

const easePremium = [0.22, 1, 0.36, 1] as const;

const inputClass = cn(
  "mt-3 w-full border-0 border-b border-[#F2F0EF]/35 bg-transparent px-0 pb-3",
  "font-mono text-sm text-[#F2F0EF]/90 placeholder:text-[#F2F0EF]/30",
  "outline-none ring-0 focus:border-[#F2F0EF]/80 select-text",
);

const labelClass =
  "font-mono text-[11px] tracking-[0.2em] text-[#F2F0EF]/45 uppercase";

const actionLinkClass =
  "cursor-grab font-mono text-[11px] tracking-[0.16em] text-[#F2F0EF]/45 uppercase transition hover:text-[#F2F0EF]/80 active:cursor-grabbing";

function getDirection(from: PortalView, to: PortalView) {
  const delta = VIEW_ORDER[to] - VIEW_ORDER[from];
  if (delta > 0) return 1;
  if (delta < 0) return -1;
  return 1;
}

const titleVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 28 : -28,
    scale: 0.96,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -20 : 20,
    scale: 0.97,
  }),
};

const panelVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -36 : 36,
    scale: 0.98,
  }),
};

const fieldVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.06 + i * 0.07,
      duration: 0.38,
      ease: easePremium,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      delay: i * 0.03,
      duration: 0.22,
      ease: easePremium,
    },
  }),
};

const titleContent: Record<PortalView, { line1: string; line2: string }> = {
  signin: { line1: "STAFF", line2: "PORTAL" },
  register: { line1: "CREATE", line2: "ACCOUNT" },
  recovery: { line1: "SECURE", line2: "RECOVERY" },
};

type FormField = {
  key: string;
  label: string;
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

/**
 * Staff Portal — sign in, create account (UCSD email + invite code), password recovery.
 */
export default function LoginPage() {
  const [view, setView] = useState<PortalView>("signin");
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const frame = useRef(0);
  const prevView = useRef<PortalView>("signin");

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
    setDirection(getDirection(prevView.current, next));
    prevView.current = next;
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
    switchView("signin");
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
    switchView("signin");
    setPassword("");
    setConfirmPassword("");
    setInviteCode("");
  }

  const title = titleContent[view];

  const submitLabel =
    view === "register"
      ? "Create account"
      : view === "recovery"
        ? "Reset password"
        : "Initialize stream";

  const fields: FormField[] = [
    {
      key: "email",
      label: "UCSD email",
      id: "email",
      name: "email",
      type: "email",
      autoComplete: "email",
      value: email,
      onChange: setEmail,
      placeholder: "you@ucsd.edu",
    },
    ...(view === "register" || view === "recovery"
      ? [
          {
            key: "inviteCode",
            label: "Invite code",
            id: "inviteCode",
            name: "inviteCode",
            type: "text",
            autoComplete: "off",
            value: inviteCode,
            onChange: setInviteCode,
            placeholder: "CRS-STAFF-2026",
          } satisfies FormField,
        ]
      : []),
    {
      key: "password",
      label: view === "recovery" ? "New sequence key" : "Sequence key",
      id: "password",
      name: "password",
      type: "password",
      autoComplete:
        view === "signin" ? "current-password" : "new-password",
      value: password,
      onChange: setPassword,
      placeholder: "••••••••••••",
    },
    ...(view === "register" || view === "recovery"
      ? [
          {
            key: "confirmPassword",
            label: "Confirm sequence key",
            id: "confirmPassword",
            name: "confirmPassword",
            type: "password",
            autoComplete: "new-password",
            value: confirmPassword,
            onChange: setConfirmPassword,
            placeholder: "••••••••••••",
          } satisfies FormField,
        ]
      : []),
  ];

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

            <div className="mt-4 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={view}
                  custom={direction}
                  variants={titleVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.42, ease: easePremium }}
                >
                  <h1 className="text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
                    <span className="block">{title.line1}</span>
                    <span className="block">{title.line2}</span>
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {message ? (
                <motion.p
                  key="message"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: easePremium }}
                  className="mt-6 font-mono text-xs leading-relaxed tracking-wide text-[#78dcca]"
                >
                  {message}
                </motion.p>
              ) : null}
              {error ? (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: easePremium }}
                  className="mt-6 font-mono text-xs leading-relaxed tracking-wide text-[#ff9d77]"
                >
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="mt-16 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={view}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: easePremium }}
                  className="space-y-10"
                >
                  <AnimatePresence mode="popLayout">
                    {fields.map((field, index) => (
                      <motion.label
                        key={`${view}-${field.key}`}
                        layout
                        custom={index}
                        variants={fieldVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="block"
                      >
                        <span className={labelClass}>{field.label}</span>
                        <input
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          required
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={field.placeholder}
                          className={inputClass}
                        />
                      </motion.label>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={busy}
              layout
              transition={{ duration: 0.35, ease: easePremium }}
              className="mt-12 w-full cursor-grab rounded-full bg-[#182B49] py-4 text-sm font-bold tracking-[0.14em] text-[#F2F0EF] uppercase transition hover:bg-[#121F38] active:cursor-grabbing disabled:opacity-60"
            >
              {busy ? "Processing…" : submitLabel}
            </motion.button>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <AnimatePresence mode="wait">
                {view === "signin" ? (
                  <motion.div
                    key="signin-actions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.32, ease: easePremium }}
                    className="flex w-full flex-wrap items-center justify-between gap-4"
                  >
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
                  </motion.div>
                ) : (
                  <motion.button
                    key="back-action"
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.32, ease: easePremium }}
                    onClick={() => switchView("signin")}
                    className={actionLinkClass}
                  >
                    Back to sign in
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>
        </PageEnter>
      </main>
    </>
  );
}
