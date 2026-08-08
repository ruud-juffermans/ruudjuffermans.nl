import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Reveal from "@/components/Reveal";
import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tc = await getTranslations("common");
  const posts = getBlogPosts(locale);

  return (
    <>
      <Box sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 6, md: 9 } }}>
        <Container>
          <Box sx={{ maxWidth: 800 }}>
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
        <Container maxWidth="lg">
          {posts.length === 0 ? (
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
            <Grid container spacing={2.5}>
              {posts.map((post, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.slug}>
                  <Reveal variant="rise" delay={i * 100} sx={{ height: "100%" }}>
                    <BlogCard
                      post={post}
                      meta={`${post.date} · ${post.readingTime} ${tc("readingTimeSuffix")}`}
                    />
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
