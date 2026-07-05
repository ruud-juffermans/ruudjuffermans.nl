import { Box, Container, Typography, Card, CardContent, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import { getPortfolioItems } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");
  const items = getPortfolioItems(locale);

  return (
    <>
      <Box sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 6, md: 9 } }}>
        <Container>
          <Box sx={{ maxWidth: 700 }}>
            <Reveal variant="rise" delay={0}>
              <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                {t("eyebrow")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={100}>
              <Typography variant="h1" sx={{ mb: 3 }}>
                {t("title")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={200}>
              <Typography variant="subtitle1">{t("subtitle")}</Typography>
            </Reveal>
          </Box>
        </Container>
      </Box>

      <Box sx={{ pb: { xs: 10, md: 14 } }}>
        <Container>
          {items.length === 0 ? (
            <Reveal variant="zoom">
              <Box
                sx={{
                  textAlign: "center",
                  py: 10,
                  px: 4,
                  backgroundColor: palette.offWhite,
                  borderRadius: 4,
                }}
              >
                <Typography variant="h3" sx={{ mb: 2 }}>
                  {t("empty.title")}
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 500, mx: "auto" }}>
                  {t("empty.body")}
                </Typography>
              </Box>
            </Reveal>
          ) : (
            <Grid container spacing={3}>
              {items.map((item, i) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.slug}>
                  <Reveal variant="rise" delay={(i % 2) * 100} sx={{ height: "100%" }}>
                  <Card
                    component={Link}
                    href={{ pathname: "/portfolio/[slug]", params: { slug: item.slug } }}
                    sx={{ height: "100%", cursor: "pointer" }}
                  >
                    <CardContent sx={{ p: { xs: 4, md: 6 }, "&:last-child": { pb: { xs: 4, md: 6 } } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 3,
                        }}
                      >
                        <Chip
                          label={item.industry}
                          size="small"
                          sx={{
                            backgroundColor: palette.redMuted,
                            color: palette.red,
                            fontWeight: 600,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: palette.gray400 }}>
                          {item.duration}
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ mb: 1.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {item.summary}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                        {item.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: palette.red,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {t("view")} <ArrowForwardIcon sx={{ fontSize: 16 }} />
                      </Typography>
                    </CardContent>
                  </Card>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
