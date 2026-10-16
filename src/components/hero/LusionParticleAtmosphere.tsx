"use client";

import GlobalParticleAtmosphere from "../particles/GlobalParticleAtmosphere";

interface LusionParticleAtmosphereProps {
  className?: string;
}

export default function LusionParticleAtmosphere({ className = "" }: LusionParticleAtmosphereProps) {
  // Re-exports the unified single GlobalParticleAtmosphere to prevent redundant WebGL canvases
  return <GlobalParticleAtmosphere />;
}
