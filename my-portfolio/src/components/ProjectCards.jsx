import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import projects from "../data/projects";
import usePerformanceMode from "../hooks/usePerformanceMode";

// Individual Card Component
const Card = ({ i, status, title, description, tech, link, github, images, color, progress, range, targetScale }) => {
  const container = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const { shouldReduceMotion } = usePerformanceMode();
  const isInView = useInView(container, { margin: "200px 0px 200px 0px" });
  
  const cardScale = useTransform(progress, range, [1, targetScale]);
  const topOffset = 30; 

  // Graceful Auto-scroll logic
  React.useEffect(() => {
    if (!images || images.length <= 1 || isHovered || !isInView || shouldReduceMotion || reduceMotion) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds for a graceful pace

    return () => clearInterval(interval);
  }, [images.length, isHovered, isInView, shouldReduceMotion, reduceMotion]);

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

  const hasLiveLink = Boolean(link && typeof link === "string" && !link.includes("example.com") && link.trim() !== "");
  const hasGithubLink = Boolean(github && typeof github === "string" && !github.includes("example.com") && github.trim() !== "");

  return (
    <div 
      ref={container} 
      className="h-screen flex items-start justify-center sticky top-0"
      style={{ top: topOffset, paddingTop: '60px', zIndex: i + 1 }}
    >
        <motion.div 
          style={{ scale: reduceMotion || shouldReduceMotion ? 1 : cardScale, willChange: 'transform' }} 
        className="relative w-full max-w-9xl h-[65vh] flex flex-col md:flex-row gap-8 md:gap-12 px-4"
      >
        {/* LEFT: Floating Glass Image Section (Monochrome Carousel) */}
        <motion.div 
          className="w-full md:w-[60%] h-full relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ y: 0 }}
        >
            <div className="absolute inset-0 bg-zinc-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10 transition-all duration-500 group-hover:border-white/30">
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
        <div className="w-full md:w-[40%] h-full flex flex-col relative z-20">
          
          <div className="w-full h-full bg-zinc-950/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl hover:border-white/20 transition-colors duration-300 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex flex-col justify-start overflow-y-auto no-scrollbar pr-1">
              {status && (
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    status === "In Progress"
                      ? "bg-amber-400 animate-pulse"
                      : status === "Internship Project"
                        ? "bg-blue-400"
                        : "bg-emerald-400"
                  }`} />
                  {status !== "Completed" && (
                    <span className="text-xs font-mono font-medium uppercase tracking-wider text-gray-300">
                      {status}
                    </span>
                  )}
                </div>
              )}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-3 leading-tight tracking-tight font-sans">
                {title}
              </h3>
              
              {/* White separator */}
              <div className="w-20 h-1 bg-white rounded-full mb-4" />

              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 font-sans font-normal">
                {description}
              </p>

              {/* Technologies B&W */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tech && tech.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-gray-300 rounded-lg hover:bg-white hover:text-black transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>

            </div>

              {/* Buttons B&W */}
              {(hasLiveLink || hasGithubLink) && (
                <div className="flex gap-4 pt-4 mt-auto border-t border-white/10">
                {hasLiveLink && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-5 py-3 rounded-xl bg-white text-black font-extrabold text-center hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 text-sm"
                  >
                    View Live
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                )}
                 
                {hasGithubLink && (
                  <a 
                  href={github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-5 py-3 rounded-xl border-2 border-white/20 text-white font-bold text-center hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-sm"
                >
                  GitHub
                  </a>
                )}
                </div>
              )}
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectCards() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });
  const getProjectOrder = (title = "") => {
    if (title.includes("ProEdxAI") || title.includes("ProedXAI")) return 0;
    if (title.includes("Converge")) return 1;
    if (title.includes("Navy AI")) return 2;
    if (title.includes("WDIP") || title.includes("Workforce Deployment")) return 3;
    return 999;
  };
  const orderedProjects = [...projects].sort(
    (a, b) => getProjectOrder(a.title) - getProjectOrder(b.title)
  );

  return (
    <section className="bg-black relative w-full pt-16 pb-32" id="projects"> 
      
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <h2 className="text-6xl md:text-8xl font-normal font-serif text-white mb-6 lowercase tracking-tight">
             selected works
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-sans font-normal">
             Monochrome precision.
        </p>
      </div>

      <div ref={container} className="relative w-full px-4"> 
         {orderedProjects.map((project, i) => {
           const targetScale = 1 - ( (orderedProjects.length - 1 - i) * 0.05 );
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

