// components/AdLayout.tsx
// Adsterra Placement ID 31635306 — lazy-loaded via IntersectionObserver,
// isolated inside a sandboxed srcDoc iframe to avoid `atOptions` collisions
// between multiple ad slots and to keep the top-level page CSP clean.

"use client";

import { useEffect, useRef, useState } from "react";
import { getAdsterraPlacementId } from "@/lib/site-config";

interface AdSlotProps {
  width?: number;
  height?: number;
  className?: string;
  label?: string;
}

export function AdSlot({ width = 300, height = 250, className = "", label = "Advertisement" }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const placementId = getAdsterraPlacementId();

  // Step 1: lazily flag visibility using IntersectionObserver (zero layout cost until in-view)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px", threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Step 2: inject sandboxed iframe only once visible
  useEffect(() => {
    if (!visible || loaded) return;
    const el = containerRef.current;
    if (!el) return;

    const iframe = document.createElement("iframe");
    iframe.title = "advertisement";
    iframe.style.border = "0";
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.loading = "lazy";
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
    iframe.referrerPolicy = "no-referrer-when-downgrade";

    const srcDoc = `<!doctype html><html><head><meta charset="utf-8"/><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head><body>
<script type="text/javascript">
  var atOptions = { 'key': '${placementId}', 'format': 'iframe', 'height': ${height}, 'width': ${width}, 'params': {} };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/${placementId}/invoke.js"></script>
</body></html>`;

    iframe.srcdoc = srcDoc;
    el.innerHTML = "";
    el.appendChild(iframe);
    setLoaded(true);
  }, [visible, loaded, placementId, width, height]);

  return (
    <div
      ref={containerRef}
      className={`glass-card flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      {!loaded && <span className="text-[10px] uppercase tracking-widest text-white/30">{label}</span>}
    </div>
  );
}

export default function AdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-center">
        <AdSlot width={728} height={90} className="hidden md:flex" label="Sponsored" />
      </div>
      <div className="flex justify-center">
        <AdSlot width={320} height={50} className="flex md:hidden" label="Sponsored" />
      </div>

      {children}

      <div className="flex justify-center">
        <AdSlot width={300} height={250} label="Sponsored" />
      </div>
    </div>
  );
}
