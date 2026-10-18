"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

interface InteractionContextValue {
  interactionCount: number;
  registerInteraction: () => void;
}

const InteractionContext = createContext<InteractionContextValue | undefined>(undefined);

const ADSTERRA_SCRIPT_SRC =
  "https://pl31804194.profitableratecpmnetwork.com/72/bc/4b/72bc4b4ca161783e4681f10c50bbf607.js";
const ADSTERRA_THRESHOLD = 2;

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [interactionCount, setInteractionCount] = useState(0);
  const scriptInjected = useRef(false);

  const injectAdsterraScript = useCallback(() => {
    if (scriptInjected.current) return;
    if (typeof document === "undefined") return;
    if (document.querySelector(`script[src="${ADSTERRA_SCRIPT_SRC}"]`)) {
      scriptInjected.current = true;
      return;
    }
    const script = document.createElement("script");
    script.src = ADSTERRA_SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
    scriptInjected.current = true;
  }, []);

  const registerInteraction = useCallback(() => {
    setInteractionCount((prev) => {
      const next = prev + 1;
      if (next >= ADSTERRA_THRESHOLD) {
        injectAdsterraScript();
      }
      return next;
    });
  }, [injectAdsterraScript]);

  return (
    <InteractionContext.Provider value={{ interactionCount, registerInteraction }}>
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction(): InteractionContextValue {
  const ctx = useContext(InteractionContext);
  if (!ctx) {
    throw new Error("useInteraction must be used within an InteractionProvider");
  }
  return ctx;
}
