import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Load the bundled font once per cold start.
const fontData = await readFile(
  path.join(process.cwd(), "public/fonts/Inter-Bold.ttf")
);

export const GET = (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const postTitle = searchParams.get("title") || "Johnie Hjelm";
    return new ImageResponse(
      <div
        style={{
          alignItems: "flex-start",
          backgroundImage: "url(https://johnie.se/images/og-image.png)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundClip: "text",
            backgroundImage: "linear-gradient(to right, #fafafa, #d4d4d4)",
            color: "transparent",
            display: "flex",
            fontFamily: "Inter",
            fontSize: 100,
            fontStyle: "normal",
            fontWeight: "bold",
            letterSpacing: "-0.05em",
            lineHeight: "120px",
            marginLeft: 190,
            marginRight: 190,
            textShadow: "0 0 15px rgba(0, 0, 0, 0.25)",
            whiteSpace: "pre-wrap",
          }}
        >
          {postTitle}
        </div>
      </div>,
      {
        fonts: [
          {
            data: fontData,
            name: "Inter",
            style: "normal",
          },
        ],
        height: 1080,
        width: 1920,
      }
    );
  } catch {
    return new Response("Failed to generate image", {
      status: 500,
    });
  }
};
