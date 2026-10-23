# ToolGlobe Security Architecture

## Content Security Policy — why it is static, not nonce-based

ToolGlobe's performance mandate depends on Static Generation + ISR
(`generateStaticParams`, `revalidate = 86400`) for 20,000+ tool pages.

A per-request CSP nonce requires reading `headers()` inside a Server
Component to embed the matching value in rendered HTML. In Next.js App
Router, this forces the entire route segment into dynamic (uncached)
rendering. Since the root layout wraps every route, adopting nonce-CSP
project-wide would silently convert every statically generated tool page
into a per-request serverless invocation — an unacceptable regression.

Additionally, a nonce baked into a page cached for up to 24 hours and
served to thousands of visitors is not a real nonce (it stops being
unique), so the security benefit would have been largely theoretical
even if implemented.

**Decision:** static, domain-allowlisted CSP in `next.config.ts`,
applied at Vercel's edge regardless of cache status. `'unsafe-inline'`
is retained only for `script-src`/`style-src` because:
- Next.js's own framework bootstrap injects inline hydration scripts.
- AdSense/Adsterra tags occasionally inject inline style/script snippets.

If a future infra upgrade moves tool pages to a model where
`headers()`/dynamic rendering is acceptable (e.g. edge-cached dynamic
responses with full control over cache keys), nonce-CSP can be
revisited. Until then, this is the correct trade-off.

## Rate limiting

`middleware.ts` applies a sliding-window limiter scoped to `/api/*`
only — zero interaction with page rendering. It is per-edge-isolate
in-memory state, which resets on redeploy/cold start and is not
synchronized across regions. For production-grade abuse resistance at
scale, replace with Upstash Redis or Vercel KV-backed counters.

## Input handling

All user-submitted tool input is sanitized and schema-validated via
`lib/security/sanitize.ts` (DOMPurify + Zod) before reaching
`lib/factory/transform-rules.ts`. No raw user input is ever interpolated
via `dangerouslySetInnerHTML`.

## Contact form

`components/contact/ContactForm.tsx` has no backend endpoint — it
constructs a `mailto:` link client-side after sanitization. There is no
server-side attack surface (no CSRF/injection target) for this feature.

## Reporting

Security issues: 7868686@gmail.com
