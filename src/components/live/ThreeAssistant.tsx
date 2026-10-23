'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type AssistantVisualState =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'muted'
  | 'completed'
  | 'failed';

interface ThreeAssistantProps {
  state: AssistantVisualState;
  audioLevel?: number; // 0 to 1
  className?: string;
}

export function ThreeAssistant({ state, audioLevel = 0, className = '' }: ThreeAssistantProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);
  const stateRef = useRef(state);
  const audioLevelRef = useRef(audioLevel);

  useEffect(() => {
    stateRef.current = state;
    audioLevelRef.current = audioLevel;
  }, [state, audioLevel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      const width = container.clientWidth || 360;
      const height = container.clientHeight || 360;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 5.2;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Procedural 3D Orb Structure: Inner Nucleus + Wireframe Sphere + Outer Particle Halo
      const innerGeometry = new THREE.IcosahedronGeometry(1.2, 3);
      const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x4f46e5,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
        roughness: 0.3,
        metalness: 0.8,
      });
      const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
      scene.add(innerMesh);

      // Core Solid Sphere
      const coreGeometry = new THREE.SphereGeometry(0.85, 32, 32);
      const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity: 0.75,
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      scene.add(coreMesh);

      // Outer Halo Rings
      const ringGeometry = new THREE.RingGeometry(1.6, 1.66, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 3;
      scene.add(ringMesh);

      // Floating Particle Cloud
      const particleCount = 140;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 1.6 + Math.random() * 0.5;
        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x818cf8,
        size: 0.04,
        transparent: true,
        opacity: 0.75,
      });
      const particleCloud = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particleCloud);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x06b6d4, 2.5, 50);
      pointLight1.position.set(4, 4, 4);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x6366f1, 2.5, 50);
      pointLight2.position.set(-4, -4, 4);
      scene.add(pointLight2);

      // Animation loop with state-driven behaviors
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        const curState = stateRef.current;
        const level = audioLevelRef.current;

        // Base rotations
        let rotSpeed = 0.5;
        let scaleTarget = 1.0;
        let targetColor = new THREE.Color(0x4f46e5);
        let coreColor = new THREE.Color(0x06b6d4);

        switch (curState) {
          case 'idle':
            rotSpeed = 0.35;
            scaleTarget = 1.0 + Math.sin(elapsedTime * 1.5) * 0.03;
            targetColor.setHex(0x4f46e5);
            coreColor.setHex(0x0ea5e9);
            break;
          case 'connecting':
            rotSpeed = 1.8;
            scaleTarget = 1.0 + Math.sin(elapsedTime * 6.0) * 0.06;
            targetColor.setHex(0xf59e0b);
            coreColor.setHex(0xfbbf24);
            break;
          case 'listening':
            rotSpeed = 0.7;
            scaleTarget = 1.08 + Math.sin(elapsedTime * 3.0) * 0.04;
            targetColor.setHex(0x06b6d4);
            coreColor.setHex(0x38bdf8);
            break;
          case 'thinking':
            rotSpeed = 2.4;
            scaleTarget = 0.95 + Math.sin(elapsedTime * 5.0) * 0.05;
            targetColor.setHex(0xa855f7);
            coreColor.setHex(0xc084fc);
            break;
          case 'speaking':
            rotSpeed = 1.2;
            scaleTarget = 1.1 + Math.sin(elapsedTime * 8.0) * 0.08 + level * 0.2;
            targetColor.setHex(0x3b82f6);
            coreColor.setHex(0x60a5fa);
            break;
          case 'muted':
            rotSpeed = 0.15;
            scaleTarget = 0.92;
            targetColor.setHex(0x64748b);
            coreColor.setHex(0x94a3b8);
            break;
          case 'completed':
            rotSpeed = 0.4;
            scaleTarget = 1.0;
            targetColor.setHex(0x10b981);
            coreColor.setHex(0x34d399);
            break;
          case 'failed':
            rotSpeed = 0.2;
            scaleTarget = 0.9 + Math.sin(elapsedTime * 4.0) * 0.02;
            targetColor.setHex(0xef4444);
            coreColor.setHex(0xf87171);
            break;
        }

        // Apply smooth color lerping
        innerMaterial.color.lerp(targetColor, 0.08);
        coreMaterial.color.lerp(coreColor, 0.08);
        ringMaterial.color.lerp(coreColor, 0.08);

        // Rotations
        innerMesh.rotation.x = elapsedTime * rotSpeed * 0.5;
        innerMesh.rotation.y = elapsedTime * rotSpeed * 0.7;

        coreMesh.rotation.y = -elapsedTime * rotSpeed * 0.3;

        ringMesh.rotation.z = elapsedTime * rotSpeed * 0.4;
        particleCloud.rotation.y = elapsedTime * rotSpeed * 0.2;

        // Scale pulsating
        const curScale = innerMesh.scale.x;
        const newScale = THREE.MathUtils.lerp(curScale, scaleTarget, 0.1);
        innerMesh.scale.set(newScale, newScale, newScale);
        coreMesh.scale.set(newScale * 0.9, newScale * 0.9, newScale * 0.9);

        renderer?.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || 360;
        const h = container.clientHeight || 360;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('WebGL init error, falling back to 2D canvas procedural renderer:', err);
      setHasWebGlError(true);
    }
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[340px] flex items-center justify-center"
      />

      {/* Fallback procedural SVG if WebGL fails */}
      {hasWebGlError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-44 h-44 rounded-full border-2 border-indigo-500/50 flex items-center justify-center animate-pulse">
            <div className="w-32 h-32 rounded-full border border-cyan-400/40 flex items-center justify-center animate-spin">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* State Badge Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono backdrop-blur-md shadow-lg">
        <span
          className={`w-2 h-2 rounded-full ${
            state === 'listening'
              ? 'bg-cyan-400 animate-pulse'
              : state === 'speaking'
              ? 'bg-blue-400 animate-ping'
              : state === 'thinking'
              ? 'bg-purple-400 animate-spin'
              : state === 'connecting'
              ? 'bg-amber-400 animate-pulse'
              : state === 'completed'
              ? 'bg-emerald-400'
              : state === 'failed'
              ? 'bg-rose-500 animate-bounce'
              : 'bg-indigo-400'
          }`}
        />
        <span className="uppercase text-slate-200 tracking-wider font-semibold text-[11px]">
          {state}
        </span>
      </div>
    </div>
  );
}
