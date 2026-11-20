import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { routing, type Locale } from "@/i18n/routing";

const contentDir = path.join(process.cwd(), "content");

// Projects with a bespoke page under app/[locale]/projects/<slug>/ instead of
// the generic MDX article. Their MDX file still supplies the frontmatter for
// listings, the sitemap, the OG image and llms-full.txt; the generic
// [slug] route must skip them or its prerender overwrites the custom page.
export const CUSTOM_PROJECT_PAGES: ReadonlySet<string> = new Set([
  "ov-streaming-pipeline",
  "open-data-warehouse",
]);
const DEFAULT_LOCALE = routing.defaultLocale;

export interface ProjectStat {
  label: string;
  value: string;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  industry: string;
  summary: string;
  tags: string[];
  duration: string;
  thumbnail?: string;
  /** 2–3 hard numbers from the case study, rendered as the card's stats strip. */
  stats?: ProjectStat[];
  /** Public repository backing the "verifiable in the repo" claim. */
  repo?: string;
  /** Section accent colour (hex) used by the project's band on /projects. */
  accent?: string;
}

function listSlugs(kind: "projects", locale: Locale): string[] {
  const dir = path.join(contentDir, kind, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function resolveFile(kind: "projects", locale: Locale, slug: string) {
  const primary = path.join(contentDir, kind, locale, `${slug}.mdx`);
  if (fs.existsSync(primary)) return { filePath: primary, usedFallback: false };
  if (locale !== DEFAULT_LOCALE) {
    const fallback = path.join(contentDir, kind, DEFAULT_LOCALE, `${slug}.mdx`);
    if (fs.existsSync(fallback)) return { filePath: fallback, usedFallback: true };
  }
  return null;
}

export function getProjectItems(locale: Locale = DEFAULT_LOCALE): ProjectMeta[] {
  const localeSlugs = new Set(listSlugs("projects", locale));
  const fallbackSlugs = listSlugs("projects", DEFAULT_LOCALE);
  const slugs = Array.from(new Set([...localeSlugs, ...fallbackSlugs]));

  return slugs
    .map((slug) => {
      const resolved = resolveFile("projects", locale, slug);
      if (!resolved) return null;
      const raw = fs.readFileSync(resolved.filePath, "utf-8");
      const { data } = matter(raw);
      return projectMetaFromFrontmatter(slug, data);
    })
    .filter((p): p is ProjectMeta => p !== null);
}

function projectMetaFromFrontmatter(
  slug: string,
  data: Record<string, unknown>
): ProjectMeta {
  return {
    slug,
    title: data.title || "Untitled",
    industry: data.industry || "",
    summary: data.summary || "",
    tags: data.tags || [],
    duration: data.duration || "",
    thumbnail: data.thumbnail,
    stats: data.stats,
    repo: data.repo,
    accent: data.accent,
  } as ProjectMeta;
}

export function getProjectItem(locale: Locale, slug: string) {
  const resolved = resolveFile("projects", locale, slug);
  if (!resolved) return null;

  const raw = fs.readFileSync(resolved.filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: projectMetaFromFrontmatter(slug, data),
    content,
    usedFallback: resolved.usedFallback,
  };
}
