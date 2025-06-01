
"use client";
import ProjectShowcaseSection from "@/components/couro/ProjectShowcaseSection";
import PortfolioFooter from "@/components/couro/PortfolioFooter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isTextFadingOut, setIsTextFadingOut] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null); // For the full hero section
  const projectsSectionRef = useRef<HTMLDivElement>(null); // For the projects section
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
    // Logic for showing the ProjectShowcaseSection
    if (heroRef.current) { 
      const currentHeroHeight = heroRef.current.offsetHeight;
      if (currentHeroHeight > 0 && latest > currentHeroHeight * 0.8) {
        setShowProjects(true);
      } else {
        setShowProjects(false);
      }
    }

    // New logic for hero text fade-out
    if (projectsSectionRef.current) {
      const projectsSectionRect = projectsSectionRef.current.getBoundingClientRect();
      const viewportMiddle = window.innerHeight / 2;
      
      // Fade out when the top of the projects section is at or above the middle of the viewport
      if (projectsSectionRect.top <= viewportMiddle) {
        setIsTextFadingOut(true);
      } else {
        setIsTextFadingOut(false);
      }
    } else {
      // If projects section isn't rendered or ref not attached, don't fade text
      setIsTextFadingOut(false); 
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
      {/* Hero Section - acts as a spacer and for showProjects trigger */}
      <section 
        ref={heroRef} 
        className="h-screen w-full relative p-4 overflow-hidden"
      >
        {/* Hero Text Container - NOW FIXED */}
        <motion.div 
          className="fixed top-[40%] left-1/2 -translate-x-1/2 z-10 text-center flex flex-col items-center" 
          initial={{ opacity: 1 }} 
          animate={{ opacity: isTextFadingOut ? 0 : 1 }} 
          transition={{ duration: 0.5 }} 
        >
          <motion.h1 
            className="font-headline mb-4 md:mb-6 hero-title-pulse"
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            CouroComencia
          </motion.h1>
          <motion.p 
            className="font-semibold font-body mb-2 md:mb-3 hero-subtitle-pulse"
            style={{ 
              fontSize: 'clamp(1.17rem, 3.2vw, 1.5rem)',
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 + 0.3 }} 
          >
            Explorando Novos Limites
          </motion.p>
          <motion.p 
            className="font-semibold font-body hero-subtitle-pulse"
            style={{ 
              fontSize: 'clamp(0.93rem, 2.5vw, 1.2rem)',
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 + 0.3 + 0.2 }} 
          >
            Inovação em cada detalhe
          </motion.p>
        </motion.div>
      </section>

      {/* Projects Section */}
      <motion.div
        ref={projectsSectionRef} // Assign ref to the projects section wrapper
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
    
