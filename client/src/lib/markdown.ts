import { SITE_URL } from "@/lib/seo";

/**
 * Helper for the plain-Markdown surfaces (llms.txt, llms-full.txt). Those
 * documents are fetched standalone, so root-relative links must become
 * absolute.
 */
export function absolutizeLinks(markdown: string): string {
  return markdown
    .replace(/\]\(\//g, `](${SITE_URL}/`)
    .replace(/href="\//g, `href="${SITE_URL}/`)
    .replace(/src="\//g, `src="${SITE_URL}/`);
}
