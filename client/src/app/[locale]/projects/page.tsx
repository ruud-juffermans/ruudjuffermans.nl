import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { getProjectItems } from "@/lib/content";
import { getPackage } from "@/lib/packages";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";
import SplitText from "@/components/SplitText";
import { palette } from "@/theme/theme";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/projects", locale),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const items = getProjectItems(locale);
  const cardLabels = {
    view: t("view"),
    repo: t("repoLabel"),
  };

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
                <SplitText text={t("title")} />
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
              {items.map((item, i) => {
                const provenPackage = item.proves ? getPackage(item.proves) : undefined;
                return (
                  <Grid size={{ xs: 12, md: 6 }} key={item.slug}>
                    <Reveal variant="rise" delay={(i % 2) * 100} sx={{ height: "100%" }}>
                      <ProjectCard
                        project={item}
                        accent={provenPackage?.accent ?? palette.red}
                        labels={cardLabels}
                      />
                    </Reveal>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
