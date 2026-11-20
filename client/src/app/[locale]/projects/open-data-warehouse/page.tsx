import Grid from "@mui/material/Grid2";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import {
  Band,
  BulletCard,
  CodeCards,
  FigureBlock,
  MetricsTable,
  NumberedCards,
  ProjectClosing,
  ProjectHero,
  ProseBlock,
  ProseWithCallouts,
  PullQuote,
  SectionTitle,
  SplitBand,
  SubTitle,
} from "@/components/ProjectPageKit";
import { getProjectItem } from "@/lib/content";
import { absoluteUrl, buildAlternates, buildOpenGraph, SITE_URL } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";
import { ACCENT, CONTENT, REPO_URL, SLUG } from "./content";

// Bespoke page for open-data-warehouse. It shadows the generic
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

export default async function OpenDataWarehousePage({
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
        <SectionTitle title={c.questions.title} intro={c.questions.intro} />
        <NumberedCards items={c.questions.items} columns={3} accent={ACCENT} />
        <Grid container spacing={{ xs: 4, md: 8 }} sx={{ mt: { xs: 2, md: 3 } }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <SubTitle title={c.questions.sourcesTitle} />
            <ProseBlock paragraphs={c.questions.sourcesBody} />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <MetricsTable columns={c.questions.columns} rows={c.questions.rows} accent={ACCENT} />
          </Grid>
        </Grid>
      </Band>

      <Band shaded>
        <SectionTitle title={c.model.title} />
        <ProseBlock paragraphs={c.model.body} />
        <Reveal variant="rise" sx={{ mt: { xs: 4, md: 6 } }}>
          <SubTitle title={c.model.tablesTitle} />
        </Reveal>
        <CodeCards items={c.model.tables} />
        <PullQuote text={c.model.quote} accent={ACCENT} />
      </Band>

      <Band>
        <SectionTitle title={c.scd2.title} />
        <ProseWithCallouts paragraphs={c.scd2.body} callouts={c.scd2.callouts} accent={ACCENT} />
        <FigureBlock figure={c.scd2.figure} />
        <BulletCard
          title={c.scd2.testsTitle}
          items={c.scd2.tests}
          note={c.scd2.testsNote}
          accent={ACCENT}
          ordered
        />
      </Band>

      <Band shaded>
        <SectionTitle title={c.powerbi.title} />
        <ProseBlock paragraphs={c.powerbi.body} />
        <Reveal variant="rise" sx={{ mt: { xs: 4, md: 5 } }}>
          <BulletCard title={c.powerbi.choicesTitle} items={c.powerbi.choices} accent={ACCENT} ordered />
        </Reveal>
        <PullQuote text={c.powerbi.quote} accent={ACCENT} />
      </Band>

      <Band>
        <SectionTitle title={c.limits.title} />
        <ProseBlock paragraphs={c.limits.body} />
        <PullQuote text={c.limits.quote} accent={ACCENT} />
      </Band>

      <Band shaded>
        <SectionTitle title={c.quality.title} />
        <ProseBlock paragraphs={c.quality.body} />
        <Reveal variant="rise" sx={{ mt: { xs: 4, md: 5 } }}>
          <MetricsTable columns={c.quality.columns} rows={c.quality.rows} accent={ACCENT} />
        </Reveal>
        <FigureBlock figure={c.quality.figure} />
        <ProseBlock paragraphs={c.quality.after} delay={0} />
      </Band>

      <Band>
        <SectionTitle title={c.consistency.title} />
        <ProseWithCallouts
          paragraphs={c.consistency.body}
          callouts={c.consistency.callouts}
          accent={ACCENT}
        />
        <Reveal variant="rise" sx={{ mt: { xs: 4, md: 6 } }}>
          <BulletCard
            title={c.consistency.resultTitle}
            items={c.consistency.results}
            note={c.consistency.resultNote}
            accent={ACCENT}
          />
        </Reveal>
      </Band>

      <Band shaded>
        <SectionTitle title={c.pipeline.title} />
        <ProseBlock paragraphs={c.pipeline.body} />
        <FigureBlock figure={c.pipeline.figure} />
        <SubTitle title={c.pipeline.partsTitle} />
        <NumberedCards items={c.pipeline.parts} columns={3} accent={ACCENT} />
        <Reveal variant="rise" sx={{ mt: { xs: 4, md: 5 } }}>
          <ProseBlock paragraphs={c.pipeline.after} delay={0} />
        </Reveal>
      </Band>

      <ProjectClosing
        accent={ACCENT}
        title={c.shows.title}
        skills={c.shows.skills}
        closing={c.shows.closing}
        repoUrl={REPO_URL}
        labels={labels}
        footnotes={[c.ui.sources, c.ui.docs]}
      />
    </>
  );
}
