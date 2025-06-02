
"use client";
import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button"; // No longer using ShadCN Button here
import { CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

// Declare YT types for window object
declare global {
  interface Window {
    YT?: {
      Player: any; 
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const SharkFitHighlight = () => {
  const bulletPoints = [
    "Dashboard intuitivo",
    "Rotina personalizada",
    "Monitoramento nutricional e físico"
  
  ];

  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null); // To store YT.Player instance

  useEffect(() => {
    const playerElementId = 'youtube-player-sharkfit';

    const onPlayerStateChange = (event: any) => { 
      // No glow logic needed anymore
    };

    const onPlayerReady = (event: any) => { 
      // Player is ready
    };
    
    const createPlayer = () => {
      if (!document.getElementById(playerElementId) || playerRef.current || !playerWrapperRef.current) return; 
      
      playerRef.current = new window.YT.Player(playerElementId, {
        videoId: 'dtHyBOisCr8',
        playerVars: {
          rel: 0,            
          modestbranding: 1,  
          controls: 1,        
          iv_load_policy: 3,  
          fs: 1,             
          showinfo: 0,       
          autohide: 1,        
          playsinline: 1,     
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
      
      const existingApiReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (existingApiReady) {
          existingApiReady(); 
        }
        createPlayer();
      };
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);


  const textContentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="mb-16 md:mb-24">
      <div className="flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mx-auto" 
        >
          <div
            ref={playerWrapperRef}
            className="relative overflow-hidden" 
            style={{ paddingBottom: "56.25%", height: 0 }} 
          >
            <div id="youtube-player-sharkfit" className="absolute top-0 left-0 w-full h-full"></div>
          </div>
        </motion.div>

        <motion.div
          className="p-6 md:p-10 mt-8 md:mt-12 text-center"
          variants={textContentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          <h2 className="text-3xl md:text-4xl font-headline mb-4 text-primary">
            SharkFit
          </h2>
          <p className="text-muted-foreground mb-6 text-lg max-w-xl mx-auto">
          Aplicativo de alta performance inteligente para evolução diária.
          </p>
          <ul className="space-y-3 mb-8 inline-block text-left">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <button className="btn">
              Ver Projeto
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SharkFitHighlight;
