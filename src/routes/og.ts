import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "workers-og";

export const Route = createFileRoute("/og")({
  server: {
    handlers: {
      GET: ({ request }) => {
        try {
          const url = new URL(request.url);
          const title = url.searchParams.get("title") || "Johnie Hjelm";

          const html = `
            <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; height: 100%; width: 100%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
              <div style="margin-left: 80px; margin-right: 80px; display: flex; flex-direction: column;">
                <div style="display: flex; font-size: 80px; font-family: Inter, sans-serif; font-weight: bold; letter-spacing: -0.03em; color: white; line-height: 1.2; white-space: pre-wrap;">
                  ${title}
                </div>
                <div style="display: flex; margin-top: 40px; font-size: 32px; font-family: Inter, sans-serif; color: rgba(255, 255, 255, 0.7);">
                  johnie.se
                </div>
              </div>
            </div>
          `;

          return new ImageResponse(html, {
            width: 1200,
            height: 630,
          });
        } catch (error) {
          console.error("OG image generation failed:", error);
          return new Response("Failed to generate image", { status: 500 });
        }
      },
    },
  },
});
