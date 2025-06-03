
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number; // diameter
  speedX: number;
  speedY: number;
  baseOpacity: number;
  currentOpacity: number; 
  isNear: boolean;
  
  twinkleOffset: number;
  twinkleDuration: number;

  isRepelling: boolean;
  repelEndTime: number;
  originalTargetOpacityBeforeRepel: number;
}

// Configuration
const DESKTOP_NUM_NEAR_PARTICLES = 15;
const DESKTOP_NUM_FAR_PARTICLES = 65; 
const MOBILE_NUM_NEAR_PARTICLES = 10;
const MOBILE_NUM_FAR_PARTICLES = 40;

const ACCENT_COLOR_RGB_STRING = "100, 181, 246"; // #64B5F6

const NEAR_PARTICLE_BASE_OPACITY = 1.0;
const FAR_PARTICLE_BASE_OPACITY = 0.6;
const LINE_BASE_OPACITY = 0.4;
const CONNECT_DISTANCE = 80;
const PARTICLE_STROKE_WIDTH = 1;

const NEAR_PARTICLE_SIZE = 8; 
const FAR_PARTICLE_SIZE = 4;  

const NEAR_PARTICLE_SPEED_PX_S_MIN = 6;
const NEAR_PARTICLE_SPEED_PX_S_MAX = 10;
const FAR_PARTICLE_SPEED_PX_S_MIN = 2;
const FAR_PARTICLE_SPEED_PX_S_MAX = 4;

const MOUSE_REPEL_RADIUS = 80;
const REPEL_STRENGTH = 0.03; 
const OPACITY_ON_REPEL = 1.0; 
const REPEL_EFFECT_DURATION = 500; 
const INITIAL_FADE_IN_DURATION = 1000; 
const MOBILE_BREAKPOINT = 768;

const pxPerSecondToPxPerFrame = (px_s: number) => px_s / 60;

const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesArray = useRef<Particle[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animationFrameId = useRef<number>();
  const pageLoadTime = useRef<number>(Date.now());
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const createParticle = useCallback((isNear: boolean, canvasWidth: number, canvasHeight: number, id: number): Particle => {
    const size = isNear ? NEAR_PARTICLE_SIZE : FAR_PARTICLE_SIZE;
    
    const speedMagnitudePxS = isNear
      ? Math.random() * (NEAR_PARTICLE_SPEED_PX_S_MAX - NEAR_PARTICLE_SPEED_PX_S_MIN) + NEAR_PARTICLE_SPEED_PX_S_MIN
      : Math.random() * (FAR_PARTICLE_SPEED_PX_S_MAX - FAR_PARTICLE_SPEED_PX_S_MIN) + FAR_PARTICLE_SPEED_PX_S_MIN;
    
    const speedMagnitude = pxPerSecondToPxPerFrame(speedMagnitudePxS);
    const angle = Math.random() * Math.PI * 2;
    const speedX = Math.cos(angle) * speedMagnitude;
    const speedY = Math.sin(angle) * speedMagnitude;
    
    const baseOpacity = isNear ? NEAR_PARTICLE_BASE_OPACITY : FAR_PARTICLE_BASE_OPACITY;

    return {
      id,
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size,
      speedX,
      speedY,
      baseOpacity,
      currentOpacity: 0,
      isNear,
      twinkleOffset: Math.random() * Math.PI * 2, 
      twinkleDuration: 3000 + Math.random() * 2000, 
      isRepelling: false,
      repelEndTime: 0,
      originalTargetOpacityBeforeRepel: baseOpacity,
    };
  }, []);

  const initParticles = useCallback(() => {
    if (!canvasRef.current || !isClient) return;
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect(); // Use getBoundingClientRect for initial size
    canvas.width = width;
    canvas.height = height;
    
    particlesArray.current = [];
    let numNear = DESKTOP_NUM_NEAR_PARTICLES;
    let numFar = DESKTOP_NUM_FAR_PARTICLES;
    let particleIdCounter = 0;

    if (window.innerWidth < MOBILE_BREAKPOINT) {
      numNear = MOBILE_NUM_NEAR_PARTICLES;
      numFar = MOBILE_NUM_FAR_PARTICLES;
    }

    for (let i = 0; i < numNear; i++) {
      particlesArray.current.push(createParticle(true, canvas.width, canvas.height, particleIdCounter++));
    }
    for (let i = 0; i < numFar; i++) {
      particlesArray.current.push(createParticle(false, canvas.width, canvas.height, particleIdCounter++));
    }
    pageLoadTime.current = Date.now(); 
  }, [createParticle, isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const {width, height} = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        // Re-init particles on resize might be too much, let them adjust or just redraw
        // For simplicity, we'll let them continue, they will wrap around.
        // If re-init is desired, call initParticles() here, but be mindful of performance.
      }
    });
    resizeObserver.observe(canvas);
    initParticles(); // Initial setup based on current canvas size


    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || !canvasRef.current) return; // Disable hover on mobile
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.current.x = event.clientX - rect.left;
      mouse.current.y = event.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      if (isMobile) return;
      mouse.current.x = null;
      mouse.current.y = null;
    };

    // Add listeners to window as canvas is pointer-events: none
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave); // or mouseout on document.body
    
    return () => {
      resizeObserver.unobserve(canvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isClient, initParticles, isMobile]);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (!canvasRef.current) return; // Ensure canvas still exists
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      const initialElapsedTime = now - pageLoadTime.current;

      // Draw connecting lines first
      ctx.lineWidth = PARTICLE_STROKE_WIDTH;
      ctx.filter = 'blur(0.5px)'; 
      for (let i = 0; i < particlesArray.current.length; i++) {
        for (let j = i + 1; j < particlesArray.current.length; j++) {
          const p1 = particlesArray.current[i];
          const p2 = particlesArray.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECT_DISTANCE) {
            const lineOpacityFactor = (1 - distance / CONNECT_DISTANCE);
            const finalLineOpacity = Math.max(0, Math.min(1, LINE_BASE_OPACITY * lineOpacityFactor));
            
            let effectiveLineOpacity = 0;
            if (initialElapsedTime < INITIAL_FADE_IN_DURATION) {
                 effectiveLineOpacity = (initialElapsedTime / INITIAL_FADE_IN_DURATION) * finalLineOpacity;
            } else {
                 effectiveLineOpacity = finalLineOpacity;
            }

            if (effectiveLineOpacity > 0) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${ACCENT_COLOR_RGB_STRING}, ${effectiveLineOpacity})`;
              ctx.stroke();
            }
          }
        }
      }
      ctx.filter = 'none'; 

      // Draw particles
      particlesArray.current.forEach(particle => {
        let interactiveOpacityTarget = particle.baseOpacity;

        if (!particle.isNear) { 
            const twinkleAmplitude = Math.max(0, 0.9 - particle.baseOpacity); 
            const sineValue = Math.sin(now / particle.twinkleDuration * (2 * Math.PI) + particle.twinkleOffset);
            interactiveOpacityTarget = particle.baseOpacity + twinkleAmplitude * (sineValue * 0.5 + 0.5);
        }
        
        let finalOpacity = 0;
        if (initialElapsedTime < INITIAL_FADE_IN_DURATION) {
          finalOpacity = (initialElapsedTime / INITIAL_FADE_IN_DURATION) * interactiveOpacityTarget;
        } else {
          finalOpacity = interactiveOpacityTarget;
        }
        
        let tempX = particle.x;
        let tempY = particle.y;
        
        if (!isMobile && mouse.current.x !== null && mouse.current.y !== null) {
          const dxMouse = particle.x - mouse.current.x;
          const dyMouse = particle.y - mouse.current.y;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distanceMouse < MOUSE_REPEL_RADIUS) {
            if (!particle.isRepelling) {
              particle.isRepelling = true;
              particle.originalTargetOpacityBeforeRepel = finalOpacity; 
            }
            particle.repelEndTime = now + REPEL_EFFECT_DURATION; 

            const repelFactor = (MOUSE_REPEL_RADIUS - distanceMouse) / MOUSE_REPEL_RADIUS;
            const forceX = (dxMouse / distanceMouse) * repelFactor * REPEL_STRENGTH;
            const forceY = (dyMouse / distanceMouse) * repelFactor * REPEL_STRENGTH;
            
            tempX += forceX * 50; 
            tempY += forceY * 50;
            finalOpacity = OPACITY_ON_REPEL;

          } else if (particle.isRepelling && distanceMouse >= MOUSE_REPEL_RADIUS) {
             particle.isRepelling = false;
          }
        }
        
        if (particle.isRepelling) {
          if (now < particle.repelEndTime) {
             particle.currentOpacity += (OPACITY_ON_REPEL - particle.currentOpacity) * 0.2;
          } else {
            particle.isRepelling = false; 
          }
        }
        
        if (!particle.isRepelling) {
            particle.currentOpacity += (finalOpacity - particle.currentOpacity) * 0.1;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        else if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        else if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        
        const opacityToDraw = Math.max(0, Math.min(1, particle.currentOpacity)); 

        if (opacityToDraw > 0) {
            ctx.beginPath();
            ctx.arc(tempX, tempY, particle.size / 2, 0, Math.PI * 2); 
            ctx.strokeStyle = `rgba(${ACCENT_COLOR_RGB_STRING}, ${opacityToDraw})`;
            ctx.lineWidth = PARTICLE_STROKE_WIDTH;
            ctx.stroke();
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate(); 

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isClient, createParticle, initParticles, isMobile]);


  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[1] pointer-events-none" 
    />
  );
};

export default FloatingParticles;
    
