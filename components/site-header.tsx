"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useScroll, motion, AnimatePresence } from "motion/react";
import { springTransition } from "@/components/spring-underline";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us/" },
  { name: "Program", href: "/program/" },
  { name: "Sponsors", href: "/sponsors/" },
  { name: "Recruitment", href: "/recruitment/" },
  { name: "Contact", href: "/contact/" },
];

function normalizePath(pathname: string | null) {
  if (!pathname) return "/";
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function isActivePath(pathname: string | null, href: string) {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  return current === target;
}

function NavItem({
  item,
  active,
  onHover,
  onLeave,
  layoutId,
  showUnderline,
}: {
  item: (typeof menuItems)[number];
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
        "relative block py-1 font-medium text-white/65 duration-200 hover:text-white",
        active || showUnderline ? "font-bold text-white" : "hover:font-semibold",
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
          className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-white"
          transition={springTransition}
        />
      )}
    </Link>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);

  const activeHref =
    menuItems.find((item) => isActivePath(pathname, item.href))?.href ?? "/";
  const underlineHref = hoveredHref ?? activeHref;

  return (
    <ul className="flex gap-7 text-sm font-medium tracking-wide lg:gap-9">
      {menuItems.map((item) => (
        <li key={item.href}>
          <NavItem
            item={item}
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

function MobileNav() {
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

/** White rounded-rectangle Login button — black text, solid fill. */
function LoginButton({ className }: { className?: string }) {
  return (
    <Link
      href="/login/"
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black",
        "border-0 shadow-none outline-none ring-0",
        "transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className,
      )}
    >
      Login
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

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
        className="group fixed inset-x-0 top-0 z-50 w-full pt-4 text-white lg:pt-6"
      >
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12",
            scrolled
              ? "bg-black/55 shadow-lg shadow-black/20 backdrop-blur-2xl"
              : "bg-black/20 backdrop-blur-md",
          )}
        >
          <motion.div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-5",
              scrolled && "lg:py-3.5",
            )}
          >
            <div className="flex w-full items-center justify-between gap-10 lg:w-auto lg:gap-14">
              <Link
                href="/"
                aria-label="UCSD x CRS home"
                className="flex items-center"
              >
                <Image
                  src="/images/ucsd-x-crs-logo-footer.png"
                  alt="UCSD x CRS"
                  width={1024}
                  height={639}
                  className="h-8 w-auto object-contain md:h-9"
                  priority
                />
              </Link>

              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer border-0 bg-transparent p-2.5 shadow-none outline-none ring-0 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <DesktopNav />
              </div>
            </div>

            <div className="hidden lg:block lg:ml-4">
              <LoginButton />
            </div>

            <AnimatePresence>
              {menuState && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="mb-6 w-full space-y-8 rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl shadow-black/40 lg:hidden"
                >
                  <MobileNav />
                  <LoginButton className="w-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
