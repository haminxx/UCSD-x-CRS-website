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
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.55, 0.55, 0],
            }}
            transition={{
              duration: 15 + index * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.2,
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
        "text-balance font-bold tracking-[-0.04em] text-[#0a1218]",
        "text-[clamp(3.25rem,7.5vw,6.75rem)]",
        "leading-[1.05]",
        className,
      )}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="mr-3 inline-block last:mr-0 md:mr-4"
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
  /** Subtitle / CTA content rendered below the letter-animated title (keeps links interactive). */
  children?: ReactNode;
  showGradientOrb?: boolean;
  className?: string;
};

export function BackgroundPaths({
  title = "Join Our Mission",
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
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.55, 0.75, 0.55],
          }}
          transition={{
            duration: 18,
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

      <div className="absolute inset-0">
        <FloatingPaths position={1} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <div
            className={cn(
              "rounded-3xl border border-white/55",
              "bg-white/45 px-8 py-10 shadow-[0_8px_40px_rgba(10,18,24,0.06)]",
              "backdrop-blur-2xl backdrop-saturate-150",
              "md:px-12 md:py-14",
            )}
          >
            <LetterTitle title={title} />

            {children ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7 }}
                className="mt-8 md:mt-10"
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
