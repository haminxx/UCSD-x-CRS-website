"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

export interface OrbitStackItem {
  name: string;
  role: string;
  description: string;
  accent?: string;
  initials?: string;
  stat?: string;
  image?: string;
}

interface OrbitCardStackProps {
  /** Cards shown in the stack. */
  items?: OrbitStackItem[];
  /** Additional CSS classes for the outer stage. */
  className?: string;
  /** Additional CSS classes for each card. */
  cardClassName?: string;
  /** Card that sits at the front when the stack is collapsed. */
  defaultActiveIndex?: number;
  /** Horizontal fan distance in pixels. */
  spread?: number;
  /** Vertical lift for hovered cards in pixels. */
  lift?: number;
  /** Called when the active card changes. */
  onActiveChange?: (item: OrbitStackItem, index: number) => void;
  /** Called when the stack collapses / pointer leaves. */
  onCollapse?: () => void;
}

const defaultItems: OrbitStackItem[] = [
  {
    name: "Mira Vale",
    role: "Creative Lead",
    description:
      "Shapes visual systems with enough restraint to feel expensive and enough edge to be remembered.",
    accent: "#f8d66d",
    initials: "MV",
    stat: "Identity",
  },
  {
    name: "Noor Kade",
    role: "Product Strategy",
    description:
      "Turns loose ideas into sharp product moves, crisp priorities, and launchable experiences.",
    accent: "#78dcca",
    initials: "NK",
    stat: "Roadmap",
  },
  {
    name: "Ari Chen",
    role: "Founder",
    description:
      "Sets the taste bar, protects the details, and keeps the whole team pointed at the same high signal.",
    accent: "#f3f1ea",
    initials: "AC",
    stat: "Vision",
  },
  {
    name: "Sana Holt",
    role: "Frontend Engineer",
    description:
      "Builds the motion, polish, and interface texture that make the product feel calm under pressure.",
    accent: "#b9a7ff",
    initials: "SH",
    stat: "Motion",
  },
  {
    name: "Ezra Moon",
    role: "Operations",
    description:
      "Keeps the machine quiet, the handoffs clean, and the team moving without pointless friction.",
    accent: "#ff9d77",
    initials: "EM",
    stat: "Systems",
  },
];

function clampIndex(index: number, length: number) {
  return Math.min(Math.max(index, 0), Math.max(length - 1, 0));
}

function Portrait({ item }: { item: OrbitStackItem }) {
  const isEmpty = !item.name.trim() && !item.image;

  if (item.image) {
    return (
      <div className="relative flex aspect-[1.36] w-full overflow-hidden rounded-[1.45rem] border border-black/[0.08] bg-black/[0.045]">
        <img
          src={item.image}
          alt={item.name || "Team member"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // Blank placeholder — no cartoon figure or fake initials
  if (isEmpty) {
    return (
      <div
        aria-hidden
        className="relative flex aspect-[1.36] w-full overflow-hidden rounded-[1.45rem] border border-black/[0.08] bg-gradient-to-br from-[#ebe8e1] via-[#e3dfd6] to-[#d8d3c8]"
        style={{ "--accent": item.accent ?? "#f3f1ea" } as CSSProperties}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,var(--accent),transparent_40%)] opacity-35" />
      </div>
    );
  }

  return (
    <div
      className="relative flex aspect-[1.36] w-full overflow-hidden rounded-[1.45rem] border border-black/[0.08] bg-black/[0.045]"
      style={{ "--accent": item.accent ?? "#f3f1ea" } as CSSProperties}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,var(--accent),transparent_24%),radial-gradient(circle_at_85%_72%,rgba(255,255,255,0.5),transparent_28%)] opacity-45" />
      <div className="absolute inset-x-8 bottom-0 h-[72%] rounded-t-[999px] border-2 border-zinc-950 bg-[#f7f5ef]" />
      <div className="absolute left-1/2 top-[22%] size-24 -translate-x-1/2 rounded-[45%_55%_48%_52%] border-2 border-zinc-950 bg-[#f5f2eb]">
        <div className="absolute left-1/2 top-[42%] h-2 w-10 -translate-x-1/2 rounded-full bg-zinc-950 opacity-80" />
        <div className="absolute left-[27%] top-[34%] size-2 rounded-full bg-zinc-950" />
        <div className="absolute right-[27%] top-[34%] size-2 rounded-full bg-zinc-950" />
        <div className="absolute left-1/2 top-[52%] h-6 w-4 -translate-x-1/2 rounded-b-full border-b-2 border-zinc-950" />
        <div
          className="absolute -top-5 left-1/2 h-9 w-24 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-zinc-950"
          style={{ backgroundColor: item.accent ?? "#f3f1ea" }}
        />
      </div>
    </div>
  );
}

export function OrbitCardStack({
  items = defaultItems,
  className,
  cardClassName,
  defaultActiveIndex = 2,
  spread = 168,
  lift = 34,
  onActiveChange,
  onCollapse,
}: OrbitCardStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length ? items : defaultItems;
  const defaultIndex = clampIndex(defaultActiveIndex, safeItems.length);
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [raisedIndex, setRaisedIndex] = useState(defaultIndex);
  const raiseTimeoutRef = useRef<number | null>(null);

  const center = (safeItems.length - 1) / 2;
  const transition: Transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 350, damping: 30, mass: 0.7 };

  const collapseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (raiseTimeoutRef.current) {
        window.clearTimeout(raiseTimeoutRef.current);
      }
      if (collapseTimeoutRef.current) {
        window.clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  const activateCard = (item: OrbitStackItem, index: number) => {
    setActiveIndex(index);
    onActiveChange?.(item, index);

    if (raiseTimeoutRef.current) {
      window.clearTimeout(raiseTimeoutRef.current);
    }

    raiseTimeoutRef.current = window.setTimeout(() => {
      setRaisedIndex(index);
    }, shouldReduceMotion ? 0 : 45);
  };

  const scheduleCollapse = () => {
    if (collapseTimeoutRef.current) {
      window.clearTimeout(collapseTimeoutRef.current);
    }
    collapseTimeoutRef.current = window.setTimeout(() => {
      setExpanded(false);
      setActiveIndex(defaultIndex);
      setRaisedIndex(defaultIndex);
      onCollapse?.();
    }, 80);
  };

  const cancelCollapse = () => {
    if (collapseTimeoutRef.current) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
  };

  const cardLayouts = useMemo(
    () =>
      safeItems.map((_, index) => {
        const fromCenter = index - center;
        const collapsedFromActive = index - defaultIndex;
        const expandedRotate = fromCenter * 8.5;

        return {
          collapsed: {
            x: collapsedFromActive * 10,
            y: Math.abs(collapsedFromActive) * 5,
            rotate: collapsedFromActive * 2.8,
          },
          expanded: {
            x: fromCenter * spread,
            y:
              Math.abs(fromCenter) * 30 +
              Math.max(0, Math.abs(fromCenter) - 1) * 10,
            rotate: expandedRotate,
          },
        };
      }),
    [center, defaultIndex, safeItems, spread],
  );

  return (
    <div
      className={cn(
        // overflow-visible so expanded/rotated side cards are not clipped
        "relative flex min-h-full w-full items-center justify-center overflow-visible px-4 py-10 md:px-8 md:py-12",
        className,
      )}
    >
      <div className="relative h-[560px] w-full max-w-[980px] md:h-[600px]">
        {safeItems.map((item, index) => {
          const active = activeIndex === index;
          const cardLayout = cardLayouts[index] ?? cardLayouts[defaultIndex]!;
          const layout = expanded ? cardLayout.expanded : cardLayout.collapsed;
          const raised = raisedIndex === index;
          // Keep below SiteHeader (z-[100]) so cards never cover the nav
          const zIndex = raised
            ? 20
            : expanded
              ? 15 - Math.abs(index - raisedIndex)
              : 10 - Math.abs(index - defaultIndex);

          return (
            <motion.article
              key={`${item.name}-${index}`}
              className={cn(
                "absolute left-1/2 top-1/2 w-[min(78vw,21rem)] origin-bottom cursor-pointer rounded-[1.9rem] border border-black/10 bg-[#e9e6df] p-4 text-[#141414] outline-none",
                "focus-visible:ring-2 focus-visible:ring-zinc-950/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                cardClassName,
              )}
              style={{ zIndex }}
              animate={{
                x: `calc(-50% + ${layout.x}px)`,
                y: `calc(-50% + ${layout.y - (active && expanded ? lift : 0)}px)`,
                rotate: layout.rotate,
                scale: expanded ? 0.985 : 0.97,
              }}
              transition={transition}
              tabIndex={0}
              onMouseEnter={() => {
                cancelCollapse();
                setExpanded(true);
                activateCard(item, index);
              }}
              onMouseLeave={scheduleCollapse}
              onFocus={() => {
                setExpanded(true);
                activateCard(item, index);
              }}
            >
              <div className="relative">
                <Portrait item={item} />
              </div>

              <div className="px-2 pb-2 pt-6">
                <div>
                  <p className="min-h-[1rem] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {item.role}
                  </p>
                  <h3 className="mt-2 min-h-[2rem] text-[2rem] font-semibold leading-none tracking-[-0.04em] text-zinc-950">
                    {item.name}
                  </h3>
                </div>
                <p className="mt-4 min-h-[4.5rem] max-w-[17rem] text-[0.98rem] font-medium leading-[1.42] tracking-[-0.01em] text-zinc-700">
                  {item.description}
                </p>
                <div className="mt-5 border-t border-black/10 pt-4">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    {item.stat || "\u00a0"}
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
