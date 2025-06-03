
"use client";
import ProjectShowcaseSection from "@/components/couro/ProjectShowcaseSection";
import PortfolioFooter from "@/components/couro/PortfolioFooter";
import SplashScreen from "@/components/splash/SplashScreen";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isTextFadingOut, setIsTextFadingOut] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  
  const [splashScreenActive, setSplashScreenActive] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (heroRef.current) {
      const currentHeroHeight = heroRef.current.offsetHeight;
      if (currentHeroHeight > 0 && latest > currentHeroHeight * 0.8) {
        setShowProjects(true);
      } else {
        setShowProjects(false);
      }
    }

    if (projectsSectionRef.current) {
      const projectsSectionRect = projectsSectionRef.current.getBoundingClientRect();
      const viewportMiddle = window.innerHeight / 2;
      
      if (projectsSectionRect.top <= viewportMiddle) {
        setIsTextFadingOut(true);
      } else {
        setIsTextFadingOut(false);
      }
    } else {
      setIsTextFadingOut(false);
    }
  });
  
  const slowScrollToProjects = () => {
    const targetElement = document.getElementById('projects');
    if (!targetElement) return;

    const targetY = targetElement.getBoundingClientRect().top + window.scrollY;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 1500; // 1.5 segundos para uma rolagem mais lenta
    let startTime: number | null = null;

    function step(currentTime: number) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - (startTime as number)) / duration, 1);
      // Easing function (easeOutQuad)
      const easedProgress = progress * (2 - progress);
      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  };

  if (!isClient) {
    return null; 
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent text-foreground w-full relative z-[2]">
      <AnimatePresence>
        {splashScreenActive && (
          <SplashScreen onSplashFinished={() => setSplashScreenActive(false)} />
        )}
      </AnimatePresence>

      <section 
        ref={heroRef} 
        className="h-screen w-full relative p-4 overflow-hidden flex flex-col items-center justify-center"
      >
        <motion.div 
          className="text-center flex flex-col items-center"
          initial={{ opacity: 0 }} 
          animate={{ 
            opacity: !splashScreenActive && !isTextFadingOut ? 1 : 0 
          }} 
          transition={{ duration: 0.5, delay: !splashScreenActive ? 0.3 : 0 }} 
        >
          <motion.h1 
            className="font-headline mb-4 md:mb-6 hero-title-pulse"
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={!splashScreenActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: !splashScreenActive ? 0.6 : 0 }}
          >
            CouroComencia.
          </motion.h1>
          <motion.p 
            className="font-semibold font-body mb-2 md:mb-3 hero-subtitle-pulse"
            style={{ 
              fontSize: 'clamp(1.02rem, 2.55vw, 1.36rem)', 
              color: 'rgba(255, 255, 255, 0.9)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={!splashScreenActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: !splashScreenActive ? 0.8 : 0 }} 
          >
            Apenas tentamos não explodir a internet
          </motion.p>
          <motion.p 
            className="font-semibold font-body hero-subtitle-pulse"
            style={{ 
              fontSize: 'clamp(0.816rem, 2.04vw, 1.088rem)', 
              color: 'rgba(255, 255, 255, 0.9)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={!splashScreenActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: !splashScreenActive ? 1.0 : 0 }} 
          >
            Spoiler: falhamos (mas com estilo)
          </motion.p>
          <motion.button
            className="scroll-down-btn mt-16"
            aria-label="Ver projetos"
            onClick={slowScrollToProjects}
            initial={{ opacity: 0, y: 20 }}
            animate={!splashScreenActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: !splashScreenActive ? 1.2 : 0 }}
          >
            ↓
          </motion.button>
        </motion.div>
      </section>

      <motion.div
        id="projects" 
        ref={projectsSectionRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: !splashScreenActive && showProjects ? 1 : 0, 
          y: !splashScreenActive && showProjects ? 0 : 50 
        }}
        transition={{ duration: 0.8, ease: "easeOut", delay: !splashScreenActive ? 0.1 : 0 }}
        className="w-full"
      >
        <ProjectShowcaseSection />
      </motion.div>
      
      {!splashScreenActive && <PortfolioFooter />}
    </main>
  );
}
