"use client";

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import { useSession, logoutSession } from "@/lib/session";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import NavDropdown, { type NavDropdownItem } from "./NavDropdown";

type StaticPathname = Exclude<AppPathname, `${string}[${string}]${string}`>;

// The central account app (login lives there, not on this site).
const accountLoginUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_URL ?? "https://account.ruudjuffermans.nl"}/login`;

// The platform's apps, shown in the header's Apps dropdown.
const APP_URLS = {
  fitness: "https://fitness.ruudjuffermans.nl",
  habit: "https://habit.ruudjuffermans.nl",
  journal: "https://journal.ruudjuffermans.nl",
} as const;

const SERVICE_SLUGS = ["data-engineering", "data-analytics", "ai-genai"] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tm = useTranslations("menus");
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, loading } = useSession();

  // Log in (link to the account app) or Log out (ends the platform session),
  // in the primary color. Nothing while the session check runs, to avoid a
  // Log in → Log out flash for signed-in visitors. return_url brings the user
  // back to the page they were on (computed on click — no URL at SSR time).
  const toLogin = () =>
    window.location.assign(
      `${accountLoginUrl}?return_url=${encodeURIComponent(window.location.href)}`,
    );
  const authButton = loading ? null : (
    <Button
      onClick={user ? () => void logoutSession() : toLogin}
      sx={{
        px: 2,
        minHeight: 38,
        color: palette.red,
        fontWeight: 600,
        fontSize: "0.92rem",
        "&:hover": {
          color: palette.redHover,
          backgroundColor: "transparent",
        },
      }}
    >
      {user ? tc("logout") : tc("login")}
    </Button>
  );

  const navItems: { label: string; href: StaticPathname }[] = [
    { label: t("portfolio"), href: "/portfolio" },
    { label: t("blog"), href: "/blog" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  const serviceMenuKeys = ["dataEngineering", "dataAnalytics", "aiGenai"] as const;
  const serviceItems: NavDropdownItem[] = serviceMenuKeys.map((key, i) => ({
    title: tm(`services.${key}.title`),
    desc: tm(`services.${key}.desc`),
    href: { pathname: "/services/[slug]", params: { slug: SERVICE_SLUGS[i] } },
  }));

  const appItems: NavDropdownItem[] = (["fitness", "habit", "journal"] as const).map((app) => ({
    title: tm(`apps.${app}.title`),
    desc: tm(`apps.${app}.desc`),
    external: APP_URLS[app],
    icon: tm(`apps.${app}.title`).charAt(0),
  }));

  return (
    <>
      <AppBar position="sticky" sx={{px:5}}>
          <Toolbar
            disableGutters
            sx={{ justifyContent: "space-between", minHeight: { xs: 60, lg: 68 } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                sx={{
                  color: palette.gray900,
                  ml: -1,
                  display: { xs: "inline-flex", lg: "none" },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Box
                component={Link}
                href="/"
                sx={{
                  textDecoration: "none",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: { xs: "1.15rem", lg: "1.3rem" },
                  color: palette.gray900,
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                  "&:hover": { color: palette.red },
                  transition: "color 0.2s",
                }}
              >
                Ruud Juffermans
              </Box>
            </Box>

            {/* Desktop nav */}
            <Box>
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <NavDropdown
                label={t("services")}
                active={pathname.startsWith("/services")}
                items={serviceItems}
                footer={{ label: tm("services.all"), href: "/services" }}
              />
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: pathname === item.href ? palette.red : "var(--app-text-secondary)",
                    fontWeight: pathname === item.href ? 600 : 500,
                    fontSize: "0.92rem",
                    px: 2,
                    minHeight: 38,
                    position: "relative",
                    "&::after":
                      pathname === item.href
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 18,
                            height: 2,
                            borderRadius: 1,
                            backgroundColor: palette.red,
                          }
                        : {},
                    "&:hover": {
                      color: palette.red,
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <NavDropdown label={t("apps")} items={appItems} />
              <Box sx={{ ml: 1.5, display: "flex", alignItems: "center", gap: 0.5, mr:4 }}>
                <ThemeSwitcher />
                <LanguageSwitcher />
              </Box>
              
              <Button
                variant="contained"
                component={Link}
                href="/contact"
                size="small"
                sx={{ ml: 0.5, px: 3.5 }}
              >
                {tc("cta")}
              </Button>
              <Box sx={{ ml: 1.5 }}>{authButton}</Box>
            </Box>

            {/* Mobile CTA */}
            <Button
              variant="contained"
              component={Link}
              href="/contact"
              size="small"
              sx={{ display: { xs: "inline-flex", lg: "none" }, px: 3 }}
            >
              {tc("contact")}
            </Button>
            <Box sx={{ ml: 0, display: { xs: "inline-flex", lg: "none" }}}>{authButton}</Box>
            </Box>
          </Toolbar>
   
      </AppBar>

      {/* Mobile navigation drawer — large editorial links, controls at the bottom */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "min(86vw, 360px)",
            backgroundColor: "var(--app-bg)",
            backgroundImage: "none",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid var(--app-border-soft)`,
            "@keyframes navItemIn": {
              from: { opacity: 0, transform: "translateX(-14px)" },
              to: { opacity: 1, transform: "translateX(0)" },
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3.5,
            pt: 2.5,
            pb: 1,
          }}
        >
          <Box
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: palette.gray900,
              letterSpacing: "-0.02em",
            }}
          >
            Ruud Juffermans
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close menu" sx={{ mr: -1 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="nav" sx={{ flex: 1, px: 2, pt: 3, overflowY: "auto" }}>
          {/* Services: big link to the overview + the three service pages. */}
          <Box
            component={Link}
            href="/services"
            onClick={() => setDrawerOpen(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textDecoration: "none",
              px: 2,
              py: 1.8,
              borderRadius: 3,
              fontFamily: "var(--font-heading)",
              fontWeight: pathname === "/services" ? 700 : 600,
              fontSize: "1.55rem",
              letterSpacing: "-0.02em",
              color: pathname === "/services" ? palette.red : palette.gray900,
              backgroundColor: pathname === "/services" ? palette.redMuted : "transparent",
              animation: drawerOpen ? `navItemIn 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both` : "none",
              animationDelay: "80ms",
              "&:active": { backgroundColor: palette.redMuted },
            }}
          >
            {t("services")}
            {pathname === "/services" && <ArrowForwardIcon sx={{ fontSize: 20, color: palette.red }} />}
          </Box>
          <Box sx={{ pl: 2, mb: 1 }}>
            {serviceItems.map((item, i) => {
              const slug = SERVICE_SLUGS[i];
              const active = pathname === `/services/${slug}`;
              return (
                <Box
                  key={item.title}
                  component={Link}
                  href={item.href!}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    px: 2,
                    py: 0.9,
                    borderRadius: 2,
                    fontWeight: active ? 600 : 500,
                    fontSize: "1.02rem",
                    color: active ? palette.red : "var(--app-text-secondary)",
                    animation: drawerOpen
                      ? `navItemIn 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both`
                      : "none",
                    animationDelay: `${115 + i * 40}ms`,
                    "&:active": { backgroundColor: palette.redMuted },
                  }}
                >
                  {item.title}
                </Box>
              );
            })}
          </Box>
          {navItems.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Box
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  px: 2,
                  py: 1.8,
                  mb: 0.5,
                  borderRadius: 3,
                  fontFamily: "var(--font-heading)",
                  fontWeight: active ? 700 : 600,
                  fontSize: "1.55rem",
                  letterSpacing: "-0.02em",
                  color: active ? palette.red : palette.gray900,
                  backgroundColor: active ? palette.redMuted : "transparent",
                  animation: drawerOpen
                    ? `navItemIn 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both`
                    : "none",
                  animationDelay: `${260 + i * 55}ms`,
                  "&:active": { backgroundColor: palette.redMuted },
                }}
              >
                {item.label}
                {active && <ArrowForwardIcon sx={{ fontSize: 20, color: palette.red }} />}
              </Box>
            );
          })}

          {/* Apps: the platform's tools, external links. */}
          <Box
            sx={{
              px: 2,
              pt: 2.5,
              pb: 0.75,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--app-text-secondary)",
              animation: drawerOpen ? `navItemIn 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both` : "none",
              animationDelay: "480ms",
            }}
          >
            {t("apps")}
          </Box>
          {appItems.map((item, i) => (
            <Box
              key={item.title}
              component="a"
              href={item.external}
              onClick={() => setDrawerOpen(false)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                px: 2,
                py: 0.9,
                borderRadius: 2,
                animation: drawerOpen ? `navItemIn 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both` : "none",
                animationDelay: `${515 + i * 40}ms`,
                "&:active": { backgroundColor: palette.redMuted },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 30,
                  height: 30,
                  flexShrink: 0,
                  borderRadius: "9px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: palette.redMuted,
                  color: palette.red,
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ fontWeight: 500, fontSize: "1.02rem", color: "var(--app-text-secondary)" }}>
                {item.title}
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mx: 3.5 }} />
        <Box
          sx={{
            px: 3.5,
            pt: 2,
            pb: "calc(20px + env(safe-area-inset-bottom))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeSwitcher />
            <LanguageSwitcher variant="compact" />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {authButton}
            <Button
              variant="contained"
              component={Link}
              href="/contact"
              size="small"
              onClick={() => setDrawerOpen(false)}
              sx={{ px: 3 }}
            >
              {tc("cta")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
