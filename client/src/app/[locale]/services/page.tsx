import { Box, Container, Typography, Card, CardContent, Button, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

type ServiceKey =
  | "dataTransformation"
  | "dashboards"
  | "analysis"
  | "engineering"
  | "genai"
  | "aiStrategy"
  | "modelDevelopment"
  | "automation"
  | "training";

const structure: { categoryKey: "data" | "ai" | "knowledge"; items: ServiceKey[] }[] = [
  { categoryKey: "data", items: ["dataTransformation", "dashboards", "analysis", "engineering"] },
  { categoryKey: "ai", items: ["genai", "aiStrategy", "modelDevelopment", "automation"] },
];

const categoryColors: Record<string, string> = {
  data: palette.red,
  ai: "#8B5CF6",
  knowledge: "#10B981",
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      {/* Hero */}
      <Box sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 6, md: 9 } }}>
        <Container>
          <Box sx={{ maxWidth: 700 }}>
            <Reveal variant="rise" delay={0}>
              <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                {t("hero.eyebrow")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={100}>
              <Typography variant="h1" sx={{ mb: 3 }}>
                {t("hero.title")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={200}>
              <Typography variant="subtitle1">{t("hero.subtitle")}</Typography>
            </Reveal>
          </Box>
        </Container>
      </Box>

      {/* Services */}
      {structure.map(({ categoryKey, items }) => (
        <Box
          key={categoryKey}
          sx={{
            py: { xs: 8, md: 11 },
            backgroundColor: categoryKey === "data" ? palette.offWhite : "transparent",
            borderTop: categoryKey === "data" ? `1px solid var(--app-border-soft)` : "none",
            borderBottom: categoryKey === "data" ? `1px solid var(--app-border-soft)` : "none",
          }}
        >
          <Container>
            <Reveal variant="rise">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 32,
                    borderRadius: 2,
                    backgroundColor: categoryColors[categoryKey],
                  }}
                />
                <Typography variant="h2">{t(`categories.${categoryKey}`)}</Typography>
              </Box>
            </Reveal>
            <Grid container spacing={3}>
              {items.map((key, i) => {
                const deliverables = t.raw(`items.${key}.deliverables`) as string[];
                return (
                  <Grid size={{ xs: 12, md: 6 }} key={key}>
                    <Reveal variant="rise" delay={i * 100} sx={{ height: "100%" }}>
                      <Card sx={{ height: "100%" }}>
                      <CardContent sx={{ p: { xs: 4, md: 5 }, "&:last-child": { pb: { xs: 4, md: 5 } } }}>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                          {t(`items.${key}.title`)}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          {t(`items.${key}.description`)}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: palette.gray900, mb: 0.5 }}
                        >
                          {t("labels.forWhom")}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {t(`items.${key}.forWhom`)}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: palette.gray900, mb: 1 }}
                        >
                          {t("labels.deliverables")}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                          {deliverables.map((d) => (
                            <Chip key={d} label={d} size="small" variant="outlined" />
                          ))}
                        </Box>

                      </CardContent>
                    </Card>
                    </Reveal>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>
      ))}

      {/* CTA */}
      <Box sx={{ py: { xs: 10, md: 14 }, textAlign: "center" }}>
        <Container maxWidth="md">
          <Reveal variant="zoom">
            <Typography variant="h2" sx={{ mb: 2.5 }}>
              {t("cta.title")}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 6, maxWidth: 560, mx: "auto" }}>
              {t("cta.subtitle")}
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/contact"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 7, width: { xs: "100%", sm: "auto" }, maxWidth: 360 }}
            >
              {t("cta.button")}
            </Button>
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
