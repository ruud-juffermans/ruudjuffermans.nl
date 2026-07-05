import { Box, Container, Typography, Chip, Button } from "@mui/material";
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
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const skills: Record<"data" | "ai" | "engineering" | "tools", string[]> = {
  data: ["Power BI", "Data modeling", "ETL", "Data visualization", "KPI frameworks"],
  ai: ["LLMs", "RAG", "Prompt engineering", "AI agents", "Document processing"],
  engineering: ["Python", "SQL", "PostgreSQL", "API development", "Azure"],
  tools: ["Claude", "ChatGPT", "Copilot", "Power Query", "DAX"],
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const timeline = t.raw("timeline") as { year: string; label: string }[];

  return (
    <>
      <Box sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 8, md: 10 } }}>
        <Container>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 7 }}>
              <Reveal variant="rise" delay={0}>
                <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                  {t("eyebrow")}
                </Typography>
                <Typography variant="h1" sx={{ mb: 4 }}>
                  {t("name")}
                </Typography>
              </Reveal>
              <Reveal variant="rise" delay={140}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {t("intro1")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {t("intro2")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {t("intro3")}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: palette.gray900 }}>
                  {t("pullQuote")}
                </Typography>
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Reveal variant="slide-left" delay={200}>
              <Box
                sx={{
                  backgroundColor: palette.offWhite,
                  borderRadius: "20px",
                  p: { xs: 4, md: 5 },
                  border: `1px solid var(--app-border-soft)`,
                }}
              >
                <Typography variant="overline" sx={{ mb: 3, display: "block" }}>
                  {t("expertiseTitle")}
                </Typography>
                {(Object.keys(skills) as Array<keyof typeof skills>).map((category) => (
                  <Box key={category} sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: palette.gray900, mb: 1 }}
                    >
                      {t(`skills.${category}`)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                      {skills[category].map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.8rem" }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Timeline */}
      <Box
        sx={{
          py: { xs: 9, md: 13 },
          backgroundColor: palette.offWhite,
          borderTop: `1px solid var(--app-border-soft)`,
          borderBottom: `1px solid var(--app-border-soft)`,
        }}
      >
        <Container maxWidth="md">
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
              {t("timelineEyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: 6 }}>
              {t("timelineTitle")}
            </Typography>
          </Reveal>
          <Box>
            {timeline.map((item, i) => (
              <Reveal variant="slide-left" delay={i * 120} key={item.year}>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  pb: i < timeline.length - 1 ? 4 : 0,
                  position: "relative",
                  "&::before":
                    i < timeline.length - 1
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 32,
                          top: 28,
                          bottom: 0,
                          width: 2,
                          backgroundColor: palette.gray200,
                        }
                      : {},
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: palette.red,
                    minWidth: 48,
                    pt: 0.3,
                  }}
                >
                  {item.year}
                </Typography>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: palette.red,
                    mt: 1,
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                />
                <Typography variant="body1" sx={{ color: palette.gray700, pt: 0.1 }}>
                  {item.label}
                </Typography>
              </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

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
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/contact"
                sx={{ px: 7, width: { xs: "100%", sm: "auto" }, maxWidth: 360 }}
              >
                {t("cta.primary")}
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/services"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 7, width: { xs: "100%", sm: "auto" }, maxWidth: 360 }}
              >
                {t("cta.secondary")}
              </Button>
            </Box>
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
