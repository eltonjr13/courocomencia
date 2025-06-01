
"use client";
import ProjectShowcaseSection from "@/components/couro/ProjectShowcaseSection";
import PortfolioFooter from "@/components/couro/PortfolioFooter";
import FloatingParticles from "@/components/hero/FloatingParticles";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isTextFadingOut, setIsTextFadingOut] = useState(false); // For text fade 1 to 0
  const [particleScrollFade, setParticleScrollFade] = useState(1.0); // For particle fade 1 to 0.5
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
      const scrollThresholdEndFade = heroHeight; // End of hero section

      // Text fade out (1.0 to 0.0) from 80% to 100%
      if (latest > scrollThresholdStartFade) {
        setIsTextFadingOut(true);
      } else {
        setIsTextFadingOut(false);
      }

      // Particle fade (1.0 to 0.5) from 80% to 100%
      if (latest >= scrollThresholdStartFade && latest <= scrollThresholdEndFade) {
        const progress = (latest - scrollThresholdStartFade) / (scrollThresholdEndFade - scrollThresholdStartFade);
        setParticleScrollFade(1.0 - progress * 0.5); // Fades from 1.0 down to 0.5
      } else if (latest < scrollThresholdStartFade) {
        setParticleScrollFade(1.0);
      } else { // latest > scrollThresholdEndFade
        setParticleScrollFade(0.5);
      }
      
      // Show projects when 80% of hero is scrolled (can adjust if needed)
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
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground w-full">
      <section 
        ref={heroRef} 
        className="h-screen w-full flex flex-col items-center justify-center relative p-4 overflow-hidden"
      >
        <FloatingParticles scrollFade={particleScrollFade} />
        <motion.div 
          className="relative z-10 text-center flex flex-col items-center" 
          initial={{ opacity: 1 }} 
          animate={{ opacity: isTextFadingOut ? 0 : 1 }} // Text fades to 0
          transition={{ duration: 0.5 }} // Duration for text fade out
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
    
