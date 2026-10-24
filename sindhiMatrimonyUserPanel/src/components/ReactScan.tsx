"use client";

import { useEffect } from "react";
import { scan } from "react-scan";

export function ReactScan() {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      try {
        const stored = localStorage.getItem("react-scan-widget-settings-v2");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.dimensions?.position && parsed.dimensions.position.y < 96) {
            parsed.dimensions.position.y = 96;
            localStorage.setItem("react-scan-widget-settings-v2", JSON.stringify(parsed));
          }
        }
      } catch (_) {}

      scan({
        enabled: true,
        log: false,
        showToolbar: true,
        showFPS: true,
        safeArea: {
          top: 24,
          right: 24,
          bottom: 96,
          left: 24,
        },
      });
    }
  }, []);

  return null;
}
