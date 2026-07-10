/** Informational routes use an off-white page + dark header. Home/login stay dark. */
export const LIGHT_PAGE_PREFIXES = [
  "/about-us",
  "/contact",
  "/program",
  "/sponsors",
  "/recruitment",
] as const;

export function normalizePath(pathname: string | null | undefined) {
  if (!pathname) return "/";
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function isLightPage(pathname: string | null | undefined) {
  const path = normalizePath(pathname);
  if (path === "/") return false;
  return LIGHT_PAGE_PREFIXES.some(
    (prefix) => path === `${prefix}/` || path.startsWith(`${prefix}/`),
  );
}
