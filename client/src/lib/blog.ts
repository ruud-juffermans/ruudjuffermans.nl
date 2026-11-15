/**
 * The blog lives on its own site (the Jekyll blog in the blog-site repo). The
 * portfolio links to it, redirects its old /blog URLs there (next.config.ts)
 * and shows the latest posts on the homepage from the blog's Atom feed.
 *
 * Imported by client components (Header, Footer) too, so keep it free of
 * server-only modules.
 */
export const BLOG_URL = "https://blog.ruudjuffermans.nl";
export const BLOG_FEED_URL = `${BLOG_URL}/feed.xml`;

export interface BlogPost {
  slug: string;
  title: string;
  /** Absolute URL of the post on the blog. */
  url: string;
  /** ISO timestamp from the feed's <published>. */
  date: string;
  /** The post's category, shown as the card's label. */
  category: string;
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
};

function decode(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&(amp|lt|gt|quot|apos|#39);/g, (m) => ENTITIES[m] ?? m)
    .trim();
}

/** Parses the entries of the blog's Atom feed (as jekyll-feed/Chirpy emit it). */
export function parseBlogFeed(xml: string): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const [, entry] of xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/g)) {
    const title = entry.match(/<title\b[^>]*>([\s\S]*?)<\/title>/)?.[1];
    const url = entry.match(/<link\b[^>]*\bhref="([^"]+)"/)?.[1];
    if (!title || !url) continue;
    posts.push({
      slug: new URL(url, BLOG_URL).pathname.replace(/^\/|\/$/g, "") || url,
      title: decode(title),
      url: new URL(decode(url), BLOG_URL).toString(),
      date: entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim() ?? "",
      category: decode(entry.match(/<category\b[^>]*\bterm="([^"]*)"/)?.[1] ?? ""),
    });
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * The most recent posts on the blog, newest first. Cached and refreshed at
 * most once an hour, so a new post shows up on the homepage without a
 * portfolio deploy. Returns [] when the blog can't be reached (the homepage
 * then hides the section) — the portfolio must build and render without it.
 */
export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const res = await fetch(BLOG_FEED_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    return parseBlogFeed(await res.text()).slice(0, limit);
  } catch {
    return [];
  }
}
