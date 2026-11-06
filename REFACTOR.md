# Untangling decision log

Scope: behavior-preserving structural refactor; remove implementation-restating comments; clean brittle/weak tests last. Preserve pre-existing package/lockfile/workspace changes. Inventory completed before application edits.

## Decisions and problems they solve

### Give content authoring deterministic, minimal metadata

- `content-collections.ts:33-38,157-186`: optional TIL dates fall back to filesystem birth time, hiding build-machine state. Require the dates already present in all four TIL documents.
- `content-collections.ts:45-60,163-170`: publication/modification date validation is copied three times. Share the date schema and isolate Post schema from build configuration so schema tests do not import the whole build.
- `content-collections.ts:25-31,121-153`, `components/work.tsx:63,74`, `components/projects.tsx:25`: hash IDs exist only for React keys. Use collection document identity and remove hash generation/transforms.
- `content-collections.ts:89-93,171-172`: Page image and TIL type/url are not consumed. Remove unused schema fields and unused TIL frontmatter annotations (including undeclared tags); do not add features to justify them.
- `content-collections.ts:232-244`: Git failures and uncommitted files both omit Uses dates. Preserve optional dates, but make the fallback policy explicit rather than claiming null means only uncommitted.

### Own content loading and rendering protocols once

- `src/routes/$slug.tsx:23-42`, `about.tsx:61-79`, `uses.tsx:25-44`: duplicate Page lookup, not-found and MDX preload. One small Page-loading operation uses public `slug`; dedicated routes keep their presentation/head ownership.
- `src/routes/til.tsx:9-13,41-43`: sort static TILs once and use the same order for preload/render.
- `lib/site-index.ts:39,96-99`: `isStaticRoute` actually means explicit file-route ownership. Name it accordingly; preserve exhaustive classification and collision exclusion, not just final URL deduplication.
- `src/routes/about.tsx:30-33`: duplicated safe JSON-LD serialization. Reuse `serializeJsonLd`.
- `components/mdx.tsx:63-80`, `src/routes/about.tsx:43-52`: responsive image sizes encode the same content layout. Share the image size value with an explicit root-layout dependency; keep image loading policy local.
- `components/about-actions.tsx:57`, `src/routes/about.tsx:51`: share portrait asset identity used by display/download.

### Make command-palette ownership explicit

- `lib/main-store.ts`, `components/cmd-loader.tsx`, `components/cmd.tsx`, `components/nav.tsx`: one feature is split across generic state and presentation files. Colocate palette lifecycle/rendering and replace process-global selector state with root-scoped React ownership.
- `components/cmd.tsx:5-6`: palette imports data from navigation/social components. Move shared link definitions out of component implementations; preserve order, icons, destinations, and hidden TIL behavior.
- Palette-only command/dialog primitives move into the same feature folder; navigation lists contain actual visible destinations rather than disabled placeholder entries.
- `components/social-links.tsx:11-42`: all-true enabled configuration is filtered by only one consumer. Keep only the actual social links; no unused switch.
- `components/nav.tsx:54-56`: article-only pathname rewriting duplicates router active matching. Use router link matching for descendants and exact Home matching.
- `components/cmd.tsx:30-41`: repeated closing in URL-protocol branches. Close at command selection ownership; preserve mailto versus new-tab behavior.
- `components/ui/dialog.tsx:16-128`, `components/ui/command.tsx:132-156`: unused generic exports/header/footer/shortcut wrappers. Retain only the actual accessible dialog/command surface.

### Separate displaying views from recording an article visit

- `components/views.tsx:6-24`, `components/view-counter.tsx:6-23`, `src/routes/writing/$slug.tsx:43-50`: article-only `trackView` travels through display components. Make count display read-only; article owns tracking at the existing resolved-count mount boundary.
- Preserve count formatting, missing-slug zero, asynchronous placeholders, no list increments, development suppression, slug-change tracking, and nonfatal transport/database failures.

### Put contracts beside their domain rather than in a shared type bag

- `lib/types.ts:19-81`: mixes React/router presentation, Spotify wire types, display contracts, unused View rows and unused collection re-exports. Move Spotify contracts to a dependency-light Spotify type module, ViewCounts to its domain, Callout props beside their component, and link types beside shared links; delete dead exports without aliases.
- `lib/now-playing.ts:24-51`: SQL persistence and playback orchestration change independently. Give song-log persistence its own module while preserving the small independently failing Player/SongLog contracts and production composition modules.
- `drizzle.config.ts:5-6`, `wrangler.jsonc:15`: duplicated D1 identity. Read the binding identity from the deployment configuration rather than maintain a second database ID.

### Read the calendar in a request and serialize it for all consumers

- Production smoke exposed `components/bio.tsx:8`: a module-scope date used the Worker's epoch-frozen startup clock, producing “-39 years” on the server and “17 years” in the browser. React discarded the mismatched hydrated subtree. Both Bio and Footer now consume `lib/current-year.ts`, supplied by the root loader; no browser/server clock agreement is assumed.
- Keep the biography's source career year and prose in Bio; the root supplies only the current year. Preserve the copy actions' exact visible biography value.

### Remove unconsumed presentation scaffolding, not real variants

- `components/mdx.tsx:126-197`, `components/ui/badge.tsx`: unused ProsCard/ConsCard/Badge definitions and registrations. Remove together after checking MDX consumers.
- `components/mdx.tsx:14-60`: fragment rendering duplicates the final anchor branch. Remove it while preserving the hoisted Zod href parser at the MDX input boundary, as required by the repository's runtime-narrowing policy.
- `components/footer.tsx:7-28`: GetInTouch is always disabled and year wrapper hides an impure render-time clock read. Remove the dormant banner/config; pass the request-owned year from the root loader so SSR and hydration use the same value.
- `components/ui/button.tsx`, `components/not-found.tsx`: generic variants/sizes/asChild and a nested button-in-link serve one default-styled home link. Keep one styled semantic link; remove unused generic button module.
- `components/logo.tsx:3-21`: width/height/attribute options never vary. Keep actual logo dimensions and remove unused API.
- `components/bio.tsx:3-12`, `components/spotify.tsx:19`: one-use year-parameter wrapper and single-string cn call add no independent behavior. Simplify locally.
- `components/work.tsx`: mapped records cannot be absent; remove optional chaining on the record, not optional image/URL guards.
- `src/routes/__root.tsx:46`: remove unstyled intermediate div; retain layout, main target, deferred footer and palette host.
- `package.json`: removing the unused Button/Badge makes their direct `@radix-ui/react-slot` and `class-variance-authority` dependencies surplus. Remove only those declarations and refresh the lockfile, preserving pre-existing version updates.

### Keep OG resources behind the existing asset boundary

- `lib/og.server.tsx:25`: checked-in background image is fetched from production while font uses ASSETS. Load background through ASSETS too so previews are self-contained.
- `lib/og.server.tsx:63-64`: any render failure discards a successfully loaded font. Evict only a failed resource load, preserving later-request recovery without retries/sleeps.

### Remove redundant comments; keep external constraints

- Remove implementation narration in writing/metadata/site-index, Spotify composition, Omni logo, Uses constant/ISO max, and stale next/image CSS comment.
- Remove/correct MDX's unsupported claim that paths are validated.
- Remove palette lifecycle comments made obsolete by new ownership.
- Retain comments for UTC/locale determinism, JSON-LD escaping, cache key ownership/degradation, MDX preload identity, browser idle API compatibility, external token-import constraints, accessibility/find-in-page, nested-link avoidance, and targeted lint suppressions.

### Clean tests after production cutover

- `lib/writing.test.ts`: schema tests import full build configuration; UTC grouping fixture does not discriminate local time when run in UTC. Decouple schema import and make timezone boundary meaningful.
- `lib/site-index.test.ts`: purported dynamic Page coverage only supplies reserved Pages. Include a genuinely generic Page; assert XML element facts rather than adjacent serialization strings.
- `scripts/seo.test.mjs`: metadata regexes depend on attribute order; first-match helpers hide duplicate tags; structured-data/image loops can pass vacuously; exact sizes string tests a copied layout detail. Parse semantic tags, require appropriate schemas/images, and check meaningful image loading/dimensions without pinning incidental markup.
- `lib/view-counts.test.ts`, `lib/now-playing.test.ts`: cache-lifetime names overstate immortal cache fixtures. Model expiry with an injectable clock and exercise stale reads followed by refreshed behavior.
- `lib/testing/local-runtime.ts`: `migrate:false` is a normal fixture option used only to manufacture database errors. Use explicit fault setup instead; dispose proxy when schema setup fails.
- Playback fallback setup currently records through the entire cache/player pipeline; seed the actual SongLog directly. Preserve real D1 coverage for SQL behavior, avoid tests asserting only mocks/calls.

## Special cases intentionally retained

- Hidden TIL navigation versus indexable/directly routable `/til`; no individual TIL route; intentional `/wp-admin` noindex novelty page.
- Explicit route sitemap classifications and Page ownership collisions, root canonical formatting, article/page editorial metadata differences, optional updatedAt, custom versus generated post images, JSON-LD `<` escaping.
- Required MDX preload/cache identity and direct paragraph children for leadertext; real Bio, Callout and Image consumers; generated heading anchors.
- Optional Work/Project images/URLs remain supported; Symbio has no URL; inactive projects remain excluded; current work says Now; final rows have no divider.
- Uses expanded Essentials, three-item preview only when more than one item would be hidden, independent external/product and internal/article links, fragment IDs, optional Git dates, hidden-until-found/accessibility and clipping behavior.
- Missing clipboard API and clipboard rejection produce errors; headshot uses native download plus toast.
- Palette pointer origin versus keyboard centre, retained origin for close animation, focus restoration, lazy first mount with retained host, browser idle callback versus Safari timeout fallback. No synchronization sleep.
- Cache infrastructure errors bypass cache; loader failures propagate. Fixed distinct cache keys, 60-second TTL, intentionally stale view counts/no invalidation, cached playback fallback/null. No added single-flight or retry policy.
- Database view reads fail to `{}`; increments fail harmlessly; development skips increments; public slug length validation stays. Client transport failures remain nonfatal.
- Spotify 204/no-playback, paused/non-track/missing item fallback, HTTP failure fallback, album-artist mapping, live display despite failed recording, empty/failed log -> null; repeat song observations only update count/time.
- Lazy credential validation, independent network timeouts, token grant union and optional refresh token, non-JSON token-error fallback, Node/Vite import boundary, OAuth state/path/code checks and token-only stdout.
- Redirect aliases take precedence over slash normalization; aliases drop query and slash redirects preserve it; root slash fallback; server-function-only CSRF.
- OG missing/empty title defaults to name, bounded error response and resource reuse.

## Investigated boundaries intentionally unchanged

- Static `public/_headers` and dynamic document headers serve different delivery paths; CSP origins are security policy. Do not change policy or invent a header-generation build step as part of this behavior-preserving refactor.
- Ignored historical SQL exists under `src/lib/db/migrations`, but configured future output is `lib/db/migrations` and no tracked migration chain exists. Do not move/replay/delete ignored user files or apply destructive historical SQL. Schema-generated test databases do not validate deployment migration history; document this accurately.
- Website and article head builders have genuine different titles/types/date/image contracts. Do not replace them with a switch-heavy universal builder.
- Featured/archive rows and Work/Project cards have different presentation/loading semantics. Do not create a universal card framework or change content to remove valid guards.
- Toast variants/actions/promise support are explicitly documented public UI behavior; keep even where current callsites use fewer options.

## Baseline evidence

- Unit suite: 4 files, 28 tests passed.
- Typecheck passed.
- Quality check found pre-existing formatting in `components/cmd.tsx` only.
- Browser baseline captured title, H1, canonical and main links for home/about/writing/uses/TIL/article/404. Pointer palette opens, Escape closes and restores trigger focus after animation.
- Initial first-party import graph: 69 source/test files, 134 resolved static import edges, no cycles. Dynamic imports/content references are separately covered by inventory and runtime verification.

## Completion evidence

- `pnpm fix`, `pnpm typecheck`, `pnpm test`, `pnpm check`, and `pnpm build` passed on the completed source. Unit suite: 32 tests in four files.
- `pnpm test:seo` passed against the rebuilt production Worker preview: eight tests. The biography regression first failed against the previous build with expected 17, actual -39, then passed after the request-year cutover.
- Browser comparison of seven hydrated routes preserved document titles, H1s, canonicals, and main-link destinations: home, About, Writing, Uses, TIL, an article, and a real 404. No hydration errors remained.
- Exercised pointer-origin and keyboard-centred palette opening, exact command destinations, Escape focus restoration, selection navigation, descendant Writing activation, Uses expansion/collapse and its retained Essentials/four-item rules.
- Production browser observed no view-recording request from home/archive, one successful recording request for the article visit, and no hydration errors.
- About's server-rendered biography reports 17 years; browser hydration preserves it, the clipboard contains the same long biography, and copyright reports 2026.
- `/og` returned a 1920×1080 PNG with the existing cache contract; visually inspected the generated image. Drizzle configuration resolved the deployment's DB binding without remote database access.
- Final first-party graph: 71 source/test files, 133 resolved static import edges, no cycles or unresolved first-party source imports. This graph excludes generated routes and does not claim to model dynamic imports or MDX references; the audits and browser scenarios cover those.
- Independent content/UI and server repeat audits found no worthwhile residual issues after removing the obsolete direct dependencies. A further source audit of request-year ownership found no remaining module-time current-clock reads in presentation.
- Updated README ownership, content-authoring and test/runtime guidance. Removed obsolete files and direct dependencies; retained the documented legitimate special cases and ignored historical SQL without replaying it.
- Preserved pre-existing dependency/workspace updates; package changes from this refactor only remove the two obsolete direct dependencies and refresh their lockfile entries. No deployment performed.
