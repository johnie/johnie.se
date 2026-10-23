export const SECURITY_HEADERS: readonly (readonly [string, string])[] = [
  [
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' pulse.hjelm.cloud; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://i.scdn.co https://media0.giphy.com https://johnie.se; media-src 'none'; connect-src 'self' https://pulse.hjelm.cloud https://api.spotify.com https://accounts.spotify.com; font-src 'self' data:;",
  ],
  ["Referrer-Policy", "origin-when-cross-origin"],
  ["X-Frame-Options", "DENY"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-DNS-Prefetch-Control", "on"],
  ["Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=()"],
];
