
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  targetOpacity: number; // The opacity it should have when not affected by interaction
  currentOpacity: number; // The actual opacity being rendered
  isNear: boolean;
  originalSpeedX: number;
  originalSpeedY: number;
  originalTargetOpacity: number;
  isRepelling: boolean;
  repelEndTime: number;
}

const PARTICLE_COLOR_RGB = "68, 68, 68"; // #444444
const NUM_NEAR_PARTICLES = 20;
const NUM_FAR_PARTICLES = 110; // Total 130 particles
const NEAR_PARTICLE_SIZE_MIN = 10;
const NEAR_PARTICLE_SIZE_MAX = 12;
const FAR_PARTICLE_SIZE_MIN = 4;
const FAR_PARTICLE_SIZE_MAX = 6;
const NEAR_PARTICLE_SPEED_MIN = 0.25; // px per frame, approx 15px/s at 60fps
const NEAR_PARTICLE_SPEED_MAX = 0.33; // px per frame, approx 20px/s at 60fps
const FAR_PARTICLE_SPEED_MIN = 0.08;  // px per frame, approx 5px/s at 60fps
const FAR_PARTICLE_SPEED_MAX = 0.17;  // px per frame, approx 10px/s at 60fps
const NEAR_PARTICLE_OPACITY = 0.7;
const FAR_PARTICLE_OPACITY = 0.4;
const MOUSE_REPEL_RADIUS = 100;
const REPEL_STRENGTH = 0.3; // Adjusted for "slight" repulsion
const OPACITY_ON_REPEL = 0.2;
const REPEL_DURATION = 600; // ms
const INITIAL_FADE_IN_DURATION = 1000; // ms

const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesArray = useRef<Particle[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animationFrameId = useRef<number>();
  const pageLoadTime = useRef<number>(Date.now());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createParticle = useCallback((isNear: boolean, canvasWidth: number, canvasHeight: number): Particle => {
    const size = isNear
      ? Math.random() * (NEAR_PARTICLE_SIZE_MAX - NEAR_PARTICLE_SIZE_MIN) + NEAR_PARTICLE_SIZE_MIN
      : Math.random() * (FAR_PARTICLE_SIZE_MAX - FAR_PARTICLE_SIZE_MIN) + FAR_PARTICLE_SIZE_MIN;
    
    const speedMagnitude = isNear
      ? Math.random() * (NEAR_PARTICLE_SPEED_MAX - NEAR_PARTICLE_SPEED_MIN) + NEAR_PARTICLE_SPEED_MIN
      : Math.random() * (FAR_PARTICLE_SPEED_MAX - FAR_PARTICLE_SPEED_MIN) + FAR_PARTICLE_SPEED_MIN;
    
    const angle = Math.random() * Math.PI * 2;
    const speedX = Math.cos(angle) * speedMagnitude;
    const speedY = Math.sin(angle) * speedMagnitude;
    
    const targetOpacity = isNear ? NEAR_PARTICLE_OPACITY : FAR_PARTICLE_OPACITY;

    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size,
      speedX,
      speedY,
      opacity: 0, // Used for initial fade-in calculation
      targetOpacity,
      currentOpacity: 0, // Actual rendered opacity
      isNear,
      originalSpeedX: speedX,
      originalSpeedY: speedY,
      originalTargetOpacity: targetOpacity,
      isRepelling: false,
      repelEndTime: 0,
    };
  }, []);

  const initParticles = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    particlesArray.current = [];
    for (let i = 0; i < NUM_NEAR_PARTICLES; i++) {
      particlesArray.current.push(createParticle(true, canvas.width, canvas.height));
    }
    for (let i = 0; i < NUM_FAR_PARTICLES; i++) {
      particlesArray.current.push(createParticle(false, canvas.width, canvas.height));
    }
    pageLoadTime.current = Date.now(); 
  }, [createParticle]);

  useEffect(() => {
    if (!isClient) return;
    initParticles();

    const handleResize = () => {
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouse.current.x = event.clientX - rect.left;
        mouse.current.y = event.clientY - rect.top;
      }
    };
    const handleMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    canvasRef.current?.addEventListener('mousemove', handleMouseMove);
    canvasRef.current?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isClient, initParticles]);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      const initialElapsedTime = now - pageLoadTime.current;

      particlesArray.current.forEach(particle => {
        // Initial fade-in
        if (initialElapsedTime < INITIAL_FADE_IN_DURATION) {
          particle.currentOpacity = (initialElapsedTime / INITIAL_FADE_IN_DURATION) * particle.targetOpacity;
        } else {
          particle.opacity = particle.targetOpacity; // Ensure base opacity is set after initial fade
        }

        // Mouse interaction
        let dx = particle.x, dy = particle.y; // Keep original position for drawing if not repelled

        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dxMouse = particle.x - mouse.current.x;
          const dyMouse = particle.y - mouse.current.y;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distanceMouse < MOUSE_REPEL_RADIUS) {
            if (!particle.isRepelling) {
              particle.isRepelling = true;
              particle.repelEndTime = now + REPEL_DURATION;
            }
            const repelFactor = (MOUSE_REPEL_RADIUS - distanceMouse) / MOUSE_REPEL_RADIUS;
            const forceX = (dxMouse / distanceMouse) * repelFactor * REPEL_STRENGTH;
            const forceY = (dyMouse / distanceMouse) * repelFactor * REPEL_STRENGTH;
            dx += forceX;
            dy += forceY;
          }
        }

        if (particle.isRepelling) {
          const timeSinceRepelEnd = particle.repelEndTime - now;
          if (timeSinceRepelEnd > 0) {
            // Currently repelling and opacity is low
            const progress = timeSinceRepelEnd / REPEL_DURATION; // 1 when starts, 0 when ends
            particle.currentOpacity = particle.originalTargetOpacity - (particle.originalTargetOpacity - OPACITY_ON_REPEL) * progress;

          } else {
            // Repel time ended, smoothly transition opacity back
            particle.isRepelling = false;
            // The opacity will naturally revert in the next block if not interacting
          }
        }
        
        if (!particle.isRepelling && initialElapsedTime >= INITIAL_FADE_IN_DURATION) {
           // Smoothly transition to targetOpacity if not repelling and initial fade is done
            if (particle.currentOpacity < particle.targetOpacity) {
                particle.currentOpacity += (particle.targetOpacity - particle.currentOpacity) * 0.05; // Adjust 0.05 for speed of revert
            } else if (particle.currentOpacity > particle.targetOpacity) {
                particle.currentOpacity -= (particle.currentOpacity - particle.targetOpacity) * 0.05;
            }
             // Clamp opacity
            if (Math.abs(particle.currentOpacity - particle.targetOpacity) < 0.01) {
                particle.currentOpacity = particle.targetOpacity;
            }
        }


        // Update particle position for normal drift (only apply if not being significantly repelled by new logic)
        // The repulsion is now additive to the current position for that frame.
        // The base movement should always happen.
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // If repelled, dx/dy contains the new temp position for this frame
        const drawX = particle.isRepelling ? dx : particle.x;
        const drawY = particle.isRepelling ? dy : particle.y;


        // Wrap around logic for base position
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        else if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        else if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR_RGB}, ${particle.currentOpacity})`;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate(0); // Start animation with a timestamp

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isClient, createParticle, initParticles]);


  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
    />
  );
};

export default FloatingParticles;

    