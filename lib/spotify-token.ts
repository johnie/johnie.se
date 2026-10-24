import { z } from "zod";

// Imported by `scripts/spotify-auth.ts` under plain Node: keep value imports
// free of the `@/` alias.

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const REQUEST_TIMEOUT_MS = 5000;

const tokenErrorSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
});

export interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
}

export interface SpotifyTokenResponse {
  access_token: string;
  /** Present on authorization code exchanges; refreshes may omit it. */
  refresh_token?: string;
}

type TokenGrant =
  | { grant_type: "authorization_code"; code: string; redirect_uri: string }
  | { grant_type: "refresh_token"; refresh_token: string };

/**
 * Requests tokens from Spotify's accounts service. Failures throw with the
 * HTTP status and Spotify's OAuth error, e.g. `400 invalid_grant: Refresh
 * token revoked` once a refresh token passes its 6-month lifetime.
 */
export const requestSpotifyToken = async (
  { clientId, clientSecret }: SpotifyCredentials,
  grant: TokenGrant
): Promise<SpotifyTokenResponse> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    body: new URLSearchParams(grant),
    headers: { Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}` },
    method: "POST",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (response.ok) {
    return response.json();
  }

  const failure = tokenErrorSchema.safeParse(
    await response.json().catch(() => null)
  );

  const reason = failure.success
    ? [failure.data.error, failure.data.error_description]
        .filter(Boolean)
        .join(": ")
    : response.statusText;

  throw new Error(
    `Spotify token request failed: ${response.status} ${reason}`.trimEnd()
  );
};
