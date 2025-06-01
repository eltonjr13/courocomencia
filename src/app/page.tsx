
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
    setIsClient(true); // Ensure client-side logic runs after mount
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
  
  useEffect(() => {
    // This effect for overflowX is no longer needed as no-scroll class handles it
    return () => {
      // Ensure body styles are reset if component unmounts unexpectedly
      // document.body.style.overflowX = ''; // Already handled by no-scroll removal
    };
  }, []);

  if (!isClient) {
    // Render nothing or a basic loader until client is determined
    // to prevent hydration mismatch with splash screen logic
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
        className="h-screen w-full relative p-4 overflow-hidden"
      >
        <motion.div 
          className="fixed top-[40%] left-1/2 -translate-x-1/2 z-10 text-center flex flex-col items-center" 
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
            CouroComencia
          </motion.h1>
          <motion.p 
            className="font-semibold font-body mb-2 md:mb-3 hero-subtitle-pulse"
            style={{ 
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', 
              color: '#FFFFFF',
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
              fontSize: 'clamp(0.96rem, 2.4vw, 1.28rem)', 
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={!splashScreenActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: !splashScreenActive ? 1.0 : 0 }} 
          >
            Spoiler: falhamos (mas com estilo)
          </motion.p>
        </motion.div>
      </section>

      <motion.div
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
