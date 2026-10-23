"use client";

import dynamic from "next/dynamic";

/**
 * Defers IntrusiveAdManager (Social Bar / Popunder) out of the initial
 * client JS chunk delivered with every page. Pure Core Web Vitals /
 * bundle-size optimization — no change to frequency-capping logic.
 * `ssr: false` requires this wrapper: next/dynamic cannot use ssr:false
 * directly inside a Server Component (app/layout.tsx).
 */
const IntrusiveAdManager = dynamic(
  () => import("@/components/ads/intrusive-ad-manager"),
  { ssr: false }
);

export default function IntrusiveAdLoader() {
  return <IntrusiveAdManager />;
}
