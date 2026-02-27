import React, { useRef, useId } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CurvedSection({ children, nextBgColor = "#000000" }) {
  const containerRef = useRef(null);
  const uniqueId = useId();
  const gradId = `grad-${uniqueId.replace(/:/g, "")}`;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smaller, subtler curve (80px max instead of 180px)
  const curveDepth = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, 60, 80, 60, 0]
  );

  // Opacity control - curve only visible during active scroll transition
  const curveOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );

  return (
    <section ref={containerRef} className="relative w-full bg-black" style={{ contain: 'paint' }}>
      {/* Content - no transforms, fully visible */}
      {children}

      {/* Curved bottom edge */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-[100px] overflow-visible pointer-events-none" 
        style={{ 
          zIndex: 50,
          opacity: curveOpacity,
          willChange: 'opacity'
        }}
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="50%" stopColor="#0a0a0a" stopOpacity="1" />
              <stop offset="100%" stopColor={nextBgColor} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Main curve path */}
          <motion.path
            d={useTransform(
              curveDepth,
              (depth) => `M 0,50 Q 720,${50 - depth} 1440,50 L 1440,100 L 0,100 Z`
            )}
            fill={`url(#${gradId})`}
          />
          
          {/* Subtle highlight */}
          <motion.path
            d={useTransform(
              curveDepth,
              (depth) => `M 0,50 Q 720,${50 - depth} 1440,50`
            )}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
    </section>
  );
}
