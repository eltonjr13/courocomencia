
"use client";
import ProjectShowcaseSection from "@/components/couro/ProjectShowcaseSection";
import PortfolioFooter from "@/components/couro/PortfolioFooter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isTextFadingOut, setIsTextFadingOut] = useState(false); 
  const [showProjects, setShowProjects] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroHeight, setHeroHeight] = useState(0);

  useEffect(() => {
    if (heroRef.current) {
      setHeroHeight(heroRef.current.offsetHeight);
    }
    const updateHeroHeight = () => {
      if (heroRef.current) {
        setHeroHeight(heroRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', updateHeroHeight);
    return () => window.removeEventListener('resize', updateHeroHeight);
  }, []);


  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (heroHeight > 0) {
      const scrollThresholdStartFade = heroHeight * 0.8;
      
      if (latest > scrollThresholdStartFade) {
        setIsTextFadingOut(true);
      } else {
        setIsTextFadingOut(false);
      }
      
      if (latest > heroHeight * 0.8) {
        setShowProjects(true);
      } else {
        setShowProjects(false);
      }
    }
  });
  
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent text-foreground w-full relative z-[2]">
      <section 
        ref={heroRef} 
        className="h-screen w-full flex flex-col items-center justify-center relative p-4 overflow-hidden"
      >
        {/* FloatingParticles is now global, rendered from layout.tsx */}
        <motion.div 
          className="relative z-10 text-center flex flex-col items-center" 
          initial={{ opacity: 1 }} 
          animate={{ opacity: isTextFadingOut ? 0 : 1 }} 
          transition={{ duration: 0.5 }} 
        >
          <motion.h1 
            className="font-headline mb-4 md:mb-6 text-accent text-shadow-hero-title"
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            CouroComencia
          </motion.h1>
          <motion.p 
            className="font-semibold font-body mb-2 md:mb-3 text-accent text-shadow-hero-subtitle"
            style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.75rem)', 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 + 0.3 }} 
          >
            Explorando Novos Limites
          </motion.p>
          <motion.p 
            className="font-semibold font-body text-accent text-shadow-hero-subtitle"
            style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.75rem)', 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 + 0.3 + 0.2 }} 
          >
            Inovação em cada detalhe
          </motion.p>
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showProjects ? 1 : 0, y: showProjects ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full"
      >
        <ProjectShowcaseSection />
      </motion.div>
      
      <PortfolioFooter />
    </main>
  );
}
    
