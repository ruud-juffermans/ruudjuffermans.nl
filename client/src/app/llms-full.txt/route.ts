import { BLOG_URL } from "@/lib/blog";
import { getProjectItem, getProjectItems } from "@/lib/content";
import { absolutizeLinks } from "@/lib/markdown";
import { absoluteUrl } from "@/lib/seo";
import nlMessages from "../../../messages/nl.json";

// The full corpus as one Markdown file (llms-full.txt convention): every
// project, so an AI system can ingest the entire portfolio in a single
// fetch. Rendered at build time, like the sitemap. The blog posts live on
// blog.ruudjuffermans.nl and are only pointed to here.
export const dynamic = "force-static";

export function GET() {
  const about = nlMessages.about;
  const experience = about.experience
    .map((e) => `- **${e.period} — ${e.role}, ${e.org}**\n${e.bullets.map((b) => `  - ${b}`).join("\n")}`)
    .join("\n");

  const projects = getProjectItems("nl").map((meta) => {
    const item = getProjectItem("nl", meta.slug)!;
    return `## ${meta.title}

URL: ${absoluteUrl("/projects/[slug]", "nl", { slug: meta.slug })}

${meta.summary}

${absolutizeLinks(item.content.trim())}`;
  });

  const body = `# ${nlMessages.site.title}

> ${nlMessages.site.description}

Portfolio van een data engineer in Nederland, open voor een nieuwe rol. Contact: ${absoluteUrl("/contact", "nl")}

# Over

URL: ${absoluteUrl("/about", "nl")}

${about.intro1}

${about.intro2}

${about.intro3}

## Ervaring

${experience}

# Projecten

${projects.join("\n\n---\n\n")}

# Blog

De technische artikelen (Engels) staan op een eigen site: ${BLOG_URL}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
