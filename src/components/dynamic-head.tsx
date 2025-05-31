
"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const NUM_PARTICLES = 100;
const SYMBOLS = ['*', '+', '.', ':', '^', '~', '-', '_', '|', '/', '\\', '0', '1', '<', '>'];
const HEAD_CONTAINER_WIDTH = 300;
const HEAD_CONTAINER_HEIGHT = 400;
const HEAD_ELLIPSE_RADIUS_X = HEAD_CONTAINER_WIDTH / 2 * 0.8;
const HEAD_ELLIPSE_RADIUS_Y = HEAD_CONTAINER_HEIGHT / 2 * 0.9;

interface Particle {
  id: number;
  char: string;
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
  dissolveX: number;
  dissolveY: number;
  assemblyDelay: number;
  assemblyDuration: number;
  idleAmplitudeX: number;
  idleAmplitudeY: number;
  idleDuration: number;
  initialOpacity: number;
  targetOpacity: number;
  fontSize: string;
}

interface DynamicHeadProps {
  isDissolving?: boolean;
}

export default function DynamicHead({ isDissolving = false }: DynamicHeadProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const generatedParticles = Array.from({ length: NUM_PARTICLES }).map((_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const radiusFactor = Math.sqrt(Math.random()); 
      const dissolveAngle = Math.random() * 2 * Math.PI;
      const dissolveRadius = (window.innerWidth / 2) * (1 + Math.random());


      return {
        id: i,
        char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        initialX: (Math.random() - 0.5) * (window.innerWidth * 0.7),
        initialY: (Math.random() - 0.5) * (window.innerHeight * 0.7),
        targetX: Math.cos(angle) * HEAD_ELLIPSE_RADIUS_X * radiusFactor,
        targetY: Math.sin(angle) * HEAD_ELLIPSE_RADIUS_Y * radiusFactor,
        dissolveX: Math.cos(dissolveAngle) * dissolveRadius,
        dissolveY: Math.sin(dissolveAngle) * dissolveRadius,
        assemblyDelay: Math.random() * 1.5,
        assemblyDuration: 1 + Math.random() * 1.5,
        idleAmplitudeX: (Math.random() - 0.5) * 8,
        idleAmplitudeY: (Math.random() - 0.5) * 8,
        idleDuration: 3 + Math.random() * 3,
        initialOpacity: 0,
        targetOpacity: Math.random() * 0.4 + 0.4,
        fontSize: `${Math.floor(Math.random() * 4) + 10}px`,
      };
    });
    setParticles(generatedParticles);
  }, [isClient]);

  if (!isClient) {
    return <div style={{ width: `${HEAD_CONTAINER_WIDTH}px`, height: `${HEAD_CONTAINER_HEIGHT}px` }} />;
  }

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{
        width: `${HEAD_CONTAINER_WIDTH}px`,
        height: `${HEAD_CONTAINER_HEIGHT}px`,
      }}
      animate={!isDissolving ? {
        scale: [1, 1.02, 1],
        rotate: [0, 0.5, -0.5, 0],
      } : { scale: 1.1, rotate: 0}} // Slightly expand on dissolve
      transition={!isDissolving ? {
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      } : {duration: 1, ease: "easeOut"}}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{
            x: p.initialX,
            y: p.initialY,
            opacity: p.initialOpacity,
          }}
          animate={
            isDissolving ? {
              x: p.dissolveX,
              y: p.dissolveY,
              opacity: 0,
              scale: Math.random() * 1.5 + 0.5,
            } : {
              x: [p.targetX, p.targetX + p.idleAmplitudeX, p.targetX],
              y: [p.targetY, p.targetY + p.idleAmplitudeY, p.targetY],
              opacity: p.targetOpacity,
              scale: 1,
            }
          }
          transition={
            isDissolving ? {
              x: { duration: 1, ease: "easeOut", delay: p.assemblyDelay * 0.3 },
              y: { duration: 1, ease: "easeOut", delay: p.assemblyDelay * 0.3 },
              opacity: { duration: 0.8, ease: "easeOut", delay: p.assemblyDelay * 0.3 },
              scale: { duration: 1, ease: "easeOut", delay: p.assemblyDelay * 0.3 },
            } : {
              x: { duration: p.assemblyDuration, ease: "circOut", delay: p.assemblyDelay },
              y: { duration: p.assemblyDuration, ease: "circOut", delay: p.assemblyDelay },
              opacity: { duration: p.assemblyDuration * 0.8, ease: "linear", delay: p.assemblyDelay },
              default: {
                duration: p.idleDuration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: p.assemblyDelay + p.assemblyDuration,
              }
            }
          }
          style={{
            position: 'absolute',
            color: 'hsl(var(--foreground))',
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
