import { Box, Container, Typography, Button, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorageIcon from "@mui/icons-material/StorageOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeOutlined";
import HandshakeIcon from "@mui/icons-material/HandshakeOutlined";
import TuneIcon from "@mui/icons-material/TuneOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBookOutlined";
import EuroIcon from "@mui/icons-material/EuroOutlined";
import ShieldIcon from "@mui/icons-material/ShieldOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import HeroCircles from "@/components/HeroCircles";
import TechMarquee from "@/components/TechMarquee";
import BlogCard from "@/components/BlogCard";
import ServicesShowcase from "@/components/ServicesShowcase";
import FlowLines from "@/components/FlowLines";
import UnderTheHood from "@/components/UnderTheHood";
import Availability from "@/components/Availability";
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
      key: "analytics",
      icon: <StorageIcon sx={{ fontSize: 24 }} />,
      title: t("services.service1Title"),
      learnMore: t("services.learnMore", { topic: t("services.service1Title") }),
      flow: {
        sources: [
          t("services.flow.analytics.src1"),
          t("services.flow.analytics.src2"),
          t("services.flow.analytics.src3"),
        ] as [string, string, string],
        hub: {
          label: t("services.flow.analytics.hubLabel"),
          title: t("services.flow.analytics.hubTitle"),
        },
        outputs: [
          {
            label: t("services.flow.analytics.out1Label"),
            title: t("services.flow.analytics.out1Title"),
          },
          {
            label: t("services.flow.analytics.out2Label"),
            title: t("services.flow.analytics.out2Title"),
          },
        ] as [{ label: string; title: string }, { label: string; title: string }],
      },
    },
    {
      key: "ai",
      icon: <AutoAwesomeIcon sx={{ fontSize: 24 }} />,
      title: t("services.service2Title"),
      learnMore: t("services.learnMore", { topic: t("services.service2Title") }),
      flow: {
        sources: [
          t("services.flow.ai.src1"),
          t("services.flow.ai.src2"),
          t("services.flow.ai.src3"),
        ] as [string, string, string],
        hub: {
          label: t("services.flow.ai.hubLabel"),
          title: t("services.flow.ai.hubTitle"),
        },
        outputs: [
          {
            label: t("services.flow.ai.out1Label"),
            title: t("services.flow.ai.out1Title"),
          },
          {
            label: t("services.flow.ai.out2Label"),
            title: t("services.flow.ai.out2Title"),
          },
        ] as [{ label: string; title: string }, { label: string; title: string }],
      },
    },
  ];

  const hoodVariants = ["ai", "analytics"].map((key) => ({
    key,
    toggleLabel: t(key === "ai" ? "underhood.toggleAi" : "underhood.toggleAnalytics"),
    eyebrow: t("underhood.eyebrow"),
    title: t(`underhood.${key}.title`),
    sub: t(`underhood.${key}.sub`),
    codeNote: t(`underhood.${key}.codeNote`),
    features: [
      { icon: "✓", title: t(`underhood.${key}.f1Title`), desc: t(`underhood.${key}.f1Body`) },
      { icon: "⎇", title: t(`underhood.${key}.f2Title`), desc: t(`underhood.${key}.f2Body`) },
      { icon: "⌕", title: t(`underhood.${key}.f3Title`), desc: t(`underhood.${key}.f3Body`) },
      { icon: "🔒", title: t(`underhood.${key}.f4Title`), desc: t(`underhood.${key}.f4Body`) },
    ],
  }));

  const whyFreelanceCards = [
    { icon: <HandshakeIcon sx={{ fontSize: 21 }} />, key: "card1" },
    { icon: <TuneIcon sx={{ fontSize: 21 }} />, key: "card2" },
    { icon: <MenuBookIcon sx={{ fontSize: 21 }} />, key: "card3" },
    { icon: <EuroIcon sx={{ fontSize: 21 }} />, key: "card4" },
    { icon: <ShieldIcon sx={{ fontSize: 21 }} />, key: "card5" },
    { icon: <WorkspacePremiumIcon sx={{ fontSize: 21 }} />, key: "card6" },
  ].map(({ icon, key }) => ({
    icon,
    title: t(`whyFreelance.${key}Title`),
    description: t(`whyFreelance.${key}Body`),
  }));

  // ── Flow backdrop ─────────────────────────────────────────────────────────
  // The scrolling line animation lives inside the "How I Work" section only —
  // <FlowLines /> sizes itself to whichever wrapper holds it, so its span is
  // set by placement, not by hiding it elsewhere. Layering inside that section:
  // its own background, then the lines, then the same background again at
  // 100 - FLOW_SHOW percent, then the content.
  const FLOW_SHOW = 55;
  const FLOW_BG = "var(--app-bg)";

  const steps = [
    { step: "01", title: t("process.step1Title"), description: t("process.step1Body") },
    { step: "02", title: t("process.step2Title"), description: t("process.step2Body") },
    { step: "03", title: t("process.step3Title"), description: t("process.step3Body") },
    { step: "04", title: t("process.step4Title"), description: t("process.step4Body") },
  ];

  return (
    <>
      {/* Hero — sits above the flow backdrop, which starts below it */}
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
        <HeroCircles />
        <Container sx={{ position: "relative" }}>
          <Box sx={{ maxWidth: 820 }}>
            <Reveal variant="rise" delay={0}>
              <Box sx={{ mb: 3 }}>
                <Availability variant="hero" />
              </Box>
            </Reveal>
            <Reveal variant="rise" delay={60}>
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
                  sx={{
                    px: 6,
                    width: { xs: "100%", sm: "auto" },
                    // Solid white pill in both schemes, so text is pinned to a
                    // dark ink rather than the scheme's text token.
                    backgroundColor: "#FFFFFF",
                    color: "#0F172A",
                    borderColor: "#FFFFFF",
                    boxShadow: "0 1px 2px rgba(11,17,32,0.12)",
                    "@media (hover: hover)": {
                      "&:hover": {
                        backgroundColor: "#FFFFFF",
                        borderColor: "var(--app-red)",
                        color: "var(--app-red)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 10px 28px rgba(11,17,32,0.14)",
                      },
                    },
                  }}
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </Box>
            </Reveal>
            <Reveal variant="fade" delay={480}>
              <TechMarquee label={t("hero.toolsLabel")} />
            </Reveal>
          </Box>
        </Container>
      </Box>

      {/* Services Overview — "Van kennis naar antwoord"-style band: deep
          brand-dark background with a soft dot grid, copy left, flow right */}
      <Box
        sx={{
          py: { xs: 10, md: 13 },
          backgroundColor: "#420D22",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(247, 166, 188, 0.16) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 70% 90% at 70% 50%, #000, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 90% at 70% 50%, #000, transparent 75%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container sx={{ position: "relative" }}>
          <Reveal variant="rise">
            <ServicesShowcase
              eyebrow={t("services.eyebrow")}
              title={t("services.title")}
              subtitle={t("services.subtitle")}
              services={servicesList}
            />
          </Reveal>
        </Container>
      </Box>

      {/* How I Work — ghost-numbered steps, no card chrome, and the only
          section carrying the flowing-line backdrop */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          position: "relative",
          overflow: "hidden",
          backgroundColor: FLOW_BG,
          // Second pass of the background, over the lines: this alone decides
          // how much of the animation reads through.
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: FLOW_BG,
            opacity: (100 - FLOW_SHOW) / 100,
            pointerEvents: "none",
          },
          "& > .MuiContainer-root": { position: "relative", zIndex: 1 },
        }}
      >
        <FlowLines />
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

      {/* Projects — dark section with toggleable code panel */}
      <UnderTheHood variants={hoodVariants} allProjectsLabel={t("projects.all")} />

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

      {/* Why a freelancer — six-card band, ported from datavakwerk.nl's
          "Waarom een zzp'er" section */}
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
              {t("whyFreelance.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: 2, maxWidth: 600 }}>
              {t("whyFreelance.title")}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: { xs: 5, md: 8 }, maxWidth: 620 }}
            >
              {t("whyFreelance.subtitle")}
            </Typography>
          </Reveal>
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {whyFreelanceCards.map((card, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
                {/* stagger per row, like the source section */}
                <Reveal variant="rise" delay={(i % 3) * 90} sx={{ height: "100%" }}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent
                      sx={{
                        p: { xs: 3.5, md: 4 },
                        "&:last-child": { pb: { xs: 3.5, md: 4 } },
                      }}
                    >
                      {/* Navy tile with a brand-pink glyph: absolute colors, so
                          it reads the same in both schemes. */}
                      <Box
                        aria-hidden
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2.5,
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: palette.navy,
                          color: "#f7a6bc",
                          mb: 2,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body1">{card.description}</Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Latest Articles */}
      {posts.length > 0 && (
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
            <Grid container spacing={2.5}>
              {posts.map((post, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.slug}>
                  <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                    <BlogCard
                      post={post}
                      meta={`${post.date} · ${post.readingTime} ${tc("readingTimeSuffix")}`}
                    />
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

      {/* CTA — full-bleed dark section that blends into the footer (same
          #070B15); the radial glow rises from the bottom edge */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#070B15",
          py: { xs: 12, md: 15 },
          textAlign: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(640px 340px at 50% 115%, rgba(221, 46, 90, 0.35), transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container sx={{ position: "relative" }}>
          <Reveal variant="rise">
            <Typography
              variant="h2"
              sx={{
                color: palette.white,
                fontSize: "clamp(32px, 5vw, 56px)",
                maxWidth: 720,
                mx: "auto",
              }}
            >
              {t("cta.title")}
            </Typography>
            <Typography
              sx={{ mt: 2.25, mb: 6, color: "#a3a3a3", fontSize: 17, maxWidth: 560, mx: "auto" }}
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
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
