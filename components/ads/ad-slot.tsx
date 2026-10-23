"use client";

import { useEffect, useId, useRef } from "react";
import Script from "next/script";

export type AdSlotVariant = "adsense-display" | "adsterra-native-banner";

interface AdSlotPropsBase {
  className?: string;
}

interface AdSenseDisplayProps extends AdSlotPropsBase {
  variant: "adsense-display";
  adSlotId: string;
  adFormat?: string;
}

interface AdsterraNativeBannerProps extends AdSlotPropsBase {
  variant: "adsterra-native-banner";
  scriptSrc: string;
  containerId: string;
}

export type AdSlotProps = AdSenseDisplayProps | AdsterraNativeBannerProps;

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;

function AdSenseDisplaySlot({
  adSlotId,
  adFormat,
  className,
}: Omit<AdSenseDisplayProps, "variant">) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current || !ADSENSE_CLIENT_ID) return;
    try {
      // @ts-expect-error -- adsbygoogle is injected globally by the lazy-loaded script below
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Script not yet ready — safe no-op; avoids a duplicate/throwing push.
    }
  }, []);

  if (!ADSENSE_CLIENT_ID) return null;

  return (
    <div className={className} aria-label="Advertisement" role="complementary">
      <Script
        id="adsbygoogle-loader"
        strategy="lazyOnload"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
      />
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlotId}
        data-ad-format={adFormat ?? "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}

function AdsterraNativeBannerSlot({
  scriptSrc,
  containerId,
  className,
}: Omit<AdsterraNativeBannerProps, "variant">) {
  const reactId = useId().replace(/:/g, "");
  const resolvedContainerId = `${containerId}-${reactId}`;

  return (
    <div className={className} aria-label="Advertisement" role="complementary">
      <div id={resolvedContainerId} />
      <Script
        id={`adsterra-native-${resolvedContainerId}`}
        strategy="lazyOnload"
        async
        data-cfasync="false"
        src={scriptSrc}
      />
    </div>
  );
}

/**
 * Non-intrusive, placement-based ad slot. Both AdSense and Adsterra Native
 * Banner scripts load via strategy="lazyOnload" so they never block
 * hydration or degrade Core Web Vitals. Intrusive formats (Social Bar,
 * Popunder) are intentionally NOT handled here — see
 * components/ads/intrusive-ad-manager.tsx for those, which applies the
 * 2-per-24h frequency cap required by the architecture spec.
 */
export function AdSlot(props: AdSlotProps) {
  const { variant, ...rest } = props;
  if (variant === "adsense-display") {
    return <AdSenseDisplaySlot {...(rest as Omit<AdSenseDisplayProps, "variant">)} />;
  }
  return (
    <AdsterraNativeBannerSlot {...(rest as Omit<AdsterraNativeBannerProps, "variant">)} />
  );
}
