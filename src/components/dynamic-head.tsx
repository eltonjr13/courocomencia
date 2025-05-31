"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const NUM_PARTICLES = 100;
const SYMBOLS = ['*', '+', '.', ':', '^', '~', '-', '_', '|', '/', '\\', '0', '1', '<', '>'];
const HEAD_CONTAINER_WIDTH = 300; // Width of the head area
const HEAD_CONTAINER_HEIGHT = 400; // Height of the head area
const HEAD_ELLIPSE_RADIUS_X = HEAD_CONTAINER_WIDTH / 2 * 0.8; // Ellipse horizontal radius
const HEAD_ELLIPSE_RADIUS_Y = HEAD_CONTAINER_HEIGHT / 2 * 0.9; // Ellipse vertical radius

interface Particle {
  id: number;
  char: string;
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
  assemblyDelay: number;
  assemblyDuration: number;
  idleAmplitudeX: number;
  idleAmplitudeY: number;
  idleDuration: number;
  initialOpacity: number;
  targetOpacity: number;
  fontSize: string;
}

export default function DynamicHead() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const generatedParticles = Array.from({ length: NUM_PARTICLES }).map((_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const radiusFactor = Math.sqrt(Math.random()); // For more central distribution

      return {
        id: i,
        char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        initialX: (Math.random() - 0.5) * (window.innerWidth * 0.7),
        initialY: (Math.random() - 0.5) * (window.innerHeight * 0.7),
        targetX: Math.cos(angle) * HEAD_ELLIPSE_RADIUS_X * radiusFactor,
        targetY: Math.sin(angle) * HEAD_ELLIPSE_RADIUS_Y * radiusFactor,
        assemblyDelay: Math.random() * 1.5, // Stagger up to 1.5s
        assemblyDuration: 1 + Math.random() * 1.5, // Duration 1-2.5s
        idleAmplitudeX: (Math.random() - 0.5) * 8,
        idleAmplitudeY: (Math.random() - 0.5) * 8,
        idleDuration: 3 + Math.random() * 3, // 3-6s
        initialOpacity: 0,
        targetOpacity: Math.random() * 0.4 + 0.4, // 0.4 to 0.8
        fontSize: `${Math.floor(Math.random() * 4) + 10}px`, // 10px to 13px
      };
    });
    setParticles(generatedParticles);
  }, [isClient]);

  if (!isClient) {
    // Render a placeholder or null during SSR to avoid hydration mismatch
    // The head area will be empty until client-side rendering kicks in
    return <div style={{ width: `${HEAD_CONTAINER_WIDTH}px`, height: `${HEAD_CONTAINER_HEIGHT}px` }} />;
  }

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{
        width: `${HEAD_CONTAINER_WIDTH}px`,
        height: `${HEAD_CONTAINER_HEIGHT}px`,
      }}
      animate={{
        scale: [1, 1.02, 1],
        rotate: [0, 0.5, -0.5, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{
            x: p.initialX,
            y: p.initialY,
            opacity: p.initialOpacity,
          }}
          animate={{
            x: [p.targetX, p.targetX + p.idleAmplitudeX, p.targetX],
            y: [p.targetY, p.targetY + p.idleAmplitudeY, p.targetY],
            opacity: [p.targetOpacity, p.targetOpacity * 0.7, p.targetOpacity],
          }}
          transition={{
            // Assembly part (first segment of x, y, opacity animation)
            x: { duration: p.assemblyDuration, ease: "circOut", delay: p.assemblyDelay },
            y: { duration: p.assemblyDuration, ease: "circOut", delay: p.assemblyDelay },
            opacity: { duration: p.assemblyDuration * 0.8, ease: "linear", delay: p.assemblyDelay },
            // Default for continuous looping part
            default: {
              duration: p.idleDuration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: p.assemblyDelay + p.assemblyDuration, // Start idle animation after assembly
            }
          }}
          style={{
            position: 'absolute',
            color: 'hsl(var(--foreground))', // Uses main foreground color #E0E0E0
            fontSize: p.fontSize,
            fontFamily: 'Space Grotesk, monospace', // Ensure retro font
            userSelect: 'none',
          }}
          className="font-code" // Uses tailwind config for font-code
        >
          {p.char}
        </motion.span>
      ))}
    </motion.div>
  );
}
