
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const SharkFitHighlight = () => {
  const bulletPoints = [
    "Monitoramento nutricional e físico",
    "Dashboard intuitivo",
    "Rotina personalizada",
  ];

  // Variants for the text content block
  const textContentVariants = {
    hidden: { opacity: 0, y: 30 }, // Starts invisible and slightly down
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="mb-16 md:mb-24">
      <Card className="bg-card/80 border-border shadow-xl overflow-hidden">
        <div className="flex flex-col">
          {/* Video/Image section - Fades in when its part of the component is visible */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }} // Image fades in when 20% of it is visible
            transition={{ duration: 0.5 }}
          >
            <Image
              src="https://placehold.co/800x450.png"
              alt="SharkFit Video Preview"
              width={800}
              height={450}
              className="object-cover w-full h-auto aspect-video rounded-t-lg shadow-lg shadow-accent/30 border border-accent/50"
              data-ai-hint="fitness app video"
              priority
            />
          </motion.div>

          {/* Project Information Section - Animates in ON SCROLL AFTER video is visible */}
          <motion.div
            className="p-6 md:p-10"
            variants={textContentVariants}
            initial="hidden" // Text block starts hidden
            whileInView="visible" // Animates when this block itself is scrolled into view
            viewport={{ once: true, amount: 0.05 }} // Trigger when 5% of THIS text block is visible
          >
            <CardContent className="p-0">
              <h2 className="text-3xl md:text-4xl font-headline mb-4 text-primary">
                SharkFit
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Aplicativo fitness inteligente para evolução diária.
              </p>
              <ul className="space-y-3 mb-8">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div>
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105">
                  Ver Projeto
                </Button>
              </div>
            </CardContent>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};

export default SharkFitHighlight;
