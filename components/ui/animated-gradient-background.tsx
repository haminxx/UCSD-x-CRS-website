"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { motion } from "motion/react";

/** Soft cinematic palette for light pages — cool steel / teal, no neon. */
const DEFAULT_GRADIENT_COLORS = [
  "#f8fafb",
  "#eef3f6",
  "#e2e9ee",
  "#d4dee6",
  "#c5d4d8",
  "#b6c2c8",
  "#a8b4bb",
];

const DEFAULT_GRADIENT_STOPS = [35, 50, 60, 70, 80, 90, 100];

export interface AnimatedGradientBackgroundProps {
  /** Initial size of the radial gradient, defining the starting width. @default 110 */
  startingGap?: number;
  /** Enables or disables the breathing animation effect. @default false */
  Breathing?: boolean;
  /** Colors for the radial gradient (paired with `gradientStops`). */
  gradientColors?: string[];
  /** Percentage stops (0–100) corresponding to each color. */
  gradientStops?: number[];
  /** Breathing speed — lower is slower. @default 0.02 */
  animationSpeed?: number;
  /** Max breathing range in percentage points. @default 5 */
  breathingRange?: number;
  /** Additional inline styles for the gradient container. */
  containerStyle?: CSSProperties;
  /** Additional class names for the outer motion container. */
  containerClassName?: string;
  /** Extra vertical stretch offset for the radial ellipse. @default 0 */
  topOffset?: number;
}

/**
 * Animated radial gradient with optional breathing via requestAnimationFrame
 * and a scale/fade entrance via motion.
 */
export function AnimatedGradientBackground({
  startingGap = 125,
  Breathing = false,
  gradientColors = DEFAULT_GRADIENT_COLORS,
  gradientStops = DEFAULT_GRADIENT_STOPS,
  animationSpeed = 0.02,
  breathingRange = 5,
  containerStyle = {},
  topOffset = 0,
  containerClassName = "",
}: AnimatedGradientBackgroundProps) {
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `GradientColors and GradientStops must have the same length. Received gradientColors length: ${gradientColors.length}, gradientStops length: ${gradientStops.length}`,
    );
  }

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrame: number;
    let width = startingGap;
    let directionWidth = 1;

    const animateGradient = () => {
      if (width >= startingGap + breathingRange) directionWidth = -1;
      if (width <= startingGap - breathingRange) directionWidth = 1;

      if (!Breathing) directionWidth = 0;
      width += directionWidth * animationSpeed;

      const gradientStopsString = gradientStops
        .map((stop, index) => `${gradientColors[index]} ${stop}%`)
        .join(", ");

      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${gradientStopsString})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }

      animationFrame = requestAnimationFrame(animateGradient);
    };

    animationFrame = requestAnimationFrame(animateGradient);

    return () => cancelAnimationFrame(animationFrame);
  }, [
    startingGap,
    Breathing,
    gradientColors,
    gradientStops,
    animationSpeed,
    breathingRange,
    topOffset,
  ]);

  return (
    <motion.div
      key="animated-gradient-background"
      initial={{ opacity: 0, scale: 1.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 2,
          ease: [0.25, 0.1, 0.25, 1],
        },
      }}
      className={`absolute inset-0 overflow-hidden ${containerClassName}`}
      aria-hidden
    >
      <div
        ref={containerRef}
        style={containerStyle}
        className="absolute inset-0 transition-transform"
      />
    </motion.div>
  );
}

export default AnimatedGradientBackground;
