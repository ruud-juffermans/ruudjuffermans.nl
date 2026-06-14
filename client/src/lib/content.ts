import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { routing, type Locale } from "@/i18n/routing";

const contentDir = path.join(process.cwd(), "content");
const DEFAULT_LOCALE = routing.defaultLocale;

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
}

export interface PortfolioMeta {
  slug: string;
  title: string;
  industry: string;
  summary: string;
  tags: string[];
  duration: string;
  thumbnail?: string;
}

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

function listSlugs(kind: "blog" | "portfolio", locale: Locale): string[] {
  const dir = path.join(contentDir, kind, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function resolveFile(kind: "blog" | "portfolio", locale: Locale, slug: string) {
  const primary = path.join(contentDir, kind, locale, `${slug}.mdx`);
  if (fs.existsSync(primary)) return { filePath: primary, usedFallback: false };
  if (locale !== DEFAULT_LOCALE) {
    const fallback = path.join(contentDir, kind, DEFAULT_LOCALE, `${slug}.mdx`);
    if (fs.existsSync(fallback)) return { filePath: fallback, usedFallback: true };
  }
  return null;
}

export function getBlogPosts(locale: Locale = DEFAULT_LOCALE): PostMeta[] {
  const localeSlugs = new Set(listSlugs("blog", locale));
  const fallbackSlugs = listSlugs("blog", DEFAULT_LOCALE);
  const slugs = Array.from(new Set([...localeSlugs, ...fallbackSlugs]));

  return slugs
    .map((slug) => {
      const resolved = resolveFile("blog", locale, slug);
      if (!resolved) return null;
      const raw = fs.readFileSync(resolved.filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || "",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        readingTime: estimateReadingTime(content),
      } as PostMeta;
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(locale: Locale, slug: string) {
  const resolved = resolveFile("blog", locale, slug);
  if (!resolved) return null;

  const raw = fs.readFileSync(resolved.filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: data.title || "Untitled",
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      readingTime: estimateReadingTime(content),
    } as PostMeta,
    content,
    usedFallback: resolved.usedFallback,
  };
}

export function getPortfolioItems(locale: Locale = DEFAULT_LOCALE): PortfolioMeta[] {
  const localeSlugs = new Set(listSlugs("portfolio", locale));
  const fallbackSlugs = listSlugs("portfolio", DEFAULT_LOCALE);
  const slugs = Array.from(new Set([...localeSlugs, ...fallbackSlugs]));

  return slugs
    .map((slug) => {
      const resolved = resolveFile("portfolio", locale, slug);
      if (!resolved) return null;
      const raw = fs.readFileSync(resolved.filePath, "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || "Untitled",
        industry: data.industry || "",
        summary: data.summary || "",
        tags: data.tags || [],
        duration: data.duration || "",
        thumbnail: data.thumbnail,
      } as PortfolioMeta;
    })
    .filter((p): p is PortfolioMeta => p !== null);
}

export function getPortfolioItem(locale: Locale, slug: string) {
  const resolved = resolveFile("portfolio", locale, slug);
  if (!resolved) return null;

  const raw = fs.readFileSync(resolved.filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: data.title || "Untitled",
      industry: data.industry || "",
      summary: data.summary || "",
      tags: data.tags || [],
      duration: data.duration || "",
      thumbnail: data.thumbnail,
    } as PortfolioMeta,
    content,
    usedFallback: resolved.usedFallback,
  };
}
