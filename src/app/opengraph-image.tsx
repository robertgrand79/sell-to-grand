import { ImageResponse } from "next/og";

export const alt = "Sell to Grand — cash offer or listed, you pick";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card. Brand colors, the approved tagline. No DB dependency so
// it always renders even if Supabase is unreachable.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f5f6f4",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              backgroundColor: "#1f6f6b",
            }}
          />
          <div style={{ fontSize: "34px", fontWeight: 700, color: "#1c2430" }}>
            Sell to Grand
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "88px",
              fontWeight: 800,
              color: "#1c2430",
              lineHeight: 1.05,
            }}
          >
            Two numbers. You pick.
          </div>
          <div style={{ fontSize: "34px", color: "#4a5568", maxWidth: "900px" }}>
            A licensed Oregon brokerage shows you both: what your house nets
            listed, and what we pay in cash.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "28px", color: "#175653", fontWeight: 600 }}>
          Cash offers across Lane County, Oregon · (541) 214-2163
        </div>
      </div>
    ),
    { ...size }
  );
}
