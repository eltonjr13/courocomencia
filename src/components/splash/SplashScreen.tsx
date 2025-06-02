
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
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleDismiss = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
  };

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        document.body.classList.remove('no-scroll');
        onSplashFinished();
        setIsVisible(false); 
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [isFadingOut, onSplashFinished]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleDismiss();
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
      <button
        className="splash-btn flex items-center justify-center bg-white/10 text-white font-sans font-semibold rounded-full px-8 py-3 h-auto transition-all duration-300 ease-in-out hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#0A84FF] transform hover:scale-105 backdrop-blur-sm"
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
    </div>
  );
}

