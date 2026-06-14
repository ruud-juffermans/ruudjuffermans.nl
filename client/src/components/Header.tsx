"use client";

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

type StaticPathname = Exclude<AppPathname, `${string}[${string}]${string}`>;

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems: { label: string; href: StaticPathname }[] = [
    { label: t("services"), href: "/services" },
    { label: t("portfolio"), href: "/portfolio" },
    { label: t("blog"), href: "/blog" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 0.5 }}>
            <Box
              component={Link}
              href="/"
              sx={{
                textDecoration: "none",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1.35rem",
                color: palette.gray900,
                letterSpacing: "-0.02em",
                "&:hover": { color: palette.red },
                transition: "color 0.2s",
              }}
            >
              Ruud Juffermans
            </Box>

            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: pathname === item.href ? palette.red : palette.gray600,
                      fontWeight: pathname === item.href ? 600 : 500,
                      fontSize: "0.95rem",
                      px: 2,
                      position: "relative",
                      "&::after": pathname === item.href
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 6,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 20,
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
                <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                </Box>
                <Button
                  variant="contained"
                  component={Link}
                  href="/contact"
                  size="small"
                  sx={{ ml: 1.5, py: 1, px: 3 }}
                >
                  {tc("cta")}
                </Button>
              </Box>
            )}

            {isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  component={Link}
                  href="/contact"
                  size="small"
                  sx={{ py: 0.8, px: 2, fontSize: "0.85rem" }}
                >
                  {tc("contact")}
                </Button>
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: palette.gray900 }}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, pt: 2 },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, mb: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              selected={pathname === item.href}
              sx={{
                px: 3,
                py: 1.5,
                "&.Mui-selected": {
                  backgroundColor: palette.redMuted,
                  color: palette.red,
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <ThemeSwitcher />
          <LanguageSwitcher variant="compact" />
        </Box>
      </Drawer>
    </>
  );
}
