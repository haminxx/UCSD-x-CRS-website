"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isLightPage } from "@/lib/theme";

/** Syncs `data-theme` on <html> from the current route (light informational vs dark home). */
export function PageTheme() {
  const pathname = usePathname();
  const light = isLightPage(pathname);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = light ? "light" : "dark";
    return () => {
      delete root.dataset.theme;
    };
  }, [light]);

  return null;
}
