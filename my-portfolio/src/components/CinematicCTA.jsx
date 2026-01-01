import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * CinematicCTA Component
 * 
 * Features:
 * 1. "Pinned" scroll behavior (similar to ProjectCards).
 * 2. Liquid text fill (Solid White -> Black with White Borders).
 * 3. Compact typography to fit both text and button in sticky viewport.
 * 4. Reversible animation on scroll up.
 */
export default function CinematicCTA() {
  const sectionRef = useRef(null);
  
  // 1. Track scroll progress exclusively within this section
  // Increased height (300vh) and offset ["start start", "end end"] 
  // allows the sticky content to feel "locked" while progress drives the animation.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"], 
  });

  // 2. Smooth the scroll progress for a more "liquid" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 25,
    restDelta: 0.001
  });

  // 3. Transformation for the fill progress (Liquid Reveal)
  // Fill happens in the middle part of the scroll (0.1 to 0.7)
  const fillCurve = useTransform(smoothProgress, [0.1, 0.7], [100, 0]);
  
  // 4. Button Visibility: Logic to show button only AFTER the fill is nearly done
  // Appear between 0.7 and 0.85 progress
  const buttonOpacity = useTransform(smoothProgress, [0.72, 0.85], [0, 1]);
  const buttonY = useTransform(smoothProgress, [0.72, 0.85], [40, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-black"
    >
      {/* Sticky Content Wrapper - Pins the section to the viewport */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 overflow-hidden" style={{ contain: 'paint' }}>
        
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none -z-10">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_75%)]" />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] contrast-150" />
        </div>

        {/* liquid Text Fill Container */}
        <div className="relative mb-12 text-center w-full">
          {/* Layer 1: Base State - Solid White Text (Slightly reduced size for composition) */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-urbanist uppercase tracking-tighter text-white leading-[0.9] select-none">
            Ready to <br /> turn Your ideas into <br /> reality?
          </h2>

          {/* Layer 2: Fill State - Black Color with Pure White Borders */}
          {/* This layer reveals horizontally (Left-to-Right) as if "filling" the letters */}
          <motion.h2 
            style={{ 
              clipPath: useTransform(fillCurve, v => `inset(0 ${v}% 0 0)`),
              WebkitTextStroke: "2px white", 
              filter: "drop-shadow(0 0 8px rgba(255,255,255,0.1))",
              willChange: 'clip-path'
            }}
            className="absolute top-0 left-0 w-full text-5xl md:text-7xl lg:text-8xl font-black font-urbanist uppercase tracking-tighter text-black leading-[0.9] pointer-events-none select-none"
          >
            Ready to <br /> turn Your ideas into <br /> reality?
          </motion.h2>
        </div>

        {/* Action Area - Delayed reveal */}
        <div className="flex flex-col items-center justify-center">
            <motion.div
              style={{
                opacity: buttonOpacity,
                y: buttonY,
                pointerEvents: useTransform(smoothProgress, v => v > 0.8 ? "auto" : "none"),
                willChange: 'transform, opacity'
              }}
              className="flex flex-col items-center gap-6"
            >
                <p className="text-gray-400 text-lg md:text-xl font-urbanist max-w-xl text-center leading-relaxed italic opacity-80">
                  The journey starts with a single click.
                </p>

                {/* Main CTA Button */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-14 py-4 bg-white text-black font-black font-urbanist rounded-full overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-500"
                >
                   <span className="relative z-10 text-xl uppercase tracking-widest">Contact Now</span>
                   <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </motion.a>

                {/* Social Links Row - Black Fill / White Borders */}
                <div className="flex items-center gap-6 mt-4">
                  {(() => {
                    const email = "bharadwajflasmup@gmail.com";
                    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
                    
                    let emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`; // Desktop Default
                    
                    if (isMobile) {
                      if (isAndroid) {
                        // Android: Intent to open Gmail specifically, fallback to mailto
                        emailUrl = `intent:mailto:${email}#Intent;scheme=mailto;package=com.google.android.gm;end`;
                      } else {
                        // iOS/Standard Mobile: mailto is the best default for apps
                        emailUrl = `mailto:${email}`;
                      }
                    }

                    return [
                      { 
                        name: "GitHub", 
                        href: "https://github.com/Bharadwaj710", 
                        icon: (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black" stroke="white" strokeWidth="1.5">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        )
                      },
                      { 
                        name: "LinkedIn", 
                        href: "https://www.linkedin.com/in/bharadwaj-donthikurthi-bb8696288", 
                        icon: (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black" stroke="white" strokeWidth="1.5">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        )
                      },
                      { 
                        name: "Email", 
                        href: emailUrl, 
                        icon: (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black" stroke="white" strokeWidth="1.5">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                        )
                      }
                    ].map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target={social.name === "Email" ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/30 transition-all shadow-xl group"
                      >
                        {social.icon}
                      </motion.a>
                    ));
                  })()}
                </div>
            </motion.div>
        </div>

      </div>
    </section>
  );
}
