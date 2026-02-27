import React from "react";
import { motion, useInView } from "framer-motion";
import Spline from "@splinetool/react-spline";
import TypewriterText from "./TypewriterText";
import AnimatedNavLink from "./AnimatedNavLink";
import Logo from "./Logo";
import usePerformanceMode from "../hooks/usePerformanceMode";

export default function SplineHero() {
  const [isDesktop, setIsDesktop] = React.useState(false);
  const { shouldReduceMotion } = usePerformanceMode();
  const sectionRef = React.useRef(null);
  const isHeroInView = useInView(sectionRef, { margin: "200px 0px 200px 0px" });

  React.useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* Cinematic Reveal - Scene Fades In, Scales Down, and Clears Blur */}
      {isDesktop && isHeroInView && !shouldReduceMotion ? (
        <motion.div
           initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
           animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
           transition={{ duration: 2.5, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
           className="absolute inset-0 w-full h-full"
        >
          <Spline
            scene="https://prod.spline.design/uIR4KYYy0DxHXp0P/scene.splinecode"
            className="w-full h-full pointer-events-none"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-[#050505]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_80%)]" />
        </div>
      )}

      {/* Dark overlay with its own fade */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.5 }}
        className="absolute inset-0 bg-black/40 pointer-events-none" 
      />

      {/* Top Bar: Logo (Left) and Nav (Right) */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2.8, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <Logo className="w-12 h-12" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 3, ease: "easeOut" }}
          className="flex gap-8 pointer-events-auto"
        >
          <AnimatedNavLink href="#" label="Home" />
          <AnimatedNavLink href="#about" label="About Me" />
          <AnimatedNavLink href="#projects" label="View Projects" />
          <AnimatedNavLink href="#contact" label="Contact" />
        </motion.div>
      </div>

      {/* Hero Content - Dramatic Slide Up */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        {/* Headline */}
        <div className="mb-10 pointer-events-none">
          <h1 className="font-urbanist text-5xl md:text-7xl font-extrabold text-white leading-tight">
            <TypewriterText
              lines={[
                "Hi! I am Bharadwaj",
                "I create digital experiences."
              ]}
              typingDelay={100}
              lineDelay={600}
              restartDelay={5000}
            />
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.5 }}
            className="mt-6 font-urbanist text-gray-200 max-w-2xl text-lg md:text-xl leading-relaxed mx-auto"
          >
            By building scalable web experiences that feel fast, fluid, and human.
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1 }}
      >
        <span className="text-sm tracking-wide uppercase">
          Scroll Down
        </span>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-6"
        >
          {/* Down arrow */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
