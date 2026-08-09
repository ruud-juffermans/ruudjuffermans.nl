import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/services": {
      nl: "/diensten",
      en: "/services",
    },
    "/services/[slug]": {
      nl: "/diensten/[slug]",
      en: "/services/[slug]",
    },
    "/projects": {
      nl: "/projecten",
      en: "/projects",
    },
    "/projects/[slug]": {
      nl: "/projecten/[slug]",
      en: "/projects/[slug]",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/about": {
      nl: "/over-mij",
      en: "/about",
    },
    "/contact": "/contact",
    "/privacy": "/privacy",
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
