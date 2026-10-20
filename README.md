# johnie.se

Personal website and digital garden for Johnie Hjelm. Features blog posts, TIL entries, work history, and projects.

**[johnie.se](https://johnie.se)**

## Tech Stack

Built with modern web technologies:

- **[Next.js 16](https://nextjs.org)** — React framework with App Router
- **[React 19](https://react.dev)** — UI library
- **[TypeScript](https://www.typescriptlang.org)** — Type safety
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first styling
- **[Content Collections](https://www.content-collections.dev)** — Type-safe content management
- **[MDX](https://mdxjs.com)** — Markdown with React components
- **[Turso](https://turso.tech)** — Edge database (LibSQL)
- **[Radix UI](https://www.radix-ui.com)** — Accessible component primitives
- **[Zustand](https://zustand-demo.pmnd.rs)** — State management
- **[OpenPanel](https://openpanel.dev)** — Privacy-first analytics
- **[Vercel](https://vercel.com)** — Hosting and deployment
- **[Drizzle ORM](https://orm.drizzle.team)** — Database operations
- **[Ultracite](https://www.ultracite.ai/)** — Code quality (Oxlint and Oxfmt presets)

## Development

Use Node.js LTS **24.22.0** (pinned in `.nvmrc`) and pnpm **12.14.0** (pinned in `package.json`). The Node engine is restricted to `24.x` so deployments also stay on LTS.

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Configure Spotify and Turso credentials in `.env.local` before running the app; required variables are defined in `lib/env.ts`.

Built by [Johnie Hjelm](https://johnie.se)
