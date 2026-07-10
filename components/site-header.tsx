"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useScroll, motion, AnimatePresence } from "motion/react";
import { SpringUnderline, springTransition } from "@/components/spring-underline";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us/" },
  { name: "Program", href: "/program/" },
  { name: "Sponsors", href: "/sponsors/" },
  { name: "Recruitment", href: "/recruitment/" },
  { name: "Contact", href: "/contact/" },
];

type SiteHeaderProps = {
  theme?: "light" | "dark";
};

function normalizePath(pathname: string | null) {
  if (!pathname) return "/";
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function isHomePath(pathname: string | null) {
  const path = normalizePath(pathname);
  return path === "/";
}

function isActivePath(pathname: string | null, href: string) {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  return current === target;
}

function NavItem({
  item,
  isDark,
  active,
  onHover,
  onLeave,
  layoutId,
  showUnderline,
}: {
  item: (typeof menuItems)[number];
  isDark: boolean;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
  layoutId: string;
  showUnderline: boolean;
}) {
  return (
    <Link
      href={item.href}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "relative block py-1 font-medium duration-200",
        active || showUnderline ? "font-bold" : "hover:font-semibold",
        isDark
          ? "text-white/65 hover:text-white"
          : "text-black hover:text-neutral-700",
        (active || showUnderline) && (isDark ? "text-white" : "text-black"),
      )}
    >
      <motion.span
        className="inline-block"
        animate={{ fontWeight: active || showUnderline ? 700 : 500 }}
        transition={{ duration: 0.2 }}
      >
        {item.name}
      </motion.span>
      {showUnderline && (
        <motion.span
          layoutId={layoutId}
          className={cn(
            "absolute inset-x-0 -bottom-0.5 h-[2px]",
            isDark ? "bg-white" : "bg-black",
          )}
          transition={springTransition}
        />
      )}
    </Link>
  );
}

function DesktopNav({ isDark }: { isDark: boolean }) {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);

  const activeHref =
    menuItems.find((item) => isActivePath(pathname, item.href))?.href ?? "/";
  const underlineHref = hoveredHref ?? activeHref;

  return (
    <ul className="flex gap-8 text-sm font-medium">
      {menuItems.map((item) => (
        <li key={item.href}>
          <NavItem
            item={item}
            isDark={isDark}
            active={isActivePath(pathname, item.href)}
            layoutId="desktop-nav-underline"
            showUnderline={underlineHref === item.href}
            onHover={() => setHoveredHref(item.href)}
            onLeave={() => setHoveredHref(null)}
          />
        </li>
      ))}
    </ul>
  );
}

function MobileNav({ isDark }: { isDark: boolean }) {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);

  const activeHref =
    menuItems.find((item) => isActivePath(pathname, item.href))?.href ?? "/";
  const underlineHref = hoveredHref ?? activeHref;

  return (
    <ul className="space-y-6 text-base font-medium">
      {menuItems.map((item) => (
        <li key={item.href}>
          <NavItem
            item={item}
            isDark={isDark}
            active={isActivePath(pathname, item.href)}
            layoutId="mobile-nav-underline"
            showUnderline={underlineHref === item.href}
            onHover={() => setHoveredHref(item.href)}
            onLeave={() => setHoveredHref(null)}
          />
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader({ theme = "light" }: SiteHeaderProps) {
  const pathname = usePathname();
  const showLogin = isHomePath(pathname);
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const isDark = theme === "dark";

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.02);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  React.useEffect(() => {
    setMenuState(false);
  }, [pathname]);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "group fixed inset-x-0 top-0 z-50 w-full pt-4 lg:pt-6",
          isDark && "text-white",
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12",
            scrolled
              ? isDark
                ? "bg-black/55 shadow-lg shadow-black/20 backdrop-blur-2xl"
                : "bg-background/70 shadow-lg shadow-black/5 backdrop-blur-2xl"
              : isDark
                ? "bg-black/20 backdrop-blur-md"
                : "bg-background/30 backdrop-blur-md",
          )}
        >
          <motion.div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-5",
              scrolled && "lg:py-3.5",
            )}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/"
                aria-label="UCSD x CRS home"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/images/ucsd-x-crs-logo.png"
                  alt="UCSD x CRS"
                  width={160}
                  height={84}
                  className="h-7 w-auto md:h-8"
                  priority
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <DesktopNav isDark={isDark} />
              </div>
            </div>

            <div
              className={cn(
                "group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                showLogin ? "lg:flex" : "lg:hidden",
                isDark
                  ? "border-white/15 bg-zinc-950 shadow-black/40"
                  : "bg-background shadow-zinc-300/20 dark:shadow-none dark:lg:bg-transparent",
              )}
            >
              <div className="lg:hidden">
                <MobileNav isDark={isDark} />
              </div>
              <AnimatePresence>
                {showLogin && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex w-full items-center md:w-fit lg:ml-4"
                  >
                    <Link
                      href="/login/"
                      className={cn(
                        "relative inline-block border-0 bg-transparent p-0 text-sm font-medium shadow-none outline-none ring-0",
                        "rounded-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
                        "transition-[font-weight,color] duration-200",
                        isDark
                          ? "text-white/80 hover:font-bold hover:text-white"
                          : "text-black hover:font-bold hover:text-neutral-900",
                      )}
                    >
                      <SpringUnderline className="pb-0.5">Login</SpringUnderline>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
