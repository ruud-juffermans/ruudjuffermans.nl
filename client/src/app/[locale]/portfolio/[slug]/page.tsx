import { Box, Container, Typography, Chip, Button, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPortfolioItem, getPortfolioItems } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import PageViewTracker from "@/components/PageViewTracker";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPortfolioItems(locale).map((item) => ({ locale, slug: item.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = getPortfolioItem(locale, slug);
  if (!item) return {};
  return {
    title: item.meta.title,
    description: item.meta.summary,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = getPortfolioItem(locale, slug);
  if (!item) notFound();

  const t = await getTranslations("portfolio");
  const tc = await getTranslations("common");

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <PageViewTracker path={`/portfolio/${slug}`} locale={locale} />
      <Container maxWidth="md">
        <Button
          component={Link}
          href="/portfolio"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: palette.gray500 }}
        >
          {tc("backToPortfolio")}
        </Button>

        {item.usedFallback && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {t("detail.fallbackNotice")}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {item.meta.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        <Typography variant="h1" sx={{ mb: 1.5, fontSize: { xs: "2rem", md: "2.75rem" } }}>
          {item.meta.title}
        </Typography>

        <Box sx={{ display: "flex", gap: 3, mb: 4, color: palette.gray400 }}>
          <Typography variant="body2">{item.meta.industry}</Typography>
          <Typography variant="body2">{item.meta.duration}</Typography>
        </Box>

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
              fontSize: "1rem",
              lineHeight: 1.65,
              color: palette.gray600,
              mb: 1.5,
            },
            "& ul, & ol": {
              pl: 2.5,
              mb: 1.5,
              "& li": {
                fontSize: "1rem",
                lineHeight: 1.6,
                color: palette.gray600,
                mb: 0.25,
              },
            },
            "& strong": {
              color: palette.gray800,
              fontWeight: 600,
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
                fontSize: "0.875rem",
                lineHeight: 1.7,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontWeight: 400,
                display: "block",
              },
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
          }}
        >
          <MDXRemote
            source={item.content}
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
      </Container>
    </Box>
  );
}
