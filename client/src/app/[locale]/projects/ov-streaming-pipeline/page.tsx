import Grid from "@mui/material/Grid2";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ProjectFigure from "@/components/ProjectFigure";
import JsonLd from "@/components/JsonLd";
import {
  Band,
  BulletCard,
  CodeNote,
  FigureBlock,
  MetricsTable,
  NumberedCards,
  ProjectClosing,
  ProjectHero,
  ProseBlock,
  SectionTitle,
  SplitBand,
  SubTitle,
} from "@/components/ProjectPageKit";
import { getProjectItem } from "@/lib/content";
import { absoluteUrl, buildAlternates, buildOpenGraph, SITE_URL } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";
import { ACCENT, CONTENT, REPO_URL, SLUG } from "./content";

// Bespoke page for the OV delay metrics project (slug: ov-streaming-pipeline). It shadows the generic
// /projects/[slug] article for this slug (see CUSTOM_PROJECT_PAGES); the
// project's MDX file still supplies the frontmatter for the /projects
// listing, the sitemap, the OG image and llms-full.txt.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = CONTENT[locale];
  return {
    title: c.title,
    description: c.lead,
    alternates: buildAlternates("/projects/[slug]", locale, { slug: SLUG }),
    openGraph: {
      ...buildOpenGraph("/projects/[slug]", locale, { slug: SLUG }),
      type: "article",
      title: c.title,
      description: c.lead,
    },
  };
}

export default async function OvStreamingPipelinePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = CONTENT[locale];
  const meta = getProjectItem(locale, SLUG)?.meta;
  const labels = { repo: c.ui.repo, allProjects: c.ui.allProjects, back: c.ui.back };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            {
              "@type": "ListItem",
              position: 2,
              name: locale === "nl" ? "Projecten" : "Projects",
              item: absoluteUrl("/projects", locale),
            },
            { "@type": "ListItem", position: 3, name: c.title },
          ],
        }}
      />

      <ProjectHero
        accent={ACCENT}
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        intro={c.intro}
        tags={meta?.tags ?? []}
        facts={c.facts}
        stats={c.stats}
        repoUrl={REPO_URL}
        labels={labels}
      >
        <FigureBlock figure={c.hero} priority />
      </ProjectHero>

      <SplitBand title={c.why.title} paragraphs={c.why.body} />

      <Band>
        <SectionTitle title={c.definitions.title} />
        <ProseBlock paragraphs={c.definitions.body} />
        <Reveal variant="rise" sx={{ mt: { xs: 5, md: 7 } }}>
          <SubTitle title={c.definitions.choicesTitle} />
        </Reveal>
        <NumberedCards items={c.definitions.choices} accent={ACCENT} />
      </Band>

      <Band shaded>
        <SectionTitle title={c.dashboards.title} />
        <ProseBlock paragraphs={c.dashboards.body} />
        <Grid container spacing={{ xs: 4, md: 3 }} sx={{ mt: { xs: 2, md: 3 } }}>
          {c.dashboards.screenshots.map((f, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={f.src}>
              <Reveal variant="fade" delay={i * 100}>
                <ProjectFigure {...f} sizes="(min-width: 900px) 50vw, 100vw" />
              </Reveal>
            </Grid>
          ))}
        </Grid>
        <FigureBlock figure={c.dashboards.grafana} />
      </Band>

      <Band>
        <SectionTitle title={c.quality.title} />
        <ProseBlock paragraphs={c.quality.body} />
        <Reveal variant="rise" sx={{ mt: { xs: 3, md: 4 } }}>
          <BulletCard
            title={c.quality.quirksTitle}
            items={c.quality.quirks}
            note={c.quality.quirksNote}
            accent={ACCENT}
          />
        </Reveal>
        <Reveal variant="rise" sx={{ mt: { xs: 5, md: 7 } }}>
          <SubTitle title={c.quality.notesTitle} />
        </Reveal>
        <NumberedCards items={c.quality.notes} accent={ACCENT} />
      </Band>

      <Band shaded>
        <SectionTitle title={c.incidents.title} />
        <ProseBlock paragraphs={c.incidents.body} />
        <Reveal variant="rise" sx={{ mt: { xs: 3, md: 4 } }}>
          <NumberedCards items={c.incidents.items} accent={ACCENT} />
        </Reveal>
        <FigureBlock figure={c.incidents.figure} />
      </Band>

      <Band>
        <SectionTitle title={c.trust.title} />
        <ProseBlock paragraphs={c.trust.body} />
        <Reveal variant="rise" sx={{ mt: { xs: 3, md: 4 } }}>
          <NumberedCards items={c.trust.items} columns={3} accent={ACCENT} />
        </Reveal>
        <FigureBlock figure={c.trust.figure} />
        <CodeNote code={c.trust.proof.test} body={c.trust.proof.body} />
      </Band>

      <Band shaded>
        <SectionTitle title={c.measured.title} intro={c.measured.intro} />
        <MetricsTable caption={c.measured.tableCaption} rows={c.measured.rows} accent={ACCENT} />
      </Band>

      <Band>
        <SectionTitle title={c.underneath.title} />
        <ProseBlock paragraphs={c.underneath.body} />
        <FigureBlock figure={c.underneath.figure} />
        <NumberedCards items={c.underneath.items} columns={3} accent={ACCENT} />
      </Band>

      <ProjectClosing
        accent={ACCENT}
        title={c.shows.title}
        skills={c.shows.skills}
        closing={c.shows.closing}
        repoUrl={REPO_URL}
        labels={labels}
        footnotes={[`${c.ui.dataSource}: ${c.ui.dataSourceName}`]}
      />
    </>
  );
}
