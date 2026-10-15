"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AbstractGeometry() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      // Fallback handled by parent if WebGL context creation fails
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6d8dff, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b9cff, 1.2);
    dirLight2.position.set(-5, -3, -2);
    scene.add(dirLight2);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    // Outer Wireframe Polyhedron
    const outerGeo = new THREE.IcosahedronGeometry(1.4, 0);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x6d8dff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    group.add(outerMesh);

    // Inner Solid Faceted Mesh
    const innerGeo = new THREE.OctahedronGeometry(0.85, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x1b1d23,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x15171c,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // Point anchors
    const pointsGeo = new THREE.IcosahedronGeometry(1.4, 0);
    const pointsMat = new THREE.PointsMaterial({
      color: 0x8b9cff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    group.add(points);

    // Mouse movement damping
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetX = ((x / width) - 0.5) * 0.8;
      targetY = ((y / height) - 0.5) * 0.8;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

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

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Slow subtle natural rotation
      group.rotation.y += 0.25 * delta;
      group.rotation.x += 0.15 * delta;

      // Mouse tilt offset
      group.rotation.y += mouseX * 0.02;
      group.rotation.x += mouseY * 0.02;

      innerMesh.rotation.y -= 0.35 * delta;
      innerMesh.rotation.z += 0.2 * delta;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      title="Interaktif: Gerakkan kursor untuk mengamati aksen 3D"
    />
  );
}
