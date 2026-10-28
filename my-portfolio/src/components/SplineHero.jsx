import React from "react";
import Logo from "./Logo";

export default function SplineHero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col justify-between">
      {/* Subtle Dot Grid Texture matching the inspo aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-80" />
      
      {/* Soft Ambient Radial Vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_75%)] pointer-events-none" />

      {/* Top Bar: Brand Logo & Resume Action */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-8 flex justify-between items-center">
        <div>
          <Logo className="w-10 h-10 md:w-11 md:h-11" />
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="/Resume.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 border border-white/20 rounded-full text-xs font-sans font-medium text-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            view resume ↗
          </a>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col justify-center my-auto">
        {/* Monospace Identifier Tag */}
        <div className="flex items-center gap-2 mb-6 text-xs md:text-sm font-mono font-normal text-gray-400 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
          <span>B.TECH CSE · CLASS OF 2027 · INDIA</span>
        </div>

        {/* Primary Headline */}
        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.08] tracking-tight mb-6 max-w-4xl">
          I build backend systems and practical AI applications.
        </h1>

        {/* Supporting Paragraph */}
        <p className="font-sans text-gray-300 max-w-2xl text-base md:text-lg leading-relaxed mb-8 font-normal">
          Full-stack developer focused on Python backends, APIs, databases and applied AI. I build software that solves practical problems, from web applications to semantic-search workflows.
        </p>

        {/* Three Restrained Technology Labels */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          <span className="px-3 py-1 rounded-md bg-zinc-950/80 border border-white/10 text-xs font-mono font-normal text-gray-400">
            Backend Engineering
          </span>
          <span className="px-3 py-1 rounded-md bg-zinc-950/80 border border-white/10 text-xs font-mono font-normal text-gray-400">
            Applied AI
          </span>
          <span className="px-3 py-1 rounded-md bg-zinc-950/80 border border-white/10 text-xs font-mono font-normal text-gray-400">
            Full-Stack Development
          </span>
        </div>

        {/* Call to Action */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-sans text-sm font-medium hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <span>Explore selected work</span>
            <span>↓</span>
          </a>
          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 text-gray-300 font-sans text-sm font-medium hover:text-white hover:border-white/40 transition-colors"
          >
            <span>Resume</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Bottom Meta Cue */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-10 flex items-center justify-between text-xs font-mono font-normal text-gray-500">
        <a
          href="#projects"
          className="hover:text-gray-300 transition-colors inline-flex items-center gap-1.5"
        >
          <span>scroll to explore</span>
          <span className="text-[10px]">↓</span>
        </a>
        <span>section 01/04</span>
      </div>
    </section>
  );
}
