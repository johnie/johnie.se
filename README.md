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
- **[Turso](https://turso.tech)** — Edge database (LibSQL)
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

Configure the five Spotify and Turso credentials in gitignored `.dev.vars` before running the app: `SPOTIFY_API_CLIENT_ID`, `SPOTIFY_API_CLIENT_SECRET`, `SPOTIFY_API_REFRESH_TOKEN`, `TURSO_AUTH_TOKEN`, and `TURSO_DATABASE_URL`. Validation is defined in `lib/env.server.ts`; credentials are read lazily on the server and are never injected into client code.

In production, provision the same five names as Worker secrets. With the configured Node compatibility and compatibility date, Cloudflare populates `process.env` from secret bindings, so `getServerEnv()` reads them without renaming or client-side exposure.

Vite serves development and production preview on port 3000. If a clean checkout cannot resolve `content-collections` on first development startup, run `pnpm build` once to generate the metadata. MDX edits hot reload without a restart.

### Cloudflare Workers

`wrangler.jsonc` targets the existing `johnie` Worker and configures its static asset binding, Node compatibility, and observability. Generated `worker-configuration.d.ts` is committed; run `pnpm cf-typegen` whenever the Wrangler configuration changes.

```sh
pnpm build
pnpm preview
pnpm exec wrangler deploy --dry-run
```

The deployment target is **Workers Paid** (10 MiB compressed script limit, default 30-second CPU allowance). `/og` generates images at request time using bundled WebAssembly and the Inter Bold font from the asset binding. Public images are served as-is, without image optimization.

When ready to publish, provision the five variables above with `wrangler secret put <NAME>`, then run `pnpm deploy`. Authentication, secret uploads, deployment, DNS, and custom-domain configuration are separate operator actions, not part of local verification.

Static redirects live in `lib/redirects.ts`: `/ai` → `/writing/ai-manifesto` and `/skills` → GitHub. Add future entries there. Document security headers live in `lib/security-headers.ts`; `public/_headers` covers static assets. Spotify and the view-count row-set use the Worker Cache API with a 60-second TTL.

### Quality checks

```sh
pnpm check
pnpm typecheck
pnpm build
```

The unchanged SEO regression suite uses Vitest against a running application. Run `pnpm build && pnpm preview`, then `pnpm test:seo` in another terminal. Set `SEO_BASE_URL` to target a different address (default: `http://localhost:3000`). `vitest.config.ts` keeps these HTTP checks in Node, separate from the Cloudflare application Vite plugin.

Oxlint's JavaScript plugins reserve roughly 6 GiB of virtual memory per worker. Small Linux hosts may need additional swap to satisfy the kernel's memory reservation policy; adding 6 GiB of swap resolved the allocator failure on a host with 4 GiB RAM and 1 GiB swap. See [the upstream allocator issue](https://github.com/oxc-project/oxc/issues/20331). Keep the configured plugins and rules enabled.

Built by [Johnie Hjelm](https://johnie.se)
