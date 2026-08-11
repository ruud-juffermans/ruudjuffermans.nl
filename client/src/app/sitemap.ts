import type { MetadataRoute } from "next";
import { getBlogPosts, getProjectItems } from "@/lib/content";
import { PACKAGE_SLUGS } from "@/lib/packages";
import { absoluteUrl } from "@/lib/seo";
import type { AppPathname } from "@/i18n/routing";

const STATIC_ROUTES: AppPathname[] = [
  "/",
  "/services",
  "/projects",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
];

function entry(
  href: AppPathname,
  params?: Record<string, string>,
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  const nl = absoluteUrl(href, "nl", params);
  const en = absoluteUrl(href, "en", params);
  return {
    url: nl,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    alternates: { languages: { nl, en } },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // getBlogPosts/getProjectItems already union locale + fallback slugs, so the
  // default-locale listing covers every published slug.
  const posts = getBlogPosts("nl");
  const projects = getProjectItems("nl");

  return [
    ...STATIC_ROUTES.map((href) => entry(href)),
    ...PACKAGE_SLUGS.map((slug) => entry("/services/[slug]", { slug })),
    ...projects.map((p) => entry("/projects/[slug]", { slug: p.slug })),
    ...posts.map((p) => entry("/blog/[slug]", { slug: p.slug }, p.date)),
  ];
}
