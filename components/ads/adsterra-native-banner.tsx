"use client";

import { useEffect, useRef } from "react";

/**
 * Both values come from the exact snippet issued in the Adsterra dashboard for
 * this placement. Component renders nothing if unset, so local/preview builds
 * stay ad-free and layout-shift-free.
 */
const NATIVE_BANNER_SRC = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_SRC ?? "";
const NATIVE_BANNER_CONTAINER_ID =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_CONTAINER_ID ?? "";

interface AdsterraNativeBannerProps {
  className?: string;
}

/**
 * Safe to render on any page (tool pages, homepage, category pages). Each
 * mount performs its own isolated invoke-script injection; each unmount tears
 * it down cleanly, so navigating between tool pages re-triggers a real ad
 * fetch (desired for native banners, unlike the capped Social Bar).
 */
export function AdsterraNativeBanner({ className = "" }: AdsterraNativeBannerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!NATIVE_BANNER_SRC || !NATIVE_BANNER_CONTAINER_ID) return;
    const mount = mountRef.current;
    if (!mount) return;

    // Defensive clear (handles React 18 StrictMode double-invoke in dev).
    mount.innerHTML = "";

    const script = document.createElement("script");
    script.src = NATIVE_BANNER_SRC;
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    const adContainer = document.createElement("div");
    adContainer.id = NATIVE_BANNER_CONTAINER_ID;

    mount.appendChild(script);
    mount.appendChild(adContainer);

    return () => {
      mount.innerHTML = "";
    };
  }, []);

  if (!NATIVE_BANNER_SRC || !NATIVE_BANNER_CONTAINER_ID) {
    return null;
  }

  return (
    <div
      className={`my-8 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 ${className}`}
      aria-label="Advertisement"
    >
      <span className="mb-2 block text-center text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-600">
        Advertisement
      </span>
      <div ref={mountRef} className="min-h-[250px] w-full" />
    </div>
  );
}
