import { palette } from "@/theme/theme";
import type { Locale } from "@/i18n/routing";

/**
 * The five packaged outcomes that replaced the three discipline pages.
 *
 * Copy for every package lives in the `packages` translation namespace under
 * the slug; this file holds only what isn't language-specific — ordering,
 * accent color, price, and which project backs it up as proof.
 */

export type PackageSlug =
  | "data-scan"
  | "requirements-and-kpis"
  | "dashboards"
  | "single-source-of-truth"
  | "reporting-automation"
  | "ai-prototype"
  | "ai-workshop";

/**
 * Packages are grouped by the stage a buyer is in, not by discipline. The
 * grouping is what keeps seven packages reading as one path instead of a menu
 * of capabilities — which is the thing that makes a one-person practice look
 * junior.
 */
export type PackagePhase = "know" | "build" | "run";

export const PHASES: PackagePhase[] = ["know", "build", "run"];

export interface PackageDef {
  slug: PackageSlug;
  /** Which stage of the path this package belongs to. */
  phase: PackagePhase;
  /** Section accent; the Datascan carries the brand red as the entry point. */
  accent: string;
  /** Highlighted entry package — rendered wide, above the delivery grid. */
  featured?: boolean;
  /** Sits apart from the three delivery packages, in its own band. */
  workshop?: boolean;
  /**
   * Price in whole euros.
   *
   * TODO — awaiting the real figures. While these are null the UI falls back
   * to "prijs op aanvraag" instead of rendering a placeholder, so an early
   * deploy never shows a prospect a number that isn't real.
   */
  price: number | null;
  /** `fixed` renders the amount bare, `from` renders it as "vanaf €X". */
  priceKind: "fixed" | "from";
  /** Slug under /projects that demonstrates this package, when one exists. */
  proofSlug?: string;
  /**
   * Carries the "built so you can put AI on top later" line. Only the two
   * analytics packages do — that bridge sentence is what keeps AI positioned
   * as a consequence of the data work rather than a separate offering.
   */
  hasBridge?: boolean;
}

export const PACKAGES: PackageDef[] = [
  // ── Weten waar je staat ───────────────────────────────────────────────────
  {
    slug: "data-scan",
    phase: "know",
    accent: palette.red,
    featured: true,
    price: null,
    priceKind: "fixed",
  },
  {
    slug: "requirements-and-kpis",
    phase: "know",
    accent: "#14B8A6",
    price: null,
    priceKind: "fixed",
  },
  // ── Bouwen ────────────────────────────────────────────────────────────────
  {
    slug: "dashboards",
    phase: "build",
    accent: "#0EA5E9",
    price: null,
    priceKind: "from",
    proofSlug: "open-data-warehouse",
  },
  {
    slug: "single-source-of-truth",
    phase: "build",
    accent: "#3B82F6",
    price: null,
    priceKind: "from",
    proofSlug: "open-data-warehouse",
    hasBridge: true,
  },
  {
    slug: "ai-prototype",
    phase: "build",
    accent: "#8B5CF6",
    price: null,
    priceKind: "fixed",
    proofSlug: "uitspraak-rag",
  },
  // ── Draaiend houden ───────────────────────────────────────────────────────
  {
    slug: "reporting-automation",
    phase: "run",
    accent: "#10B981",
    price: null,
    priceKind: "fixed",
    proofSlug: "open-data-warehouse",
    hasBridge: true,
  },
  {
    slug: "ai-workshop",
    phase: "run",
    accent: "#F59E0B",
    workshop: true,
    price: null,
    priceKind: "fixed",
  },
];

export const PACKAGE_SLUGS = PACKAGES.map((p) => p.slug);

export const FEATURED_PACKAGE = PACKAGES.find((p) => p.featured)!;

export function packagesInPhase(phase: PackagePhase): PackageDef[] {
  return PACKAGES.filter((p) => p.phase === phase);
}

export function getPackage(slug: string): PackageDef | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}

/** Whole-euro currency, e.g. "€ 1.500" in nl and "€1,500" in en. */
export function formatAmount(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
