"use client";
import DynamicHead from "@/components/dynamic-head";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden">
      <DynamicHead />
      <div className="mt-10 text-center relative z-10">
        <motion.h1 
          className="text-5xl md:text-6xl font-headline mb-6 md:mb-8 text-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Dynamic Persona
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl font-body mb-3 md:mb-4 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          whileHover={{ 
            scale: 1.05, 
            color: "hsl(var(--accent))",
            textShadow: "0 0 8px hsl(var(--accent))" 
          }}
          whileTap={{ scale: 0.98 }}
        >
          Explorando Novos Limites
        </motion.p>
        
        <motion.p
          className="text-lg md:text-xl font-body cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
          whileHover={{ 
            scale: 1.05, 
            color: "hsl(var(--accent))",
            textShadow: "0 0 8px hsl(var(--accent))" 
          }}
          whileTap={{ scale: 0.98 }}
        >
          Inovação em cada detalhe
        </motion.p>
      </div>
    </main>
  );
}
