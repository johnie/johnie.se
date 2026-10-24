import { ImageResponse } from "@cf-wasm/og/workerd";
import { env } from "cloudflare:workers";

let fontPromise: Promise<ArrayBuffer> | undefined;

export const renderOgImage = async (request: Request): Promise<Response> => {
  try {
    fontPromise ??= env.ASSETS.fetch(
      new URL("/fonts/Inter-Bold.ttf", request.url)
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load OG font: ${response.status}`);
      }

      return response.arrayBuffer();
    });
    const fontData = await fontPromise;
    const { searchParams } = new URL(request.url);
    const postTitle = searchParams.get("title") || "Johnie Hjelm";

    return await ImageResponse.async(
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
        fonts: [{ data: fontData, name: "Inter", style: "normal" }],
        headers: {
          "Cache-Control": "public, immutable, no-transform, max-age=31536000",
        },
        height: 1080,
        width: 1920,
      }
    );
  } catch (error) {
    fontPromise = undefined;
    console.error("Failed to generate OG image:", error);

    return new Response("Failed to generate image", { status: 500 });
  }
};
