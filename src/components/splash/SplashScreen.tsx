
"use client";

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Not needed for this request

interface SplashScreenProps {
  onSplashFinished: () => void;
}

export default function SplashScreen({ onSplashFinished }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  // const router = useRouter(); // Not needed for this request

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
        // router.push('/projects'); // Navigation removed as per current request focusing on style
        setIsVisible(false); 
      }, 600); 
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
      // onClick={handleDismiss} // Removed: only button dismisses
    >
      <button
        className="splash-btn" // Removed font-bold
        aria-label="Entrar no portfólio"
        onClick={(e) => {
          e.stopPropagation(); 
          handleDismiss();
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        Onde o couro tá comendo?
      </button>
    </div>
  );
}
