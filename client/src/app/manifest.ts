import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ruud Juffermans — Data Analytics & AI",
    short_name: "Ruud Juffermans",
    description:
      "Datafundamenten waar je rapportage én je AI op draaien. Vaste scope, vaste prijs.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
