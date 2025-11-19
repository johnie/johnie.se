# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Next.js 16 (App Router) for Johnie Hjelm. It's a content-focused site featuring blog posts, TIL (Today I Learned) entries, work history, and projects. The site uses modern React patterns with TypeScript and Tailwind CSS.

## Development Commands

**Development server:**
```bash
npm run dev
# Uses Next.js with Turbopack for faster builds
# Accessible at http://localhost:3000
```

**Production build:**
```bash
npm run build
```

**Linting:**
```bash
npm run lint
# Uses ESLint with Next.js config
```

## Architecture

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

### App Structure (Next.js App Router)

```
app/
├── page.tsx              # Homepage
├── layout.tsx            # Root layout with navigation, footer, CMD component
├── about/                # About page
├── writing/
│   └── [slug]/          # Blog post pages (dynamic routes from content/*.mdx)
├── til/                 # Today I Learned listing/pages
├── [slug]/              # Dynamic pages (content/page/*.mdx)
├── og/                  # OpenGraph image generation
├── sitemap.ts           # Dynamic sitemap
└── robots.ts            # Robots.txt
```

### Components Organization

- **UI components** (`components/ui/`) - Radix UI primitives (button, dialog, badge, command, skeleton)
- **Feature components** (`components/`) - bio, footer, nav, projects, work, latestWriting, socialLinks
- **MDX renderer** (`components/mdx.tsx`) - Custom MDX components including:
  - CustomLink (handles internal/external/anchor links)
  - RoundedImage (Next.js Image wrapper)
  - Callout, ProsCard, ConsCard (content widgets)
  - Heading overrides (H1, H2, H3)
  - Bio and Badge components available in MDX

**CMD component** (`components/cmd.tsx`) - Command palette (likely uses cmdk library)

### Database & Analytics

**Turso (LibSQL):**
- Database client configured in `lib/turso.ts`
- Used for view counting (`lib/actions.ts`)
- Views table: `slug`, `count`, `updated_at`
- Server actions: `increment(slug)`, `getViewsCount()`
- View counting disabled in development mode

**Analytics:**
- OpenPanel analytics integrated in root layout
- Tracks screen views, outgoing links, and attributes

### Environment Variables

Environment variables are validated using `@t3-oss/env-nextjs` in `lib/env.ts`:

Required variables:
- `TURSO_DATABASE_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `OPENPANEL_CLIENT_ID` - OpenPanel analytics client ID

### Configuration Files

**next.config.mjs:**
- `typedRoutes: true` - Enables Next.js typed routes
- Image optimization: AVIF and WebP formats
- Redirects from Vercel Edge Config
- Comprehensive security headers (CSP, X-Frame-Options, HSTS, etc.)
- Wrapped with `withContentCollections` for content processing

**eslint.config.mjs:**
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores: node_modules, .next, out, dist, build, public, .content-collections

### Styling

- **Tailwind CSS v4** with PostCSS
- `@tailwindcss/typography` for prose content
- `tailwindcss-animate` for animations
- Dark mode support throughout
- Custom utilities: `clsx`, `tailwind-merge` wrapped in `lib/utils.ts`
- Global styles in `app/globals.css`

### State Management

- **Zustand** store configured in `lib/mainStore.ts`
- Used for client-side state (likely for CMD/command palette)

## Key Patterns

1. **MDX Custom Components**: When adding features to MDX content, edit `components/mdx.tsx` and add to the `components` object
2. **Content Collections**: After adding/modifying content schemas in `content-collections.ts`, rebuild to regenerate types
3. **Server Actions**: View counting and data fetching use Next.js server actions in `lib/actions.ts`
4. **Path Aliases**: Use `@/*` for imports from root (configured in tsconfig.json)
5. **Structured Data**: Blog posts automatically generate JSON-LD schema for SEO

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

- Strong CSP headers configured
- Database queries use Drizzle ORM with proper parameterization
- No API routes - all data fetching via server components/actions
