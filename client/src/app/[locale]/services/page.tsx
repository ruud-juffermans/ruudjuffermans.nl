import { Box, Container, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/CheckRounded";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import ProofStrip from "@/components/ProofStrip";
import PackageCard from "@/components/PackageCard";
import Faq, { type FaqItem } from "@/components/Faq";
import { PHASES, packagesInPhase, type PackageDef } from "@/lib/packages";
import { buildPackageCardProps, packageCardLabels } from "@/lib/packageContent";
import type { Locale } from "@/i18n/routing";
import SplitText from "@/components/SplitText";
import { palette } from "@/theme/theme";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tp = await getTranslations("packages");

  const labels = packageCardLabels(tp);
  const card = (pkg: PackageDef) => buildPackageCardProps(pkg, tp, locale, labels);

  const customItems = t.raw("custom.items") as string[];
  const faqItems = t.raw("faq.items") as FaqItem[];

  return (
    <>
      {/* Hero — one positioning line, then the proof that backs it */}
      <Box sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 7, md: 10 } }}>
        <Container>
          <Box sx={{ maxWidth: 780 }}>
            <Reveal variant="rise" delay={0}>
              <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                {t("hero.eyebrow")}
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={100}>
              <Typography variant="h1" sx={{ mb: 3 }}>
                <SplitText text={t("hero.title")} />
              </Typography>
            </Reveal>
            <Reveal variant="rise" delay={200}>
              <Typography variant="subtitle1" sx={{ mb: 4 }}>
                {t("hero.subtitle")}
              </Typography>
            </Reveal>
            <Reveal variant="fade" delay={320}>
              <ProofStrip />
            </Reveal>
          </Box>
        </Container>
      </Box>

      {/* The seven packages, grouped by the stage the buyer is in. The phase
          headers are what stop a seven-item list reading as a capability menu:
          you're meant to see a path and find yourself on it. */}
      {PHASES.map((phase, phaseIndex) => {
        const items = packagesInPhase(phase);
        const shaded = phaseIndex % 2 === 0;
        return (
          <Box
            key={phase}
            sx={{
              py: { xs: 8, md: 11 },
              backgroundColor: shaded ? palette.offWhite : "transparent",
              borderTop: shaded ? `1px solid var(--app-border-soft)` : "none",
              borderBottom: shaded ? `1px solid var(--app-border-soft)` : "none",
            }}
          >
            <Container>
              <Reveal variant="rise">
                <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
                  {t(`phases.${phase}.eyebrow`)}
                </Typography>
                <Typography variant="h2" sx={{ mb: 2, maxWidth: 620 }}>
                  {t(`phases.${phase}.title`)}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: { xs: 4, md: 6 }, maxWidth: 660 }}>
                  {t(`phases.${phase}.sub`)}
                </Typography>
              </Reveal>
              {/* Every package gets the wide two-column treatment, stacked —
                  the same card the Datascan carries on the homepage. */}
              <Box sx={{ display: "grid", gap: { xs: 2.5, md: 3 } }}>
                {items.map((pkg, i) => (
                  <Reveal variant="rise" delay={i * 110} key={pkg.slug}>
                    <PackageCard {...card(pkg)} featured highlight={pkg.featured} />
                  </Reveal>
                ))}
              </Box>
            </Container>
          </Box>
        );
      })}

      {/* Bespoke work — so an off-shape lead has somewhere to land */}
      <Box sx={{ py: { xs: 9, md: 12 } }}>
        <Container>
          <Grid container spacing={{ xs: 4, md: 8 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Reveal variant="rise">
                <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
                  {t("custom.eyebrow")}
                </Typography>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  {t("custom.title")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {t("custom.subtitle")}
                </Typography>
                <Button
                  component={Link}
                  href="/contact"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ ml: -2 }}
                >
                  {t("custom.cta")}
                </Button>
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Reveal variant="rise" delay={120}>
                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2 }}>
                  {customItems.map((item) => (
                    <Box
                      component="li"
                      key={item}
                      sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                    >
                      <CheckIcon
                        sx={{ fontSize: 19, color: palette.red, mt: "3px", flexShrink: 0 }}
                      />
                      <Typography variant="body1">{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Proof */}
      <Box
        sx={{
          py: { xs: 9, md: 12 },
          backgroundColor: palette.offWhite,
          borderTop: `1px solid var(--app-border-soft)`,
          borderBottom: `1px solid var(--app-border-soft)`,
        }}
      >
        <Container>
          <Reveal variant="rise">
            <Box sx={{ maxWidth: 720 }}>
              <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
                {t("proof.eyebrow")}
              </Typography>
              <Typography variant="h2" sx={{ mb: 2.5 }}>
                {t("proof.title")}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3.5 }}>
                {t("proof.subtitle")}
              </Typography>
              <ProofStrip />
              <Button
                component={Link}
                href="/projects"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 3, ml: -2 }}
              >
                {t("proof.cta")}
              </Button>
            </Box>
          </Reveal>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: { xs: 9, md: 12 } }}>
        <Container maxWidth="md" sx={{ mx: "auto" }}>
          <Reveal variant="rise">
            <Typography variant="overline" sx={{ mb: 1.5, display: "block" }}>
              {t("faq.eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ mb: { xs: 4, md: 6 } }}>
              {t("faq.title")}
            </Typography>
          </Reveal>
          <Reveal variant="fade" delay={120}>
            <Faq items={faqItems} />
          </Reveal>
        </Container>
      </Box>

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
              {t("cta.title")}
            </Typography>
            <Typography
              sx={{ mt: 2.25, mb: 6, color: "#a3a3a3", fontSize: 17, maxWidth: 560, mx: "auto" }}
            >
              {t("cta.subtitle")}
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/contact"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 7, width: { xs: "100%", sm: "auto" }, maxWidth: 360 }}
            >
              {t("cta.button")}
            </Button>
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
