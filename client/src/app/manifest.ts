import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ruud Juffermans — Data & BI",
    short_name: "Ruud Juffermans",
    description:
      "Portfolio van Ruud Juffermans, data-analist: projecten, artikelen en achtergrond.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ea580c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
