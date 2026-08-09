import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// Cache font at module level - only fetched once per cold start
const fontData = fetch(
  new URL("../../public/fonts/Inter-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const postTitle = searchParams.get("title");
    const font = await fontData;

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
            data: font,
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
}
