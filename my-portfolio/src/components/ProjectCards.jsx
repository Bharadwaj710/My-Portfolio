import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import projects from "../data/projects";

// Individual Card Component
const Card = ({ i, title, description, tech, link, github, images, color, progress, range, targetScale }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'start start'] });
  
  const cardScale = useTransform(progress, range, [1, targetScale]);
  const topOffset = 30 + i * 25; 

  // Graceful Auto-scroll logic
  React.useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds for a graceful pace

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div 
      ref={container} 
      className="h-screen flex items-start justify-center sticky top-0"
      style={{ top: topOffset, paddingTop: '60px', contain: 'layout' }}
    >
      <motion.div 
        style={{ scale: cardScale, willChange: 'transform' }} 
        className="relative w-full max-w-9xl h-[65vh] flex flex-col md:flex-row gap-8 md:gap-12 px-4"
      >
        {/* LEFT: Floating Glass Image Section (Monochrome Carousel) */}
        <motion.div 
          className="w-full md:w-[60%] h-full relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/5">
                {images && images.length > 0 ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.img 
                                key={currentImageIndex}
                                src={images[currentImageIndex].src} 
                                alt={images[currentImageIndex].alt || title} 
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.4 }
                                }}
                                className="absolute w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                            />
                        </AnimatePresence>

                        {/* Navigation Arrows (Only if more than 1 image) */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-4 z-20 p-2 rounded-full bg-black/40 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-4 z-20 p-2 rounded-full bg-black/40 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                
                                {/* Indicators */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {images.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/40">
                        <span className="text-gray-500">No Image</span>
                    </div>
                )}
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </div>
            
            {/* White/Silver Glow instead of Indigo */}
            <div className="absolute -inset-4 bg-white/10 blur-3xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 -z-10" />
        </motion.div>


        {/* RIGHT: Project Info Section (B&W) */}
        <div className="w-full md:w-[40%] h-full flex flex-col justify-center relative z-20">
          
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:border-white/20 transition-colors duration-300">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4 leading-none tracking-tight font-urbanist">
                {title}
              </h3>
              
              {/* White separator */}
              <div className="w-24 h-1 bg-white rounded-full mb-6" />

              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 font-urbanist font-normal">
                {description}
              </p>

              {/* Technologies B&W */}
              <div className="flex flex-wrap gap-2 mb-8">
                {tech && tech.slice(0, 5).map((item, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-gray-300 rounded-lg hover:bg-white hover:text-black transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Buttons B&W */}
              <div className="flex gap-4">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-4 rounded-xl bg-white text-black font-extrabold text-center hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                >
                  View Live
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
                
                <a 
                  href={github || link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-white/20 text-white font-bold text-center hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  GitHub
                </a>
              </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectCards() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });

  return (
    <section className="bg-black relative w-full pt-16 pb-32" id="projects"> 
      
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <h2 className="text-6xl md:text-9xl font-black text-white mb-6 uppercase tracking-tighter font-urbanist">
             Selected<span className="text-gray-500">Works</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light font-urbanist">
             Monochrome precision.
        </p>
      </div>

      <div ref={container} className="relative w-full px-4"> 
         {projects.map((project, i) => {
           const targetScale = 1 - ( (projects.length - 1 - i) * 0.05 );
           return (
             <Card 
                key={i} 
                i={i} 
                {...project} 
                progress={scrollYProgress} 
                range={[i * 0.25, 1]} 
                targetScale={targetScale} 
             />
           )
         })}
      </div>
      
    </section>
  );
}
