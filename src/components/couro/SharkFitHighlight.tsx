
"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const SharkFitHighlight = () => {
  const bulletPoints = [
    "Monitoramento nutricional e físico",
    "Dashboard intuitivo",
    "Rotina personalizada",
  ];

  // Variants for the text content block
  const textContentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="mb-16 md:mb-24">
      <div className="flex flex-col">
        {/* Video section - Fades in when its part of the component is visible */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }} // Video container fades in when 20% of it is visible
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mx-auto" // Limit width and center
        >
          <div 
            className="relative rounded-lg overflow-hidden shadow-[0_0_15px_hsl(var(--accent)/0.5),_0_0_35px_hsl(var(--accent)/0.3),_0_0_60px_hsl(var(--accent)/0.15)]"
            style={{ paddingBottom: "56.25%", height: 0 }} // 16:9 Aspect Ratio
          >
            <iframe
              src="https://www.youtube.com/embed/dtHyBOisCr8?rel=0&modestbranding=1&controls=1&iv_load_policy=3&fs=1&showinfo=0&autohide=1"
              title="SharkFit Video Preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </motion.div>

        {/* Project Information Section - Animates in ON SCROLL AFTER video is visible */}
        <motion.div
          className="p-6 md:p-10 mt-8 md:mt-12 text-center" // Added margin top and centered text for info block
          variants={textContentVariants}
          initial="hidden" // Text block starts hidden
          whileInView="visible" // Animates when this block itself is scrolled into view
          viewport={{ once: true, amount: 0.05 }} // Trigger when 5% of THIS text block is visible
        >
          <h2 className="text-3xl md:text-4xl font-headline mb-4 text-primary">
            SharkFit
          </h2>
          <p className="text-muted-foreground mb-6 text-lg max-w-xl mx-auto"> {/* Centered and max-width for description */}
            Aplicativo fitness inteligente para evolução diária.
          </p>
          <ul className="space-y-3 mb-8 inline-block text-left"> {/* Inline-block and text-left for bullets */}
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6"> {/* Added margin top for button */}
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105">
              Ver Projeto
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SharkFitHighlight;

