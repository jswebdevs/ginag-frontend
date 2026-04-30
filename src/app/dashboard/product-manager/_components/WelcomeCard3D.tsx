"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { useUserStore } from '@/store/useUserStore';
import * as THREE from 'three';

// 1. The Actual 3D Object Component
function DreamGem() {
  const meshRef = useRef<THREE.Mesh>(null);

  // useFrame runs on every render frame (usually 60fps) to animate the object
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // Spin horizontally
      meshRef.current.rotation.x += delta * 0.2; // Slowly tumble vertically
    }
  });

  return (
    // Float adds a nice hovering up-and-down breathing effect
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        {/* A highly reflective silver/glass material that looks great on ANY theme */}
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

// 2. The Main Wrapper Component
export default function WelcomeCard3D() {
  const { user } = useUserStore();
  const [mounted, setMounted] = useState(false);

  // We only mount the 3D canvas AFTER the component has hydrated on the client.
  // This prevents Next.js hydration mismatch errors with WebGL.
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="relative h-64 w-full rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary/80 dark:to-primary/40 shadow-sm flex transition-colors duration-500 border border-primary/10">
      
      {/* --- Left Side: Text Content --- */}
      <div className="absolute z-10 p-8 flex flex-col justify-center h-full max-w-[60%] pointer-events-none">
        <h2 className="text-2xl sm:text-3xl font-black text-primary-foreground mb-3 drop-shadow-md">
          Welcome back, {user?.firstName || "Product Manager"}! ✨
        </h2>
        <p className="text-primary-foreground/90 text-sm sm:text-base font-medium max-w-md drop-shadow">
          Here is what is happening in DreamShop today. Check your products, stock levels, and recent product sales.
        </p>
      </div>

      {/* --- Right Side: 3D Canvas --- */}
      {/* cursor-grab allows the user to click and drag the canvas around if you add OrbitControls later */}
      <div className="absolute right-0 top-0 w-[50%] sm:w-[40%] h-full cursor-grab active:cursor-grabbing">
        {mounted && (
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          >
            {/* Environment lighting makes the metalness/roughness actually look realistic */}
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            <DreamGem />
          </Canvas>
        )}
      </div>

      {/* Decorative Blur for blending the 3D area */}
      <div className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-r from-primary via-transparent to-transparent z-0 opacity-50 pointer-events-none"></div>
    </div>
  );
}