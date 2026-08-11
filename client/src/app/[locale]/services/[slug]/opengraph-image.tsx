import { getTranslations } from "next-intl/server";
import { getPackage } from "@/lib/packages";
import { formatPackagePrice } from "@/lib/packageContent";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import type { Locale } from "@/i18n/routing";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Ruud Juffermans — diensten";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) {
    return renderOgImage({
      eyebrow: locale === "nl" ? "Diensten" : "Services",
      title: "Ruud Juffermans",
    });
  }
  const tp = await getTranslations({ locale, namespace: "packages" });
  return renderOgImage({
    eyebrow: locale === "nl" ? "Diensten" : "Services",
    title: tp(`${pkg.slug}.name`),
    meta: `${formatPackagePrice(pkg, tp, locale)} · ${tp(`${pkg.slug}.duration`)}`,
  });
}
