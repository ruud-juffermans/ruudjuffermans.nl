import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import PageViewTracker from "@/components/PageViewTracker";
import { routing, type Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import type { Metadata } from "next";

// The three service detail pages; content lives in the serviceDetail
// translation namespace under these keys.
const SERVICES = {
  "data-engineering": { accent: "#3B82F6" },
  "data-analytics": { accent: palette.red },
  "ai-genai": { accent: "#8B5CF6" },
} as const;

type ServiceSlug = keyof typeof SERVICES;
const slugs = Object.keys(SERVICES) as ServiceSlug[];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(slug in SERVICES)) return {};
  const t = await getTranslations({ locale, namespace: "serviceDetail" });
  return {
    title: t(`${slug as ServiceSlug}.metaTitle`),
    description: t(`${slug as ServiceSlug}.metaDescription`),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!(slug in SERVICES)) notFound();
  const service = slug as ServiceSlug;
  const { accent } = SERVICES[service];

  const t = await getTranslations("serviceDetail");
  const items = [1, 2, 3, 4].map((i) => ({
    title: t(`${service}.item${i}Title`),
    body: t(`${service}.item${i}Body`),
  }));

  return (
    <>
      <PageViewTracker path={`/services/${service}`} locale={locale} />

      {/* Hero */}
      <Box sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 6, md: 9 } }}>
        <Container>
          <Button
            component={Link}
            href="/services"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4, color: "var(--app-text-secondary)", "&:hover": { color: palette.red } }}
          >
            {t("backToServices")}
          </Button>
          <Box sx={{ maxWidth: 700 }}>
            <Typography variant="overline" sx={{ mb: 2, display: "block", color: accent }}>
              {t(`${service}.eyebrow`)}
            </Typography>
            <Typography variant="h1" sx={{ mb: 3 }}>
              {t(`${service}.title`)}
            </Typography>
            <Typography variant="subtitle1">{t(`${service}.intro`)}</Typography>
          </Box>
        </Container>
      </Box>

      {/* What I do */}
      <Box sx={{ pb: { xs: 8, md: 12 } }}>
        <Container>
          <Typography variant="h3" sx={{ mb: 4 }}>
            {t("whatTitle")}
          </Typography>
          <Grid container spacing={3}>
            {items.map((item, i) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                <Reveal delay={i * 90}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "20px",
                      border: "1px solid var(--app-border-soft)",
                      boxShadow: "none",
                      transition: "border-color 0.25s ease, transform 0.25s ease",
                      "&:hover": {
                        borderColor: accent,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Box
                        aria-hidden
                        sx={{
                          width: 42,
                          height: 42,
                          mb: 2,
                          borderRadius: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                          color: accent,
                          fontFamily: "var(--font-heading)",
                          fontWeight: 800,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </Box>
                      <Typography variant="h5" sx={{ mb: 1.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "var(--app-text-secondary)" }}>
                        {item.body}
                      </Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ pb: { xs: 10, md: 14 } }}>
        <Container>
          <Reveal>
            <Box
              sx={{
                borderRadius: "24px",
                border: "1px solid var(--app-border-soft)",
                background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 8%, var(--app-bg)), var(--app-bg))`,
                p: { xs: 4, md: 7 },
                textAlign: "center",
              }}
            >
              <Typography variant="h3" sx={{ mb: 2 }}>
                {t("ctaTitle")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 4, color: "var(--app-text-secondary)", maxWidth: 480, mx: "auto" }}
              >
                {t("ctaBody")}
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/contact"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 5 }}
              >
                {t("ctaButton")}
              </Button>
            </Box>
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
