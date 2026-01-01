import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SplineHero from "./SplineHero";

export default function HeroWithCurve() {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Curve depth - animated based on scroll
  const curveDepth = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 50, 80, 0]
  );

  // Opacity control
  const curveOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

  return (
    <div ref={heroRef} className="relative">
      <SplineHero />
      
      {/* Scroll-animated curved separator */}
      <motion.div 
        className="absolute -bottom-[1px] left-0 right-0 w-full h-[100px] overflow-visible z-30 pointer-events-none"
        style={{ opacity: curveOpacity }}
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="heroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="50%" stopColor="#0a0a0a" stopOpacity="1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="1" />
            </linearGradient>
            
            <filter id="heroGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Animated curve path */}
          <motion.path
            d={useTransform(
              curveDepth,
              (depth) => `M 0,50 Q 720,${50 - depth} 1440,50 L 1440,100 L 0,100 Z`
            )}
            fill="url(#heroGradient)"
          />
          
          {/* Highlight line */}
          <motion.path
            d={useTransform(
              curveDepth,
              (depth) => `M 0,50 Q 720,${50 - depth} 1440,50`
            )}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            filter="url(#heroGlow)"
          />
        </svg>
      </motion.div>
    </div>
  );
}
