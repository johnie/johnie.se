/**
 * Issues a new SPOTIFY_API_REFRESH_TOKEN through the authorization code flow.
 * Spotify refresh tokens expire 6 months after authorization, so rerun this
 * when Now playing logs `invalid_grant`.
 *
 * The refresh token is the only stdout output; instructions go to stderr so
 * `pnpm -s spotify:auth | pnpm exec wrangler secret put SPOTIFY_API_REFRESH_TOKEN`
 * works.
 */
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import type { ServerResponse } from "node:http";

import { requestSpotifyToken } from "../lib/spotify-token.ts";

const HOST = "127.0.0.1";
const PORT = 8888;
const CALLBACK_PATH = "/callback";
const REDIRECT_URI = `http://${HOST}:${PORT}${CALLBACK_PATH}`;
const SCOPE = "user-read-currently-playing";
const REFRESH_TOKEN_LIFETIME_MONTHS = 6;

const log = (message: string) => process.stderr.write(`${message}\n`);

const clientId = process.env.SPOTIFY_API_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_API_CLIENT_SECRET;

if (!(clientId && clientSecret)) {
  log(
    "Set SPOTIFY_API_CLIENT_ID and SPOTIFY_API_CLIENT_SECRET in .dev.vars or the environment."
  );
  process.exit(1);
}

const state = randomUUID();

const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams(
  {
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    state,
  }
)}`;

const expiryDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + REFRESH_TOKEN_LIFETIME_MONTHS);

  return date.toISOString().slice(0, 10);
};

const exchangeCode = async (url: URL) => {
  const error = url.searchParams.get("error");

  if (error) {
    throw new Error(`Spotify denied authorization: ${error}`);
  }

  if (url.searchParams.get("state") !== state) {
    throw new Error("State mismatch; restart and use the printed URL.");
  }

  const code = url.searchParams.get("code");

  if (!code) {
    throw new Error("Spotify redirected without a code.");
  }

  const { refresh_token: refreshToken } = await requestSpotifyToken(
    { clientId, clientSecret },
    { code, grant_type: "authorization_code", redirect_uri: REDIRECT_URI }
  );

  if (!refreshToken) {
    throw new Error("Spotify returned no refresh token.");
  }

  return refreshToken;
};

const completeAuthorization = async (url: URL, response: ServerResponse) => {
  try {
    const refreshToken = await exchangeCode(url);

    response.end("Authorized. Return to the terminal.");
    process.stdout.write(`${refreshToken}\n`);
    log(
      [
        "",
        "Store the refresh token above:",
        "  production: pnpm exec wrangler secret put SPOTIFY_API_REFRESH_TOKEN",
        "  local:      SPOTIFY_API_REFRESH_TOKEN=<token> in .dev.vars",
        `It expires around ${expiryDate()}; rerun pnpm spotify:auth before then.`,
      ].join("\n")
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    response.writeHead(500).end(message);
    log(message);
    process.exitCode = 1;
  }
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", REDIRECT_URI);

  if (url.pathname !== CALLBACK_PATH) {
    response.writeHead(404).end();

    return;
  }

  await completeAuthorization(url, response);
  server.close();
});

server.listen(PORT, HOST, () => {
  log(
    [
      `Add ${REDIRECT_URI} as a Redirect URI in the Spotify app settings, then open:`,
      "",
      `  ${authorizeUrl}`,
      "",
      "Waiting for Spotify to redirect back...",
    ].join("\n")
  );
});
