"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Hero3DFallback from "./Hero3DFallback";

const AbstractGeometry = dynamic(() => import("./AbstractGeometry"), {
  ssr: false,
  loading: () => <Hero3DFallback />,
});

export default function Hero3DCanvas() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  if (!mounted || prefersReducedMotion) {
    return <Hero3DFallback />;
  }

  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      <AbstractGeometry />
    </div>
  );
}
