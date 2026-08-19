import { formatAmount, type PackageDef } from "@/lib/packages";
import type { PackageCardLabels, PackageCardProps } from "@/components/PackageCard";
import type { FaqItem } from "@/components/Faq";
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
 * Renders the price slot: the discounted price when a launch discount is on,
 * the regular price otherwise. A null price falls back to "prijs op
 * aanvraag" rather than a placeholder, so the page is never wrong, only less
 * specific.
 */
export function formatPackagePrice(pkg: PackageDef, tp: Translator, locale: Locale): string {
  const charged = pkg.discountPrice ?? pkg.price;
  if (charged === null) return tp("labels.priceOnRequest");
  const amount = formatAmount(charged, locale);
  return pkg.priceKind === "from" ? tp("labels.priceFrom", { amount }) : amount;
}

/** The pre-discount price, formatted — rendered struck through in grey next
 *  to the discounted one. Undefined when no discount is running. */
export function formatOriginalPrice(pkg: PackageDef, locale: Locale): string | undefined {
  if (pkg.discountPrice == null || pkg.price === null) return undefined;
  return formatAmount(pkg.price, locale);
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
    originalPrice: formatOriginalPrice(pkg, locale),
    bridge: pkg.hasBridge ? tp(`${pkg.slug}.bridge`) : undefined,
    proofSlug: pkg.proofSlug,
    labels,
  };
}

/**
 * The four practical questions on a package detail page (price, lead time,
 * deliverables, scope), with every answer derived from the package definition
 * and its existing translations — so the visible FAQ and its FAQPage schema
 * can never drift from what the rest of the page says.
 */
export function buildPackageFaq(pkg: PackageDef, tp: Translator, locale: Locale): FaqItem[] {
  const name = tp(`${pkg.slug}.name`);
  const charged = pkg.discountPrice ?? pkg.price;
  const priceAnswer =
    charged === null
      ? tp("labels.faq.aPriceOnRequest")
      : tp(pkg.priceKind === "from" ? "labels.faq.aPriceFrom" : "labels.faq.aPriceFixed", {
          name,
          amount: formatAmount(charged, locale),
        });
  const deliverables = tp.raw(`${pkg.slug}.deliverables`) as string[];
  const notIncluded = tp.raw(`${pkg.slug}.notIncluded`) as string[];
  return [
    { q: tp("labels.faq.qPrice", { name }), a: priceAnswer },
    {
      q: tp("labels.faq.qDuration", { name }),
      a: tp("labels.faq.aDuration", { duration: tp(`${pkg.slug}.duration`) }),
    },
    {
      q: tp("labels.faq.qDeliverables"),
      a: tp("labels.faq.aDeliverables", { items: deliverables.join("; ") }),
    },
    {
      q: tp("labels.faq.qNotIncluded"),
      a: tp("labels.faq.aNotIncluded", { items: notIncluded.join("; ") }),
    },
  ];
}

export interface PackageStep {
  label: string;
  body: string;
}

export function packageSteps(pkg: PackageDef, tp: Translator): PackageStep[] {
  return tp.raw(`${pkg.slug}.steps`) as PackageStep[];
}
