import { getBlogPosts, getProjectItems } from "@/lib/content";
import { PACKAGES, formatAmount, type PackageDef } from "@/lib/packages";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import nlMessages from "../../../messages/nl.json";

// Curated AI-discovery index (llms.txt convention): the whole business in one
// small Markdown fetch. Dutch is the primary audience; the English mirror is
// noted once. Rendered at build time — a deploy accompanies every content change.
export const dynamic = "force-static";

type PackageMessages = Record<string, { name: string; navDesc: string; duration: string }>;

function priceLabel(pkg: PackageDef): string {
  const charged = pkg.discountPrice ?? pkg.price;
  if (charged === null) return "prijs op aanvraag";
  const amount = formatAmount(charged, "nl");
  return pkg.priceKind === "from" ? `vanaf ${amount}` : `vaste prijs ${amount}`;
}

export function GET() {
  const packages = nlMessages.packages as unknown as PackageMessages;
  const services = PACKAGES.map((pkg) => {
    const m = packages[pkg.slug];
    const url = absoluteUrl("/services/[slug]", "nl", { slug: pkg.slug });
    return `- [${m.name}](${url}): ${m.navDesc} (${priceLabel(pkg)}, ${m.duration})`;
  });

  const projects = getProjectItems("nl").map((p) => {
    const url = absoluteUrl("/projects/[slug]", "nl", { slug: p.slug });
    return `- [${p.title}](${url}): ${p.summary}`;
  });

  // Posts link to their Markdown twin — the cheapest representation for an
  // AI fetcher (~1.5K tokens instead of the full HTML page).
  const posts = getBlogPosts("nl").map(
    (p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}.md): ${p.excerpt}`,
  );

  const body = `# ${nlMessages.site.title}

> ${nlMessages.site.description} Freelance data- & AI-engineer voor het mkb in Nederland, met pakketten met vaste scope en vaste prijs.

Taal: Nederlands (primair), Engels onder ${SITE_URL}/en. Volledige inhoud in één bestand: ${SITE_URL}/llms-full.txt

## Diensten

${services.join("\n")}

## Projecten

${projects.join("\n")}

## Blog

${posts.join("\n")}

## Contact

- [Contact](${absoluteUrl("/contact", "nl")}): plan een vrijblijvend gesprek
- [Over Ruud Juffermans](${absoluteUrl("/about", "nl")})
- RSS: ${SITE_URL}/feed.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
