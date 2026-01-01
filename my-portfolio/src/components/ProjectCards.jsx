import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import projects from "../data/projects";

// Individual Card Component
const Card = ({ i, title, description, tech, link, images, color, progress, range, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'start start'] });
  
  const cardScale = useTransform(progress, range, [1, targetScale]);
  const topOffset = 30 + i * 25; 

  return (
    <div 
      ref={container} 
      className="h-screen flex items-start justify-center sticky top-0"
      style={{ top: topOffset, paddingTop: '60px', contain: 'layout' }}
    >
      <motion.div 
        style={{ scale: cardScale, willChange: 'transform' }} 
        className="relative w-full max-w-7xl h-[60vh] flex flex-col md:flex-row gap-8 md:gap-12 px-4"
      >
        {/* LEFT: Floating Glass Image Section (Monochrome) */}
        <motion.div 
          className="w-full md:w-[60%] h-full relative group"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/5">
               {images && images.length > 0 ? (
                    <motion.div className="w-full h-full"> 
                    <motion.img 
                        src={images[0].src} 
                        alt={images[0].alt || title} 
                        // Grayscale by default, clear on hover
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700"
                        initial={{ scale: 1.1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7 }}
                    />
                    </motion.div>
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
                  href={link}
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
