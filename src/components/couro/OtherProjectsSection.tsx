
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const projects = [
  {
    title: "Diário de Conexão Espiritual",
    description: "Produto digital para mulheres cristãs, com mais de 400 páginas devocionais interativas.",
    image: "https://placehold.co/600x400.png",
    aiHint: "journal app mockup"
  },
  {
    title: "SpeedFlix",
    description: "Landing page e branding para plataforma de IPTV com experiência rápida e fluida.",
    image: "https://placehold.co/600x400.png",
    aiHint: "streaming service interface"
  },
  {
    title: "Projeto Futuro",
    description: "Explorando novas fronteiras da tecnologia e design para criar impacto.",
    image: "https://placehold.co/600x400.png",
    aiHint: "abstract tech design"
  }
];

const OtherProjectsSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div 
      className="py-12"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2 
        className="text-3xl md:text-4xl font-headline mb-10 md:mb-12 text-center text-primary"
        variants={cardVariants} // Use cardVariants for individual animation trigger
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        Outros Projetos Notáveis
      </motion.h2>
      <div className="flex overflow-x-auto space-x-6 pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="snap-center shrink-0 w-[calc(100%-2rem)] sm:w-2/3 md:w-1/2 lg:w-1/3"
          >
            <Card className="h-full flex flex-col bg-card/70 border-border shadow-lg hover:shadow-accent/30 transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover w-full h-48"
                  data-ai-hint={project.aiHint}
                />
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="text-xl font-headline mb-2 text-primary">{project.title}</CardTitle>
                <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
                  Detalhes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--accent)) transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: hsl(var(--accent));
          border-radius: 10px;
          border: 2px solid transparent; // Match track color for seamless look
          background-clip: content-box;
        }
      `}</style>
    </motion.div>
  );
};

export default OtherProjectsSection;
