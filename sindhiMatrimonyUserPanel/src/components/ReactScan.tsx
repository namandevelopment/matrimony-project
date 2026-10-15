"use client";

import { useEffect } from "react";
import { scan } from "react-scan";

export function ReactScan() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      scan({
        enabled: true,
        log: false, // Set to true if you also want console logs for why components re-render
      });
    }
  }, []);

  return null;
}
