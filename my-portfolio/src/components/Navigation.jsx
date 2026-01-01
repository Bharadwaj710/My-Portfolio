import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Spline from "@splinetool/react-spline";
import Logo from "./Logo";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Show button only after scrolling past Hero (0.7vh to be safe)
  useEffect(() => {
    const handleScroll = () => {
      // Logic: Show if scrolled past 70% of viewport
      if (window.scrollY > window.innerHeight * 0.7) {
        setShowButton(true);
      } else {
        setShowButton(false);
        setIsOpen(false); 
      }
    };
    
    // Initial check in case of reload
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { title: "Home", href: "#" },
    { title: "About", href: "#about" },
    { title: "Works", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ];

  // Use Portal to render outside of #root/App div to escape any transforms/stacking contexts
  // Rendering directly into document.body
  return ReactDOM.createPortal(
    <>
      {/* Floating Hamburger Button - Top Right */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            key="nav-hamburger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed top-8 right-8 z-[9999] w-14 h-14 bg-black/80 backdrop-blur-md border border-white/20 rounded-full flex flex-col items-center justify-center gap-1.5 shadow-2xl group hover:border-white/50 transition-colors"
          >
            <motion.span 
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white group-hover:w-8 transition-all duration-300" 
            />
            <motion.span 
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-white group-hover:w-8 transition-all duration-300" 
            />
            <motion.span 
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white group-hover:w-8 transition-all duration-300" 
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="nav-overlay"
            // Open from Top-Right corner (circle expand)
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }} 
            className="fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center p-4 md:p-20 text-white"
          >
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex flex-col md:flex-row w-full max-w-6xl items-center gap-10 md:gap-20">
               
               {/* Left: Menu Links */}
               <div className="w-full md:w-1/2 flex flex-col gap-4">
                 <h2 className="text-sm text-gray-500 font-urbanist uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Navigation</h2>
                 {menuItems.map((item, idx) => (
                   <motion.div
                     key={idx}
                     initial={{ opacity: 0, x: -50 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                     className="group flex items-center justify-between border-b border-gray-800/50 pb-4 last:border-0 hover:pl-4 transition-all duration-300 cursor-pointer"
                   >
                     <a
                       href={item.href}
                       onClick={() => setIsOpen(false)}
                       className="text-5xl md:text-7xl font-bold text-white group-hover:text-gray-300 transition-colors font-urbanist"
                     >
                       {item.title}
                     </a>
                     <span className="opacity-0 group-hover:opacity-100 text-2xl text-white font-light">+</span>
                   </motion.div>
                 ))}
               </div>

                {/* Right: Stylized Card with Spline */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="hidden md:flex w-full md:w-1/2 h-96 bg-zinc-900 rounded-[2.5rem] relative overflow-hidden items-center justify-center shadow-2xl"
                >
                   {/* Spline Background */}
                   <div className="absolute inset-0 w-full h-full opacity-100">
                      <Spline scene="https://prod.spline.design/PIA7BlRgB6HhBz0f/scene.splinecode" />
                   </div>
                   
                   <div className="absolute bottom-8 left-8 text-white font-urbanist z-10 flex items-center gap-3">
                      <Logo className="w-8 h-8" />
                      <div>
                        <p className="text-xs uppercase tracking-widest font-bold opacity-50">Portfolio </p>
                        <p className="text-xl text-white font-urbanist">Bharadwaj</p>
                      </div>
                   </div>

                  {/* Bottom-right badge (covers Spline watermark) */}
<div className="absolute bottom-5 right-1 z-10">
  <div className="px-4 py-3 bg-white/90 backdrop-blur-md text-black rounded-full text-xs font-bold uppercase tracking-wide border border-white/20 shadow-lg">
    Available for work
  </div>
</div>
               </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
