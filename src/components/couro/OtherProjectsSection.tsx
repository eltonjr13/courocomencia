
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const projects = [
  {
    title: "AI-Assist ChatBot",
    description: "Chatbot inteligente baseado em IA para atendimento, respondendo dúvidas técnicas e gerando conteúdos automáticos como e-mails e descrições de produtos.",
    image: "/imgs/AI-ASSIST-CHATBOT.jpg",
    alt: "AI-Assist ChatBot Banner",
    aiHint: "chatbot interface"
  },
  {
    title: "CNPJ Insights",
    description: "Ferramenta que busca dados de empresas pelo CNPJ, exibindo informações como nome, sócios, contatos e ramo de atuação.",
    image: "/imgs/CNPJ-INSIGHTS.JPG.jpg",
    alt: "CNPJ Insights Banner",
    aiHint: "data analytics"
  },
  {
    title: "Maps for All",
    description: "Aplicativo que, ao informar um nicho e uma cidade, retorna empresas do segmento com dados de contato, sócios e localização.",
    image: "/imgs/MapsForAll.jpg.jpg",
    alt: "Maps for All Banner",
    aiHint: "map application"
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
                <div className="project-banner-container rounded-t-lg">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    className="object-cover object-center project-banner"
                    sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 767px) 66vw, (max-width: 1023px) 50vw, 33vw"
                    data-ai-hint={project.aiHint}
                  />
                </div>
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
          border: 2px solid transparent; 
          background-clip: content-box;
        }
      `}</style>
    </motion.div>
  );
};

export default OtherProjectsSection;
