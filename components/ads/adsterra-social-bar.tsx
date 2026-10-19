"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

/**
 * Adsterra issues one "Social Bar" invoke script per zone. Configure via env —
 * component renders nothing if unset, so local/preview builds stay ad-free.
 */
const SOCIAL_BAR_SRC = process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SRC ?? "";

/** Hard cap: once shown, never again for the lifetime of this browser tab/session. */
const SESSION_FLAG_KEY = "tg_adsterra_sb_session_shown";

/** Soft cap: even in a brand-new tab/session, don't show again within this window. */
const COOLDOWN_KEY = "tg_adsterra_sb_last_shown_at";
const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

/** Wait for genuine engagement before the first (only) injection — avoids greeting
 *  new visitors with an ad before they've seen any real content. */
const ENGAGEMENT_DELAY_MS = 4000;

function canLoadSocialBar(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.sessionStorage.getItem(SESSION_FLAG_KEY) === "1") {
      return false; // already shown this session — hard skip
    }
    const lastShownRaw = window.localStorage.getItem(COOLDOWN_KEY);
    if (lastShownRaw) {
      const lastShown = Number(lastShownRaw);
      if (Number.isFinite(lastShown) && Date.now() - lastShown < COOLDOWN_MS) {
        return false; // within cross-session cooldown window
      }
    }
    return true;
  } catch {
    // Storage blocked (private mode / disabled) — fail closed, never spam when we
    // can't reliably track whether it's already been shown.
    return false;
  }
}

function markSocialBarShown(): void {
  try {
    window.sessionStorage.setItem(SESSION_FLAG_KEY, "1");
    window.localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  } catch {
    // Non-fatal — worst case the cap only applies for this session.
  }
}

/**
 * Mount once, globally, in app/layout.tsx. Do NOT mount per-page — that would
 * defeat the session-level frequency cap and reintroduce spam-loading on
 * every client-side route change.
 */
export function AdsterraSocialBar() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!SOCIAL_BAR_SRC) return;
    if (!canLoadSocialBar()) return;

    timerRef.current = setTimeout(() => {
      setShouldLoad(true);
      markSocialBarShown();
    }, ENGAGEMENT_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!shouldLoad || !SOCIAL_BAR_SRC) return null;

  return (
    <Script
      id="adsterra-social-bar"
      src={SOCIAL_BAR_SRC}
      strategy="afterInteractive"
      async
      data-cfasync="false"
    />
  );
}
