
"use client";

import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onSplashFinished: () => void;
}

export default function SplashScreen({ onSplashFinished }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    // Cleanup function to ensure 'no-scroll' is removed if the component unmounts unexpectedly
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleDismiss = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
  };

  const handleScrollDownClick = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
    handleDismiss(); // This will trigger the fade-out and cleanup
  };

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        document.body.classList.remove('no-scroll');
        onSplashFinished();
        setIsVisible(false); 
      }, 400); // Matches the fade-out duration
      return () => clearTimeout(timer);
    }
  }, [isFadingOut, onSplashFinished]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Differentiate based on which button is focused if needed, or assume primary action
      handleDismiss();
    }
  };
   const handleScrollButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleScrollDownClick();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="splash-overlay"
      className={`fixed top-0 left-0 w-full h-screen bg-transparent flex items-center justify-center z-[9999] ${isFadingOut ? 'fade-out-splash' : ''}`}
    >
      <div className="flex flex-col items-center">
        <button
          className="btn backdrop-blur-sm" 
          aria-label="Entrar no portfólio – Onde o couro tá comendo?"
          onClick={(e) => {
            e.stopPropagation(); 
            handleDismiss();
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <span className="text-base">Onde o couro tá comendo?</span>
        </button>
        <button 
          className="scroll-down-btn" 
          aria-label="Ver projetos"
          onClick={(e) => {
            e.stopPropagation();
            handleScrollDownClick();
          }}
          onKeyDown={handleScrollButtonKeyDown}
          tabIndex={0}
        >
          ↓
        </button>
      </div>
    </div>
  );
}
