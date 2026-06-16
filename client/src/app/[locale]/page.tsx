import { Box, Container, Typography, Button, Card, CardContent, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorageIcon from "@mui/icons-material/StorageOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import { getBlogPosts } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const posts = getBlogPosts(locale).slice(0, 3);

  const problemCards = [
    { title: t("problem.card1Title"), description: t("problem.card1Body"), accent: palette.redLight },
    { title: t("problem.card2Title"), description: t("problem.card2Body"), accent: palette.redGlow },
    { title: t("problem.card3Title"), description: t("problem.card3Body"), accent: "#10B981" },
  ];

  const servicesList = [
    {
      icon: <StorageIcon sx={{ fontSize: 32 }} />,
      title: t("services.service1Title"),
      description: t("services.service1Body"),
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
      title: t("services.service2Title"),
      description: t("services.service2Body"),
    },
  ];

  const steps = [
    { step: "01", title: t("process.step1Title"), description: t("process.step1Body") },
    { step: "02", title: t("process.step2Title"), description: t("process.step2Body") },
    { step: "03", title: t("process.step3Title"), description: t("process.step3Body") },
    { step: "04", title: t("process.step4Title"), description: t("process.step4Body") },
  ];

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 10, md: 16 },
          pb: { xs: 10, md: 14 },
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${palette.redMuted} 0%, transparent 70%)`,
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -200,
            left: -200,
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(221, 46, 90, 0.5) 0%, rgba(221, 46, 90, 0.5) 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Container>
          <Box sx={{ maxWidth: 800 }}>
            <Reveal variant="rise" delay={0}>
              <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                {t("hero.eyebrow")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={120}>
              <Typography variant="h1" sx={{ mb: 3 }}>
                {t("hero.title")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={240}>
              <Typography variant="subtitle1" sx={{ mb: 5, maxWidth: 650 }}>
                {t("hero.subtitle")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={360}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/contact"
                  sx={{ px: 4, py: 1.5 }}
                >
                  {t("hero.ctaPrimary")}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/portfolio"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </Box>
            </Reveal>
          </Box>
        </Container>
      </Box>

        {/* Services Overview */}
        <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: palette.offWhite}}>
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
              {t("services.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: 6, maxWidth: 600 }}>
              {t("services.title")}
            </Typography>
          </Reveal>
          <Grid container spacing={4}>
            {servicesList.map((service, i) => (
              <Grid size={{ xs: 12, md: 6 }} key={service.title}>
                <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                  <Card
                    component={Link}
                    href="/services"
                    sx={{ height: "100%", cursor: "pointer" }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          backgroundColor: palette.redMuted,
                          color: palette.red,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography variant="h4" sx={{ mb: 1.5 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {service.description}
                      </Typography>
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
                        {t("services.learnMore", { topic: service.title })}{" "}
                        <ArrowForwardIcon sx={{ fontSize: 16 }} />
                      </Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How I Work */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
              {t("process.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: 6, maxWidth: 600 }}>
              {t("process.title")}
            </Typography>
          </Reveal>
          <Grid container spacing={4}>
            {steps.map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.step}>
                <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          backgroundColor: palette.redMuted,
                          color: palette.red,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {item.step}
                      </Box>
                      <Typography variant="h4" sx={{ mb: 1.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Problem Statement */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: palette.offWhite }}>
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
              {t("problem.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: 6, maxWidth: 600 }}>
              {t("problem.title")}
            </Typography>
          </Reveal>
          <Grid container spacing={3}>
            {problemCards.map((card, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={card.title}>
                <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderTop: `3px solid ${card.accent}`,
                      borderRadius: "4px 4px 16px 16px",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h4" sx={{ mb: 2 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body1">{card.description}</Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
          <Reveal variant="fade" delay={400}>
            <Typography variant="body1" sx={{ mt: 4, fontWeight: 500, color: palette.gray900 }}>
              {t("problem.closer")}
            </Typography>
          </Reveal>
        </Container>
      </Box>

      {/* Latest Articles */}
      {posts.length > 0 && (
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container>
            <Reveal variant="rise">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  mb: 6,
                }}
              >
                <Box>
                  <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
                    {t("blog.eyebrow")}
                  </Typography>
                  <Typography variant="h2">{t("blog.title")}</Typography>
                </Box>
                <Button
                  component={Link}
                  href="/blog"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  {t("blog.all")}
                </Button>
              </Box>
            </Reveal>
            <Grid container spacing={3}>
              {posts.map((post, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={post.slug}>
                  <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                    <Card
                      component={Link}
                      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                      sx={{ height: "100%", cursor: "pointer" }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                          {post.tags.slice(0, 2).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          ))}
                        </Box>
                        <Typography variant="h4" sx={{ mb: 1.5 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 200, color: palette.gray700 }}>
                          {post.excerpt}
                        </Typography>
                        <Typography variant="body2" sx={{ color: palette.gray400, fontSize: "0.85rem" }}>
                          {post.date} &middot; {post.readingTime} {tc("readingTimeSuffix")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
            <Button
              component={Link}
              href="/blog"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 4, display: { xs: "flex", sm: "none" } }}
            >
              {t("blog.all")}
            </Button>
          </Container>
        </Box>
      )}

      {/* CTA Banner */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          backgroundColor: palette.offWhite,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Reveal variant="zoom">
            <Box
              sx={{
                position: "relative",
                px: { xs: 3, md: 6 },
                py: { xs: 6, md: 8 },
              }}
            >
              {/* Corner brackets — 4 absolutely positioned L-shaped frames */}
              {(
                [
                  { top: 0, left: 0, borderTop: 4, borderLeft: 4 },
                  { top: 0, right: 0, borderTop: 4, borderRight: 4 },
                  { bottom: 0, left: 0, borderBottom: 4, borderLeft: 4},
                  { bottom: 0, right: 0, borderBottom: 4, borderRight: 4},
                ] as const
              ).map((pos, i) => (
                <Box
                  key={i}
                  aria-hidden
                  sx={{
                    position: "absolute",
                    width: { xs: 18, md: 24 },
                    height: { xs: 18, md: 24 },
                    ...pos,
                  }}
                />
              ))}
              <Box sx={{ position: "relative" }}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                {t("cta.title")}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 5 }}>
                {t("cta.subtitle")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Button variant="contained" size="large" component={Link} href="/contact" sx={{ px: 5 }}>
                  {t("cta.primary")}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/services"
                  endIcon={<ArrowForwardIcon />}
                >
                  {t("cta.secondary")}
                </Button>
              </Box>
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
