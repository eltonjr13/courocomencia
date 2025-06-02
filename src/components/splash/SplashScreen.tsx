
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SplashScreenProps {
  onSplashFinished: () => void;
}

export default function SplashScreen({ onSplashFinished }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

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
        // No automatic navigation to /projects here anymore
        // The page will simply appear from the top
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [isFadingOut, onSplashFinished, router]);

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
        className="btn" // Apply the new standardized button class
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
