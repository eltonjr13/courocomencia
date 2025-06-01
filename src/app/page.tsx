
"use client";
import DynamicHead from "@/components/dynamic-head";
import ProjectShowcaseSection from "@/components/couro/ProjectShowcaseSection";
import PortfolioFooter from "@/components/couro/PortfolioFooter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isDissolving, setIsDissolving] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
    if (latest > heroHeight * 0.6) {
      setIsDissolving(true);
    } else {
      setIsDissolving(false);
    }
    if (latest > heroHeight * 0.8) {
      setShowProjects(true);
    } else {
      setShowProjects(false);
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
      <section ref={heroRef} className="h-screen w-full flex flex-col items-center justify-center relative p-4">
        <DynamicHead isDissolving={isDissolving} />
        {/* Hero text is now fixed relative to the viewport until it fades */}
      </section>

      {/* This div contains the hero text and is positioned fixed */}
      <motion.div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 text-center z-10 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: isDissolving ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-7xl font-headline mb-4 md:mb-6 text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          CouroComencia
        </h1>
        <p className="text-2xl md:text-3xl font-semibold font-body mb-3 md:mb-4 text-accent text-shadow-subtle-hero">
          Explorando Novos Limites
        </p>
        <p className="text-xl md:text-2xl font-semibold font-body text-accent text-shadow-subtle-hero">
          Inovação em cada detalhe
        </p>
      </motion.div>

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
