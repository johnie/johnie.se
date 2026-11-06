import { Buffer } from "node:buffer";

import { ImageResponse } from "@cf-wasm/og/workerd";
import { env } from "cloudflare:workers";

import { SITE_NAME } from "@/lib/constants";

let fontPromise: Promise<ArrayBuffer> | undefined;
let backgroundPromise: Promise<string> | undefined;

const loadFont = async (requestUrl: string): Promise<ArrayBuffer> => {
  try {
    const response = await env.ASSETS.fetch(
      new URL("/fonts/Inter-Bold.ttf", requestUrl)
    );

    if (!response.ok) {
      throw new Error(`Failed to load OG font: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    fontPromise = undefined;
    throw error;
  }
};

const loadBackground = async (requestUrl: string): Promise<string> => {
  try {
    const response = await env.ASSETS.fetch(
      new URL("/images/og-image.png", requestUrl)
    );

    if (!response.ok) {
      throw new Error(`Failed to load OG background: ${response.status}`);
    }

    const data = await response.arrayBuffer();

    return `data:image/png;base64,${Buffer.from(data).toString("base64")}`;
  } catch (error) {
    backgroundPromise = undefined;
    throw error;
  }
};

export const renderOgImage = async (request: Request): Promise<Response> => {
  try {
    fontPromise ??= loadFont(request.url);
    backgroundPromise ??= loadBackground(request.url);

    const [fontData, background] = await Promise.all([
      fontPromise,
      backgroundPromise,
    ]);

    const { searchParams } = new URL(request.url);
    const postTitle = searchParams.get("title") || SITE_NAME;

    return await ImageResponse.async(
      <div
        style={{
          alignItems: "flex-start",
          backgroundImage: `url(${background})`,
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
        fonts: [{ data: fontData, name: "Inter", style: "normal" }],
        headers: {
          "Cache-Control": "public, immutable, no-transform, max-age=31536000",
        },
        height: 1080,
        width: 1920,
      }
    );
  } catch (error) {
    console.error("Failed to generate OG image:", error);

    return new Response("Failed to generate image", { status: 500 });
  }
};
