
"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const NUM_PARTICLES = 30; // Fewer particles for initials
const SYMBOLS = ['C', 'O', 'U', 'R', 'E', 'N', 'C', 'I', 'A']; // Simplified symbols, or use C,C
const CONTAINER_WIDTH = 100;
const CONTAINER_HEIGHT = 100;

// Define points for "CC" - very simplified
const C_SHAPE_POINTS_1 = [
  { x: -20, y: -20 }, { x: -25, y: -10 }, { x: -25, y: 0 }, { x: -25, y: 10 }, { x: -20, y: 20 },
  { x: -10, y: 25 }, { x: 0, y: 25 }
];
const C_SHAPE_POINTS_2 = [
  { x: 10, y: -20 }, { x: 5, y: -10 }, { x: 5, y: 0 }, { x: 5, y: 10 }, { x: 10, y: 20 },
  { x: 20, y: 25 }, { x: 30, y: 25 }
];
const CC_POINTS = [...C_SHAPE_POINTS_1, ...C_SHAPE_POINTS_2];


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
  opacity: number;
  fontSize: string;
}

export default function FooterInitials() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const generatedParticles = Array.from({ length: NUM_PARTICLES }).map((_, i) => {
      const targetPoint = CC_POINTS[i % CC_POINTS.length];
      return {
        id: i,
        char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        initialX: (Math.random() - 0.5) * CONTAINER_WIDTH * 2,
        initialY: (Math.random() - 0.5) * CONTAINER_HEIGHT * 2,
        targetX: targetPoint.x + (Math.random() - 0.5) * 5, // Add some jitter
        targetY: targetPoint.y + (Math.random() - 0.5) * 5,
        assemblyDelay: Math.random() * 1 + 0.5, // Start animating after a delay
        assemblyDuration: 1 + Math.random(),
        idleAmplitudeX: (Math.random() - 0.5) * 3,
        idleAmplitudeY: (Math.random() - 0.5) * 3,
        idleDuration: 4 + Math.random() * 3,
        opacity: Math.random() * 0.3 + 0.3,
        fontSize: `${Math.floor(Math.random() * 3) + 8}px`, // Smaller font size
      };
    });
    setParticles(generatedParticles);
  }, [isClient]);

  if (!isClient) {
    return <div style={{ width: `${CONTAINER_WIDTH}px`, height: `${CONTAINER_HEIGHT}px` }} />;
  }

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{
        width: `${CONTAINER_WIDTH}px`,
        height: `${CONTAINER_HEIGHT}px`,
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: p.initialX, y: p.initialY, opacity: 0 }}
          animate={{
            x: [p.targetX, p.targetX + p.idleAmplitudeX, p.targetX],
            y: [p.targetY, p.targetY + p.idleAmplitudeY, p.targetY],
            opacity: p.opacity,
          }}
          transition={{
            x: { duration: p.assemblyDuration, ease: "circOut", delay: p.assemblyDelay },
            y: { duration: p.assemblyDuration, ease: "circOut", delay: p.assemblyDelay },
            opacity: { duration: p.assemblyDuration * 0.8, ease: "linear", delay: p.assemblyDelay },
            default: {
              duration: p.idleDuration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: p.assemblyDelay + p.assemblyDuration,
            },
          }}
          style={{
            position: 'absolute',
            color: 'hsl(var(--accent))', // Use accent color
            fontSize: p.fontSize,
            fontFamily: 'Space Grotesk, monospace',
            userSelect: 'none',
          }}
          className="font-code"
        >
          {p.char}
        </motion.span>
      ))}
    </motion.div>
  );
}
