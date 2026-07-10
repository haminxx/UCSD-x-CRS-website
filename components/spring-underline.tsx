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

type BoldHoverTextProps = {
  children: ReactNode;
  /** When true, use the bold (hover) weight. Drive from parent hover so chevrons/padding count. */
  active: boolean;
  className?: string;
  /** Resting weight (default medium / 500). */
  from?: number;
  /** Hover weight (default extrabold / 800). */
  to?: number;
};

/**
 * Font-weight hover without layout shift: invisible bold twin reserves width.
 * Instant weight swap — no spring/scale/motion that would nudge the button.
 */
export function BoldHoverText({
  children,
  active,
  className,
  from = 500,
  to = 800,
}: BoldHoverTextProps) {
  return (
    <span className={cn("inline-grid justify-items-center", className)}>
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 select-none"
        style={{ fontWeight: to }}
      >
        {children}
      </span>
      <span
        className="col-start-1 row-start-1"
        style={{ fontWeight: active ? to : from }}
      >
        {children}
      </span>
    </span>
  );
}

export { springTransition };
