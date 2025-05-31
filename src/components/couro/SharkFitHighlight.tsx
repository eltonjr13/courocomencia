
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const SharkFitHighlight = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const bulletPoints = [
    "Design de interface intuitivo e moderno.",
    "Experiência de usuário otimizada para engajamento.",
    "Identidade visual que transmite força e dinamismo.",
  ];

  return (
    <motion.div
      className="mb-16 md:mb-24"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className="bg-card/80 border-border shadow-xl overflow-hidden">
        <div className="md:flex">
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <Image
              src="https://placehold.co/800x600.png"
              alt="SharkFit Project"
              width={800}
              height={600}
              className="object-cover w-full h-64 md:h-full"
              data-ai-hint="fitness app interface"
            />
          </motion.div>
          <motion.div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center" variants={itemVariants}>
            <CardContent className="p-0">
              <motion.h2 
                className="text-3xl md:text-4xl font-headline mb-4 text-primary"
                variants={itemVariants}
              >
                Identidade SharkFit
              </motion.h2>
              <motion.p className="text-muted-foreground mb-6 text-lg" variants={itemVariants}>
                Criação de marca, app e identidade visual com foco em performance e realismo.
              </motion.p>
              <ul className="space-y-3 mb-8">
                {bulletPoints.map((point, index) => (
                  <motion.li key={index} className="flex items-start" variants={itemVariants}>
                    <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.div variants={itemVariants}>
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105">
                  Ver Projeto
                </Button>
              </motion.div>
            </CardContent>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SharkFitHighlight;
