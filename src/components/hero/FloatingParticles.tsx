
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  baseOpacity: number; // Target opacity (e.g., 0.8 or 0.5)
  currentOpacity: number; // Opacity used for drawing, includes twinkle & initial fade & hover
  colorRGB: string; // e.g., "255,255,255"
  
  // Twinkle properties
  twinkleOffset: number;
  twinkleDuration: number; // Duration for one full twinkle cycle

  // Hover interaction properties
  isRepelling: boolean;
  repelEndTime: number;
  originalTargetOpacityBeforeRepel: number; // Base opacity before repel started
}

// Configuration
const DESKTOP_NUM_NEAR_PARTICLES = 15;
const DESKTOP_NUM_FAR_PARTICLES = 65; // Total 80
const MOBILE_NUM_NEAR_PARTICLES = 10;
const MOBILE_NUM_FAR_PARTICLES = 40; // Total 50

const NEAR_PARTICLE_COLOR_RGB = "255, 255, 255";
const FAR_PARTICLE_COLOR_RGB = "230, 245, 255";

const NEAR_PARTICLE_BASE_OPACITY = 0.8;
const FAR_PARTICLE_BASE_OPACITY = 0.5;

const NEAR_PARTICLE_SIZE_MIN = 8;
const NEAR_PARTICLE_SIZE_MAX = 10;
const FAR_PARTICLE_SIZE_MIN = 3;
const FAR_PARTICLE_SIZE_MAX = 5;

// Speeds in pixels per second
const NEAR_PARTICLE_SPEED_PX_S_MIN = 8;
const NEAR_PARTICLE_SPEED_PX_S_MAX = 12;
const FAR_PARTICLE_SPEED_PX_S_MIN = 3;
const FAR_PARTICLE_SPEED_PX_S_MAX = 6;

const MOUSE_REPEL_RADIUS = 80;
const REPEL_STRENGTH = 0.03; // Softer repulsion
const OPACITY_ON_REPEL = 1.0;
const REPEL_EFFECT_DURATION = 500; // ms for opacity change
const INITIAL_FADE_IN_DURATION = 1200; // ms
const MOBILE_BREAKPOINT = 768;

// Convert px/s to px/frame (assuming 60fps for approximation)
const pxPerSecondToPxPerFrame = (px_s: number) => px_s / 60;

interface FloatingParticlesProps {
  scrollFade?: number; // Opacity factor from scrolling (0.5 to 1.0)
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ scrollFade = 1.0 }) => {
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
    
    const speedMagnitudePxS = isNear
      ? Math.random() * (NEAR_PARTICLE_SPEED_PX_S_MAX - NEAR_PARTICLE_SPEED_PX_S_MIN) + NEAR_PARTICLE_SPEED_PX_S_MIN
      : Math.random() * (FAR_PARTICLE_SPEED_PX_S_MAX - FAR_PARTICLE_SPEED_PX_S_MIN) + FAR_PARTICLE_SPEED_PX_S_MIN;
    
    const speedMagnitude = pxPerSecondToPxPerFrame(speedMagnitudePxS);
    const angle = Math.random() * Math.PI * 2;
    const speedX = Math.cos(angle) * speedMagnitude;
    const speedY = Math.sin(angle) * speedMagnitude;
    
    const baseOpacity = isNear ? NEAR_PARTICLE_BASE_OPACITY : FAR_PARTICLE_BASE_OPACITY;
    const colorRGB = isNear ? NEAR_PARTICLE_COLOR_RGB : FAR_PARTICLE_COLOR_RGB;

    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size,
      speedX,
      speedY,
      baseOpacity,
      currentOpacity: 0, // Starts at 0 for fade-in
      colorRGB,
      twinkleOffset: Math.random() * Math.PI * 2, // Random start phase for twinkle
      twinkleDuration: 3000 + Math.random() * 2000, // 3-5 seconds per twinkle cycle
      isRepelling: false,
      repelEndTime: 0,
      originalTargetOpacityBeforeRepel: baseOpacity,
    };
  }, []);

  const initParticles = useCallback(() => {
    if (!canvasRef.current || !isClient) return;
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    particlesArray.current = [];
    let numNear = DESKTOP_NUM_NEAR_PARTICLES;
    let numFar = DESKTOP_NUM_FAR_PARTICLES;

    if (window.innerWidth < MOBILE_BREAKPOINT) {
      numNear = MOBILE_NUM_NEAR_PARTICLES;
      numFar = MOBILE_NUM_FAR_PARTICLES;
    }

    for (let i = 0; i < numNear; i++) {
      particlesArray.current.push(createParticle(true, canvas.width, canvas.height));
    }
    for (let i = 0; i < numFar; i++) {
      particlesArray.current.push(createParticle(false, canvas.width, canvas.height));
    }
    pageLoadTime.current = Date.now(); 
  }, [createParticle, isClient]);

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

    const currentCanvas = canvasRef.current;
    currentCanvas?.addEventListener('mousemove', handleMouseMove);
    currentCanvas?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      currentCanvas?.removeEventListener('mousemove', handleMouseMove);
      currentCanvas?.removeEventListener('mouseleave', handleMouseLeave);
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      const initialElapsedTime = now - pageLoadTime.current;

      particlesArray.current.forEach(particle => {
        let interactiveOpacityTarget = particle.baseOpacity;

        // Twinkle effect calculation
        const twinkleAmplitude = Math.max(0, 0.9 - particle.baseOpacity); // Ensure amplitude is non-negative
        const sineValue = Math.sin(now / particle.twinkleDuration * (2 * Math.PI) + particle.twinkleOffset); // Full cycle 0-1
        let twinkledOpacity = particle.baseOpacity + twinkleAmplitude * (sineValue * 0.5 + 0.5);
        
        interactiveOpacityTarget = twinkledOpacity;


        // Initial fade-in
        let finalOpacity = 0;
        if (initialElapsedTime < INITIAL_FADE_IN_DURATION) {
          finalOpacity = (initialElapsedTime / INITIAL_FADE_IN_DURATION) * interactiveOpacityTarget;
        } else {
          finalOpacity = interactiveOpacityTarget;
        }
        
        let tempX = particle.x;
        let tempY = particle.y;
        
        // Mouse interaction
        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dxMouse = particle.x - mouse.current.x;
          const dyMouse = particle.y - mouse.current.y;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distanceMouse < MOUSE_REPEL_RADIUS) {
            if (!particle.isRepelling) {
              particle.isRepelling = true;
              particle.originalTargetOpacityBeforeRepel = finalOpacity; // Capture current opacity before repel
            }
            particle.repelEndTime = now + REPEL_EFFECT_DURATION; 

            const repelFactor = (MOUSE_REPEL_RADIUS - distanceMouse) / MOUSE_REPEL_RADIUS;
            const forceX = (dxMouse / distanceMouse) * repelFactor * REPEL_STRENGTH;
            const forceY = (dyMouse / distanceMouse) * repelFactor * REPEL_STRENGTH;
            
            tempX += forceX * 50; // Apply force more visibly for gentle push
            tempY += forceY * 50;
            finalOpacity = OPACITY_ON_REPEL; // Target opacity during repel

          } else if (particle.isRepelling && distanceMouse >= MOUSE_REPEL_RADIUS) {
             // If mouse moved out of radius while repelling, stop repelling
             particle.isRepelling = false;
          }
        }
        
        // Smoothly transition opacity if repelling or repel ended
        if (particle.isRepelling) {
          if (now < particle.repelEndTime) {
            // Gradually move towards OPACITY_ON_REPEL
             particle.currentOpacity += (OPACITY_ON_REPEL - particle.currentOpacity) * 0.2;
          } else {
            particle.isRepelling = false; 
            // Start transitioning back to original twinkled opacity after repel duration ends
          }
        }
        
        if (!particle.isRepelling) {
            // Gradually move towards the calculated finalOpacity (which includes twinkle)
            particle.currentOpacity += (finalOpacity - particle.currentOpacity) * 0.1;
        }


        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Boundary check (wrap around)
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        else if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        else if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        
        ctx.beginPath();
        ctx.arc(tempX, tempY, particle.size, 0, Math.PI * 2);
        // Apply scrollFade to the final opacity
        const opacityToDraw = Math.max(0, Math.min(1, particle.currentOpacity * scrollFade));
        ctx.fillStyle = `rgba(${particle.colorRGB}, ${opacityToDraw})`;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate(); 

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  // scrollFade is a dependency now
  }, [isClient, createParticle, initParticles, scrollFade]);


  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[1] pointer-events-none blur-[1px]"
    />
  );
};

export default FloatingParticles;
    
