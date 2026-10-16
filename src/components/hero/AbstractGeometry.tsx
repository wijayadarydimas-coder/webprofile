"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AbstractGeometry() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Controlled Cinematic Lighting (Dark Matter palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x7790ff, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x96a9ff, 1.4);
    rimLight.position.set(-4, -3, -2);
    scene.add(rimLight);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer Precision Wireframe (Muted technical icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(1.45, 0);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x7790ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    group.add(outerMesh);

    // 2. Inner Dark Metallic Faceted Core
    const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x171a24,
      metalness: 0.88,
      roughness: 0.24,
      emissive: 0x0b0d12,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // 3. Precision Node Anchors
    const pointsGeo = new THREE.IcosahedronGeometry(1.45, 0);
    const pointsMat = new THREE.PointsMaterial({
      color: 0x96a9ff,
      size: 0.05,
      transparent: true,
      opacity: 0.85,
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    group.add(points);

    // 4. Dual Orbital Planetary / Gyroscope Rings
    const ring1Geo = new THREE.RingGeometry(1.8, 1.815, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x292d39,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    group.add(ring1Mesh);

    const ring2Geo = new THREE.RingGeometry(2.05, 2.062, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x7790ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = -Math.PI / 6;
    group.add(ring2Mesh);

    // Mouse movement damping
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetX = (x / width - 0.5) * 0.7;
      targetY = (y / height - 0.5) * 0.7;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Scroll-linked continuous rotation & subtle depth
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Visibility Observer
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop with performance.now()
    let lastTime = performance.now();

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isVisible) return;

        const now = performance.now();
        const delta = Math.min((now - lastTime) * 0.001, 0.1);
        lastTime = now;

        // Smooth mouse follow with inertia damping
        mouseX += (targetX - mouseX) * 0.045;
        mouseY += (targetY - mouseY) * 0.045;

        // Base continuous organic rotation
        group.rotation.y += 0.2 * delta;
        group.rotation.x += 0.1 * delta;

        // Scroll continuity: link rotation and slight position shift to scroll
        const scrollOffset = scrollY * 0.001;
        group.rotation.y += scrollOffset * 0.03;
        group.position.y = -Math.min(scrollY * 0.0006, 0.4);

        // Subtle mouse tilt
        group.rotation.y += mouseX * 0.015;
        group.rotation.x += mouseY * 0.015;

        // Counter-rotating inner core and rings
        innerMesh.rotation.y -= 0.3 * delta;
        innerMesh.rotation.z += 0.15 * delta;

        ring1Mesh.rotation.z += 0.14 * delta;
        ring2Mesh.rotation.z -= 0.1 * delta;

        renderer.render(scene, camera);
      };

      animate();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      title="Interaktif: Gerakkan kursor atau gulir halaman untuk mengamati aksen 3D"
    />
  );
}
