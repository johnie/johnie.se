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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundImage: "url(https://johnie.se/images/og-image.png)",
        }}
      >
        <div
          style={{
            marginLeft: 190,
            marginRight: 190,
            display: "flex",
            fontSize: 100,
            fontFamily: "Inter",
            fontWeight: "bold",
            letterSpacing: "-0.05em",
            fontStyle: "normal",
            color: "transparent",
            backgroundClip: "text",
            backgroundImage: "linear-gradient(to right, #fafafa, #d4d4d4)",
            lineHeight: "120px",
            whiteSpace: "pre-wrap",
            textShadow: "0 0 15px rgba(0, 0, 0, 0.25)",
          }}
        >
          {postTitle}
        </div>
      </div>,
      {
        width: 1920,
        height: 1080,
        fonts: [
          {
            name: "Inter",
            data: font,
            style: "normal",
          },
        ],
      }
    );
  } catch {
    return new Response("Failed to generate image", {
      status: 500,
    });
  }
}
