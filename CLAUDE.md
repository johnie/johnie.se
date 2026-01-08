# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with **TanStack Start** (React) deployed to **Cloudflare Workers**. It's a content-focused site featuring blog posts, TIL (Today I Learned) entries, work history, and projects. The site uses modern React patterns with TypeScript and Tailwind CSS.

## Development Commands

**Development server:**
```bash
pnpm dev
# Uses Vite with Cloudflare Workers runtime simulation
# Accessible at http://localhost:5173
```

**Production build:**
```bash
pnpm build
# Outputs to .output/ directory
```

**Preview with Wrangler:**
```bash
pnpm preview
# Runs the built app in Cloudflare Workers environment
```

**Deploy to Cloudflare:**
```bash
pnpm deploy
# Deploys to Cloudflare Workers
```

**Linting:**
```bash
pnpm lint
# Uses Ultracite (Biome-based linting)
```

**Database operations:**
```bash
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## Architecture

### Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | TanStack Start (React) |
| Build Tool | Vite |
| Hosting | Cloudflare Workers |
| Content | @content-collections/vite |
| Database | Turso (LibSQL) |
| OG Images | workers-og |
| Styling | Tailwind CSS v4 |

### Content Management System

The project uses **@content-collections** for content management, configured in `content-collections.ts`. This is critical to understand:

- **Content is NOT stored in a database** - it's file-based in the `content/` directory
- Content collections are generated at build time into `.content-collections/generated`
- TypeScript path alias: `content-collections` → `./.content-collections/generated`

**Content types:**
1. **Post** (`content/*.mdx`) - Blog posts with frontmatter (title, publishedAt, summary, image, leading)
2. **Page** (`content/page/*.mdx`) - Static pages
3. **Work** (`content/work/*.yml`) - Work experience entries
4. **Project** (`content/projects/*.yml`) - Project portfolio items
5. **TodayILearned** (`content/til/*.mdx`) - TIL entries with type (article/code/podcast/general)

All MDX content is compiled with:
- `remark-gfm` for GitHub Flavored Markdown
- `rehype-shiki` with 'vesper' theme for syntax highlighting
- `rehype-slug` and `rehype-autolink-headings` for heading anchors
- Reading time calculation (275 words/minute)
- Git-based last modified dates via `git log`

**Import pattern:**
```typescript
import { allPosts } from 'content-collections';
```

### App Structure (TanStack Start)

```
src/
├── routes/
│   ├── __root.tsx           # Root layout with navigation, footer, CMD
│   ├── index.tsx            # Homepage (/)
│   ├── about.tsx            # About page (/about)
│   ├── til.tsx              # TIL page (/til)
│   ├── writing/
│   │   ├── index.tsx        # Writing listing (/writing)
│   │   └── $slug.tsx        # Blog post (/writing/:slug)
│   ├── feed[.]xml.ts        # RSS feed
│   ├── sitemap[.]xml.ts     # Sitemap
│   └── og.ts                # OG image generation
├── components/              # React components
│   ├── ui/                  # UI primitives (button, dialog, etc.)
│   ├── mdx.tsx              # MDX renderer
│   ├── mdx-loader.tsx       # Client-only MDX wrapper
│   ├── nav.tsx              # Navigation component
│   ├── nav-loader.tsx       # Client-only navigation wrapper
│   ├── cmd.tsx              # Command palette
│   └── cmd-loader.tsx       # Client-only CMD wrapper
├── lib/                     # Utilities and services
│   ├── server-functions.ts  # TanStack Start server functions
│   ├── turso.ts             # Database client
│   ├── spotify.ts           # Spotify API integration
│   └── env.ts               # Environment variable validation
├── router.tsx               # Router configuration
├── client.tsx               # Client entry point
├── server.ts                # Server entry point
├── routeTree.gen.ts         # Generated route tree (auto-generated)
└── globals.css              # Global styles
```

### Components Organization

- **UI components** (`src/components/ui/`) - Radix UI primitives (button, dialog, badge, command, skeleton)
- **Feature components** (`src/components/`) - bio, footer, nav, projects, work, latestWriting, socialLinks
- **MDX renderer** (`src/components/mdx.tsx`) - Custom MDX components including:
  - CustomLink (handles internal/external/anchor links using TanStack Router's Link)
  - RoundedImage (native img wrapper)
  - Callout, ProsCard, ConsCard (content widgets)
  - Heading overrides (H1, H2, H3)
  - Bio and Badge components available in MDX

**Client-only components** - Components using hooks that can't run on Cloudflare Workers SSR are wrapped with lazy loading:
- `nav-loader.tsx` wraps `nav.tsx` (uses Zustand store)
- `cmd-loader.tsx` wraps `cmd.tsx` (uses cmdk library)
- `mdx-loader.tsx` wraps `mdx.tsx` (MDX uses `new Function()` which isn't allowed in Workers)

### Database & Analytics

**Turso (LibSQL):**
- Database client configured in `src/lib/turso.ts`
- Used for view counting and Spotify song tracking
- Schema defined in `src/lib/db/schema.ts`
- Server functions: `increment(slug)`, `getViewsCount()` in `src/lib/server-functions.ts`
- View counting disabled in development mode
- Gracefully handles missing database credentials

**Analytics:**
- OpenPanel analytics removed (was Vercel-specific)
- Cloudflare Web Analytics can be added via Cloudflare dashboard

### Environment Variables

Environment variables are validated using `@t3-oss/env-core` in `src/lib/env.ts`:

**Required for production:**
- `TURSO_DATABASE_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token

**Optional (for Spotify integration):**
- `SPOTIFY_API_CLIENT_ID`
- `SPOTIFY_API_CLIENT_SECRET`
- `SPOTIFY_API_REFRESH_TOKEN`

Set secrets via Wrangler:
```bash
wrangler secret put TURSO_DATABASE_URL
wrangler secret put TURSO_AUTH_TOKEN
```

### Configuration Files

**vite.config.ts:**
- Cloudflare Vite plugin for Workers integration
- TanStack Start plugin for SSR
- Content collections plugin for MDX processing
- React plugin and TypeScript paths

**wrangler.jsonc:**
- Cloudflare Workers configuration
- R2 bucket binding for OG image caching (optional)
- Environment variables

**tsconfig.json:**
- Path alias `@/*` for `src/` directory
- Path alias `content-collections` for generated content

### Styling

- **Tailwind CSS v4** with PostCSS
- `@tailwindcss/typography` for prose content
- `tailwindcss-animate` for animations
- Dark mode support throughout
- Custom utilities: `clsx`, `tailwind-merge` wrapped in `src/lib/utils.ts`
- Global styles in `src/globals.css`

### State Management

- **Zustand** store configured in `src/lib/main-store.ts`
- Used for client-side state (CMD/command palette open state)
- Client-only components use lazy loading to avoid SSR issues

### Routing

TanStack Router file-based routing:
- `$param` for dynamic segments (e.g., `$slug.tsx`)
- `[.]` for escaping dots in filenames (e.g., `feed[.]xml.ts`)
- Route tree auto-generated in `src/routeTree.gen.ts`
- Links use `<Link to="/path">` from `@tanstack/react-router`

### Server Functions

TanStack Start server functions replace Next.js server actions:
```typescript
import { createServerFn } from '@tanstack/react-start'

export const myServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    // Server-side logic
  })
```

## Key Patterns

1. **MDX Custom Components**: When adding features to MDX content, edit `src/components/mdx.tsx` and add to the `components` object
2. **Content Collections**: After adding/modifying content schemas in `content-collections.ts`, rebuild to regenerate types
3. **Server Functions**: View counting and data mutations use TanStack Start server functions in `src/lib/server-functions.ts`
4. **Path Aliases**: Use `@/*` for imports from `src/` (configured in tsconfig.json)
5. **Structured Data**: Blog posts automatically generate JSON-LD schema for SEO
6. **Client-only Components**: Components using hooks or browser APIs should be wrapped with lazy loading to avoid SSR issues on Cloudflare Workers

## Content Authoring

When creating new blog posts, use this frontmatter structure:
```yaml
---
title: "Post Title"
publishedAt: "2024-01-01"
summary: "Post summary"
image: "/path/to/image.jpg"  # optional
leading: false                # optional, for featured posts
---
```

Available MDX components in posts:
- `<Callout emoji="🎉">content</Callout>`
- `<ProsCard title="Tool" pros={["Pro 1", "Pro 2"]} />`
- `<ConsCard title="Tool" cons={["Con 1", "Con 2"]} />`
- `<Bio />` - Author bio
- `<Badge>text</Badge>`

## Security Notes

- Strong security headers configured in `public/_headers`
- Database queries use Drizzle ORM with proper parameterization
- Server functions run in isolated Cloudflare Workers environment
- No `new Function()` or `eval()` allowed in Workers (MDX rendered client-side)

## Cloudflare-specific Considerations

1. **No `new Function()`**: MDX rendering happens client-side because Cloudflare Workers disallow dynamic code execution
2. **Environment variables**: Use Wrangler secrets or Cloudflare dashboard for sensitive values
3. **R2 for assets**: OG images can be cached in R2 bucket (configured in wrangler.jsonc)
4. **Cold starts**: Workers have minimal cold start times compared to serverless functions
