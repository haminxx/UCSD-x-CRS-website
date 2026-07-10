"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, animate } from "motion/react";

export const HOME_INTRO_STORAGE_KEY = "ucsdxcrs-home-intro-seen";

const MIN_DURATION_MS = 2800;
const MAX_DURATION_MS = 4000;
const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

type Phase = "play" | "expand" | "exit";

type HomeIntroProps = {
  onComplete: () => void;
};

function CornerText({
  children,
  className,
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "down" | "left" | "right";
}) {
  const offset =
    from === "up"
      ? { y: 14 }
      : from === "down"
        ? { y: -14 }
        : from === "left"
          ? { x: 18 }
          : { x: -18 };

  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.9, delay, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.p>
  );
}

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
 * Premium first-visit home intro.
 * Skips for the rest of the browser session via sessionStorage (`ucsdxcrs-home-intro-seen`).
 * Sequence: corner type → logo → L→R gauge with video card → expand into hero.
 */
export function HomeIntro({ onComplete }: HomeIntroProps) {
  const [phase, setPhase] = useState<Phase>("play");
  const [progress, setProgress] = useState(0);
  const phaseRef = useRef<Phase>("play");
  const finishedRef = useRef(false);
  const videoReadyRef = useRef(false);
  const startedAt = useRef(0);
  const progressMv = useMotionValue(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const beginExpand = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    phaseRef.current = "expand";
    animate(progressMv, 1, {
      duration: 0.4,
      ease: EASE_PREMIUM,
      onUpdate: (v) => setProgress(v),
      onComplete: () => setPhase("expand"),
    });
  }, [progressMv]);

  const tryFinish = useCallback(() => {
    if (finishedRef.current || phaseRef.current !== "play") return;
    const elapsed = Date.now() - startedAt.current;
    if (!videoReadyRef.current && elapsed < MAX_DURATION_MS) return;
    if (elapsed < MIN_DURATION_MS) {
      window.setTimeout(() => {
        if (finishedRef.current) return;
        beginExpand();
      }, MIN_DURATION_MS - elapsed);
      return;
    }
    beginExpand();
  }, [beginExpand]);

  useEffect(() => {
    startedAt.current = Date.now();
    document.documentElement.style.overflow = "hidden";

    const unsub = progressMv.on("change", (v) => setProgress(v));
    animate(progressMv, 0.9, {
      duration: (MAX_DURATION_MS - 200) / 1000,
      ease: [0.4, 0, 0.2, 1],
    });

    const maxTimer = window.setTimeout(() => {
      videoReadyRef.current = true;
      tryFinish();
    }, MAX_DURATION_MS);

    return () => {
      unsub();
      clearTimeout(maxTimer);
      document.documentElement.style.overflow = "";
    };
  }, [progressMv, tryFinish]);

  useEffect(() => {
    if (phase !== "expand") return;
    const t = window.setTimeout(() => {
      phaseRef.current = "exit";
      setPhase("exit");
    }, 1150);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const t = window.setTimeout(() => {
      markHomeIntroSeen();
      document.documentElement.style.overflow = "";
      completeRef.current();
    }, 480);
    return () => clearTimeout(t);
  }, [phase]);

  const onVideoReady = () => {
    if (videoReadyRef.current) return;
    videoReadyRef.current = true;
    tryFinish();
  };

  const expanding = phase === "expand" || phase === "exit";
  const chromeVisible = phase === "play";
  const cardLeftPct = Math.min(Math.max(progress * 100, 10), 82);

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-[#0a1218]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.48, ease: EASE_PREMIUM }}
      aria-label="Loading UCSD × CRS"
      role="presentation"
    >
      <AnimatePresence>
        {chromeVisible && (
          <>
            <CornerText
              delay={0.12}
              from="left"
              className="pointer-events-none absolute left-5 top-6 z-20 max-w-[11rem] text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-white/80 sm:left-8 sm:top-8 sm:max-w-[14rem] sm:text-[11px] md:left-10 md:top-10"
            >
              Student-led
              <br />
              motorsport
            </CornerText>

            <CornerText
              delay={0.24}
              from="up"
              className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white sm:top-8 sm:text-[11px] md:top-10"
            >
              UCSD × CRS
            </CornerText>

            <CornerText
              delay={0.18}
              from="right"
              className="pointer-events-none absolute right-5 top-6 z-20 max-w-[11rem] text-right text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-white/80 sm:right-8 sm:top-8 sm:max-w-[14rem] sm:text-[11px] md:right-10 md:top-10"
            >
              Collegiate
              <br />
              Racing Series
            </CornerText>

            <CornerText
              delay={0.42}
              from="left"
              className="pointer-events-none absolute left-5 top-1/2 z-20 -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.4em] text-white/55 sm:left-8 sm:text-[11px] md:left-10"
            >
              Drive
            </CornerText>

            <CornerText
              delay={0.48}
              from="right"
              className="pointer-events-none absolute right-5 top-1/2 z-20 -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.4em] text-white/55 sm:right-8 sm:text-[11px] md:right-10"
            >
              Engineer
            </CornerText>

            <CornerText
              delay={0.32}
              from="down"
              className="pointer-events-none absolute bottom-28 left-5 z-20 text-[10px] font-medium uppercase tracking-[0.28em] text-white/70 sm:bottom-32 sm:left-8 sm:text-[11px] md:bottom-36 md:left-10"
            >
              Pit · Race
            </CornerText>

            <CornerText
              delay={0.36}
              from="down"
              className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/85 sm:bottom-32 sm:text-[11px] md:bottom-36"
            >
              2026
            </CornerText>

            <CornerText
              delay={0.34}
              from="down"
              className="pointer-events-none absolute bottom-28 right-5 z-20 max-w-[10rem] text-right text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-white/70 sm:bottom-32 sm:right-8 sm:max-w-[13rem] sm:text-[11px] md:bottom-36 md:right-10"
            >
              Engineering
              <br />
              the future
            </CornerText>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chromeVisible && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-[26%] z-20 flex justify-center sm:top-[28%] md:top-[30%]"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.35 } }}
            transition={{ duration: 1, delay: 0.18, ease: EASE_PREMIUM }}
          >
            <Image
              src="/images/ucsd-x-crs-logo-light.png"
              alt="UCSD × CRS"
              width={866}
              height={454}
              className="h-14 w-auto object-contain sm:h-16 md:h-[4.5rem]"
              priority
              unoptimized
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gauge + video card */}
      <div className="absolute inset-x-0 bottom-[16%] z-30 flex justify-center px-5 sm:bottom-[18%] sm:px-10 md:bottom-[20%]">
        <div className="relative w-full max-w-3xl">
          <motion.div
            className="relative h-[4.5rem] overflow-hidden rounded-sm border border-white/15 bg-white/[0.03] sm:h-24 md:h-28"
            initial={{ opacity: 0, y: 18 }}
            animate={
              expanding
                ? { opacity: 0, transition: { duration: 0.3 } }
                : { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.75, delay: 0.5, ease: EASE_PREMIUM }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-white/[0.08]"
              style={{ width: `${progress * 100}%` }}
            />
            <div className="absolute inset-y-0 left-0 w-px bg-white/30" />
            <div className="absolute inset-y-0 right-0 w-px bg-white/30" />
            <div
              className="absolute inset-y-1.5 w-px bg-white/75"
              style={{ left: `${progress * 100}%` }}
            />
            <div className="absolute bottom-1.5 right-2 font-mono text-[9px] tracking-[0.2em] text-white/45 sm:bottom-2 sm:right-3 sm:text-[10px]">
              {String(Math.round(progress * 100)).padStart(3, "0")}
            </div>
          </motion.div>

          <motion.div
            className="overflow-hidden border border-white/20 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              expanding
                ? {
                    opacity: phase === "exit" ? 0 : 1,
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100dvh",
                    x: 0,
                    y: 0,
                    borderRadius: 0,
                    borderColor: "rgba(255,255,255,0)",
                    scale: 1,
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    top: "50%",
                    left: `${cardLeftPct}%`,
                    x: "-50%",
                    y: "-50%",
                    width: "clamp(7.25rem, 26vw, 12.5rem)",
                    height: "clamp(4.1rem, 15vw, 7rem)",
                    borderRadius: 4,
                  }
            }
            transition={
              expanding
                ? {
                    type: "spring",
                    stiffness: 52,
                    damping: 18,
                    mass: 0.9,
                    opacity: { duration: 0.4 },
                  }
                : {
                    duration: 0.7,
                    delay: 0.55,
                    ease: EASE_PREMIUM,
                    left: { type: "tween", duration: 0.08, ease: "linear" },
                  }
            }
            style={{
              position: expanding ? "fixed" : "absolute",
              zIndex: expanding ? 50 : 35,
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={onVideoReady}
              onLoadedData={onVideoReady}
              className={`size-full object-cover transition-transform duration-700 ${
                expanding ? "scale-125" : "scale-110"
              }`}
              src="/videos/ucsdxcrs-v2.mp4"
            />
            {!expanding && (
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            )}
          </motion.div>
        </div>
      </div>

      {expanding && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40 bg-[#0a1218]"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE_PREMIUM }}
        />
      )}
    </motion.div>
  );
}
