
"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

// Declare YT types for window object
declare global {
  interface Window {
    YT?: {
      Player: any; // Replace 'any' with more specific types if available
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
    "Monitoramento nutricional e físico",
    "Dashboard intuitivo",
    "Rotina personalizada",
  ];

  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null); // To store YT.Player instance

  useEffect(() => {
    const playerElementId = 'youtube-player-sharkfit';

    const onPlayerStateChange = (event: any) => { // YT.OnStateChangeEvent
      if (playerWrapperRef.current && window.YT) {
        if (event.data === window.YT.PlayerState.PLAYING) {
          playerWrapperRef.current.classList.remove('glow-default');
          playerWrapperRef.current.classList.add('glow-bright');
        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
          playerWrapperRef.current.classList.remove('glow-bright');
          playerWrapperRef.current.classList.add('glow-default');
        }
      }
    };

    const onPlayerReady = (event: any) => { // YT.OnPlayerReadyEvent
      // Player is ready. You could, for example, play the video:
      // event.target.playVideo();
    };
    
    const createPlayer = () => {
      if (!document.getElementById(playerElementId) || playerRef.current) return; 
      
      playerRef.current = new window.YT.Player(playerElementId, {
        videoId: 'dtHyBOisCr8',
        playerVars: {
          rel: 0,             // No related videos
          modestbranding: 1,  // Minimal YouTube logo
          controls: 1,        // Show standard controls (includes play/pause, volume, progress)
          iv_load_policy: 3,  // Disable annotations
          fs: 1,              // Allow fullscreen
          showinfo: 0,        // Hide video title and uploader before video starts
          autohide: 1,        // Deprecated, but often used with showinfo=0
          playsinline: 1,     // Play inline on iOS
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
      
      // It's crucial that onYouTubeIframeAPIReady is a global function.
      // If this component re-renders, we don't want to redefine it if it's already set
      // and potentially queuing other players.
      // A simple approach:
      const existingApiReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (existingApiReady) {
          existingApiReady(); // Call previous if it exists
        }
        createPlayer();
      };
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      // More complex cleanup of onYouTubeIframeAPIReady might be needed
      // in a multi-player environment, but for a single main player this is often sufficient.
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
            className="relative rounded-lg overflow-hidden glow-default"
            style={{ paddingBottom: "56.25%", height: 0 }} // 16:9 Aspect Ratio container
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
            Aplicativo fitness inteligente para evolução diária.
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
