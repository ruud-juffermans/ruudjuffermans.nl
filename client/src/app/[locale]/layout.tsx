import type { Metadata } from "next";
// Self-hosted fonts (no CDN) — bundled from node_modules into the build.
// The variable font families are referenced via --font-heading / --font-body,
// which are defined in the MUI theme's CssBaseline.
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/outfit";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      type: "website",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      siteName: t("siteName"),
    },
    alternates: {
      languages: {
        nl: "/",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <InitColorSchemeScript
          defaultMode="system"
          attribute="data-mui-color-scheme"
          modeStorageKey="ruudjuf-color-mode"
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <ThemeRegistry>
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
