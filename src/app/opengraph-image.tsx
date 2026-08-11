import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RAIQEN — Intelligence. Engineered for Business.";

/**
 * The RAIQEN symbol, inlined into the OG card.
 * The source PNG is re-encoded with sharp (a Next.js dependency) to a JPEG
 * composited on the site background — resvg, which rasterizes next/og
 * output, rejects some PNG variants, while JPEG is universally supported.
 */
async function logoDataUri(): Promise<string | null> {
  try {
    const sharp = (await import("sharp")).default;
    const file = readFileSync(join(process.cwd(), "public", "logo.png"));
    const out = await sharp(file)
      .resize(96, 96, { fit: "contain", background: "#07080A" })
      .flatten({ background: "#07080A" })
      .jpeg({ quality: 92 })
      .toBuffer();
    return `data:image/jpeg;base64,${out.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const logo = await logoDataUri();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#07080A",
          color: "#F5F5F5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              width={44}
              height={44}
              style={{ objectFit: "contain" }}
              alt=""
            />
          ) : (
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#E3B46C",
              }}
            />
          )}
          <div style={{ fontSize: 34, letterSpacing: "0.4em", color: "#9A9DA5" }}>
            RAIQEN
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Intelligence.
          <br />
          <span style={{ color: "#E3B46C" }}>Engineered for Business.</span>
        </div>
        <div style={{ marginTop: 44, fontSize: 30, color: "#9A9DA5" }}>
          AI-powered products · Intelligent software · Business automation
        </div>
      </div>
    ),
    { ...size }
  );
}
