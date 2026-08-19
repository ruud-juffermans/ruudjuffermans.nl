import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "@/i18n/navigation";
import { MetaPair } from "./PackageCard";
import type { ProjectMeta } from "@/lib/content";

export interface ProjectCardLabels {
  view: string;
  repo: string;
}

/**
 * One case study, rendered with the same fixed slots every time: what it is,
 * the stack, and the numbers that back it up — the same scan-and-compare
 * treatment the package cards get.
 *
 * The card is not itself a link (it contains a secondary link to the repo);
 * the title link is stretched over the card instead, and the secondary link
 * sits above it on its own stacking context.
 */
export default function ProjectCard({
  project,
  accent,
  labels,
}: {
  project: ProjectMeta;
  accent: string;
  labels: ProjectCardLabels;
}) {
  return (
    <Card
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
          background: `linear-gradient(to right, ${accent}, transparent 80%)`,
        },
        "@media (hover: hover)": {
          "&:hover": { borderColor: `color-mix(in srgb, ${accent} 45%, transparent)` },
          "&:hover .prj-cta": { gap: 1.25 },
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
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}
        >
          <Chip
            label={project.industry}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
              color: accent,
            }}
          />
          {project.duration && (
            <Typography variant="body2" sx={{ color: "var(--app-text-muted)" }}>
              {project.duration}
            </Typography>
          )}
        </Box>

        <Typography variant="h4" component="h3" sx={{ mb: 1.5 }}>
          <Box
            component={Link}
            href={{ pathname: "/projects/[slug]", params: { slug: project.slug } }}
            sx={{
              color: "inherit",
              textDecoration: "none",
              "&::after": { content: '""', position: "absolute", inset: 0 },
            }}
          >
            {project.title}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ mb: 2.5 }}>
          {project.summary}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {project.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        {/* Stats and CTA pinned to the bottom so cards of unequal length still
            line up across the row. */}
        <Box sx={{ flex: 1 }} />
        {project.stats && project.stats.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 3.5,
              flexWrap: "wrap",
              mt: 4,
              pt: 3,
              borderTop: "1px solid var(--app-border-soft)",
            }}
          >
            {project.stats.map((stat) => (
              <MetaPair key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </Box>
        )}

        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2.5 }}
        >
          <Box
            className="prj-cta"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              fontWeight: 600,
              fontSize: "0.92rem",
              color: accent,
              transition: "gap 0.25s ease",
            }}
          >
            {labels.view}
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Box>
          {project.repo && (
            <Box
              component="a"
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.repo}
              title={labels.repo}
              sx={{
                position: "relative",
                zIndex: 1,
                display: "inline-flex",
                color: "var(--app-text-muted)",
                transition: "color 0.2s ease",
                "&:hover": { color: accent },
              }}
            >
              <GitHubIcon sx={{ fontSize: 20 }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
