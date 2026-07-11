"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type FloatingPathsProps = {
  /** Layer offset for stacked path sets (reserved for multi-layer layouts). */
  position: number;
};

function FloatingPaths({ position }: FloatingPathsProps) {
  const paths = Array.from({ length: 36 }, (_, i) => {
    const scale = 110 + i * 6 + position * 5;
    const offsetX = 348;
    const offsetY = 158;

    const d = `
      M ${offsetX - scale} ${offsetY}
      C ${offsetX - scale} ${offsetY - scale * 0.5},
        ${offsetX - scale * 0.5} ${offsetY - scale * 0.5},
        ${offsetX} ${offsetY}
      C ${offsetX + scale * 0.5} ${offsetY + scale * 0.5},
        ${offsetX + scale} ${offsetY + scale * 0.5},
        ${offsetX + scale} ${offsetY}
      C ${offsetX + scale} ${offsetY - scale * 0.5},
        ${offsetX + scale * 0.5} ${offsetY - scale * 0.5},
        ${offsetX} ${offsetY}
      C ${offsetX - scale * 0.5} ${offsetY + scale * 0.5},
        ${offsetX - scale} ${offsetY + scale * 0.5},
        ${offsetX - scale} ${offsetY}
    `
      .replace(/\s+/g, " ")
      .trim();

    return {
      id: i,
      d,
      width: 0.5 + i * 0.03,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-slate-500"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden
      >
        <title>Background Paths</title>
        {paths.map((path, index) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.02}
            fill="none"
            initial={{ pathLength: 0, opacity: 0.12 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0.12, 0.55, 0.55, 0.12],
            }}
            transition={{
              duration: 7 + index * 0.15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.04,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

type LetterTitleProps = {
  title: string;
  as?: "h1" | "h2";
  className?: string;
};

/** Per-character spring slide-up title used on Sponsors / Program heroes. */
export function LetterTitle({ title, as: Tag = "h1", className }: LetterTitleProps) {
  const words = title.split(" ");

  return (
    <Tag
      className={cn(
        "flex w-full flex-wrap items-center justify-center",
        "gap-x-2 gap-y-1 md:gap-x-4",
        "font-bold tracking-[-0.04em] text-[#0a1218]",
        "text-[clamp(1.65rem,6.5vw,6.75rem)]",
        "leading-[1.05] text-center",
        className,
      )}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="inline-flex justify-center"
        >
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: wordIndex * 0.1 + letterIndex * 0.03,
                type: "spring",
                stiffness: 150,
                damping: 25,
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

type BackgroundPathsProps = {
  title?: string;
  /** Optional override for the animated title sizing/layout. */
  titleClassName?: string;
  /** Subtitle / CTA content rendered below the letter-animated title (keeps links interactive). */
  children?: ReactNode;
  showGradientOrb?: boolean;
  className?: string;
};

export function BackgroundPaths({
  title = "Join Our Mission",
  titleClassName,
  children,
  showGradientOrb = true,
  className,
}: BackgroundPathsProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#F2F0EF]",
        className,
      )}
    >
      {showGradientOrb && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[640px] md:w-[640px]"
          initial={{ opacity: 0.45, scale: 0.96 }}
          animate={{
            opacity: [0.45, 0.72, 0.45],
            scale: [0.96, 1.08, 0.96],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          aria-hidden
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(24,43,73,0.12) 0%, rgba(148,163,184,0.1) 45%, transparent 70%)",
            }}
          />
        </motion.div>
      )}

      <div className="absolute inset-0 scale-[1.55] md:scale-100">
        <FloatingPaths position={1} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-[clamp(1rem,4vw,4rem)] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto w-full max-w-[min(92vw,56rem)]"
        >
          <div
            className={cn(
              "relative mx-auto w-full max-w-[min(90vw,48rem)] overflow-hidden",
              "rounded-[clamp(1.25rem,4vw,1.75rem)]",
              "border border-[#182B49]/[0.07] border-white/10",
              "bg-[rgba(242,240,239,0.06)]",
              "px-[clamp(1.25rem,5vw,2.5rem)] py-[clamp(1.75rem,6vw,3rem)]",
              "shadow-[0_clamp(6px,1.2vw,14px)_clamp(20px,4.5vw,44px)_rgba(24,43,73,0.07),0_clamp(2px,0.4vw,4px)_clamp(8px,1.8vw,18px)_rgba(24,43,73,0.04),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.04),inset_0_0_clamp(16px,4vw,36px)_rgba(255,255,255,0.025)]",
              "backdrop-blur-[clamp(28px,6vw,52px)] backdrop-saturate-[1.35]",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.05] via-transparent to-[#182B49]/[0.03]"
              aria-hidden
            />
            <div className="relative z-10 flex w-full flex-col items-center justify-center text-center">
              <LetterTitle
                title={title}
                className={cn(
                  "max-w-full text-balance",
                  "text-[clamp(1.35rem,5.25vw,3.75rem)]",
                  titleClassName,
                )}
              />
            </div>

            {children ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="relative z-10 mt-[clamp(1.25rem,3.5vw,2rem)] text-center"
              >
                {children}
              </motion.div>
            ) : null}
          </div>

          <motion.div
            className="mx-auto mt-[clamp(1.5rem,4vw,2.5rem)] h-px max-w-md bg-gradient-to-r from-transparent via-[#182B49]/35 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
            aria-hidden
          />
        </motion.div>
      </div>
    </div>
  );
}

export { FloatingPaths };
