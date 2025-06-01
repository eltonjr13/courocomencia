
"use client";
import { motion } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react"; 
import Image from "next/image";

// Custom Behance Icon SVG Component
const BehanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8.25 10.5V10.5C10.0449 10.5 11.5 9.04492 11.5 7.25V7.25C11.5 5.45508 10.0449 4 8.25 4V4C6.45508 4 5 5.45508 5 7.25V7.25C5 9.04492 6.45508 10.5 8.25 10.5Z" />
    <path d="M5 14.5H11.5" />
    <path d="M14 7H19" />
    <path d="M14 10.75H17.625C18.8633 10.75 19.5 11.3633 19.5 12.4375V12.4375C19.5 13.5117 18.8633 14.125 17.625 14.125H14V7Z" />
    <path d="M2 20.5C2 20.5 4.6875 22 8.25 22C11.8125 22 14.5 20.5 14.5 20.5" />
    <path d="M17.5 18.5H19.5V20.5H17.5V18.5Z" />
  </svg>
);

// Custom WhatsApp Icon (using MessageCircle as base, but could be a direct SVG)
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);


const socialLinks = [
  { name: "Instagram", Icon: Instagram, url: "https://instagram.com/courocomencia" },
  { name: "WhatsApp", Icon: WhatsAppIcon, url: "https://wa.me/yourphonenumber" }, // Replace with actual number
  { name: "LinkedIn", Icon: Linkedin, url: "https://linkedin.com/company/courocomencia" },
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
            src="/imgs/logo-rocket.png" 
            alt="CouroComencia Logo" 
            width={100} 
            height={100} 
            className="object-contain"
            data-ai-hint="rocket logo" 
          />
        </div>
        <motion.p 
          className="text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          CouroComencia: Eu, meu laptop e 37 abas abertas.
          <br />
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
