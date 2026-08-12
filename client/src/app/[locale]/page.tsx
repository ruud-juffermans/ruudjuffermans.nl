import { Box, Container, Typography, Button, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorageIcon from "@mui/icons-material/StorageOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeOutlined";
import HandshakeIcon from "@mui/icons-material/HandshakeOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBookOutlined";
import EuroIcon from "@mui/icons-material/EuroOutlined";
import ShieldIcon from "@mui/icons-material/ShieldOutlined";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import HeroCircles from "@/components/HeroCircles";
import TechMarquee from "@/components/TechMarquee";
import BlogCard from "@/components/BlogCard";
import ServicesShowcase from "@/components/ServicesShowcase";
import FlowLines from "@/components/FlowLines";
import UnderTheHood from "@/components/UnderTheHood";
import Availability from "@/components/Availability";
import ProofStrip from "@/components/ProofStrip";
import PackageCard from "@/components/PackageCard";
import WhyFreelanceAccordion from "@/components/WhyFreelanceAccordion";
import { FEATURED_PACKAGE, PACKAGES, packagesInPhase } from "@/lib/packages";
import {
  buildPackageCardProps,
  formatOriginalPrice,
  formatPackagePrice,
  packageCardLabels,
} from "@/lib/packageContent";
import { getBlogPosts } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { buildAlternates, formatDate, SITE_URL } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    // `absolute` bypasses the layout's "%s | Ruud Juffermans" template, which
    // would otherwise repeat the name that's already in this title.
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: buildAlternates("/", locale),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  // The page renders in parallel with the [locale] layout, so its guard
  // doesn't protect this component. Unknown single-segment paths with a dot
  // (/llms.txt — dotted paths skip the middleware) land here with the path
  // as `locale`, and Intl.NumberFormat in the price formatting throws on it.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tp = await getTranslations("packages");
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

  // The three portfolio projects, toggled in the dark "Under the hood"
  // section. Each variant links to its write-up on this site and to the repo.
  // Icons follow the features: grid/check/swap for the modelling project,
  // stream/window/live for the streaming one, section-sign/refusal/search
  // for the case-law RAG.
  const hoodIcons: Record<string, [string, string, string]> = {
    "open-data-warehouse": ["▦", "✓", "⇄"],
    "ov-streaming-pipeline": ["≋", "⧖", "◉"],
    "strafrecht-rag": ["§", "⊘", "⌕"],
  };
  const hoodVariants = [
    { key: "open-data-warehouse", github: "https://github.com/datavakwerk/open-data-warehouse" },
    { key: "ov-streaming-pipeline", github: "https://github.com/datavakwerk/ov-streaming-pipeline" },
    { key: "strafrecht-rag", github: "https://github.com/datavakwerk/strafrecht-rag" },
  ].map(({ key, github }) => ({
    key,
    github,
    toggleLabel: t(`underhood.projects.${key}.toggle`),
    eyebrow: t("underhood.eyebrow"),
    title: t(`underhood.projects.${key}.title`),
    sub: t(`underhood.projects.${key}.sub`),
    codeNote: t(`underhood.projects.${key}.codeNote`),
    githubLabel: t("underhood.github"),
    projectLabel: t("underhood.viewProject"),
    features: [
      {
        icon: hoodIcons[key][0],
        title: t(`underhood.projects.${key}.f1Title`),
        desc: t(`underhood.projects.${key}.f1Body`),
      },
      {
        icon: hoodIcons[key][1],
        title: t(`underhood.projects.${key}.f2Title`),
        desc: t(`underhood.projects.${key}.f2Body`),
      },
      {
        icon: hoodIcons[key][2],
        title: t(`underhood.projects.${key}.f3Title`),
        desc: t(`underhood.projects.${key}.f3Body`),
      },
    ],
  }));

  // Four reasons that are specific to Ruud; the generic consultancy-brochure
  // lines ("one point of contact", "flexible") were cut deliberately.
  const whyFreelanceCards = [
    { icon: <EuroIcon sx={{ fontSize: 21 }} />, key: "card1" },
    { icon: <ShieldIcon sx={{ fontSize: 21 }} />, key: "card2" },
    { icon: <MenuBookIcon sx={{ fontSize: 21 }} />, key: "card3" },
    { icon: <HandshakeIcon sx={{ fontSize: 21 }} />, key: "card4" },
  ].map(({ icon, key }) => ({
    icon,
    title: t(`whyFreelance.${key}Title`),
    description: t(`whyFreelance.${key}Body`),
  }));

  // ── Flow backdrop ─────────────────────────────────────────────────────────
  // The scrolling line animation lives inside the "How I Work" and Problem
  // Statement sections — <FlowLines /> sizes itself to whichever wrapper holds
  // it, so its span is set by placement, not by hiding it elsewhere. Layering
  // inside each section: its own background, then the lines, then the same
  // background again at 100 - FLOW_SHOW percent, then the content.
  const FLOW_SHOW = 55;
  const FLOW_BG = "var(--app-bg)";

  // The homepage shows the Datascan in full and the other four as teasers —
  // the detailed seven-slot treatment belongs on /diensten, not here.
  const packageLabels = packageCardLabels(tp);
  const featuredCard = buildPackageCardProps(FEATURED_PACKAGE, tp, locale, packageLabels);
  // On mobile the wide featured card is swapped for a swipe carousel through
  // the three phase-1 packages, so the entry point stays browsable without
  // the two-column card's height.
  const knowCards = packagesInPhase("know").map((pkg) =>
    buildPackageCardProps(pkg, tp, locale, packageLabels),
  );
  const packageTeasers = PACKAGES.filter((pkg) => !pkg.featured).map((pkg) => ({
    slug: pkg.slug,
    phase: pkg.phase,
    accent: pkg.accent,
    name: tp(`${pkg.slug}.name`),
    promise: tp(`${pkg.slug}.promise`),
    duration: tp(`${pkg.slug}.duration`),
    price: formatPackagePrice(pkg, tp, locale),
    originalPrice: formatOriginalPrice(pkg, locale),
  }));
  // The teasers tile in rows of three on desktop, with the remainder absorbed
  // so no row is left ragged: one leftover → the last four cards share a row;
  // two → the last two widen to half each.
  const teaserMdSpan = (i: number) => {
    const n = packageTeasers.length;
    if (n % 3 === 1 && i >= n - 4) return 3;
    if (n % 3 === 2 && i >= n - 2) return 6;
    return 4;
  };

  const steps = [
    { step: "01", title: t("process.step1Title"), description: t("process.step1Body") },
    { step: "02", title: t("process.step2Title"), description: t("process.step2Body") },
    { step: "03", title: t("process.step3Title"), description: t("process.step3Body") },
    { step: "04", title: t("process.step4Title"), description: t("process.step4Body") },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ProfessionalService",
              "@id": `${SITE_URL}/#business`,
              name: "Ruud Juffermans — Data Analytics & AI",
              url: SITE_URL,
              description: t("metaDescription"),
              areaServed: "NL",
              founder: { "@id": `${SITE_URL}/#person` },
            },
            {
              "@type": "Person",
              "@id": `${SITE_URL}/#person`,
              name: "Ruud Juffermans",
              url: SITE_URL,
              jobTitle: "Data & AI consultant",
              sameAs: [
                "https://www.linkedin.com/in/r-j3",
                "https://github.com/ruud-juffermans",
              ],
            },
          ],
        }}
      />
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
            <Typography variant="h1" sx={{ mb: 3.5 }}>
              <SplitText text={t("hero.title")} />
            </Typography>
            <Reveal variant="rise" delay={240}>
              <Typography variant="subtitle1" sx={{ mb: 4, maxWidth: 620 }}>
                {t("hero.subtitle")}
              </Typography>
            </Reveal>
            {/* Proof before tools: the police work and the courses are the
                reason to believe the claim above, so they sit directly under
                it rather than buried in the About timeline. */}
            <Reveal variant="fade" delay={300}>
              <Box sx={{ mb: 6 }}>
                <ProofStrip />
              </Box>
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
                  href="/services"
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
          backgroundColor: "#0D2242",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(166, 200, 247, 0.16) 1px, transparent 1px)",
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

            {/* Problem Statement — carries the same flowing-line backdrop as
          "How I Work", dimmed by a second pass of its own background */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          position: "relative",
          overflow: "hidden",
          backgroundColor: palette.offWhite,
          borderTop: `1px solid var(--app-border-soft)`,
          borderBottom: `1px solid var(--app-border-soft)`,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: palette.offWhite,
            opacity: (100 - FLOW_SHOW) / 100,
            pointerEvents: "none",
          },
          "& > .MuiContainer-root": { position: "relative", zIndex: 1 },
        }}
      >
        <FlowLines rate={0.85} />
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
              {t("problem.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: { xs: 5, md: 8 }, maxWidth: 600 }}>
              <SplitText text={t("problem.title")} />
            </Typography>
          </Reveal>
          {/* One connected card: the three problems sit in a single panel
              divided by hairlines (stacked on mobile, side by side on md+),
              under one shared accent line with the sweeping glow. */}
          <Reveal variant="rise" delay={120}>
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                // On md+ the accent gradient restarts at each of the three
                // sections; on mobile it runs once across the full width.
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundImage: `linear-gradient(to right, ${palette.red}, transparent 70%)`,
                  backgroundSize: { xs: "100% 100%", md: "33.334% 100%" },
                  backgroundRepeat: "repeat-x",
                  opacity: 0.6,
                  transition: "opacity 0.3s",
                },
                // A bright glow sweeping the full width of the accent line.
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg, transparent, var(--app-red-light) 50%, transparent)",
                  backgroundSize: "25% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "-35% 0",
                  animation: "problemAccentSweep 4s ease-in-out infinite",
                  "@media (prefers-reduced-motion: reduce)": {
                    animation: "none",
                  },
                },
                "@keyframes problemAccentSweep": {
                  "0%": { backgroundPosition: "-35% 0" },
                  "65%": { backgroundPosition: "135% 0" },
                  "100%": { backgroundPosition: "135% 0" },
                },
                "@media (hover: hover)": {
                  "&:hover::before": { opacity: 1 },
                },
              }}
            >
              {problemCards.map((card, i) => (
                <Box
                  key={card.title}
                  sx={{
                    flex: 1,
                    p: { xs: 4, md: 5 },
                    position: "relative",
                    // Dividers: on md+ a plain static hairline between the
                    // columns; on mobile they mirror the top accent — same
                    // red-to-transparent base (::before) and sweeping glow
                    // (::after), staggered down the stack.
                    ...(i > 0 && {
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: { xs: 0, md: "auto" },
                        bottom: { xs: "auto", md: 0 },
                        height: { xs: "2px", md: "auto" },
                        width: { xs: "auto", md: "1px" },
                        background: {
                          xs: `linear-gradient(to right, ${palette.red}, transparent 70%)`,
                          md: "var(--app-border-soft)",
                        },
                        opacity: { xs: 0.6, md: 1 },
                      },
                      "&::after": {
                        content: '""',
                        display: { xs: "block", md: "none" },
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background:
                          "linear-gradient(90deg, transparent, var(--app-red-light) 50%, transparent)",
                        backgroundSize: "25% 100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "-35% 0",
                        animation: "problemAccentSweep 4s ease-in-out infinite",
                        animationDelay: i === 1 ? "0.85s" : "1.7s",
                        "@media (prefers-reduced-motion: reduce)": {
                          animation: "none",
                        },
                      },
                      "@keyframes problemAccentSweep": {
                        "0%": { backgroundPosition: "-35% 0" },
                        "65%": { backgroundPosition: "135% 0" },
                        "100%": { backgroundPosition: "135% 0" },
                      },
                    }),
                  }}
                >
                  <Typography variant="h4" component="h3" sx={{ mb: 1.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1">{card.description}</Typography>
                </Box>
              ))}
            </Card>
          </Reveal>
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

      {/* Packages — the Datascan as the entry point, the rest as teasers.
          This is what the three discipline blocks used to be: the homepage now
          points at things a buyer can actually purchase. */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
              {t("packages.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: 2, maxWidth: 600 }}>
              <SplitText text={t("packages.title")} />
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: { xs: 5, md: 7 }, maxWidth: 640 }}>
              {t("packages.subtitle")}
            </Typography>
          </Reveal>

          {/* md+: the wide two-column Datascan card */}
          <Reveal variant="rise" delay={80} sx={{ display: { xs: "none", md: "block" } }}>
            <PackageCard {...featuredCard} featured highlight />
          </Reveal>

          {/* Below md: a swipe carousel through the three phase-1 packages,
              as compact cards (no "Begin hier" chip). Same scroll-snap recipe
              as the blog carousel: negative margins cancel the Container
              gutters so slides can run to the screen edge, with the next card
              peeking in as the swipe affordance. */}
          <Reveal variant="fade" delay={80} sx={{ display: { xs: "block", md: "none" } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "stretch",
                gap: 2,
                mx: { xs: "-20px", sm: "-32px" },
                px: { xs: "20px", sm: "32px" },
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollPaddingInline: { xs: "20px", sm: "32px" },
                pb: 1,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {knowCards.map((card) => (
                <Box
                  key={card.slug}
                  sx={{
                    flex: { xs: "0 0 88%", sm: "0 0 55%" },
                    minWidth: 0,
                    scrollSnapAlign: "start",
                  }}
                >
                  <PackageCard {...card} />
                </Box>
              ))}
            </Box>
          </Reveal>

          {/* The Datascan isn't among the teasers — it's the wide card above.
              Desktop spans come from teaserMdSpan so every row fills. Below
              md the whole grid is hidden: mobile shows only the phase-1
              carousel, the rest lives on /diensten. */}
          <Grid
            container
            spacing={{ xs: 2.5, md: 3 }}
            sx={{ mt: { xs: 2.5, md: 3 }, display: { xs: "none", md: "flex" } }}
          >
            {packageTeasers.map((pkg, i) => (
              <Grid
                size={{
                  xs: 12,
                  sm: i === packageTeasers.length - 1 && packageTeasers.length % 2 === 1 ? 12 : 6,
                  md: teaserMdSpan(i),
                }}
                key={pkg.slug}
              >
                <Reveal variant="rise" delay={i * 90} sx={{ height: "100%" }}>
                  <Card
                    component={Link}
                    href={{ pathname: "/services/[slug]", params: { slug: pkg.slug } }}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: `linear-gradient(to right, ${pkg.accent}, transparent 80%)`,
                      },
                      "@media (hover: hover)": {
                        "&:hover": {
                          borderColor: `color-mix(in srgb, ${pkg.accent} 45%, transparent)`,
                        },
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 3.5, md: 4 },
                        "&:last-child": { pb: { xs: 3.5, md: 4 } },
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <Typography variant="h5" component="h3" sx={{ mb: 1.5 }}>
                        {pkg.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--app-text-secondary)" }}>
                        {pkg.promise}
                      </Typography>
                      <Box sx={{ flex: 1, minHeight: 16 }} />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: 1.5,
                          mt: 2.5,
                          pt: 2,
                          borderTop: "1px solid var(--app-border-soft)",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "var(--app-text-muted)" }}>
                          {pkg.duration}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                            fontSize: "0.98rem",
                            color: pkg.accent,
                            textAlign: "right",
                          }}
                        >
                          {pkg.originalPrice && (
                            <Box
                              component="s"
                              sx={{ color: "var(--app-text-muted)", fontWeight: 500, mr: 0.75 }}
                            >
                              {pkg.originalPrice}
                            </Box>
                          )}
                          {pkg.price}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>

          <Reveal variant="fade" delay={400}>
            <Button
              component={Link}
              href="/services"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 4, ml: -2 }}
            >
              {t("packages.all")}
            </Button>
          </Reveal>
        </Container>
      </Box>

      {/* How I Work — ghost-numbered steps, no card chrome, and the only
          section carrying the flowing-line backdrop */}
      {/* <Box
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
              <SplitText text={t("process.title")} />
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
                    <Typography variant="h4" component="h3" sx={{ mb: 1.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1">{item.description}</Typography>
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}

      {/* Projects — dark section with toggleable code panel */}
      <UnderTheHood variants={hoodVariants} allProjectsLabel={t("projects.all")} />

      {/* Why a freelancer — six-card band, ported from datavakwerk.nl's
          "Waarom een zzp'er" section. Carries the circuit-trace variant of the
          flow backdrop, dimmed the same way as the Problem section. */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          position: "relative",
          overflow: "hidden",
          backgroundColor: palette.offWhite,
          borderTop: `1px solid var(--app-border-soft)`,
          borderBottom: `1px solid var(--app-border-soft)`,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: palette.offWhite,
            opacity: (100 - FLOW_SHOW) / 100,
            pointerEvents: "none",
          },
          "& > .MuiContainer-root": { position: "relative", zIndex: 1 },
        }}
      >
        <FlowLines variant="circuit" />
        <Container>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
              {t("whyFreelance.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: 2, maxWidth: 600 }}>
              <SplitText text={t("whyFreelance.title")} />
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: { xs: 5, md: 8 }, maxWidth: 620 }}
            >
              {t("whyFreelance.subtitle")}
            </Typography>
          </Reveal>
          {/* Mobile: collapsed accordion, one reason open at a time — the top
              one unfolds on its own as the section scrolls into view. */}
          <Reveal variant="rise" sx={{ display: { xs: "block", sm: "none" } }}>
            <WhyFreelanceAccordion items={whyFreelanceCards} />
          </Reveal>

          <Grid
            container
            spacing={{ xs: 2.5, md: 3 }}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
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
                      {/* Icon tile follows the scheme: a light red-tinted
                          tile with the brand-red glyph in light mode, the
                          navy tile with the pink glyph in dark. */}
                      <Box
                        aria-hidden
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2.5,
                          display: "grid",
                          placeItems: "center",
                          backgroundColor:
                            "color-mix(in srgb, var(--app-red) 10%, transparent)",
                          color: "var(--app-red)",
                          mb: 2,
                          "[data-mui-color-scheme='dark'] &": {
                            backgroundColor: palette.navy,
                            color: "#a6c8f7",
                          },
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography variant="h4" component="h3" sx={{ mb: 1 }}>
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
            backgroundColor: palette.bg,
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
                  <Typography variant="h2">
                    <SplitText text={t("blog.title")} />
                  </Typography>
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
            {/* Below md: swipe carousel — one post per view on phones, two
                side by side from 600px, with a sliver of the next card peeking
                in from the right as the swipe affordance. The negative margins
                cancel the Container's gutters (20px on xs, 32px from sm) so
                cards can slide to the screen edge. */}
            <Reveal variant="fade" sx={{ display: { xs: "block", md: "none" } }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mx: { xs: "-20px", sm: "-32px" },
                  px: { xs: "20px", sm: "32px" },
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  scrollPaddingInline: { xs: "20px", sm: "32px" },
                  pb: 1,
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {posts.map((post) => (
                  <Box
                    key={post.slug}
                    sx={{
                      flex: { xs: "0 0 88%", sm: "0 0 45%" },
                      minWidth: 0,
                      scrollSnapAlign: "start",
                    }}
                  >
                    <BlogCard
                      post={post}
                      meta={`${formatDate(post.date, locale)} · ${post.readingTime} ${tc("readingTimeSuffix")}`}
                    />
                  </Box>
                ))}
              </Box>
            </Reveal>

            <Grid container spacing={2.5} sx={{ display: { xs: "none", md: "flex" } }}>
              {posts.map((post, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.slug}>
                  <Reveal variant="rise" delay={i * 120} sx={{ height: "100%" }}>
                    <BlogCard
                      post={post}
                      meta={`${formatDate(post.date, locale)} · ${post.readingTime} ${tc("readingTimeSuffix")}`}
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
              "radial-gradient(640px 340px at 50% 115%, rgba(37, 99, 235, 0.35), transparent 70%)",
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
              <SplitText text={t("cta.title")} />
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
