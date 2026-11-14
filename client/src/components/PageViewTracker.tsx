"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { recordPageView } from "@/lib/api";
import { routing } from "@/i18n/routing";

// First path segment as the visitor sees it → the canonical (English) one, so
// "/projecten/x" and "/en/projects/x" are counted as the same page. Derived
// from the localized pathnames in i18n/routing.ts.
const CANONICAL_SEGMENT: Record<string, string> = {};
for (const [internal, localized] of Object.entries(routing.pathnames)) {
  if (typeof localized === "string") continue;
  const canonical = internal.split("/")[1] ?? "";
  for (const path of Object.values(localized)) {
    const segment = path.split("/")[1] ?? "";
    if (segment && canonical) CANONICAL_SEGMENT[segment] = canonical;
  }
}

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

/** "/en/projects/x" and "/projecten/x" → "/projects/x"; "/en" → "/". */
export function canonicalPath(pathname: string): string {
  const segments = pathname.replace(LOCALE_PREFIX, "").split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  segments[0] = CANONICAL_SEGMENT[segments[0]] ?? segments[0];
  return `/${segments.join("/")}`;
}

// Records one page view per page, on load and on every client-side
// navigation. Mounted once in the locale layout, so every page is counted.
// Renders nothing.
export default function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    recordPageView(canonicalPath(pathname), locale);
  }, [pathname, locale]);

  return null;
}
