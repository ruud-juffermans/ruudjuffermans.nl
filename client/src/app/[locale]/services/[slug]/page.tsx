import { Box, Container, Typography, Button, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/CheckRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import LinkButton from "@/components/LinkButton";
import PageViewTracker from "@/components/PageViewTracker";
import { PACKAGE_SLUGS, getPackage } from "@/lib/packages";
import { formatOriginalPrice, formatPackagePrice, packageSteps } from "@/lib/packageContent";
import { routing, type Locale } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => PACKAGE_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  const tp = await getTranslations({ locale, namespace: "packages" });
  return {
    title: tp(`${pkg.slug}.name`),
    description: tp(`${pkg.slug}.promise`),
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const tp = await getTranslations("packages");
  const ts = await getTranslations("services");
  const { accent } = pkg;

  // Detail pages render the grouped deliverables (docs/packages/ structure:
  // the core artifact leads); the flat `deliverables` list stays for cards.
  const deliverableGroups = tp.raw(`${pkg.slug}.deliverableGroups`) as {
    title: string;
    items: string[];
  }[];
  const notIncluded = tp.raw(`${pkg.slug}.notIncluded`) as string[];
  const modes = pkg.hasModes
    ? (tp.raw(`${pkg.slug}.modes`) as {
        title: string;
        intro: string;
        options: { title: string; duration: string; body: string }[];
      })
    : null;
  const related = [
    { label: tp("labels.fitConsumes"), slugs: pkg.consumes ?? [] },
    { label: tp("labels.fitFeeds"), slugs: pkg.feeds ?? [] },
  ].filter((group) => group.slugs.length > 0);
  const steps = packageSteps(pkg, tp);
  const price = formatPackagePrice(pkg, tp, locale);
  const originalPrice = formatOriginalPrice(pkg, locale);

  return (
    <>
      <PageViewTracker path={`/services/${pkg.slug}`} locale={locale} />

      {/* Hero — name, the situation, the promise */}
      <Box sx={{ pt: { xs: 9, md: 13 }, pb: { xs: 6, md: 9 } }}>
        <Container>
          <Button
            component={Link}
            href="/services"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4, color: "var(--app-text-secondary)", "&:hover": { color: palette.red } }}
          >
            {tp("labels.back")}
          </Button>
          <Box sx={{ maxWidth: 760 }}>
            <Chip
              label={tp(`${pkg.slug}.duration`)}
              size="small"
              sx={{
                mb: 2.5,
                fontWeight: 600,
                backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                color: accent,
              }}
            />
            <Typography variant="h1" sx={{ mb: 3 }}>
              {tp(`${pkg.slug}.name`)}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4 }}>
              {tp(`${pkg.slug}.intro`)}
            </Typography>

            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "16px",
                borderLeft: `3px solid ${accent}`,
                backgroundColor: `color-mix(in srgb, ${accent} 7%, transparent)`,
              }}
            >
              <Typography
                variant="overline"
                sx={{ display: "block", color: accent, mb: 0.75, letterSpacing: "0.14em" }}
              >
                {tp("labels.recognise")}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2.5 }}>
                {tp(`${pkg.slug}.recognise`)}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 650,
                  fontSize: "1.2rem",
                  lineHeight: 1.35,
                  color: palette.gray900,
                }}
              >
                {tp(`${pkg.slug}.promise`)}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Two entry modes — only Sharpen the question defines this: on top of
          the scans (shorter, cheaper) versus standalone (includes the focused
          discovery). The first option is visually led: it's the recommended
          path. */}
      {modes && (
        <Box sx={{ pb: { xs: 8, md: 11 } }}>
          <Container>
            <Reveal variant="rise">
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                {modes.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: 720 }}>
                {modes.intro}
              </Typography>
            </Reveal>
            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {modes.options.map((option, i) => (
                <Grid size={{ xs: 12, md: 6 }} key={option.title}>
                  <Reveal variant="rise" delay={i * 110} sx={{ height: "100%" }}>
                    <Box
                      sx={{
                        height: "100%",
                        p: { xs: 3, md: 4 },
                        borderRadius: "16px",
                        border: `1px solid var(--app-border-soft)`,
                        backgroundColor: "var(--app-surface-elevated)",
                        ...(i === 0 && {
                          borderColor: `color-mix(in srgb, ${accent} 40%, var(--app-border-soft))`,
                          backgroundColor: `color-mix(in srgb, ${accent} 5%, var(--app-surface-elevated))`,
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1.5,
                          mb: 1.5,
                        }}
                      >
                        <Typography variant="h4">{option.title}</Typography>
                        <Chip
                          label={option.duration}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                            color: accent,
                          }}
                        />
                      </Box>
                      <Typography variant="body1">{option.body}</Typography>
                    </Box>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* What you get + the fixed terms */}
      <Box
        sx={{
          py: { xs: 8, md: 11 },
          backgroundColor: palette.offWhite,
          borderTop: `1px solid var(--app-border-soft)`,
          borderBottom: `1px solid var(--app-border-soft)`,
        }}
      >
        <Container>
          <Grid container spacing={{ xs: 5, md: 8 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Reveal variant="rise">
                <Typography variant="h3" sx={{ mb: 3 }}>
                  {tp("labels.deliverables")}
                </Typography>
                {/* Grouped like the definition docs: the first group is the
                    core artifact and gets the accent-led treatment. */}
                <Box sx={{ display: "grid", gap: 3 }}>
                  {deliverableGroups.map((group, gi) => (
                    <Box
                      key={group.title}
                      sx={
                        gi === 0
                          ? {
                              p: { xs: 2.5, md: 3 },
                              borderRadius: "14px",
                              borderLeft: `3px solid ${accent}`,
                              backgroundColor: `color-mix(in srgb, ${accent} 6%, transparent)`,
                            }
                          : undefined
                      }
                    >
                      <Typography variant="h5" sx={{ mb: 1.5 }}>
                        {group.title}
                      </Typography>
                      <Box
                        component="ul"
                        sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5 }}
                      >
                        {group.items.map((item) => (
                          <Box
                            component="li"
                            key={item}
                            sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                          >
                            <CheckIcon
                              sx={{ fontSize: 20, color: accent, mt: "3px", flexShrink: 0 }}
                            />
                            <Typography variant="body1">{item}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
                {pkg.hasBridge && (
                  <Typography
                    sx={{
                      mt: 3.5,
                      fontWeight: 600,
                      color: palette.gray900,
                      fontSize: "1.02rem",
                    }}
                  >
                    {tp(`${pkg.slug}.bridge`)}
                  </Typography>
                )}
                {/* Scope honesty: what this package deliberately doesn't do,
                    with a pointer to the package that does. */}
                <Typography
                  variant="overline"
                  sx={{ display: "block", color: "var(--app-text-muted)", mt: 4.5, mb: 1.5 }}
                >
                  {tp("labels.notIncluded")}
                </Typography>
                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5 }}>
                  {notIncluded.map((item) => (
                    <Box
                      component="li"
                      key={item}
                      sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                    >
                      <CloseIcon
                        sx={{
                          fontSize: 20,
                          color: "var(--app-text-muted)",
                          mt: "3px",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body1" sx={{ color: "var(--app-text-secondary)" }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Reveal>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Reveal variant="rise" delay={120}>
                <Box
                  sx={{
                    p: { xs: 3.5, md: 4.5 },
                    borderRadius: "20px",
                    border: `1px solid var(--app-border-soft)`,
                    backgroundColor: "var(--app-surface-elevated)",
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="overline"
                      sx={{ display: "block", color: "var(--app-text-muted)", mb: 0.5 }}
                    >
                      {tp("labels.duration")}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        fontSize: "1.6rem",
                        color: palette.gray900,
                      }}
                    >
                      {tp(`${pkg.slug}.duration`)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3.5 }}>
                    <Typography
                      variant="overline"
                      sx={{ display: "block", color: "var(--app-text-muted)", mb: 0.5 }}
                    >
                      {tp("labels.price")}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        fontSize: "1.6rem",
                        color: accent,
                      }}
                    >
                      {originalPrice && (
                        <Box
                          component="s"
                          sx={{
                            color: "var(--app-text-muted)",
                            fontWeight: 500,
                            fontSize: "1.15rem",
                            mr: 1,
                          }}
                        >
                          {originalPrice}
                        </Box>
                      )}
                      {price}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    component={Link}
                    href="/contact"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ width: "100%" }}
                  >
                    {ts("cta.button")}
                  </Button>
                  {pkg.proofSlug && (
                    <LinkButton
                      href={{ pathname: "/projects/[slug]", params: { slug: pkg.proofSlug } }}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ width: "100%", mt: 1.5, color: accent }}
                    >
                      {tp("labels.proof")}
                    </LinkButton>
                  )}
                </Box>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How the engagement runs, week by week */}
      <Box sx={{ py: { xs: 9, md: 13 } }}>
        <Container>
          <Reveal variant="rise">
            <Typography variant="h2" sx={{ mb: { xs: 5, md: 7 } }}>
              {tp("labels.timeline")}
            </Typography>
          </Reveal>
          {/* Packages run 3 or 4 steps; either way they fill one desktop row. */}
          {(() => {
            const mdSpan = Math.floor(12 / steps.length);
            return (
          <Grid container spacing={{ xs: 0, sm: 4, md: 5 }}>
            {steps.map((step, i) => (
              <Grid size={{ xs: 12, sm: 6, md: mdSpan }} key={step.label}>
                <Reveal variant="rise" delay={i * 100} sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      height: "100%",
                      py: { xs: 3.5, sm: 0 },
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
                        fontSize: { xs: "2.4rem", md: "3rem" },
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        color: "transparent",
                        WebkitTextStroke: `1.5px ${accent}`,
                        opacity: 0.55,
                        mb: 1.75,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {step.label}
                    </Typography>
                    <Typography variant="body1">{step.body}</Typography>
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
            );
          })()}
        </Container>
      </Box>

      {/* Where this fits — the path relations from packages.ts, so eight
          packages read as one route instead of a menu: what this build starts
          from, and what its deliverables flow into. */}
      {related.length > 0 && (
        <Box
          sx={{
            py: { xs: 8, md: 11 },
            backgroundColor: palette.offWhite,
            borderTop: `1px solid var(--app-border-soft)`,
            borderBottom: `1px solid var(--app-border-soft)`,
          }}
        >
          <Container>
            <Reveal variant="rise">
              <Typography variant="h3" sx={{ mb: { xs: 4, md: 5 } }}>
                {tp("labels.fitTitle")}
              </Typography>
            </Reveal>
            <Grid container spacing={{ xs: 4, md: 6 }}>
              {related.map((group) => (
                <Grid size={{ xs: 12, md: 6 }} key={group.label}>
                  <Reveal variant="rise">
                    <Typography
                      variant="overline"
                      sx={{ display: "block", color: "var(--app-text-muted)", mb: 1.5 }}
                    >
                      {group.label}
                    </Typography>
                    <Box sx={{ display: "grid", gap: 1.5 }}>
                      {group.slugs.map((relSlug) => {
                        const rel = getPackage(relSlug)!;
                        return (
                          <Box
                            key={relSlug}
                            component={Link}
                            href={{ pathname: "/services/[slug]", params: { slug: relSlug } }}
                            sx={{
                              display: "block",
                              p: 2.5,
                              borderRadius: "14px",
                              border: `1px solid var(--app-border-soft)`,
                              borderLeft: `3px solid ${rel.accent}`,
                              backgroundColor: "var(--app-surface-elevated)",
                              textDecoration: "none",
                              "@media (hover: hover)": {
                                "&:hover": {
                                  borderColor: `color-mix(in srgb, ${rel.accent} 45%, var(--app-border-soft))`,
                                },
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                color: palette.gray900,
                              }}
                            >
                              {tp(`${relSlug}.name`)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "var(--app-text-secondary)", mt: 0.5 }}
                            >
                              {tp(`${relSlug}.navDesc`)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* CTA — full-bleed dark section that blends into the footer (same
          #070B15); the radial glow rises from the bottom edge in the
          package accent */}
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
            background: `radial-gradient(640px 340px at 50% 115%, color-mix(in srgb, ${accent} 35%, transparent), transparent 70%)`,
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
              {ts("cta.title")}
            </Typography>
            <Typography
              sx={{ mt: 2.25, mb: 6, color: "#a3a3a3", fontSize: 17, maxWidth: 560, mx: "auto" }}
            >
              {ts("cta.subtitle")}
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/contact"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 7, width: { xs: "100%", sm: "auto" }, maxWidth: 360 }}
            >
              {ts("cta.button")}
            </Button>
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
