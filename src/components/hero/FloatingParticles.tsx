
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

  // For mouse attraction
  attractionVx: number;
  attractionVy: number;
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

const INITIAL_FADE_IN_DURATION = 1000;
const MOBILE_BREAKPOINT = 768;

// Mouse Interaction Configuration
const MOUSE_ATTRACTION_RADIUS = 150; // Pixels: how close mouse needs to be to affect particles
const ATTRACTION_FORCE = 0.03;      // Strength of attraction pull towards mouse
const PARTICLE_INERTIA = 0.92;      // Higher = less friction, effect lasts longer (0 to 1)


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
      attractionVx: 0, // Initialize attraction velocity X
      attractionVy: 0, // Initialize attraction velocity Y
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
      }
    });
    resizeObserver.observe(canvas);
    initParticles();


    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.current.x = event.clientX - rect.left;
      mouse.current.y = event.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      if (isMobile) return;
      mouse.current.x = null;
      mouse.current.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

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
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      const initialElapsedTime = now - pageLoadTime.current;

      // Update particles first (position, attraction, opacity)
      particlesArray.current.forEach(particle => {
        // Mouse attraction logic
        if (!isMobile && mouse.current.x !== null && mouse.current.y !== null) {
          const dxMouse = mouse.current.x - particle.x;
          const dyMouse = mouse.current.y - particle.y;
          const distanceMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

          if (distanceMouseSq < MOUSE_ATTRACTION_RADIUS * MOUSE_ATTRACTION_RADIUS) {
            const distanceMouse = Math.sqrt(distanceMouseSq);
            if (distanceMouse > 1) { // Avoid division by zero or too strong force if exactly on particle
              const pullForceX = (dxMouse / distanceMouse) * ATTRACTION_FORCE;
              const pullForceY = (dyMouse / distanceMouse) * ATTRACTION_FORCE;
              particle.attractionVx += pullForceX;
              particle.attractionVy += pullForceY;
            }
          }
        }

        // Apply inertia to attraction velocity
        particle.attractionVx *= PARTICLE_INERTIA;
        particle.attractionVy *= PARTICLE_INERTIA;

        // Update particle position using base speed and attraction speed
        particle.x += particle.speedX + particle.attractionVx;
        particle.y += particle.speedY + particle.attractionVy;

        // Boundary checks (wrap around screen)
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        else if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        else if (particle.y < -particle.size) particle.y = canvas.height + particle.size;

        // Opacity calculation
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
        particle.currentOpacity += (finalOpacity - particle.currentOpacity) * 0.1; // Smooth transition
      });


      // Draw connecting lines
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
            // Use the minimum current opacity of the two connected particles for the line, scaled by distance
            const baseLineDynamicOpacity = Math.min(p1.currentOpacity, p2.currentOpacity) * LINE_BASE_OPACITY;
            const finalLineOpacity = Math.max(0, Math.min(1, baseLineDynamicOpacity * lineOpacityFactor));

            let effectiveLineOpacity = 0;
            if (initialElapsedTime < INITIAL_FADE_IN_DURATION) {
                 effectiveLineOpacity = (initialElapsedTime / INITIAL_FADE_IN_DURATION) * finalLineOpacity;
            } else {
                 effectiveLineOpacity = finalLineOpacity;
            }

            if (effectiveLineOpacity > 0.01) { // Threshold to avoid drawing almost invisible lines
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
        const opacityToDraw = Math.max(0, Math.min(1, particle.currentOpacity));
        if (opacityToDraw > 0.01) { // Threshold to avoid drawing almost invisible particles
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
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
  }, [isClient, createParticle, initParticles, isMobile]); // initParticles was missing


  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[1] pointer-events-none"
    />
  );
};

export default FloatingParticles;

    