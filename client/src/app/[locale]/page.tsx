import { Box, Container, Typography, Button, Card, CardContent, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorageIcon from "@mui/icons-material/StorageOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeOutlined";
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
    { title: t("problem.card1Title"), description: t("problem.card1Body") },
    { title: t("problem.card2Title"), description: t("problem.card2Body") },
    { title: t("problem.card3Title"), description: t("problem.card3Body") },
  ];

  const servicesList = [
    {
      icon: <StorageIcon sx={{ fontSize: 28 }} />,
      title: t("services.service1Title"),
      description: t("services.service1Body"),
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
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
          pt: { xs: 12, md: 20 },
          pb: { xs: 12, md: 18 },
          overflow: "hidden",
          // Restrained backdrop: one soft brand glow + a faint dot grid that
          // fades out toward the content, instead of the loud red circles.
          "&::before": {
            content: '""',
            position: "absolute",
            top: -280,
            right: -160,
            width: 720,
            height: 720,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${palette.redMuted} 0%, transparent 62%)`,
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(var(--app-gray-200) 1px, transparent 1px)`,
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 90% 70% at 80% 10%, black 0%, transparent 68%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 80% 10%, black 0%, transparent 68%)",
            opacity: 0.7,
            pointerEvents: "none",
          },
        }}
      >
        <Container sx={{ position: "relative" }}>
          <Box sx={{ maxWidth: 820 }}>
            <Reveal variant="rise" delay={0}>
              <Typography variant="overline" sx={{ mb: 2.5, display: "block" }}>
                {t("hero.eyebrow")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={120}>
              <Typography variant="h1" sx={{ mb: 3.5 }}>
                {t("hero.title")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={240}>
              <Typography variant="subtitle1" sx={{ mb: 6, maxWidth: 620 }}>
                {t("hero.subtitle")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={360}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/contact"
                  sx={{ px: 6, width: { xs: "100%", sm: "auto" } }}
                >
                  {t("hero.ctaPrimary")}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/portfolio"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 6, width: { xs: "100%", sm: "auto" } }}
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </Box>
            </Reveal>
          </Box>
        </Container>
      </Box>

      {/* Services Overview */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          backgroundColor: palette.offWhite,
          borderTop: `1px solid var(--app-border-soft)`,
          borderBottom: `1px solid var(--app-border-soft)`,
        }}
      >
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
              {t("services.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: { xs: 5, md: 8 }, maxWidth: 600 }}>
              {t("services.title")}
            </Typography>
          </Reveal>
          <Grid container spacing={{ xs: 2.5, md: 4 }}>
            {servicesList.map((service, i) => (
              <Grid size={{ xs: 12, md: 6 }} key={service.title}>
                <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                  <Card
                    component={Link}
                    href="/services"
                    sx={{ height: "100%", cursor: "pointer" }}
                  >
                    <CardContent sx={{ p: { xs: 4, md: 6 }, "&:last-child": { pb: { xs: 4, md: 6 } } }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "16px",
                          background: `linear-gradient(135deg, ${palette.redMuted}, transparent 130%)`,
                          border: `1px solid ${palette.redMuted}`,
                          color: palette.red,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3.5,
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography variant="h4" sx={{ mb: 1.5 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
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

      {/* How I Work — ghost-numbered steps, no card chrome */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
              {t("process.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: { xs: 5, md: 8 }, maxWidth: 600 }}>
              {t("process.title")}
            </Typography>
          </Reveal>
          <Grid container spacing={{ xs: 0, sm: 5, md: 6 }}>
            {steps.map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.step}>
                <Reveal variant="rise" delay={i * 100} sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      height: "100%",
                      position: "relative",
                      py: { xs: 3.5, sm: 0 },
                      pl: { xs: 0, sm: 0 },
                      borderTop: {
                        xs: i > 0 ? `1px solid var(--app-border-soft)` : "none",
                        sm: "none",
                      },
                    }}
                  >
                    <Typography
                      aria-hidden
                      sx={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: { xs: "2.6rem", md: "3.2rem" },
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        color: "transparent",
                        WebkitTextStroke: `1.5px ${palette.red}`,
                        opacity: 0.55,
                        mb: 2,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.step}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 1.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1">{item.description}</Typography>
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Problem Statement */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          backgroundColor: palette.offWhite,
          borderTop: `1px solid var(--app-border-soft)`,
          borderBottom: `1px solid var(--app-border-soft)`,
        }}
      >
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
              {t("problem.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: { xs: 5, md: 8 }, maxWidth: 600 }}>
              {t("problem.title")}
            </Typography>
          </Reveal>
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {problemCards.map((card, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={card.title}>
                <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                  <Card
                    sx={{
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: `linear-gradient(to right, ${palette.red}, transparent 70%)`,
                        opacity: 0.6,
                        transition: "opacity 0.3s",
                      },
                      "@media (hover: hover)": {
                        "&:hover::before": { opacity: 1 },
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 4, md: 5 }, "&:last-child": { pb: { xs: 4, md: 5 } } }}>
                      <Typography variant="h4" sx={{ mb: 1.5 }}>
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
            <Typography
              variant="body1"
              sx={{ mt: 5, fontWeight: 500, color: palette.gray900, maxWidth: 700 }}
            >
              {t("problem.closer")}
            </Typography>
          </Reveal>
        </Container>
      </Box>

      {/* Latest Articles */}
      {posts.length > 0 && (
        <Box sx={{ py: { xs: 10, md: 14 } }}>
          <Container>
            <Reveal variant="rise">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  mb: { xs: 5, md: 8 },
                }}
              >
                <Box>
                  <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
                    {t("blog.eyebrow")}
                  </Typography>
                  <Typography variant="h2">{t("blog.title")}</Typography>
                </Box>
                <Button
                  component={Link}
                  href="/blog"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ display: { xs: "none", sm: "inline-flex" }, flexShrink: 0 }}
                >
                  {t("blog.all")}
                </Button>
              </Box>
            </Reveal>
            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {posts.map((post, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={post.slug}>
                  <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                    <Card
                      component={Link}
                      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                      sx={{ height: "100%", cursor: "pointer" }}
                    >
                      <CardContent sx={{ p: { xs: 4, md: 5 }, "&:last-child": { pb: { xs: 4, md: 5 } } }}>
                        <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
                          {post.tags.slice(0, 2).map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                        <Typography variant="h4" sx={{ mb: 1.5 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2.5, color: palette.gray500 }}>
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
                </Grid>
              ))}
            </Grid>
            <Button
              component={Link}
              href="/blog"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 4, display: { xs: "inline-flex", sm: "none" } }}
            >
              {t("blog.all")}
            </Button>
          </Container>
        </Box>
      )}

      {/* CTA Banner — navy panel, identical in both color schemes */}
      <Box sx={{ pb: { xs: 10, md: 14 }, pt: { xs: 2, md: 4 } }}>
        <Container>
          <Reveal variant="zoom">
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: { xs: 5, md: 7 },
                backgroundColor: palette.navy,
                backgroundImage: `radial-gradient(ellipse 80% 90% at 85% -10%, rgba(221, 46, 90, 0.28), transparent 60%), linear-gradient(${palette.navyLight}, ${palette.navy})`,
                border: "1px solid rgba(255,255,255,0.08)",
                px: { xs: 4, md: 10 },
                py: { xs: 9, md: 13 },
                textAlign: "center",
              }}
            >
              <Typography variant="h2" sx={{ mb: 2.5, color: palette.white }}>
                {t("cta.title")}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mb: 6, color: "rgba(255,255,255,0.65)", maxWidth: 560, mx: "auto" }}
              >
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
                  sx={{
                    px: 7,
                    width: { xs: "100%", sm: "auto" },
                    maxWidth: 360,
                    color: palette.white,
                    borderColor: "rgba(255,255,255,0.28)",
                    "@media (hover: hover)": {
                      "&:hover": {
                        borderColor: palette.white,
                        backgroundColor: "rgba(255,255,255,0.08)",
                      },
                    },
                  }}
                >
                  {t("cta.secondary")}
                </Button>
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
