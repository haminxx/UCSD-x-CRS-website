"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const springTransition = { type: "spring" as const, stiffness: 380, damping: 28 };

type SpringUnderlineProps = {
  children: ReactNode;
  className?: string;
  underlineClassName?: string;
  /** Keep underline visible when not hovered (e.g. active route). */
  active?: boolean;
};

/**
 * Left-to-right spring underline on hover (shared by Login / Become a Sponsor).
 */
export function SpringUnderline({
  children,
  className,
  underlineClassName,
  active = false,
}: SpringUnderlineProps) {
  const [hovered, setHovered] = useState(false);
  const visible = hovered || active;

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <motion.span
        aria-hidden
        className={cn(
          "absolute bottom-0 left-0 h-[2px] w-full origin-left bg-current",
          underlineClassName,
        )}
        initial={false}
        animate={{ scaleX: visible ? 1 : 0 }}
        transition={springTransition}
      />
    </span>
  );
}

export { springTransition };
