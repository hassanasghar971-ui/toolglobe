# ToolGlobe — ISR & Caching Strategy

This document is the canonical reference for how every route type is cached,
both at the Next.js ISR layer (`revalidate`) and at the CDN/edge layer
(`Cache-Control` headers, defined in `lib/cache-headers.ts`). Any new route
added in a future phase must be classified into one of the categories below
— never invent a new ad-hoc caching policy inline.

## Route classification table

| Route | Rendering mode | `revalidate` | Edge `Cache-Control` preset | Rationale |
|---|---|---|---|---|
| `/` (homepage) | ISR | `3600` (Phase 5) | `isrHourly` | Featured tools round-robin across categories; tool registry rarely changes more than daily, hourly refresh is generous headroom |
| `/category/[slug]` | ISR | `3600` (Phase 5) | `isrHourly` | Paginated tool lists; same registry-change cadence as homepage |
| `/[...slug]` (tool pages) | ISR, `dynamicParams=true` | `86400` (Phase 3) | `isrDaily` | High-tier tools pre-rendered at build; long-tail tools rendered on first request then cached identically. Tool logic/content changes are rare once published |
| `/sitemap.xml`, `/sitemap/:id` | ISR (native `generateSitemaps`) | `86400` (Phase 4) | `isrDaily` | Matches tool-page cadence; GSC re-crawls sitemaps at most daily anyway |
| `/robots.ts` | Static (no revalidate needed) | n/a | Next.js default static caching | Content is a pure function of `SITE_URL`, never changes at runtime |
| `/about`, `/contact`, `/privacy-policy`, `/terms`, `/disclaimer` | Static (fully static generation, no `revalidate` export) | n/a | `staticLongTerm` | Content changes only via code edit + redeploy; a week-long edge TTL is safe and minimizes origin load |
| `/search` | Dynamic (`?q=` dependent) | Not cached (no `revalidate` export; effectively per-request) | `dynamicNoStore` | Output is a direct function of an arbitrary user-supplied query string — caching would either leak one user's results to another or balloon cache key cardinality uselessly |
| `/_next/static/**` | Build output | n/a | `immutableAsset` | Content-hashed filenames — cache forever, a new deploy produces new filenames |

## Why `stale-while-revalidate` everywhere instead of a hard `max-age`

Every cached preset uses `s-maxage` (CDN-only) + `stale-while-revalidate` rather
than a client-facing `max-age`. This means:

- The **browser** always re-validates with the edge on next navigation (cheap,
  usually a 304 or an instant cache hit at the CDN).
- The **CDN edge** serves the cached response instantly for up to `s-maxage`
  seconds, then — on the first request after expiry — serves the *stale*
  cached copy immediately while triggering a background regeneration, so no
  real visitor ever waits on a cold Next.js ISR regeneration.
- This is the standard pattern recommended for Vercel's Edge Network and
  matches how Next.js's own ISR `Cache-Control: s-maxage=N, stale-while-revalidate`
  header behaves by default — our explicit headers in `next.config.ts` simply
  make the policy visible/auditable and consistent for routes (like the
  sitemap) that aren't using the page-level `revalidate` export.

## Image caching

`next/image` handles per-image `Cache-Control` automatically based on
`images.minimumCacheTTL` (set to `31536000` / 1 year in the Phase 8
`next.config.ts` diff, since tool-page images — icons, OG images — are static
assets that don't change after publish). AVIF/WebP format negotiation
(`images.formats`) reduces payload size by 30–50% versus PNG/JPEG for the
icon/illustration assets used across category cards and tool previews,
directly improving LCP on image-heavy pages (image-tools category, PDF-tools
category).

## Font caching

Handled entirely by `next/font/google` (Phase 8 `app/layout.tsx` diff): the
font file is downloaded once at **build time**, self-hosted from
`/_next/static/media/`, and therefore automatically inherits the
`immutableAsset` caching policy above with zero manual configuration. This
also eliminates a render-blocking third-party request to
`fonts.googleapis.com` that would otherwise delay First Contentful Paint.

## Script loading strategy (recap, enforced since Phase 7)

| Script | Strategy | Reason |
|---|---|---|
| Adsterra Social Bar | `next/script` `strategy="afterInteractive"`, gated behind a `useEffect` + session/cooldown check | Never blocks hydration; never fires until genuine engagement + frequency cap clears |
| Adsterra Native Banner | Manual `useEffect` DOM injection, mounted per-page | Needs a fresh invoke per route for genuine per-pageview ad fill; isolated from Next's script dedupe-by-id behavior |
| `SearchModal` | `next/dynamic({ ssr: false })` (Phase 8) | Removed from the initial JS bundle entirely; downloaded only when the user first opens search |

## Explicitly out of scope for Phase 8 (documented, not implemented)

- **On-demand ISR revalidation** (`res.revalidate()` / webhook-triggered):
  not needed at current scale since the tool registry is a build-time static
  module (`lib/tool-registry.ts`, Phase 2), not a database — there is no
  external event that could invalidate a page early. If a future phase moves
  tool data to a CMS/DB, an on-demand revalidation webhook should be added
  then, using the presets in `lib/cache-headers.ts` as the baseline.
- **Service Worker / offline caching**: deliberately not added — would
  conflict with the strict CSP `object-src`/`frame-ancestors` posture
  established in Phase 1 and adds attack surface for marginal benefit on a
  tool site with no offline use case.
