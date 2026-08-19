import { getBlogPost, getBlogPosts, getProjectItem, getProjectItems } from "@/lib/content";
import { PACKAGES, formatAmount, type PackageDef } from "@/lib/packages";
import { absolutizeLinks } from "@/lib/markdown";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import nlMessages from "../../../messages/nl.json";

// The full corpus as one Markdown file (llms-full.txt convention): every
// service, project and post, so an AI system can ingest the entire business
// in a single fetch. ~17 content pages keeps this well under a 100K-token
// budget. Rendered at build time, like the sitemap and feed.
export const dynamic = "force-static";

interface PackageMessages {
  name: string;
  intro: string;
  promise: string;
  duration: string;
  deliverableGroups: { title: string; items: string[] }[];
  notIncluded: string[];
}

function priceLine(pkg: PackageDef): string {
  const charged = pkg.discountPrice ?? pkg.price;
  if (charged === null) return "Prijs op aanvraag (vaste prijs na scoping).";
  const amount = formatAmount(charged, "nl");
  return pkg.priceKind === "from"
    ? `Vanaf ${amount} excl. btw, vaste prijs na scoping.`
    : `Vaste prijs: ${amount} excl. btw.`;
}

function packageSection(pkg: PackageDef): string {
  const m = (nlMessages.packages as unknown as Record<string, PackageMessages>)[pkg.slug];
  const groups = m.deliverableGroups
    .map((g) => `**${g.title}**\n\n${g.items.map((i) => `- ${i}`).join("\n")}`)
    .join("\n\n");
  return `## ${m.name}

URL: ${absoluteUrl("/services/[slug]", "nl", { slug: pkg.slug })}

${m.intro}

${m.promise}

${priceLine(pkg)} Doorlooptijd: ${m.duration}.

${groups}

**Niet inbegrepen**

${m.notIncluded.map((i) => `- ${i}`).join("\n")}`;
}

export function GET() {
  const services = PACKAGES.map(packageSection);

  const projects = getProjectItems("nl").map((meta) => {
    const item = getProjectItem("nl", meta.slug)!;
    return `## ${meta.title}

URL: ${absoluteUrl("/projects/[slug]", "nl", { slug: meta.slug })}

${meta.summary}

${absolutizeLinks(item.content.trim())}`;
  });

  const posts = getBlogPosts("nl").map((meta) => {
    const post = getBlogPost("nl", meta.slug)!;
    return `## ${meta.title}

URL: ${absoluteUrl("/blog/[slug]", "nl", { slug: meta.slug })} (Markdown: ${SITE_URL}/blog/${meta.slug}.md)
Datum: ${meta.date}

${absolutizeLinks(post.content.trim())}`;
  });

  const body = `# ${nlMessages.site.title}

> ${nlMessages.site.description}

Freelance data- & AI-engineer voor het mkb in Nederland. Pakketten met vaste scope en vaste prijs. Contact: ${absoluteUrl("/contact", "nl")}

# Diensten

${services.join("\n\n---\n\n")}

# Projecten

${projects.join("\n\n---\n\n")}

# Blog

${posts.join("\n\n---\n\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
