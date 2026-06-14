"use client";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { submitContact } from "@/lib/api";
import { palette } from "@/theme/theme";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("form.genericError"));
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const directItems = [
    { icon: <EmailIcon />, label: t("direct.email"), href: "mailto:ruudjuffermans@pm.me" },
    { icon: <LinkedInIcon />, label: t("direct.linkedin"), href: "https://linkedin.com/in/ruudjuf" },
    { icon: <GitHubIcon />, label: t("direct.github"), href: "https://github.com/ruudjuf" },
    { icon: <LocationOnIcon />, label: t("direct.location"), href: null as string | null },
  ];

  return (
    <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 } }}>
      <Container>
        <Box sx={{ maxWidth: 600, mb: 8 }}>
          <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
            {t("eyebrow")}
          </Typography>
          <Typography variant="h1" sx={{ mb: 3 }}>
            {t("title")}
          </Typography>
          <Typography variant="subtitle1">{t("subtitle")}</Typography>
        </Box>

        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 7 }}>
            {status === "success" ? (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 3,
                  backgroundColor: palette.redGlow,
                  border: `2px solid ${palette.red}`,
                  py: 3,
                  px: 4,
                  "& .MuiAlert-message": { fontSize: "1.05rem", color: palette.gray700   },
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {t("success.title")}
                </Typography>
                <Typography variant="body1">{t("success.body")}</Typography>
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                {status === "error" && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {errorMsg}
                  </Alert>
                )}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={t("form.name")}
                      required
                      fullWidth
                      value={form.name}
                      onChange={handleChange("name")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={t("form.email")}
                      type="email"
                      required
                      fullWidth
                      value={form.email}
                      onChange={handleChange("email")}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label={t("form.company")}
                      fullWidth
                      value={form.company}
                      onChange={handleChange("company")}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label={t("form.message")}
                      required
                      fullWidth
                      multiline
                      rows={6}
                      value={form.message}
                      onChange={handleChange("message")}
                      placeholder={t("form.messagePlaceholder")}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={status === "loading"}
                      sx={{ px: 5 }}
                    >
                      {status === "loading" ? t("form.submitting") : t("form.submit")}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                backgroundColor: palette.offWhite,
                borderRadius: 4,
                p: 5,
                border: `1px solid ${palette.gray100}`,
              }}
            >
              <Typography variant="h4" sx={{ mb: 3 }}>
                {t("direct.title")}
              </Typography>
              {directItems.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2.5,
                  }}
                >
                  <Box sx={{ color: palette.gray400 }}>{item.icon}</Box>
                  {item.href ? (
                    <Typography
                      component="a"
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener" : undefined}
                      variant="body1"
                      sx={{
                        color: palette.gray700,
                        textDecoration: "none",
                        "&:hover": { color: palette.red },
                        transition: "color 0.2s",
                      }}
                    >
                      {item.label}
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ color: palette.gray700 }}>
                      {item.label}
                    </Typography>
                  )}
                </Box>
              ))}
              <Typography variant="body2" sx={{ mt: 4, color: palette.gray400 }}>
                {t("direct.remote")}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
