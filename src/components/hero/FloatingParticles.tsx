
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

const PARTICLE_COLOR_RGB = "255, 255, 255"; // Pure White
const DESKTOP_NUM_NEAR_PARTICLES = 20;
const DESKTOP_NUM_FAR_PARTICLES = 110;
const MOBILE_NUM_NEAR_PARTICLES = 15;
const MOBILE_NUM_FAR_PARTICLES = 65;

const NEAR_PARTICLE_SIZE_MIN = 10;
const NEAR_PARTICLE_SIZE_MAX = 12;
const FAR_PARTICLE_SIZE_MIN = 4;
const FAR_PARTICLE_SIZE_MAX = 6;
const NEAR_PARTICLE_SPEED_MIN = 0.25; // px per frame, approx 15px/s at 60fps
const NEAR_PARTICLE_SPEED_MAX = 0.33; // px per frame, approx 20px/s at 60fps
const FAR_PARTICLE_SPEED_MIN = 0.08;  // px per frame, approx 5px/s at 60fps
const FAR_PARTICLE_SPEED_MAX = 0.17;  // px per frame, approx 10px/s at 60fps
const NEAR_PARTICLE_OPACITY = 0.8; // Increased opacity
const FAR_PARTICLE_OPACITY = 0.6;  // Increased opacity
const MOUSE_REPEL_RADIUS = 100;
const REPEL_STRENGTH = 0.1; 
const OPACITY_ON_REPEL = 0.2;
const REPEL_DURATION = 600; // ms
const INITIAL_FADE_IN_DURATION = 1000; // ms
const MOBILE_BREAKPOINT = 768;

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
      opacity: 0, 
      targetOpacity,
      currentOpacity: 0, 
      isNear,
      originalSpeedX: speedX,
      originalSpeedY: speedY,
      originalTargetOpacity: targetOpacity,
      isRepelling: false,
      repelEndTime: 0,
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

    // Check if canvasRef.current exists before adding event listeners
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
        if (initialElapsedTime < INITIAL_FADE_IN_DURATION) {
          particle.currentOpacity = (initialElapsedTime / INITIAL_FADE_IN_DURATION) * particle.targetOpacity;
        } else {
          if (!particle.isRepelling) {
            particle.currentOpacity = particle.targetOpacity;
          }
        }

        let tempX = particle.x;
        let tempY = particle.y;
        
        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dxMouse = particle.x - mouse.current.x;
          const dyMouse = particle.y - mouse.current.y;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distanceMouse < MOUSE_REPEL_RADIUS) {
            if (!particle.isRepelling) {
              particle.isRepelling = true;
              particle.originalTargetOpacity = particle.targetOpacity; 
              particle.targetOpacity = OPACITY_ON_REPEL; 
            }
            particle.repelEndTime = now + REPEL_DURATION; 

            const repelFactor = (MOUSE_REPEL_RADIUS - distanceMouse) / MOUSE_REPEL_RADIUS;
            const forceX = (dxMouse / distanceMouse) * repelFactor * REPEL_STRENGTH;
            const forceY = (dyMouse / distanceMouse) * repelFactor * REPEL_STRENGTH;
            
            tempX += forceX * 5; 
            tempY += forceY * 5;

          }
        }

        if (particle.isRepelling) {
          if (now < particle.repelEndTime) {
            if (particle.currentOpacity > OPACITY_ON_REPEL) {
              particle.currentOpacity -= (particle.currentOpacity - OPACITY_ON_REPEL) * 0.1; 
            } else if (particle.currentOpacity < OPACITY_ON_REPEL) {
               particle.currentOpacity += (OPACITY_ON_REPEL - particle.currentOpacity) * 0.1;
            }
             if (Math.abs(particle.currentOpacity - OPACITY_ON_REPEL) < 0.01) {
                particle.currentOpacity = OPACITY_ON_REPEL;
            }

          } else { 
            particle.isRepelling = false;
            particle.targetOpacity = particle.originalTargetOpacity; 
          }
        }
        
        if (!particle.isRepelling && initialElapsedTime >= INITIAL_FADE_IN_DURATION) {
            if (particle.currentOpacity < particle.targetOpacity) {
                particle.currentOpacity += (particle.targetOpacity - particle.currentOpacity) * 0.05; 
            } else if (particle.currentOpacity > particle.targetOpacity) {
                particle.currentOpacity -= (particle.currentOpacity - particle.targetOpacity) * 0.05;
            }
            if (Math.abs(particle.currentOpacity - particle.targetOpacity) < 0.01) {
                particle.currentOpacity = particle.targetOpacity;
            }
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        else if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        else if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        
        ctx.beginPath();
        ctx.arc(tempX, tempY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR_RGB}, ${particle.currentOpacity})`;
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
  }, [isClient, createParticle, initParticles]);


  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
    />
  );
};

export default FloatingParticles;
    
