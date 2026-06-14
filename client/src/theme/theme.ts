import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Fonts loaded via next/font in layout.tsx
// --font-heading: Bricolage Grotesque
// --font-body: Outfit

// ── Absolute colors (never switch with mode) ────────────────────────────────
// Used as always-white text on navy, navy as accent section bg, etc.
const ABS = {
  navy: "#0B1120",
  navyLight: "#131B2E",
  navySurface: "#1A2340",
  white: "#FFFFFF",
};

// ── Scheme-specific color tokens (switch via data-mui-color-scheme) ─────────
// Light mode: clean paper background, deep red primary, cool neutrals
// Dark mode: near-black background with a slight blue cast, softened red primary
const LIGHT = {
  bg: "#FFFFFF",
  surface: "#F7F8FA",
  surfaceElevated: "#FFFFFF",
  border: "#E2E8F0",
  borderSoft: "#F1F5F9",
  divider: "#F1F5F9",
  gray50: "#F8FAFC",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray300: "#CBD5E1",
  gray400: "#94A3B8",
  gray500: "#64748B",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1E293B",
  gray900: "#0F172A",
  red: "#dd2e5a",
  redHover: "#b8244c",
  redLight: "#f87190",
  redMuted: "rgba(221, 46, 90, 0.12)",
  redGlow: "rgba(221, 46, 90, 0.24)",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
};

const DARK = {
  bg: "#0A0F1C",
  surface: "#121826",
  surfaceElevated: "#1A2032",
  border: "#2A3244",
  borderSoft: "#1F2636",
  divider: "#1F2636",
  gray50: "#1A2032",
  gray100: "#1F2636",
  gray200: "#2A3244",
  gray300: "#3B475C",
  gray400: "#64748B",
  gray500: "#94A3B8",
  gray600: "#CBD5E1",
  gray700: "#DBE3EE",
  gray800: "#E8EDF5",
  gray900: "#F4F7FB",
  red: "#dd2e5a",
  redHover: "#f87190",
  redLight: "#fcabc0",
  redMuted: "rgba(248, 113, 144, 0.16)",
  redGlow: "rgba(248, 113, 144, 0.32)",
  textPrimary: "#F4F7FB",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",
};

// ── Custom CSS variables (independent of MUI's palette vars) ────────────────
// Declared per-scheme and read via our exported `palette` object below
const cssVarsFor = (tokens: typeof LIGHT) => ({
  "--app-bg": tokens.bg,
  "--app-surface": tokens.surface,
  "--app-surface-elevated": tokens.surfaceElevated,
  "--app-border": tokens.border,
  "--app-border-soft": tokens.borderSoft,
  "--app-divider": tokens.divider,
  "--app-gray-50": tokens.gray50,
  "--app-gray-100": tokens.gray100,
  "--app-gray-200": tokens.gray200,
  "--app-gray-300": tokens.gray300,
  "--app-gray-400": tokens.gray400,
  "--app-gray-500": tokens.gray500,
  "--app-gray-600": tokens.gray600,
  "--app-gray-700": tokens.gray700,
  "--app-gray-800": tokens.gray800,
  "--app-gray-900": tokens.gray900,
  "--app-red": tokens.red,
  "--app-red-hover": tokens.redHover,
  "--app-red-light": tokens.redLight,
  "--app-red-muted": tokens.redMuted,
  "--app-red-glow": tokens.redGlow,
  "--app-text-primary": tokens.textPrimary,
  "--app-text-secondary": tokens.textSecondary,
  "--app-text-muted": tokens.textMuted,
});

// ── Public palette: mix of absolute hex + CSS-var references ────────────────
// Hex values = fixed across modes; var() references = swap per color scheme.
// This preserves the existing palette.* API used throughout the codebase
// while adding automatic light/dark adaptation for all semantic tokens.
export const palette = {
  // absolute
  navy: ABS.navy,
  navyLight: ABS.navyLight,
  navySurface: ABS.navySurface,
  white: ABS.white,
  // scheme-adaptive (primary)
  red: "var(--app-red)",
  redHover: "var(--app-red-hover)",
  redLight: "var(--app-red-light)",
  redMuted: "var(--app-red-muted)",
  redGlow: "var(--app-red-glow)",
  // scheme-adaptive (surfaces)
  offWhite: "var(--app-surface)",
  surfaceElevated: "var(--app-surface-elevated)",
  bg: "var(--app-bg)",
  border: "var(--app-border)",
  // scheme-adaptive (neutrals)
  gray50: "var(--app-gray-50)",
  gray100: "var(--app-gray-100)",
  gray200: "var(--app-gray-200)",
  gray300: "var(--app-gray-300)",
  gray400: "var(--app-gray-400)",
  gray500: "var(--app-gray-500)",
  gray600: "var(--app-gray-600)",
  gray700: "var(--app-gray-700)",
  gray800: "var(--app-gray-800)",
  gray900: "var(--app-gray-900)",
};

let theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: LIGHT.red,
          dark: LIGHT.redHover,
          light: LIGHT.redLight,
          contrastText: ABS.white,
        },
        secondary: {
          main: ABS.navy,
          dark: ABS.navy,
          light: ABS.navyLight,
        },
        background: {
          default: LIGHT.bg,
          paper: LIGHT.surface,
        },
        text: {
          primary: LIGHT.textPrimary,
          secondary: LIGHT.textSecondary,
        },
        divider: LIGHT.divider,
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: DARK.red,
          dark: DARK.redHover,
          light: DARK.redLight,
          contrastText: "#1A0508",
        },
        secondary: {
          main: ABS.navyLight,
          dark: ABS.navy,
          light: ABS.navySurface,
        },
        background: {
          default: DARK.bg,
          paper: DARK.surface,
        },
        text: {
          primary: DARK.textPrimary,
          secondary: DARK.textSecondary,
        },
        divider: DARK.divider,
      },
    },
  },
  typography: {
    fontFamily: "var(--font-body), 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "var(--font-heading), Georgia, serif",
      fontWeight: 700,
      fontSize: "3.5rem",
      lineHeight: 1.1,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: "var(--font-heading), Georgia, serif",
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: "var(--font-heading), Georgia, serif",
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.25,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontFamily: "var(--font-heading), Georgia, serif",
      fontWeight: 600,
      fontSize: "1.35rem",
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: "var(--font-heading), Georgia, serif",
      fontWeight: 600,
      fontSize: "1.15rem",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "var(--font-heading), Georgia, serif",
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1.125rem",
      fontWeight: 300,
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.7,
    },
    subtitle1: {
      fontSize: "1.25rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      fontFamily: "var(--font-body), 'Segoe UI', sans-serif",
      fontWeight: 600,
      textTransform: "none" as const,
      letterSpacing: "0.01em",
    },
    overline: {
      fontFamily: "var(--font-body), 'Segoe UI', sans-serif",
      fontWeight: 700,
      fontSize: "0.75rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Scheme-aware CSS variables
        ":root, [data-mui-color-scheme='light']": cssVarsFor(LIGHT),
        "[data-mui-color-scheme='dark']": cssVarsFor(DARK),
        html: {
          scrollBehavior: "smooth",
          colorScheme: "light dark",
        },
        body: {
          overflowX: "hidden",
          backgroundColor: "var(--app-bg)",
          color: "var(--app-text-primary)",
          transition: "background-color 0.3s ease, color 0.3s ease",
        },
        "::selection": {
          backgroundColor: "var(--app-red-muted)",
          color: "var(--app-text-primary)",
        },
        // Subtle scrollbar styling that adapts to scheme
        "::-webkit-scrollbar": { width: 10, height: 10 },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": {
          background: "var(--app-gray-200)",
          borderRadius: 8,
          border: "2px solid transparent",
          backgroundClip: "padding-box",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "var(--app-gray-300)",
          backgroundClip: "padding-box",
          border: "2px solid transparent",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "12px 28px",
          fontSize: "1rem",
          fontWeight: 600,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        containedPrimary: {
          backgroundColor: "var(--app-red)",
          color: ABS.white,
          "&:hover": {
            backgroundColor: "var(--app-red-hover)",
            transform: "translateY(-1px)",
            boxShadow: `0 8px 24px var(--app-red-glow)`,
          },
        },
        outlinedPrimary: {
          borderColor: "var(--app-border)",
          color: "var(--app-text-primary)",
          borderWidth: 1.5,
          "&:hover": {
            borderColor: "var(--app-red)",
            backgroundColor: "var(--app-red-muted)",
            borderWidth: 1.5,
          },
        },
        text: {
          color: "var(--app-red)",
          "&:hover": {
            backgroundColor: "var(--app-red-muted)",
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          // Ensure the card behaves correctly when rendered as `<a>` via
          // `component={Link}` — browsers otherwise apply inline display and
          // the default link color to descendants.
          display: "block",
          color: "inherit",
          textDecoration: "none",
          backgroundColor: "var(--app-surface-elevated)",
          border: `1px solid var(--app-border-soft)`,
          borderRadius: 16,
          transition:
            "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s",
          "&:hover": {
            borderColor: "var(--app-border)",
            boxShadow: `0 12px 40px rgba(11, 17, 32, 0.08)`,
            transform: "translateY(-2px)",
            textDecoration: "none",
          },
          "&:focus-visible": {
            outline: `2px solid var(--app-red)`,
            outlineOffset: 2,
          },
          "[data-mui-color-scheme='dark'] &:hover": {
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.5)`,
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "color-mix(in srgb, var(--app-bg) 82%, transparent)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          borderBottom: `1px solid var(--app-border-soft)`,
          color: "var(--app-text-primary)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 8 },
        outlined: { borderColor: "var(--app-border)" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--app-gray-300)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--app-red)",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: "lg" },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "var(--app-divider)" },
      },
    },
    MuiTypography: {
      styleOverrides: {
        overline: { color: "var(--app-red)" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          backgroundColor: "var(--app-red-muted)",
          color: "var(--app-text-primary)",
          "& .MuiAlert-icon": { color: "var(--app-red)" },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
