import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const TEETH = 28;
const OUTER_R = 30;
const INNER_R = 26;

function star() {
  const pts: string[] = [];
  for (let i = 0; i < TEETH * 2; i++) {
    const r = i % 2 === 0 ? OUTER_R : INNER_R;
    const a = (i * Math.PI) / TEETH - Math.PI / 2;
    const x = 32 + r * Math.cos(a);
    const y = 32 + r * Math.sin(a);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "transparent",
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          style={{ position: "absolute", inset: 0 }}
        >
          <polygon points={star()} fill="#8b2e2e" />
        </svg>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: "Georgia, serif",
            fontSize: 36,
            fontWeight: 800,
            lineHeight: 1,
            paddingBottom: 2,
          }}
        >
          H
        </div>
      </div>
    ),
    { ...size }
  );
}
