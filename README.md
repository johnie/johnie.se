# johnie.se

Personal website and digital garden for Johnie Hjelm. Features blog posts, TIL entries, work history, and projects.

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
- **[Zustand](https://zustand-demo.pmnd.rs)** — State management
- **[OpenPanel](https://openpanel.dev)** — Privacy-first analytics
- **[Cloudflare Workers](https://workers.cloudflare.com)** — Hosting and deployment
- **[Drizzle ORM](https://orm.drizzle.team)** — Database operations
- **[Ultracite](https://www.ultracite.ai/)** — Code quality (Oxlint and Oxfmt presets)

## Development

Use Node.js LTS **24.22.1** (pinned in `.nvmrc`) and pnpm **12.15.0** (pinned in `package.json`). The Node engine is restricted to `24.x` for local tooling; production runs in workerd.

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Configure the three Spotify credentials in gitignored `.dev.vars` before running the app: `SPOTIFY_API_CLIENT_ID`, `SPOTIFY_API_CLIENT_SECRET`, and `SPOTIFY_API_REFRESH_TOKEN`. Validation is defined in `lib/env.server.ts`; credentials are read lazily on the server and are never injected into client code.

In production, provision the same three names as Worker secrets. With the configured Node compatibility and compatibility date, Cloudflare populates `process.env` from secret bindings, so `getServerEnv()` reads them without renaming or client-side exposure.

Vite serves development and production preview on port 3000. If a clean checkout cannot resolve `content-collections` on first development startup, run `pnpm build` once to generate the metadata. MDX edits hot reload without a restart.

### Cloudflare Workers

`wrangler.jsonc` targets the existing `johnie` Worker in its default environment, with `johnie.se` as its primary Custom Domain. The `johnie.crip.workers.dev` endpoint and preview URLs remain enabled. The configuration defines the static asset binding, the `DB` binding for the `johnie` D1 database, Node compatibility, observability, and an intentionally empty `previews` block so remote previews never write view counts or Spotify plays to production D1; without a `DB` binding those reads and writes fail and fall back as they do on any database error. Generated `worker-configuration.d.ts` is committed; run `pnpm cf-typegen` whenever the Wrangler configuration changes. `pnpm preview` runs local Vite against local D1; `wrangler preview` creates a remote deployment and needs preview-safe Spotify credentials via `--secrets-file` if those routes are exercised.

```sh
pnpm build
pnpm preview
pnpm exec wrangler deploy --dry-run
```

The deployment target is **Workers Paid** (10 MiB compressed script limit, default 30-second CPU allowance). `/og` generates images at request time using bundled WebAssembly and the Inter Bold font from the asset binding. Public images are served as-is, without image optimization.

When ready to publish, provision the three variables above with `wrangler secret put <NAME>`, then run `pnpm deploy`. Authentication, secret uploads, deployment, DNS, and custom-domain configuration are separate operator actions, not part of local verification.

For routing-only changes without uploading application code, run `pnpm build` followed by `pnpm exec wrangler triggers deploy --config dist/server/wrangler.json` (experimental). Use the generated configuration because the Cloudflare Vite plugin supplies the asset directory. An existing externally managed DNS record for a Custom Domain must be removed before attaching it to the Worker; Cloudflare then manages DNS and HTTPS for that hostname.

Static redirects live in `lib/redirects.ts`: `/ai` → `/writing/ai-manifesto` and `/skills` → GitHub. Add future entries there. Document security headers live in `lib/security-headers.ts`; `public/_headers` covers static assets. Spotify and the view-count row-set use the Worker Cache API with a 60-second TTL.

### Database

View counts and Spotify plays live in the `johnie` D1 database, accessed through the `DB` binding in `lib/db.server.ts` with Drizzle (`drizzle-orm/d1`); the schema is in `lib/db/schema.ts`. `pnpm dev` and `pnpm preview` use a local D1 under `.wrangler/state`, which starts empty. To seed it with a copy of production:

```sh
rm -rf .wrangler/state/v3/d1
pnpm exec wrangler d1 export johnie --remote --output .wrangler/johnie.sql
pnpm exec wrangler d1 execute johnie --local --file .wrangler/johnie.sql
```

The export doubles as a backup. `pnpm db:push`, `db:generate`, `db:migrate`, and `db:studio` run drizzle-kit against the remote database over the D1 HTTP API and need `CLOUDFLARE_ACCOUNT_ID` and a `CLOUDFLARE_D1_TOKEN` API token with D1 edit permission in the environment.

### Quality checks

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` runs the `unit` Vitest project (`lib/**/*.test.ts`) in Node. The Writing and Site index modules are tested with Post and Page fixtures; View counts and Now playing run against an in-memory D1 from wrangler's `getPlatformProxy`, with the schema generated from `lib/db/schema.ts`, an in-memory cache store, and a fake Spotify player. No network or Cloudflare account is needed.

The SEO regression suite is the `seo` project and runs against a running application. Run `pnpm build && pnpm preview`, then `pnpm test:seo` in another terminal. Set `SEO_BASE_URL` to target a different address (default: `http://localhost:3000`).

Oxlint's JavaScript plugins reserve roughly 6 GiB of virtual memory per worker. Small Linux hosts may need additional swap to satisfy the kernel's memory reservation policy; adding 6 GiB of swap resolved the allocator failure on a host with 4 GiB RAM and 1 GiB swap. See [the upstream allocator issue](https://github.com/oxc-project/oxc/issues/20331). Keep the configured plugins and rules enabled.

Built by [Johnie Hjelm](https://johnie.se)
