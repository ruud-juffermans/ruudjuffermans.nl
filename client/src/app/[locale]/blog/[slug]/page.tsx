import { Box, Container, Typography, Chip, Button, Divider, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getBlogPosts(locale).map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPost(locale, slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getBlogPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations("blog.post");
  const tc = await getTranslations("common");

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Button
          component={Link}
          href="/blog"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: palette.gray500 }}
        >
          {tc("backToBlog")}
        </Button>

        {post.usedFallback && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {t("fallbackNotice")}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {post.meta.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        <Typography variant="h1" sx={{ mb: 1.5, fontSize: { xs: "2rem", md: "2.75rem" } }}>
          {post.meta.title}
        </Typography>

        <Typography variant="body2" sx={{ color: palette.gray400, mb: 4 }}>
          {post.meta.date} &middot; {post.meta.readingTime} {tc("readingTimeSuffix")}
        </Typography>

        <Box
          sx={{
            "& h2": {
              fontFamily: "var(--font-heading)",
              fontSize: "1.5rem",
              fontWeight: 600,
              mt: 4,
              mb: 1,
              color: palette.gray900,
            },
            "& h3": {
              fontFamily: "var(--font-heading)",
              fontSize: "1.2rem",
              fontWeight: 600,
              mt: 3,
              mb: 0.75,
              color: palette.gray900,
            },
            "& p": {
              color: palette.gray600,
            },
            "& ul, & ol": {
              pl: 4,
              mb: 1.5,
              "& li": {
                lineHeight: 1.6,
                color: palette.gray600,
                mb: 0.25,
              },
            },
            "& blockquote": {
              borderLeft: `3px solid ${palette.red}`,
              pl: 2.5,
              ml: 0,
              my: 2,
              "& p": {
                color: palette.gray700,
                fontStyle: "italic",
                mb: 0,
              },
            },
            "& code": {
              backgroundColor: palette.offWhite,
              border: `1px solid ${palette.gray100}`,
              px: 0.7,
              py: 0.2,
              borderRadius: "6px",
              fontSize: "0.85em",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontWeight: 500,
            },
            "& figure[data-rehype-pretty-code-figure]": {
              my: 2.5,
              mx: 0,
              borderRadius: "12px",
              overflow: "hidden",
              border: `1px solid ${palette.gray200}`,
              boxShadow: "0 2px 12px rgba(11, 17, 32, 0.06)",
            },
            "& figcaption[data-rehype-pretty-code-title]": {
              backgroundColor: palette.gray50,
              borderBottom: `1px solid ${palette.gray200}`,
              px: 2,
              py: 1,
              fontSize: "0.75rem",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontWeight: 600,
              color: palette.gray500,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            },
            "& figure[data-rehype-pretty-code-figure] pre": {
              backgroundColor: `${palette.navy} !important`,
              m: 0,
              p: 2.5,
              borderRadius: 0,
              border: "none",
              boxShadow: "none",
              overflowX: "auto",
              "& code": {
                backgroundColor: "transparent",
                border: "none",
                p: 0,
                fontSize: "0.8rem",
                lineHeight: 1.7,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontWeight: 400,
                display: "block",
              },
            },
            "& code[data-line-numbers] > [data-line]::before": {
              counterIncrement: "line",
              content: "counter(line)",
              display: "inline-block",
              width: "1.5rem",
              marginRight: "1.5rem",
              textAlign: "right",
              color: palette.gray600,
              fontSize: "0.8rem",
            },
            "& [data-highlighted-line]": {
              backgroundColor: "rgba(221, 46, 90, 0.1)",
              borderLeft: `2px solid ${palette.red}`,
              pl: "calc(1rem - 2px)",
              mx: -2.5,
              px: 2.5,
            },
            "& pre:not(figure pre)": {
              backgroundColor: palette.navy,
              color: palette.gray200,
              p: 2.5,
              borderRadius: "12px",
              overflowX: "auto",
              mb: 2.5,
              border: `1px solid ${palette.gray200}`,
              boxShadow: "0 2px 12px rgba(11, 17, 32, 0.06)",
              "& code": {
                backgroundColor: "transparent",
                border: "none",
                p: 0,
                color: "inherit",
                fontSize: "0.875rem",
                fontWeight: 400,
              },
            },
            "& a": {
              color: palette.red,
              textDecoration: "underline",
              textDecorationColor: palette.redMuted,
              "&:hover": {
                textDecorationColor: palette.red,
              },
            },
            "& img": {
              maxWidth: "100%",
              borderRadius: "12px",
              my: 2,
            },
            "& hr": {
              border: "none",
              borderTop: `1px solid ${palette.gray100}`,
              my: 3,
            },
            "& strong": {
              color: palette.gray800,
              fontWeight: 600,
            },
          }}
        >
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: "github-dark-default",
                      keepBackground: true,
                      defaultLang: "plaintext",
                    },
                  ],
                ],
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            backgroundColor: palette.offWhite,
            borderRadius: 3,
            p: 3.5,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: 0.75 }}>
            {t("ctaTitle")}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2.5, color: palette.gray500 }}>
            {t("ctaBody")}
          </Typography>
          <Button variant="contained" component={Link} href="/contact">
            {t("ctaButton")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
