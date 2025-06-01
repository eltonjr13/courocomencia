
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
    // Cleanup function to remove no-scroll if component unmounts for any reason
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []); // Runs once on mount and cleanup on unmount

  const handleDismiss = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
  };

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        document.body.classList.remove('no-scroll'); // Remove scroll lock before finishing
        onSplashFinished();
        setIsVisible(false); // Allow parent to unmount, or hide if not unmounted
      }, 600); // Match CSS animation duration
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
      onClick={handleDismiss} // Allow clicking anywhere on overlay to dismiss
    >
      <button
        className="splash-btn font-bold"
        aria-label="Entrar no portfólio"
        onClick={(e) => {
          e.stopPropagation(); // Prevent overlay click if button is clicked directly
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
