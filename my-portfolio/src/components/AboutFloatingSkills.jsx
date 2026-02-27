import { useState } from "react";
import { motion } from "framer-motion";
import usePerformanceMode from "../hooks/usePerformanceMode";

export default function AboutFloatingSkills() {
  const [paused, setPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const { shouldReduceMotion } = usePerformanceMode();

  return (
    <section
      id="about"
      className="relative bg-black py-32 overflow-hidden"
      style={{ contain: 'paint' }}
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            About Me
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mb-6 font-urbanist">
            I’m Bharadwaj Donthikurthi a full-stack developer who enjoys building products that solve real problems and make workflows simpler for users. Most of my work revolves around modern web applications, where full-stack development and AI-powered features come together to create practical, scalable solutions.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed mb-6 font-urbanist">
            I like taking ideas from an initial concept to a fully working product, whether that means designing clean and responsive React interfaces, building reliable Node.js and Express backends, or integrating Python-based AI services into web systems. I focus on writing clean, maintainable code and building features that actually matter.  
          </p>
          <p className="text-gray-400 text-lg leading-relaxed mb-6 font-urbanist">
            My goal is simple: to build fast, scalable, and meaningful applications that people enjoy using and teams can rely on.  
          </p>

        </motion.div>

        {/* WAVY PHOTO FRAME */}
        <div className="relative h-[450px] flex items-center justify-center">
          <motion.button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="relative w-[340px] h-[340px] md:w-[430px] md:h-[430px] cursor-pointer"
            style={{ willChange: "transform" }}
            animate={paused || shouldReduceMotion ? { y: 0, rotate: 0 } : { y: [0, -8, 0], rotate: [0, 1, 0, -1, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            aria-label="Toggle photo wave animation"
          >
            <div className="absolute inset-0 rounded-full border-[3px] border-white/85 shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" />
            <div className="absolute inset-[10px] rounded-full border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.32)]" />

            {imageLoaded ? (
              <img
                src="/profile-photo.jpg"
                alt="Bharadwaj Donthikurthi"
                loading="lazy"
                onError={() => setImageLoaded(false)}
                className="absolute inset-[18px] w-[calc(100%-36px)] h-[calc(100%-36px)] object-cover rounded-full"
              />
            ) : (
              <div className="absolute inset-[18px] rounded-full bg-zinc-800 flex items-center justify-center text-white text-sm font-semibold">
                Add /public/profile-photo.jpg
              </div>
            )}

            <span className="absolute bottom-3 right-3 text-[11px] px-2 py-1 rounded-full bg-black/50 text-gray-200 border border-white/10">
              {paused ? "Paused" : "Click to pause"}
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
