import { Box, Container, Typography, Card, CardContent, Chip } from "@mui/material";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {posts.map((post) => (
                <Reveal variant="rise" key={post.slug}>
                <Card
                  component={Link}
                  href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                  sx={{ cursor: "pointer" }}
                >
                  <CardContent sx={{ p: { xs: 4, md: 6 }, "&:last-child": { pb: { xs: 4, md: 6 } } }}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
                      {post.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {post.excerpt}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.gray400, fontSize: "0.85rem" }}
                    >
                      {post.date} &middot; {post.readingTime} {tc("readingTimeSuffix")}
                    </Typography>
                  </CardContent>
                </Card>
                </Reveal>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
