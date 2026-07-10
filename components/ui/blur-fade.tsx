"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type UseInViewOptions,
} from "motion/react";
import { cn } from "@/lib/utils";

type BlurFadeProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: string;
  inView?: boolean;
  inViewMargin?: UseInViewOptions["margin"];
};

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.4,
  yOffset = 6,
  blur = "6px",
  inView = false,
  inViewMargin = "-50px",
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: yOffset,
        filter: `blur(${blur})`,
      }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: yOffset, filter: `blur(${blur})` }
      }
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
