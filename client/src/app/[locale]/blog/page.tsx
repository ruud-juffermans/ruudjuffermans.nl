import { Box, Container, Typography, Card, CardContent, Chip } from "@mui/material";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
        <Container maxWidth="lg">
          {posts.length === 0 ? (
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {posts.map((post) => (
                <Card
                  key={post.slug}
                  component={Link}
                  href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                  sx={{ cursor: "pointer" }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
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
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
