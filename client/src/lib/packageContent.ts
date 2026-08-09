import { formatAmount, type PackageDef } from "@/lib/packages";
import type { PackageCardLabels, PackageCardProps } from "@/components/PackageCard";
import type { Locale } from "@/i18n/routing";

/**
 * Glue between a PackageDef (ordering, accent, price) and the `packages`
 * translation namespace (all the words). Both /diensten and the package detail
 * pages read their content through here, so the seven slots stay identical
 * wherever a package appears.
 */

/** Minimal shape of a next-intl translator, so this stays framework-light. */
export interface Translator {
  (key: string, values?: Record<string, string | number>): string;
  raw(key: string): unknown;
}

export function packageCardLabels(tp: Translator): PackageCardLabels {
  return {
    recognise: tp("labels.recognise"),
    promise: tp("labels.promise"),
    deliverables: tp("labels.deliverables"),
    duration: tp("labels.duration"),
    price: tp("labels.price"),
    proof: tp("labels.proof"),
    view: tp("labels.view"),
    featuredTag: tp("labels.featuredTag"),
    bridgeLabel: tp("labels.bridgeLabel"),
  };
}

/**
 * Renders the price slot. While `price` is null — the real figures aren't in
 * yet — this falls back to "prijs op aanvraag" rather than a placeholder, so
 * the page is never wrong, only less specific.
 */
export function formatPackagePrice(pkg: PackageDef, tp: Translator, locale: Locale): string {
  if (pkg.price === null) return tp("labels.priceOnRequest");
  const amount = formatAmount(pkg.price, locale);
  return pkg.priceKind === "from" ? tp("labels.priceFrom", { amount }) : amount;
}

export function buildPackageCardProps(
  pkg: PackageDef,
  tp: Translator,
  locale: Locale,
  labels: PackageCardLabels,
): PackageCardProps {
  return {
    slug: pkg.slug,
    accent: pkg.accent,
    name: tp(`${pkg.slug}.name`),
    recognise: tp(`${pkg.slug}.recognise`),
    promise: tp(`${pkg.slug}.promise`),
    deliverables: tp.raw(`${pkg.slug}.deliverables`) as string[],
    duration: tp(`${pkg.slug}.duration`),
    price: formatPackagePrice(pkg, tp, locale),
    bridge: pkg.hasBridge ? tp(`${pkg.slug}.bridge`) : undefined,
    proofSlug: pkg.proofSlug,
    labels,
  };
}

export interface PackageStep {
  label: string;
  body: string;
}

export function packageSteps(pkg: PackageDef, tp: Translator): PackageStep[] {
  return tp.raw(`${pkg.slug}.steps`) as PackageStep[];
}
