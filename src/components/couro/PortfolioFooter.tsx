
"use client";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Github } from "lucide-react"; 
import Image from "next/image";

// Custom WhatsApp Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

const socialLinks = [
  { name: "Instagram", Icon: Instagram, url: "https://instagram.com/courocomencia" },
  { name: "WhatsApp", Icon: WhatsAppIcon, url: "https://wa.me/yourphonenumber" }, // Replace with actual number
  { name: "LinkedIn", Icon: Linkedin, url: "https://linkedin.com/company/courocomencia" },
  { name: "GitHub", Icon: Github, url: "https://github.com/eltonjr13" },
];

const PortfolioFooter = () => {
  return (
    <motion.footer 
      className="w-full py-12 md:py-16 bg-background border-t border-border/50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6 md:mb-8">
          <Image 
            src="https://i.imgur.com/AJKPTd0.png" 
            alt="CouroComencia Logo" 
            width={100} 
            height={100} 
            className="object-contain"
            data-ai-hint="chatbot interface" 
          />
        </div>
        <motion.p 
          className="text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Se funcionar, fui eu. Se quebrar… atualização em progresso!
        </motion.p>
        
        <motion.div 
          className="flex justify-center space-x-6 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              <link.Icon className="h-6 w-6" />
            </a>
          ))}
        </motion.div>

        <motion.p 
          className="text-sm text-muted-foreground/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          © {new Date().getFullYear()} CouroComencia. Todos os direitos reservados.
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default PortfolioFooter;
