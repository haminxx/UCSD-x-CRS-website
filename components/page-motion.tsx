"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export function PageEnter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: easePremium }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger children slightly for premium page reveals. */
export function PageEnterItem({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: easePremium }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Custom tire cursor. Hides system cursor; spins while hovering interactive targets.
 */
export function TireCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    document.documentElement.classList.add("tire-cursor-active");

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest(
        "a, button, [role='button'], input, textarea, select, label, .cursor-pointer",
      );
      setSpinning(Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("tire-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[10000] hidden size-10 md:block",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      <img
        src="/images/tire-cursor.png"
        alt=""
        width={40}
        height={40}
        className={cn(
          "size-10 select-none object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]",
          spinning && "animate-tire-spin",
        )}
        draggable={false}
      />
    </div>
  );
}
