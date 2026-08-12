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
  | "process-scan"
  | "requirements-and-kpis"
  | "dashboards"
  | "single-source-of-truth"
  | "ai-prototype"
  | "reporting-automation";

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
  /**
   * Price in whole euros, ex VAT. Rationale and market research live in
   * docs/pricing.md. A null falls back to "prijs op aanvraag".
   */
  price: number | null;
  /**
   * Launch discount: the price actually charged. When set, `price` renders
   * struck through in grey next to this one.
   */
  discountPrice?: number;
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
  /**
   * Has a "two entry modes" block on its detail page (on top of scans vs
   * standalone). Only Sharpen the question defines the `modes` copy.
   */
  hasModes?: boolean;
  /**
   * Path relations, rendered as the "Where this fits" section on the detail
   * page. `consumes` = packages whose documents this build starts from;
   * `feeds` = packages this one's deliverables flow into. Mirrors the
   * Bridges sections in docs/packages/.
   */
  consumes?: PackageSlug[];
  feeds?: PackageSlug[];
}

export const PACKAGES: PackageDef[] = [
  // ── Weten waar je staat ───────────────────────────────────────────────────
  {
    slug: "data-scan",
    phase: "know",
    accent: palette.red,
    featured: true,
    price: 4950,
    discountPrice: 2475,
    priceKind: "fixed",
    feeds: ["requirements-and-kpis", "single-source-of-truth", "ai-prototype"],
  },
  {
    slug: "process-scan",
    phase: "know",
    accent: "#F97316",
    price: 4950,
    discountPrice: 2475,
    priceKind: "fixed",
    feeds: ["requirements-and-kpis", "ai-prototype", "reporting-automation"],
  },
  {
    slug: "requirements-and-kpis",
    phase: "know",
    accent: "#14B8A6",
    // The floor is the on-top-of-scans mode; standalone (€12.500) lives in
    // the modes block on the detail page.
    price: 7500,
    discountPrice: 3750,
    priceKind: "from",
    hasModes: true,
    consumes: ["data-scan", "process-scan"],
    feeds: ["dashboards", "single-source-of-truth", "ai-prototype"],
  },
  // ── Bouwen ────────────────────────────────────────────────────────────────
  {
    slug: "dashboards",
    phase: "build",
    accent: "#0EA5E9",
    price: 7500,
    priceKind: "from",
    proofSlug: "open-data-warehouse",
    consumes: ["data-scan", "requirements-and-kpis"],
  },
  {
    slug: "single-source-of-truth",
    phase: "build",
    accent: "#3B82F6",
    price: 15000,
    priceKind: "from",
    proofSlug: "open-data-warehouse",
    hasBridge: true,
    consumes: ["data-scan", "requirements-and-kpis"],
    feeds: ["reporting-automation", "ai-prototype"],
  },
  {
    slug: "ai-prototype",
    phase: "build",
    accent: "#8B5CF6",
    price: 12500,
    priceKind: "fixed",
    proofSlug: "strafrecht-rag",
    consumes: ["data-scan", "process-scan", "requirements-and-kpis"],
  },
  // ── Draaiend houden ───────────────────────────────────────────────────────
  {
    slug: "reporting-automation",
    phase: "run",
    accent: "#10B981",
    price: 3950,
    priceKind: "fixed",
    proofSlug: "open-data-warehouse",
    hasBridge: true,
    consumes: ["process-scan", "single-source-of-truth"],
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
