"use client";

import { useEffect, useRef, useState } from "react";

const ADSTERRA_SCRIPT_SRC =
  "https://pl31804194.profitableratecpmnetwork.com/72/bc/4b/72bc4b4ca161783e4681f10c50bbf607.js";
const ADSTERRA_SCRIPT_ID = "adsterra-social-bar-script";
const INTERACTION_THRESHOLD = 2;

export default function AdsterraLoader() {
  const [triggered, setTriggered] = useState(false);
  const interactionCount = useRef(0);

  useEffect(() => {
    if (triggered) return;

    const handleInteraction = () => {
      interactionCount.current += 1;

      if (interactionCount.current >= INTERACTION_THRESHOLD) {
        injectAdsterraScript();
        cleanupListeners();
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction);

    return cleanupListeners;
  }, [triggered]);

  const injectAdsterraScript = () => {
    if (document.getElementById(ADSTERRA_SCRIPT_ID)) {
      setTriggered(true);
      return;
    }

    const script = document.createElement("script");
    script.id = ADSTERRA_SCRIPT_ID;
    script.src = ADSTERRA_SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
    setTriggered(true);
  };

  return null;
}
