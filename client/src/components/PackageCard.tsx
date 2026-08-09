import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/CheckRounded";
import { Link } from "@/i18n/navigation";
import LinkButton from "./LinkButton";
import { palette } from "@/theme/theme";
import type { PackageSlug } from "@/lib/packages";

export interface PackageCardLabels {
  recognise: string;
  promise: string;
  deliverables: string;
  duration: string;
  price: string;
  proof: string;
  view: string;
  featuredTag: string;
  bridgeLabel: string;
}

export interface PackageCardProps {
  slug: PackageSlug;
  accent: string;
  name: string;
  recognise: string;
  promise: string;
  deliverables: string[];
  duration: string;
  /** Already formatted for display — "€1.500", "vanaf €X" or "prijs op aanvraag". */
  price: string;
  bridge?: string;
  proofSlug?: string;
  labels: PackageCardLabels;
  /** Wide two-column treatment — used on the homepage for the Datascan. */
  featured?: boolean;
  /**
   * Compact card, but visually led: accent border and the "Begin hier" chip.
   * Marks the entry package inside a phase grid without breaking the row.
   */
  highlight?: boolean;
}

/**
 * One packaged outcome, rendered with the same seven slots every time: name,
 * the situation, the promise, the artifacts, the timeline, the price, and a
 * link to proof. The consistency is the point — a buyer can compare two
 * packages by scanning the same positions.
 */
export default function PackageCard(props: PackageCardProps) {
  return props.featured ? <FeaturedCard {...props} /> : <CompactCard {...props} />;
}

function MetaPair({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ display: "block", color: "var(--app-text-muted)", mb: 0.25, letterSpacing: "0.14em" }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: "1.05rem",
          color: accent ?? palette.gray900,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function Deliverables({ items, accent }: { items: string[]; accent: string }) {
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 }}>
      {items.map((item) => (
        <Box component="li" key={item} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
          <CheckIcon sx={{ fontSize: 18, color: accent, mt: "3px", flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: "var(--app-text-secondary)" }}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function Bridge({ text, label, accent }: { text: string; label: string; accent: string }) {
  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: "12px",
        backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`,
        borderLeft: `2px solid ${accent}`,
      }}
    >
      <Typography
        variant="overline"
        sx={{ display: "block", color: accent, letterSpacing: "0.14em", mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: "var(--app-text-secondary)" }}>
        {text}
      </Typography>
    </Box>
  );
}

function FeaturedCard({
  slug,
  accent,
  name,
  recognise,
  promise,
  deliverables,
  duration,
  price,
  labels,
}: PackageCardProps) {
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderColor: `color-mix(in srgb, ${accent} 35%, var(--app-border-soft))`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(to right, ${accent}, transparent 80%)`,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 4, md: 6 }, "&:last-child": { pb: { xs: 4, md: 6 } } }}>
        <Grid container spacing={{ xs: 4, md: 7 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip
              label={labels.featuredTag}
              size="small"
              sx={{
                mb: 2.5,
                fontWeight: 600,
                backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                color: accent,
              }}
            />
            <Typography variant="h2" sx={{ mb: 2.5 }}>
              {name}
            </Typography>

            <Typography
              variant="overline"
              sx={{ display: "block", color: "var(--app-text-muted)", mb: 0.75 }}
            >
              {labels.recognise}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {recognise}
            </Typography>

            <Typography
              variant="overline"
              sx={{ display: "block", color: "var(--app-text-muted)", mb: 0.75 }}
            >
              {labels.promise}
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 650,
                fontSize: "1.25rem",
                lineHeight: 1.35,
                color: palette.gray900,
              }}
            >
              {promise}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="overline"
              sx={{ display: "block", color: "var(--app-text-muted)", mb: 1.5 }}
            >
              {labels.deliverables}
            </Typography>
            <Deliverables items={deliverables} accent={accent} />

            <Box
              sx={{
                display: "flex",
                gap: 4,
                mt: 4,
                pt: 3,
                borderTop: "1px solid var(--app-border-soft)",
              }}
            >
              <MetaPair label={labels.duration} value={duration} />
              <MetaPair label={labels.price} value={price} accent={accent} />
            </Box>

            <LinkButton
              variant="contained"
              href={{ pathname: "/services/[slug]", params: { slug } }}
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 3.5, width: { xs: "100%", sm: "auto" } }}
            >
              {labels.view}
            </LinkButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function CompactCard({
  slug,
  accent,
  name,
  recognise,
  promise,
  deliverables,
  duration,
  price,
  bridge,
  labels,
  highlight,
}: PackageCardProps) {
  return (
    <Card
      component={Link}
      href={{ pathname: "/services/[slug]", params: { slug } }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        ...(highlight && {
          borderColor: `color-mix(in srgb, ${accent} 40%, var(--app-border-soft))`,
          backgroundColor: `color-mix(in srgb, ${accent} 4%, var(--app-surface-elevated))`,
        }),
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: highlight ? 4 : 3,
          background: `linear-gradient(to right, ${accent}, transparent 80%)`,
        },
        "@media (hover: hover)": {
          "&:hover": { borderColor: `color-mix(in srgb, ${accent} 45%, transparent)` },
          "&:hover .pkg-cta": { gap: 1.25 },
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 3.5, md: 4.5 },
          "&:last-child": { pb: { xs: 3.5, md: 4.5 } },
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {highlight && (
          <Chip
            label={labels.featuredTag}
            size="small"
            sx={{
              mb: 1.75,
              alignSelf: "flex-start",
              fontWeight: 600,
              backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
              color: accent,
            }}
          />
        )}
        <Typography variant="h4" sx={{ mb: 2 }}>
          {name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "var(--app-text-muted)", fontStyle: "italic", mb: 2 }}
        >
          {recognise}
        </Typography>

        <Typography
          sx={{
            fontFamily: "var(--font-heading)",
            fontWeight: 650,
            fontSize: "1.05rem",
            lineHeight: 1.4,
            color: palette.gray900,
            mb: 3,
          }}
        >
          {promise}
        </Typography>

        <Typography
          variant="overline"
          sx={{ display: "block", color: "var(--app-text-muted)", mb: 1.25 }}
        >
          {labels.deliverables}
        </Typography>
        <Deliverables items={deliverables} accent={accent} />

        {bridge && <Bridge text={bridge} label={labels.bridgeLabel} accent={accent} />}

        {/* Meta and CTA pinned to the bottom so cards of unequal length still
            line up across the row. */}
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            display: "flex",
            gap: 3.5,
            mt: 4,
            pt: 3,
            borderTop: "1px solid var(--app-border-soft)",
          }}
        >
          <MetaPair label={labels.duration} value={duration} />
          <MetaPair label={labels.price} value={price} accent={accent} />
        </Box>

        <Box
          className="pkg-cta"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            mt: 2.5,
            fontWeight: 600,
            fontSize: "0.92rem",
            color: accent,
            transition: "gap 0.25s ease",
          }}
        >
          {labels.view}
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
