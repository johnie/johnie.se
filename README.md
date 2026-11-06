# johnie.se

Personal website and digital garden for Johnie Hjelm. Features blog posts, TIL entries, work history, projects, and a `/uses` page of recommended gear and software (`content/uses/*.yml`).

**[johnie.se](https://johnie.se)**

## Tech Stack

Built with modern web technologies:

- **[TanStack Start](https://tanstack.com/start)** — React framework with typed file-based routing and streaming SSR
- **[React 19](https://react.dev)** — UI library
- **[TypeScript](https://www.typescriptlang.org)** — Type safety
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first styling
- **[Content Collections](https://www.content-collections.dev)** — Type-safe content metadata
- **[MDX](https://mdxjs.com)** — React modules compiled at build time with `@mdx-js/rollup`; no runtime evaluation
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)** — Serverless SQLite database
- **[Radix UI](https://www.radix-ui.com)** — Accessible component primitives
- **[Base UI](https://base-ui.com)** — Composable toast primitives
- **Self-hosted analytics** — `pulse.hjelm.cloud`
- **[Cloudflare Workers](https://workers.cloudflare.com)** — Hosting and deployment
- **[Drizzle ORM](https://orm.drizzle.team)** — Database operations
- **[Ultracite](https://www.ultracite.ai/)** — Code quality (Oxlint and Oxfmt presets)

## Toast notifications

Use the app-wide toast manager from client-side event handlers:

```tsx
import { toast } from "@/components/ui/toast";

toast.add({ title: "Copied link", type: "success" });
```

`toast.add` supports `title`, `description`, `type`, and `actionProps`. Supported status types are `success`, `info`, `warning`, `error`, and `loading`. Use `toast.promise(promise, { loading, success, error })` to track an asynchronous operation.

## Development

Use Node.js **24.x** (exact version in `.nvmrc`) and the pnpm version declared in `package.json`. Production runs in workerd.

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Configure the three Spotify credentials in gitignored `.dev.vars` before running the app: `SPOTIFY_API_CLIENT_ID`, `SPOTIFY_API_CLIENT_SECRET`, and `SPOTIFY_API_REFRESH_TOKEN`. Validation is defined in `lib/env.server.ts`; credentials are read lazily on the server and are never injected into client code.

In production, provision the same three names as Worker secrets. With the configured Node compatibility and compatibility date, Cloudflare populates `process.env` from secret bindings, so `getServerEnv()` reads them without renaming or client-side exposure.

Spotify refresh tokens expire 6 months after authorization; Now playing then logs `Spotify token request failed: 400 invalid_grant` and falls back to the last logged song. To issue a new one, add `http://127.0.0.1:8888/callback` as a Redirect URI in the Spotify app settings, then run `pnpm spotify:auth` with the client ID and secret in `.dev.vars` or the environment and open the printed URL. The script prints only the refresh token on stdout, so it can be piped straight into the Worker secret:

```sh
pnpm -s spotify:auth | pnpm exec wrangler secret put SPOTIFY_API_REFRESH_TOKEN
```

Vite serves development and production preview on port 3000. If a clean checkout cannot resolve `content-collections` on first development startup, run `pnpm build` once to generate the metadata. MDX edits hot reload without a restart.

Writing lives in `content/*.mdx`. Set `seoTitle` only when the search title should differ from the article headline. Set `updatedAt` to an ISO date when the article changes substantially; omit it when the modification date is unknown. It supplies the sitemap `lastmod` and article modification metadata. Mechanical edits do not require a new date.

TIL entries live in `content/til/*.mdx` and require an explicit `publishedAt`; build-machine filesystem dates never determine publication order. Content schemas live in `lib/content-schema.ts` and `content-collections.ts`. Work and project identity comes from the source document path.

### Code ownership

- `lib/pages.ts` owns Page lookup, not-found handling, and MDX preloading; dedicated routes keep their own layout and metadata.
- `lib/writing.ts` owns Post ordering, grouping and article metadata. `lib/site-index.ts` owns discovery and explicitly classifies every file route independently of visible navigation.
- `lib/site-links.tsx` owns shared navigation/social destinations. `components/command-palette/` owns the palette, its root-scoped React state, lazy loading, keyboard shortcut and dialog primitives.
- `components/views.tsx` only displays deferred counts. The article route owns visit recording, after counts resolve; archive and featured lists never record visits.
- `lib/spotify-types.ts` owns Spotify contracts, `lib/song-log.ts` owns persistence, and `lib/now-playing.ts` owns playback/fallback policy. `*.server.ts` composes Worker dependencies; `*.functions.ts` exposes server transport.
- `lib/constants.ts` owns site identity, the portrait asset and responsive content-image sizes. Keep those sizes aligned with the root layout's width and padding.
- `lib/current-year.ts` supplies the root loader's serialized year to Bio and Footer. Read the clock inside a request: a Worker's module-scope clock can be frozen at the Unix epoch, causing incorrect experience counts and hydration mismatches.

### Cloudflare Workers

`wrangler.jsonc` targets the existing `johnie` Worker in its default environment, with `johnie.se` as its primary Custom Domain. The production `workers.dev` endpoint is disabled to avoid serving a duplicate site; preview URLs remain enabled. The configuration defines the static asset binding, the `DB` binding for the `johnie` D1 database, Node compatibility, observability, and an intentionally empty `previews` block so remote previews never write view counts or Spotify plays to production D1; without a `DB` binding those reads and writes fail and fall back as they do on any database error. Generated `worker-configuration.d.ts` is committed; run `pnpm cf-typegen` whenever the Wrangler configuration changes. `pnpm preview` runs local Vite against local D1; `wrangler preview` creates a remote deployment and needs preview-safe Spotify credentials via `--secrets-file` if those routes are exercised.

```sh
pnpm build
pnpm preview
pnpm exec wrangler deploy --dry-run
```

The deployment target is **Workers Paid** (10 MiB compressed script limit, default 30-second CPU allowance). `/og` generates images at request time using bundled WebAssembly and the Inter Bold font and background image from the asset binding; it does not fetch the production website. Public images are served as-is, without image optimization.

When ready to publish, provision the three variables above with `wrangler secret put <NAME>`, then run `pnpm deploy`. Authentication, secret uploads, deployment, DNS, and custom-domain configuration are separate operator actions, not part of local verification.

For routing-only changes without uploading application code, run `pnpm build` followed by `pnpm exec wrangler triggers deploy --config dist/server/wrangler.json` (experimental). Use the generated configuration because the Cloudflare Vite plugin supplies the asset directory. An existing externally managed DNS record for a Custom Domain must be removed before attaching it to the Worker; Cloudflare then manages DNS and HTTPS for that hostname.

Static redirects live in `lib/redirects.ts`: `/ai` → `/writing/ai-manifesto` and `/skills` → GitHub. Add future entries there. Non-root trailing slashes redirect permanently to the slashless URL, preserving query parameters. Document security headers live in `lib/security-headers.ts`; `public/_headers` covers static assets. Spotify and the view-count row-set use the Worker Cache API with a 60-second TTL.

### Database

View counts and Spotify plays live in the `johnie` D1 database, accessed through the `DB` binding in `lib/db.server.ts` with Drizzle (`drizzle-orm/d1`); the schema is in `lib/db/schema.ts`. `pnpm dev` and `pnpm preview` use a local D1 under `.wrangler/state`, which starts empty. To seed it with a copy of production:

```sh
rm -rf .wrangler/state/v3/d1
pnpm exec wrangler d1 export johnie --remote --output .wrangler/johnie.sql
pnpm exec wrangler d1 execute johnie --local --file .wrangler/johnie.sql
```

The export doubles as a backup. `pnpm db:push`, `db:generate`, `db:migrate`, and `db:studio` run drizzle-kit against the remote database over the D1 HTTP API and need `CLOUDFLARE_ACCOUNT_ID` and a `CLOUDFLARE_D1_TOKEN` API token with D1 edit permission in the environment. Drizzle reads the `DB` database identity from `wrangler.jsonc`; do not maintain a second database ID.

### Quality checks

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` runs the `unit` Vitest project (`lib/**/*.test.ts`) in Node. Writing and Site index use Post/Page fixtures. View counts and Now playing use in-memory D1 from Wrangler's `getPlatformProxy`, an expiring memory cache with an injected clock, and a fake Spotify player. No Spotify network requests or Cloudflare account are needed. Test database setup generates the current schema from `lib/db/schema.ts`; it does not validate deployment migration history. Configured future migrations belong in `lib/db/migrations`; ignored historical SQL under `src/lib/db/migrations` is not an authoritative migration chain and must not be replayed blindly.

Each D1 suite starts one Worker runtime in `beforeAll` and disposes it at suite completion. Before each test, the fixture rebuilds the schema so rows and deliberately dropped tables cannot leak between cases; runtime startup does not consume an individual test's timeout.

The SEO regression suite is the `seo` project and runs against a running application. Run `pnpm build && pnpm preview`, then `pnpm test:seo` in another terminal. Set `SEO_BASE_URL` to target a different address (default: `http://localhost:3000`).

Oxlint's JavaScript plugins reserve roughly 6 GiB of virtual memory per worker. Small Linux hosts may need additional swap to satisfy the kernel's memory reservation policy; adding 6 GiB of swap resolved the allocator failure on a host with 4 GiB RAM and 1 GiB swap. See [the upstream allocator issue](https://github.com/oxc-project/oxc/issues/20331). Keep the configured plugins and rules enabled.

Built by [Johnie Hjelm](https://johnie.se)
