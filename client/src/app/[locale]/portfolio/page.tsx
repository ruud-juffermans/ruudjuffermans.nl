import { Box, Container, Typography, Card, CardContent, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
      <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 } }}>
        <Container>
          <Box sx={{ maxWidth: 700 }}>
            <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
              {t("eyebrow")}
            </Typography>
            <Typography variant="h1" sx={{ mb: 3 }}>
              {t("title")}
            </Typography>
            <Typography variant="subtitle1">{t("subtitle")}</Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ pb: { xs: 8, md: 12 } }}>
        <Container>
          {items.length === 0 ? (
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
          ) : (
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.slug}>
                  <Card
                    component={Link}
                    href={{ pathname: "/portfolio/[slug]", params: { slug: item.slug } }}
                    sx={{ height: "100%", cursor: "pointer" }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
