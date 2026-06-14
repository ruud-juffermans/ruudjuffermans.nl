"use client";

import { Box, Container, Typography, TextField, Button, IconButton, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { palette } from "@/theme/theme";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

type StaticPathname = Exclude<AppPathname, `${string}[${string}]${string}`>;

/**
 * Footer color tokens — hard-coded to a white-on-navy spectrum so they remain
 * identical in both light and dark color schemes. The footer's navy background
 * is already an absolute color; these foreground values complete the lock-in.
 */
const FC = {
  heading: "rgba(255, 255, 255, 0.85)",
  body: "rgba(255, 255, 255, 0.50)",
  link: "rgba(255, 255, 255, 0.65)",
  linkHover: "#FFFFFF",
  copyright: "rgba(255, 255, 255, 0.40)",
  contactInfo: "rgba(255, 255, 255, 0.30)",
  icon: "rgba(255, 255, 255, 0.55)",
  iconHover: "#FFFFFF",
  hairline: "rgba(255, 255, 255, 0.30)",
  inputBg: "rgba(255, 255, 255, 0.06)",
  inputBorder: "rgba(255, 255, 255, 0.12)",
  inputBorderHover: "rgba(255, 255, 255, 0.24)",
  inputText: "#FFFFFF",
  inputPlaceholder: "rgba(255, 255, 255, 0.40)",
  divider: "rgba(255, 255, 255, 0.08)",
};

export default function Footer() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await subscribeNewsletter(email);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const servicesLinks: { label: string; href: StaticPathname }[] = [
    { label: t("servicesLinks.data"), href: "/services" },
    { label: t("servicesLinks.ai"), href: "/services" },
    { label: t("servicesLinks.training"), href: "/services" },
  ];

  const moreLinks: { label: string; href: StaticPathname }[] = [
    { label: t("moreLinks.portfolio"), href: "/portfolio" },
    { label: t("moreLinks.blog"), href: "/blog" },
    { label: t("moreLinks.about"), href: "/about" },
    { label: t("moreLinks.privacy"), href: "/privacy" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: palette.navy,
        color: FC.body,
        pt: 10,
        pb: 4,
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          pointerEvents: "none",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${palette.red}, transparent)`,
          opacity: 0.3,
        },
      }}
    >
      <Container>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1.35rem",
                color: "#FFFFFF",
                mb: 2,
              }}
            >
              Ruud Juffermans
            </Typography>
            <Typography variant="body2" sx={{ color: FC.body, mb: 3, maxWidth: 280 }}>
              {t("tagline")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                component="a"
                href="https://linkedin.com/in/ruudjuf"
                target="_blank"
                rel="noopener"
                sx={{ color: FC.icon, "&:hover": { color: FC.iconHover } }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://github.com/ruudjuf"
                target="_blank"
                rel="noopener"
                sx={{ color: FC.icon, "&:hover": { color: FC.iconHover } }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                component="a"
                href="mailto:ruudjuffermans@pm.me"
                sx={{ color: FC.icon, "&:hover": { color: FC.iconHover } }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="overline" sx={{ color: FC.heading, mb: 2, display: "block" }}>
              {t("servicesHeading")}
            </Typography>
            {servicesLinks.map((item, i) => (
              <Box
                key={`${item.label}-${i}`}
                component={Link}
                href={item.href}
                sx={{
                  display: "block",
                  color: FC.link,
                  textDecoration: "none",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  mb: 1,
                  "&:hover": { color: FC.linkHover },
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </Box>
            ))}
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="overline" sx={{ color: FC.heading, mb: 2, display: "block" }}>
              {t("moreHeading")}
            </Typography>
            {moreLinks.map((item) => (
              <Box
                key={item.label}
                component={Link}
                href={item.href}
                sx={{
                  display: "block",
                  color: FC.link,
                  textDecoration: "none",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  mb: 1,
                  "&:hover": { color: FC.linkHover },
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </Box>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="overline" sx={{ color: FC.heading, mb: 2, display: "block" }}>
              {t("newsletterHeading")}
            </Typography>
            <Typography variant="body2" sx={{ color: FC.body, mb: 2 }}>
              {t("newsletterBody")}
            </Typography>
            <Box component="form" onSubmit={handleNewsletter} sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder={t("newsletterPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: FC.inputBg,
                    color: FC.inputText,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: FC.inputBorder,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: FC.inputBorderHover,
                    },
                    "& input::placeholder": {
                      color: FC.inputPlaceholder,
                      opacity: 1,
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={status === "loading"}
                sx={{ px: 3, whiteSpace: "nowrap", height: 46 }}
              >
                {status === "success" ? t("newsletterSuccess") : t("newsletterSubmit")}
              </Button>
            </Box>
            {status === "error" && (
              <Typography variant="body2" sx={{ color: "#EF4444", mt: 1, fontSize: "0.85rem" }}>
                {t("newsletterError")}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: FC.divider }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: FC.copyright, fontSize: "0.85rem" }}>
            {t("copyright", { year: new Date().getFullYear() })}
          </Typography>
          <Typography variant="body2" sx={{ color: FC.contactInfo, fontSize: "0.85rem" }}>
            {t("contactInfo")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
