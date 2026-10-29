import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import skillsRaw from "../data/skills";
import usePerformanceMode from "../hooks/usePerformanceMode";

export default function AboutSection() {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(25);
  
  const skills = useMemo(() => skillsRaw, []);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "200px 0px 200px 0px" });
  const { shouldReduceMotion } = usePerformanceMode();

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const resize = () => {
      const w = el.scrollWidth / 2;
      const dur = Math.max(20, Math.round(w / 60));
      setDuration(dur);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [skills]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-black text-gray-100 pt-16 sm:pt-20 pb-20 sm:pb-24 overflow-hidden"
    >
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-white/[0.02] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-mono font-normal tracking-wider text-gray-400">
              01 · About
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold font-sans text-white tracking-tight lowercase">
            about
          </h2>
        </motion.div>

        {/* Top Block: Narrative & Photo Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          {/* Left Column: Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-start"
          >
            {/* Monospace Section Tag */}
            <div className="flex items-center gap-2 mb-6 text-xs md:text-sm font-mono font-normal text-gray-400 tracking-wider">
              <span>how I work</span>
            </div>

            <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed font-sans font-normal">
              <p>
                I'm <strong className="text-white font-semibold">Bharadwaj Donthikurthi</strong>, a Computer Science and Engineering undergraduate graduating in 2027. My background is in full-stack development, and I'm increasingly focused on backend engineering and applied AI.
              </p>
              <p>
                I build web applications and backend services, working across APIs, databases and frontend interfaces. I enjoy understanding how the pieces fit together—from designing data models and implementing application logic to integrating external services.
              </p>
              <p>
                My recent AI engineering work has involved Python, PostgreSQL, vector embeddings and semantic search. Through projects involving career guidance and intelligent defect classification, I've explored how AI can be integrated into practical software systems.
              </p>
              <p>
                I aim to build software that is understandable, maintainable and useful, with technical decisions grounded in the problem being solved.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Editorial Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl group">
              {imageLoaded ? (
                <img
                  src="/profile-photo.jpg"
                  alt="Bharadwaj Donthikurthi"
                  loading="lazy"
                  onError={() => setImageLoaded(false)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6 text-center text-gray-400 text-sm font-mono">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-4 text-white">
                    BD
                  </div>
                  <span>Bharadwaj Donthikurthi</span>
                  <span className="text-xs text-gray-500 mt-1">Full-Stack & Applied AI Engineer</span>
                </div>
              )}

              {/* Subtle Ambient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Corner Badge */}
              <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-300">
                2027 CSE · Backend & AI
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle Block: 'what I do' Text-First Skill Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-white/10 pt-12 mb-16"
        >
          {/* Monospace Header */}
          <div className="text-xs md:text-sm font-mono font-normal text-gray-400 tracking-wider mb-10">
            <span>what I do</span>
          </div>

          <div className="space-y-10">
            {/* Build / Backend */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <div className="md:col-span-3 text-xs md:text-sm font-mono text-white uppercase tracking-wider">
                build
              </div>
              <div className="md:col-span-9 text-gray-300 text-base md:text-lg leading-relaxed font-sans font-normal">
                Full-stack applications · REST API development · Backend business logic · PostgreSQL and MongoDB data modeling · React and Next.js interfaces
              </div>
            </div>

            {/* AI / Systems */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <div className="md:col-span-3 text-xs md:text-sm font-mono text-white uppercase tracking-wider">
                applied ai
              </div>
              <div className="md:col-span-9 text-gray-300 text-base md:text-lg leading-relaxed font-sans font-normal">
                Text embeddings with Sentence Transformers · Semantic similarity search using pgvector · AI API integration · Text preprocessing and intelligent classification workflows
              </div>
            </div>

            {/* Work With (Text-Only) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <div className="md:col-span-3 text-xs md:text-sm font-mono text-white uppercase tracking-wider">
                work with
              </div>
              <div className="md:col-span-9 text-gray-300 text-sm md:text-base leading-relaxed font-mono font-normal">
                Python · JavaScript · React · Next.js · Node.js · Express · Flask · FastAPI · PostgreSQL · MongoDB · pgvector · Git
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Block: Minimal Flowing Skills Ribbon (Icon-Only, No Text Labels) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mask-linear-fade pt-4"
        >
          {/* Gradient Edge Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

          <style>{`
            @keyframes marqueeSkills {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .animate-marquee-skills {
              animation: marqueeSkills linear infinite;
              will-change: transform;
            }
            .mask-linear-fade {
              mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
            }
          `}</style>

          <div
            className="overflow-hidden flex"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={trackRef}
              className="flex gap-4 md:gap-6 items-center py-4 animate-marquee-skills"
              style={{
                width: "max-content",
                animationDuration: `${duration}s`,
                animationPlayState: isPaused || !isInView || shouldReduceMotion ? "paused" : "running",
              }}
            >
              {[...skills, ...skills, ...skills].map((skill, idx) => (
                <div
                  key={`${skill.name}-${idx}`}
                  title={skill.name}
                  className="relative group p-0.5"
                >
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-white/10 flex items-center justify-center p-3 transition-all duration-300 group-hover:border-white/40 group-hover:bg-zinc-900 group-hover:scale-110 shadow-lg">
                    {/* Subtle Glow behind icon on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-30 blur-xl rounded-2xl transition-opacity duration-300"
                      style={{ backgroundColor: skill.accentColor }}
                    />
                    {/* Icon (Clean monochrome / subtle brand glow, NO text below) */}
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="relative z-10 w-full h-full object-contain filter invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                    />
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
