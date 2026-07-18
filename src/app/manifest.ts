import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sell to Grand",
    short_name: "Sell to Grand",
    description:
      "A licensed Oregon brokerage that shows you two numbers: what your house nets listed and what we pay in cash.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#1f6f6b",
  };
}
