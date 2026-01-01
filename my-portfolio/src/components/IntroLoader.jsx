import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * IntroLoader - Redesigned Welcome Screen
 * - Features a cinematic progress bar
 * - Displays "WELCOME" with technical progress tracking
 * - Smoothly exits after completion
 */
export default function IntroLoader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fill the progress bar over 2s
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 15); // Roughly 1.5s to complete

    const timeout = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
    >
      <div className="relative flex flex-col items-center w-full max-w-xs md:max-w-md">
        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-sm uppercase tracking-[0.5em] text-gray-400 font-urbanist font-bold text-center">
            Welcome
          </h1>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest text-center mt-2 font-urbanist uppercase">
            Initializing System
          </h2>
        </motion.div>

        {/* Loading Bar Container */}
        <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Progress Display */}
        <motion.div 
          className="flex justify-between w-full text-[10px] uppercase tracking-widest font-bold font-urbanist text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span>Loading Experience</span>
          <span className="text-white">{progress}%</span>
        </motion.div>
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>
    </motion.div>
  );
}
