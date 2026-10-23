"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  canShowIntrusiveAd,
  recordIntrusiveAdImpression,
} from "@/lib/ads/frequency-capping";

const SOCIAL_BAR_SRC = process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SRC;
const POPUNDER_SRC = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC;

/**
 * Mounted exactly once in the root layout. Social Bar and Popunder are
 * self-injecting ad formats — once loaded, Adsterra's SDK attaches its own
 * fixed-position bar / popunder trigger directly to the document with no
 * React-rendered container. This component's only responsibility is
 * deciding WHETHER to load each script, gated by a strict 2-impressions-
 * per-24h cap (dual localStorage + cookie tracked) to prevent ad fatigue
 * and avoid Google AdSense intrusive-ad policy conflicts.
 *
 * SSR output is always empty (both flags start false), and the client's
 * first render matches that before the effect flips them — no hydration
 * mismatch is possible.
 */
export default function IntrusiveAdManager() {
  const [shouldLoadSocialBar, setShouldLoadSocialBar] = useState(false);
  const [shouldLoadPopunder, setShouldLoadPopunder] = useState(false);

  useEffect(() => {
    if (SOCIAL_BAR_SRC && canShowIntrusiveAd("adsterra-social-bar")) {
      setShouldLoadSocialBar(true);
    }
    if (POPUNDER_SRC && canShowIntrusiveAd("adsterra-popunder")) {
      setShouldLoadPopunder(true);
    }
  }, []);

  return (
    <>
      {shouldLoadSocialBar && SOCIAL_BAR_SRC && (
        <Script
          id="adsterra-social-bar"
          strategy="lazyOnload"
          src={SOCIAL_BAR_SRC}
          onLoad={() => recordIntrusiveAdImpression("adsterra-social-bar")}
        />
      )}
      {shouldLoadPopunder && POPUNDER_SRC && (
        <Script
          id="adsterra-popunder"
          strategy="lazyOnload"
          src={POPUNDER_SRC}
          onLoad={() => recordIntrusiveAdImpression("adsterra-popunder")}
        />
      )}
    </>
  );
}
