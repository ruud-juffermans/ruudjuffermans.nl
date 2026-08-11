# SEO & performance checklist

Combined findings from PageSpeed Insights (mobile + desktop, Aug 11, 2026,
tested on `/en`) plus earlier live-site checks. Scores at time of writing:

|                | Mobile | Desktop |
| -------------- | ------ | ------- |
| Performance    | 81     | 68      |
| Accessibility  | 91     | 94      |
| Best Practices | 96     | 96      |
| SEO            | 92     | 92      |

Field data (CrUX): none yet — Core Web Vitals have no ranking effect until
real-user data accumulates. Lab findings below.

## Bugs — fix first

- [ ] **Canonical/hreflang/sitemap URLs point at `www.`** — every page declares
      `https://www.ruudjuffermans.nl/...` as canonical, but www 308-redirects to
      the apex. Cause: `NEXT_PUBLIC_SITE_URL` env var in Dokploy overrides the
      compose default. Fix there (set to `https://ruudjuffermans.nl` or unset)
      and **rebuild** — it's baked in at build time. Clears the Lighthouse SEO
      audit "Document does not have a valid rel=canonical".
- [x] **Unknown paths containing a dot return 500 instead of 404** — fixed.
      The crash was `getTranslations`/`Intl.NumberFormat` receiving the path
      (e.g. `llms.txt`) as a locale before any validation ran. Guards added in
      `[locale]/layout.tsx` `generateMetadata` and the home page component
      (pages render in parallel with the layout, so the layout guard alone
      isn't enough), plus a root `app/not-found.tsx` (+ pass-through root
      layout) to catch it. Verified: `/llms.txt`, `/foo.txt` → 404.
- [ ] **Desktop CLS 0.928 (mobile is 0) — investigated, root cause still open.**
      Reproduces locally (`next start` + Lighthouse desktop) with the exact
      same 0.928, so it's deterministic, not a network race. Trace filmstrip
      shows a **flash of completely unstyled content at hydration** (~640ms):
      one frame renders raw HTML (unstyled links, full-size SVGs, nav dropdown
      content in flow), the next is fully styled — the restyle is the "shift".
      Ruled out by experiment: web-font swap (now preloaded via next/font with
      metric-adjusted fallback — kept anyway, it's correct), HeroCircles,
      SplitText, hydration mismatch (no React #418/#423 in console), Suspense
      streaming (prod HTML is complete, no $RC swap), stale framework (Next
      15.5.23 / React 19.2.7). CSS links are render-blocking in `<head>` and
      serve 200 — yet a pre-CSS frame paints. Next step: reproduce headful
      with DevTools Performance panel and inspect which styles detach at
      hydration (React `data-precedence` stylesheet adoption is the suspect).
- [ ] **Console errors on page load** — locally this is the analytics beacon
      (dev rewrite target :4000 not running → 500); on production, check
      DevTools on the live site — likely the same beacon or a blocked request.

## SEO — off-repo actions

- [ ] Fix the www env var (above), redeploy, spot-check
      `curl -s https://ruudjuffermans.nl/ | grep canonical`.
- [ ] **Google Search Console**: add a Domain property for `ruudjuffermans.nl`
      (DNS TXT record), verify, then submit `sitemap.xml` — *after* the www
      fix so Google's first read has correct URLs. Request indexing for the
      homepage via URL Inspection.
- [ ] Bing Webmaster Tools: one-click import from GSC (optional).
- [ ] Validate a blog post in Google's Rich Results Test (JSON-LD).
- [ ] Check OG cards: LinkedIn Post Inspector + paste a URL in Slack/Discord.
- [ ] **Decide: locale-detection redirect.** `/` currently 307s
      English-header visitors (incl. Googlebot, which crawls with English
      headers from the US) to `/en` — it's also why PSI tested `/en`. For a
      Dutch-first site, `localeDetection: false` in the next-intl routing
      config is the SEO-safe choice: `/` always serves Dutch, humans use the
      NL/EN toggle. Tradeoff: English visitors land on Dutch first.
- [ ] **Content** — the real ranking lever now: Dutch blog posts answering
      what prospective clients search, internally linked to service pages.
- [ ] **Backlinks** — link the site from LinkedIn, Udemy instructor profile,
      GitHub profile.

## Performance — worth doing

- [x] **Hero LCP render delay** — fixed. SplitText now ships the headline
      visible in the server HTML and only hides/animates it once JS has
      mounted, so the h1 paints at FCP instead of waiting ~1.5s for
      hydration. (Reveal-wrapped blocks still fade in; only the LCP h1
      needed this.) Fonts also moved from @fontsource CSS imports to
      next/font/local: preloaded woff2 + size-adjusted fallback.
- [ ] **Forced reflow (~70ms)** — scroll handler reads geometry
      (`getBoundingClientRect` in FlowLines / homepage code) after style
      invalidation. Batch reads before writes or cache measurements.
- [x] **Preconnect to `https://api.ruudjuffermans.nl`** — added in the locale
      layout head, emitted only when `NEXT_PUBLIC_API_URL` is set (i.e. prod).
- [ ] **Render-blocking CSS** — 870ms est. savings on mobile (110ms desktop),
      three CSS chunks. Worth a look at what's inlineable/deferrable, but
      lower priority than the items above.

## Performance — low priority / ignore

- Non-composited animations (89–95 elements: FlowLines dashes, ServicesShowcase
  wires, MUI hover transitions) — decorative and cheap; ignore unless they
  cause visible jank. The CLS entry above is the only one that matters.
- Legacy JavaScript (13 KiB), minify CSS (3 KiB), unused CSS (20–24 KiB),
  unused JS (25 KiB) — single-digit real-world impact; skip.
- DOM size (1,246 elements) — fine.
- Agentic Browsing category (0–1/3) — experimental; only actionable item was
  the 500 bug, tracked above.

## Accessibility — all fixed, local Lighthouse a11y score now 100

- [x] **Icon-only links** — `aria-label`s added to the footer LinkedIn /
      GitHub / e-mail IconButtons.
- [x] **Heading levels** — card/item titles on the homepage now render as
      `<h3>` (keeping their visual variant), the accordion title no longer
      nests a heading inside MUI's own `<h3>`, and `subtitle1/2` map to
      `<p>` instead of `<h6>` via the theme's variantMapping.
- [x] **Color contrast** — two real failures found and fixed: the contained
      primary button used white text on the pale dark-mode blue `#60a5fa`
      (2.5:1); text on accent is now the per-scheme `--app-on-red` token
      (white in light mode, dark navy ink in dark mode). Footer copyright
      alpha raised 0.40 → 0.55 to clear 4.5:1.

## Best practices / hardening (no SEO effect)

- [x] Security headers added in `next.config.ts`: HSTS (2y, subdomains),
      COOP `same-origin`, Permissions-Policy, and a production-only CSP
      (self-only + platform API in connect-src; 'unsafe-inline' retained for
      Next bootstrap + Emotion). X-Frame-Options/nosniff/Referrer-Policy were
      already present.
- [ ] Trusted Types (advanced CSP) — optional, skip unless bored.

## GitHub — remaining polish

- [x] README with screenshot + live link
- [x] CI (typecheck + build), Dependabot, `.nvmrc`
- [x] Repo description, topics, homepage, social preview
- [x] Legacy code removed, work committed in reviewable pieces
- [ ] CI status badge in the README (one line)
- [ ] Pin the repo on your GitHub profile
