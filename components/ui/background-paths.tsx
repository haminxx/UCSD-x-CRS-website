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

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <div
            className={cn(
              "mx-auto w-full max-w-3xl overflow-hidden rounded-3xl",
              "border border-white/20 bg-white/[0.035]",
              "px-6 py-9",
              "shadow-[0_8px_32px_rgba(10,18,24,0.05),inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(255,255,255,0.05)]",
              "backdrop-blur-[32px] backdrop-saturate-[1.85]",
              "md:px-10 md:py-12",
            )}
          >
            <div className="flex w-full flex-col items-center justify-center text-center">
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
                className="mt-7 text-center md:mt-8"
              >
                {children}
              </motion.div>
            ) : null}
          </div>

          <motion.div
            className="mx-auto mt-8 h-px max-w-md bg-gradient-to-r from-transparent via-[#182B49]/35 to-transparent md:mt-10"
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
