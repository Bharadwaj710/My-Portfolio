import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import skillsRaw from "../data/skills";

// Cinematic Skills Section - B&W Edition
export default function ImmersiveSkillsSection() {
  const [hovered, setHovered] = useState(null);

  // Use official brand colors from data
  const skills = useMemo(() => skillsRaw, []);

  const trackRef = useRef(null);
  const [duration, setDuration] = useState(20);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Dynamic duration based on screen width/content
    const el = trackRef.current;
    if (!el) return;
    const resize = () => {
      const w = el.scrollWidth / 2; 
      const dur = Math.max(20, Math.round(w / 80));
      setDuration(dur);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [skills]);

  return (
    <section
      id="skills"
      className="relative w-full bg-black overflow-hidden py-32"
      style={{ contain: 'paint' }}
    >
      {/* Background Ambience - Subtle White/Gray */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter font-urbanist">
            Technical <span className="text-gray-500">Arsenal</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light font-urbanist">
            Tools of the trade.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mask-linear-fade"
        >
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee linear infinite;
              will-change: transform;
            }
            .mask-linear-fade {
              mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            }
          `}</style>
          
          <div
            className="overflow-hidden flex"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-8 items-stretch py-4 animate-marquee"
              style={{
                width: "max-content",
                animationDuration: `${duration}s`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {[...skills, ...skills, ...skills].map((skill, idx) => (
                <div
                  key={`${skill.name}-${idx}`}
                  className="relative group"
                >
                  <div 
                    className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center gap-4 transition-all duration-500 group-hover:bg-zinc-800/80 group-hover:border-white/30 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
                  >
                     {/* Subtle Background Gradient - Official Color */}
                     <div 
                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at center, ${skill.accentColor} 0%, transparent 70%)`
                        }}
                     />

                     {/* Icon Container with Official Colors */}
                     <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        {/* Brand Color Glow blob behind icon */}
                        <div 
                          className="absolute inset-0 opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-500 rounded-full" 
                          style={{ backgroundColor: skill.accentColor }}
                        />
                        
                        {/* Icon: Official Colors, high visibility */}
                        <div className="relative z-10 w-full h-full p-2">
                          <img 
                            src={skill.icon} 
                            alt={skill.name}
                            className="w-full h-full object-contain transition-all duration-500"
                            style={{ 
                              // Simple Icons are black by default. Invert to make white, then apply color via drop-shadow and brightness.
                              filter: `invert(1) drop-shadow(0 0 4px ${skill.accentColor}) brightness(1.1)`,
                              opacity: 0.9
                            }}
                          />
                        </div>
                     </div>

                     <span className="text-sm md:text-base font-bold text-gray-200 group-hover:text-white transition-colors duration-300 font-urbanist uppercase tracking-widest relative z-10">
                       {skill.name}
                     </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
