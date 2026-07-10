"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useAnimationFrame } from "motion/react";
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
 * Custom tire cursor. Slow start → accelerates while hovering interactive targets.
 * Adds motion blur as spin speed increases.
 */
export function TireCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  const spinningRef = useRef(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    spinningRef.current = spinning;
  }, [spinning]);

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

  useAnimationFrame((_, delta) => {
    const img = imgRef.current;
    if (!img) return;

    const dt = Math.min(delta, 40) / 1000;
    // Spring-like accel: slow start, ramps up; decelerates when not hovering
    const target = spinningRef.current ? 920 : 0; // deg/sec max
    const stiffness = spinningRef.current ? 2.4 : 4.5;
    speedRef.current += (target - speedRef.current) * Math.min(1, stiffness * dt);
    if (!spinningRef.current && Math.abs(speedRef.current) < 2) {
      speedRef.current = 0;
    }

    angleRef.current = (angleRef.current + speedRef.current * dt) % 360;
    const blur = Math.min(2.4, (Math.abs(speedRef.current) / 920) * 2.4);

    img.style.transform = `rotate(${angleRef.current}deg)`;
    img.style.filter =
      blur > 0.05
        ? `blur(${blur.toFixed(2)}px) drop-shadow(0 2px 6px rgba(0,0,0,0.45))`
        : "drop-shadow(0 2px 6px rgba(0,0,0,0.45))";
  });

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[10000] hidden size-11 md:block",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      <img
        ref={imgRef}
        src="/images/tire-cursor.png"
        alt=""
        width={44}
        height={44}
        className="size-11 select-none object-contain will-change-transform"
        draggable={false}
      />
    </div>
  );
}
