"use client";

import { cn } from "@/lib/utils";
import { SpringUnderline } from "@/components/spring-underline";
import {
  motion,
  useReducedMotion,
  type PanInfo,
  type Transition,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export interface OrbitStackItem {
  name: string;
  role: string;
  description: string;
  accent?: string;
  initials?: string;
  stat?: string;
  image?: string;
  /** Optional LinkedIn (or other) profile URL — only the name is linked. */
  href?: string;
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
  /**
   * Mobile swipe order as indices into `items`.
   * Defaults to center → left → right → far-left → far-right for a 5-card stack.
   */
  mobileOrder?: number[];
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

  // Named member without a photo — clean initials (no cartoon / invented face)
  const initials =
    item.initials?.trim() ||
    item.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <div
      className="relative flex aspect-[1.36] w-full items-center justify-center overflow-hidden rounded-[1.45rem] border border-black/[0.08] bg-gradient-to-br from-[#ebe8e1] via-[#e3dfd6] to-[#d8d3c8]"
      style={{ "--accent": item.accent ?? "#f3f1ea" } as CSSProperties}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,var(--accent),transparent_42%)] opacity-40" />
      <span className="relative text-5xl font-semibold tracking-[-0.06em] text-zinc-950/80">
        {initials}
      </span>
    </div>
  );
}

function OrbitCardName({ item }: { item: OrbitStackItem }) {
  const nameClass =
    "mt-2 min-h-[2rem] text-balance text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.04em] text-zinc-950 sm:text-[1.85rem]";

  if (!item.name.trim()) {
    return <h3 className={nameClass}>{item.name}</h3>;
  }

  if (item.href) {
    return (
      <h3 className={nameClass}>
        <SpringUnderline className="max-w-full">
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none focus-visible:opacity-80"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            {item.name}
          </a>
        </SpringUnderline>
      </h3>
    );
  }

  return (
    <h3 className={nameClass}>
      <SpringUnderline>{item.name}</SpringUnderline>
    </h3>
  );
}

function CardBody({
  item,
  className,
}: {
  item: OrbitStackItem;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="relative">
        <Portrait item={item} />
      </div>

      <div className="px-2 pb-2 pt-6">
        <div>
          <p className="min-h-[1rem] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {item.role}
          </p>
          <OrbitCardName item={item} />
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
    </div>
  );
}

/** Default mobile order: center → left → right → far-left → far-right. */
function defaultMobileOrder(length: number, centerIndex: number): number[] {
  if (length === 5 && centerIndex === 2) {
    return [2, 1, 3, 0, 4];
  }
  const order = [centerIndex];
  for (let offset = 1; offset < length; offset++) {
    const left = centerIndex - offset;
    const right = centerIndex + offset;
    if (left >= 0) order.push(left);
    if (right < length) order.push(right);
  }
  return order;
}

function MobileSwipeStack({
  items,
  order,
  cardClassName,
  onActiveChange,
}: {
  items: OrbitStackItem[];
  order: number[];
  cardClassName?: string;
  onActiveChange?: (item: OrbitStackItem, index: number) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const lastActiveRef = useRef<number | null>(null);

  const queue = useMemo(() => {
    const n = order.length;
    return Array.from({ length: n }, (_, i) => order[(rotation + i) % n]!);
  }, [order, rotation]);

  const frontIndex = queue[0]!;
  const frontItem = items[frontIndex]!;

  useEffect(() => {
    if (lastActiveRef.current === null) {
      lastActiveRef.current = frontIndex;
      return;
    }
    if (lastActiveRef.current === frontIndex) return;
    lastActiveRef.current = frontIndex;
    onActiveChange?.(frontItem, frontIndex);
  }, [frontIndex, frontItem, onActiveChange]);

  const advance = useCallback((direction: 1 | -1) => {
    setRotation((prev) => {
      const n = order.length;
      return (prev + direction + n) % n;
    });
  }, [order.length]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 56;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      // Swipe left — front card goes to back
      advance(1);
    } else if (offset > threshold || velocity > 500) {
      // Swipe right — last card comes to front
      advance(-1);
    }
  };

  const transition: Transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 380, damping: 32, mass: 0.75 };

  return (
    <div
      className="relative mx-auto flex h-[540px] w-full max-w-[22rem] touch-pan-y items-center justify-center"
      aria-roledescription="carousel"
      aria-label="Team leaders"
    >
      {queue.map((itemIndex, stackPos) => {
        const item = items[itemIndex]!;
        const isFront = stackPos === 0;
        const depth = Math.min(stackPos, 3);
        const behindX = depth * 14;
        const behindY = depth * 10;
        const behindScale = 1 - depth * 0.045;
        const behindRotate = depth * 2.2;

        return (
          <motion.article
            key={`${item.name || "empty"}-${itemIndex}`}
            className={cn(
              "absolute left-1/2 top-[46%] w-[min(86vw,20.5rem)] origin-center rounded-[1.9rem] border border-black/10 bg-[#e9e6df] p-4 text-[#141414] outline-none",
              isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
              "focus-visible:ring-2 focus-visible:ring-zinc-950/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F0EF]",
              cardClassName,
            )}
            style={{ zIndex: 30 - stackPos }}
            initial={false}
            animate={{
              x: `calc(-50% + ${isFront ? 0 : behindX}px)`,
              y: `calc(-50% + ${isFront ? 0 : behindY}px)`,
              scale: isFront ? 1 : behindScale,
              rotate: isFront ? 0 : behindRotate,
              opacity: stackPos > 3 ? 0 : isFront ? 1 : 1 - depth * 0.12,
            }}
            transition={transition}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: -140, right: 140 }}
            dragElastic={0.18}
            onDragEnd={isFront ? onDragEnd : undefined}
            tabIndex={isFront ? 0 : -1}
            aria-hidden={!isFront}
            onKeyDown={
              isFront
                ? (event) => {
                    if (event.key === "ArrowLeft") advance(1);
                    if (event.key === "ArrowRight") advance(-1);
                  }
                : undefined
            }
          >
            <CardBody item={item} />
          </motion.article>
        );
      })}

      <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[0.7rem] font-medium tracking-wide text-zinc-500/80">
        Swipe to meet the team
      </p>
    </div>
  );
}

function DesktopOrbitStack({
  items,
  className,
  cardClassName,
  defaultActiveIndex,
  spread,
  lift,
  onActiveChange,
  onCollapse,
}: {
  items: OrbitStackItem[];
  className?: string;
  cardClassName?: string;
  defaultActiveIndex: number;
  spread: number;
  lift: number;
  onActiveChange?: (item: OrbitStackItem, index: number) => void;
  onCollapse?: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const defaultIndex = clampIndex(defaultActiveIndex, items.length);
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [raisedIndex, setRaisedIndex] = useState(defaultIndex);
  const raiseTimeoutRef = useRef<number | null>(null);
  const collapseTimeoutRef = useRef<number | null>(null);

  const center = (items.length - 1) / 2;
  const transition: Transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 350, damping: 30, mass: 0.7 };

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
      items.map((_, index) => {
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
    [center, defaultIndex, items, spread],
  );

  return (
    <div
      className={cn(
        "relative flex min-h-full w-full items-center justify-center overflow-visible px-4 py-10 md:px-8 md:py-12",
        className,
      )}
    >
      <div className="relative h-[560px] w-full max-w-[980px] md:h-[600px]">
        {items.map((item, index) => {
          const active = activeIndex === index;
          const cardLayout = cardLayouts[index] ?? cardLayouts[defaultIndex]!;
          const layout = expanded ? cardLayout.expanded : cardLayout.collapsed;
          const raised = raisedIndex === index;
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
                "focus-visible:ring-2 focus-visible:ring-zinc-950/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F0EF]",
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
              <CardBody item={item} />
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export function OrbitCardStack({
  items = defaultItems,
  className,
  cardClassName,
  defaultActiveIndex = 2,
  mobileOrder,
  spread = 168,
  lift = 34,
  onActiveChange,
  onCollapse,
}: OrbitCardStackProps) {
  const safeItems = items.length ? items : defaultItems;
  const defaultIndex = clampIndex(defaultActiveIndex, safeItems.length);
  const order =
    mobileOrder ?? defaultMobileOrder(safeItems.length, defaultIndex);

  return (
    <>
      <div
        className={cn(
          "relative flex w-full items-center justify-center overflow-visible px-2 py-6 md:hidden",
          className,
        )}
      >
        <MobileSwipeStack
          items={safeItems}
          order={order}
          cardClassName={cardClassName}
          onActiveChange={onActiveChange}
        />
      </div>
      <div className="hidden md:block">
        <DesktopOrbitStack
          items={safeItems}
          className={className}
          cardClassName={cardClassName}
          defaultActiveIndex={defaultIndex}
          spread={spread}
          lift={lift}
          onActiveChange={onActiveChange}
          onCollapse={onCollapse}
        />
      </div>
    </>
  );
}
