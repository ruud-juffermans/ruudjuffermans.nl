import { BLOG_FEED_URL, BLOG_URL } from "@/lib/blog";
import { getProjectItems } from "@/lib/content";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import nlMessages from "../../../messages/nl.json";

// Curated AI-discovery index (llms.txt convention): the whole portfolio in one
// small Markdown fetch. Dutch is the primary audience; the English mirror is
// noted once. Rendered at build time — a deploy accompanies every content change.
export const dynamic = "force-static";

export function GET() {
  const projects = getProjectItems("nl").map((p) => {
    const url = absoluteUrl("/projects/[slug]", "nl", { slug: p.slug });
    return `- [${p.title}](${url}): ${p.summary}`;
  });

  const body = `# ${nlMessages.site.title}

> ${nlMessages.site.description} Portfolio van een data-analist in Nederland, open voor een nieuwe rol.

Taal: Nederlands (primair), Engels onder ${SITE_URL}/en. Volledige inhoud in één bestand: ${SITE_URL}/llms-full.txt

## Projecten

${projects.join("\n")}

## Blog

- [Blog](${BLOG_URL}): technische artikelen (Engels) over datamodellering, SQL en data-engineering, op een eigen site
- Feed: ${BLOG_FEED_URL}

## Contact

- [Over Ruud Juffermans](${absoluteUrl("/about", "nl")}): achtergrond, ervaring en expertise
- [Datamodellering](${absoluteUrl("/expertise/[field]", "nl", { field: "data-modeling" })}): aanpak, ervaring en projecten in datamodellering
- [BI & rapportage](${absoluteUrl("/expertise/[field]", "nl", { field: "business-intelligence" })}): aanpak, ervaring en projecten in BI en rapportage
- [Contact](${absoluteUrl("/contact", "nl")}): neem contact op over een rol of een project
- LinkedIn: https://www.linkedin.com/in/r-j3
- GitHub: https://github.com/ruud-juffermans
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
