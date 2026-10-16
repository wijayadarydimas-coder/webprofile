"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function GlobalParticleAtmosphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Accessibility: prefers-reduced-motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Viewport dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Responsive particle count: Desktop ~600, Tablet ~340, Mobile ~180
    let particleCount = 600;
    if (width < 640) {
      particleCount = 180;
    } else if (width < 1024) {
      particleCount = 340;
    }

    // 3. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 5.0;

    // 4. WebGLRenderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false, // Turned off for supreme particle performance
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch {
      setHasWebGL(false);
      return;
    }

    // 5. Generate Circular Soft Luminous Particle Texture
    const createParticleTexture = () => {
      const texCanvas = document.createElement("canvas");
      texCanvas.width = 64;
      texCanvas.height = 64;
      const ctx = texCanvas.getContext("2d");
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      gradient.addColorStop(0.25, "rgba(241, 242, 245, 0.9)");
      gradient.addColorStop(0.5, "rgba(161, 166, 181, 0.4)");
      gradient.addColorStop(0.75, "rgba(119, 144, 255, 0.15)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // 6. Geometry & Attributes
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    // Dark Matter palette:
    // Muted gray-white (#F1F2F5, #FFFFFF)
    // Neutral slate charcoal (#A1A6B5, #7D8496)
    // Restrained blue accents (#7790FF, #96A9FF)
    const colBrightWhite = new THREE.Color(0xffffff);
    const colSoftWhite = new THREE.Color(0xf1f2f5);
    const colSlate = new THREE.Color(0xa1a6b5);
    const colMuted = new THREE.Color(0x7d8496);
    const colAccentBlue = new THREE.Color(0x7790ff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const x = (Math.random() - 0.5) * 14.0;
      const y = (Math.random() - 0.5) * 8.5;
      const z = (Math.random() - 0.5) * 5.0;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      phases[i3] = Math.random() * Math.PI * 2;
      phases[i3 + 1] = Math.random() * Math.PI * 2;
      phases[i3 + 2] = Math.random() * Math.PI * 2;

      speeds[i] = 0.15 + Math.random() * 0.35;

      const randColor = Math.random();
      let chosenColor: THREE.Color;
      if (randColor < 0.5) {
        chosenColor = colSoftWhite;
      } else if (randColor < 0.75) {
        chosenColor = colSlate;
      } else if (randColor < 0.88) {
        chosenColor = colMuted;
      } else if (randColor < 0.96) {
        chosenColor = colBrightWhite;
      } else {
        chosenColor = colAccentBlue; // occasional restrained blue accent
      }

      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 7. Material
    const material = new THREE.PointsMaterial({
      size: width < 640 ? 0.08 : 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 8. Section-aware intensity tracking
    // Hero: 100%, About: 50%, Projects: 35%, Experience/Research: 20%, Community/Contact/Footer: 10-12%
    let targetIntensity = 1.0;
    let currentIntensity = 1.0;

    const updateSectionIntensity = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = docHeight > 0 ? scrollY / docHeight : 0;

      // Check section element positions if available
      const getSectionProgress = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.2;
      };

      if (getSectionProgress("contact")) {
        targetIntensity = 0.1;
      } else if (getSectionProgress("community")) {
        targetIntensity = 0.12;
      } else if (getSectionProgress("research")) {
        targetIntensity = 0.2;
      } else if (getSectionProgress("experience")) {
        targetIntensity = 0.2;
      } else if (getSectionProgress("projects")) {
        targetIntensity = 0.35;
      } else if (getSectionProgress("about")) {
        targetIntensity = 0.52;
      } else if (getSectionProgress("home") || scrollY < 250) {
        targetIntensity = 1.0;
      } else {
        // Fallback smooth decay based on scroll fraction
        targetIntensity = Math.max(0.12, 1.0 - scrollFraction * 0.88);
      }
    };

    window.addEventListener("scroll", updateSectionIntensity, { passive: true });
    updateSectionIntensity();

    // 9. Pointer Influence
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouseX = Math.max(-1.0, Math.min(1.0, x));
      targetMouseY = Math.max(-1.0, Math.min(1.0, y));
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // 10. Resize Handling
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 11. Tab visibility management
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 12. Animation Loop using performance.now()
    let animationFrameId: number;
    let startTime = performance.now();

    if (prefersReducedMotion) {
      material.opacity = 0.4;
      renderer.render(scene, camera);
    } else {
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isTabVisible) return;

        const now = performance.now();
        const elapsedTime = (now - startTime) * 0.001;

        // Smooth transition of particle intensity between sections
        currentIntensity += (targetIntensity - currentIntensity) * 0.04;
        material.opacity = currentIntensity * 0.85;

        // Smooth pointer damping
        mouseX += (targetMouseX - mouseX) * 0.035;
        mouseY += (targetMouseY - mouseY) * 0.035;

        // Mouse projection in world units
        const vFov = (camera.fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
        const visibleWidth = visibleHeight * camera.aspect;

        const cursorWorldX = (mouseX * visibleWidth) / 2;
        const cursorWorldY = (mouseY * visibleHeight) / 2;

        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        const influenceRadius = 2.0;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const ox = originalPositions[i3];
          const oy = originalPositions[i3 + 1];
          const oz = originalPositions[i3 + 2];

          const spd = speeds[i];
          const phX = phases[i3];
          const phY = phases[i3 + 1];
          const phZ = phases[i3 + 2];

          // Slow organic harmonic drift
          const driftX = ox + Math.sin(elapsedTime * spd * 0.45 + phX) * 0.35;
          const driftY = oy + Math.cos(elapsedTime * spd * 0.38 + phY) * 0.28;
          const driftZ = oz + Math.sin(elapsedTime * spd * 0.3 + phZ) * 0.22;

          let curX = posArray[i3];
          let curY = posArray[i3 + 1];
          let curZ = posArray[i3 + 2];

          // Distance to mouse pointer
          const dx = curX - cursorWorldX;
          const dy = curY - cursorWorldY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius) {
            // Subtle, restrained repulsion
            const factor = (1 - dist / influenceRadius) * 0.045;
            curX += (dx / (dist + 0.001)) * factor;
            curY += (dy / (dist + 0.001)) * factor;
          }

          // Gentle spring return to organic drift orbit
          curX += (driftX - curX) * 0.035;
          curY += (driftY - curY) * 0.035;
          curZ += (driftZ - curZ) * 0.035;

          posArray[i3] = curX;
          posArray[i3 + 1] = curY;
          posArray[i3 + 2] = curZ;
        }

        posAttr.needsUpdate = true;

        // Subtle camera parallax
        camera.position.x += (mouseX * 0.25 - camera.position.x) * 0.025;
        camera.position.y += (mouseY * 0.18 - camera.position.y) * 0.025;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();
    }

    return () => {
      window.removeEventListener("scroll", updateSectionIntensity);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      geometry.dispose();
      material.dispose();
      if (particleTexture) particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
      />

      {!hasWebGL && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(119,144,255,0.06),transparent_70%)]" />
      )}
    </div>
  );
}
