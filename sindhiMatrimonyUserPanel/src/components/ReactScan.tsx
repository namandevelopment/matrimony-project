"use client";

import { useEffect } from "react";
import { scan } from "react-scan";

export function ReactScan() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      scan({
        enabled: false, // Set to true only when explicitly profiling component re-renders
        log: false,
      });
    }
  }, []);

  return null;
}
