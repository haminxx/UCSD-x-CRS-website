"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";

export const HOME_INTRO_STORAGE_KEY = "ucsdxcrs-home-intro-seen";
export const HERO_VIDEO_SRC = "/videos/ucsdxcrs-v3.mp4";

const LOAD_DURATION_S = 3.4;
const EXPAND_DURATION_S = 1.2;
const EXIT_DURATION_S = 0.55;
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

type Phase = "loading" | "expand" | "exit";

type HomeIntroProps = {
  onComplete: () => void;
};

export function shouldSkipHomeIntro(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(HOME_INTRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markHomeIntroSeen(): void {
  try {
    sessionStorage.setItem(HOME_INTRO_STORAGE_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
}

/**
 * First-visit home intro (once per browser session via `ucsdxcrs-home-intro-seen`).
 * Centered video card scales with load % → full-bleed → hands off to hero.
 */
export function HomeIntro({ onComplete }: HomeIntroProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);
  const progressMv = useMotionValue(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const startExpand = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    animate(progressMv, 1, {
      duration: 0.25,
      ease: EASE_SMOOTH,
      onUpdate: (v) => setProgress(v),
      onComplete: () => setPhase("expand"),
    });
  }, [progressMv]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const unsub = progressMv.on("change", (v) => setProgress(v));
    const controls = animate(progressMv, 1, {
      duration: LOAD_DURATION_S,
      ease: [0.33, 0.05, 0.2, 1],
      onComplete: () => startExpand(),
    });

    return () => {
      unsub();
      controls.stop();
      document.documentElement.style.overflow = "";
    };
  }, [progressMv, startExpand]);

  useEffect(() => {
    if (phase !== "expand") return;
    const t = window.setTimeout(() => setPhase("exit"), EXPAND_DURATION_S * 1000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const t = window.setTimeout(() => {
      markHomeIntroSeen();
      document.documentElement.style.overflow = "";
      completeRef.current();
    }, EXIT_DURATION_S * 1000);
    return () => clearTimeout(t);
  }, [phase]);

  const expanding = phase === "expand" || phase === "exit";
  // Grow card with progress: ~26% → ~88% of viewport, then expand to full-bleed
  const cardWidth = `${26 + progress * 62}vw`;
  const cardHeight = `${18 + progress * 68}dvh`;
  const pct = Math.round(progress * 100);

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-[#0a1218]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION_S, ease: EASE_SMOOTH }}
      aria-label="Loading UCSD x CRS"
      role="presentation"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="overflow-hidden border bg-black shadow-[0_28px_80px_rgba(0,0,0,0.55)]"
          initial={false}
          animate={
            expanding
              ? {
                  width: "100vw",
                  height: "100dvh",
                  borderRadius: 0,
                  borderColor: "rgba(255,255,255,0)",
                }
              : {
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: 10,
                  borderColor: "rgba(255,255,255,0.15)",
                }
          }
          transition={
            expanding
              ? {
                  type: "spring",
                  stiffness: 46,
                  damping: 18,
                  mass: 1.05,
                  borderColor: { duration: 0.45 },
                }
              : {
                  width: { type: "tween", duration: 0.05, ease: "linear" },
                  height: { type: "tween", duration: 0.05, ease: "linear" },
                }
          }
          style={{
            position: expanding ? "fixed" : "relative",
            inset: expanding ? 0 : undefined,
            zIndex: 20,
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="size-full object-cover object-[center_bottom]"
            src={HERO_VIDEO_SRC}
          />
          {!expanding && (
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          )}
        </motion.div>
      </div>

      {/* Bottom loading bar + bottom-right percentage */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-7 sm:px-10 sm:pb-9 md:px-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: expanding ? 0 : 1 }}
        transition={{ duration: 0.35, delay: expanding ? 0 : 0.15 }}
      >
        <div className="relative mx-auto h-[2px] w-full max-w-5xl overflow-hidden bg-white/10">
          <div
            className="absolute inset-y-0 left-0 bg-white/80"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mx-auto mt-3 flex max-w-5xl justify-end">
          <span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-white/70 sm:text-xs">
            {String(pct).padStart(3, "0")}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
