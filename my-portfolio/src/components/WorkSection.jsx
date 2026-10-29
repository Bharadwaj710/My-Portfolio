import React from "react";
import caseStudies from "../data/caseStudies";

export default function WorkSection({ onNavigate }) {
  const handleProjectClick = (e, slug) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(`/work/${slug}`);
    } else {
      window.history.pushState({}, "", `/work/${slug}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <section id="projects" className="bg-black text-white py-24 px-6 md:px-12 relative w-full">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Section Header */}
        <div className="mb-14 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-mono font-normal tracking-wider text-gray-400">
              03 · Selected Work
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold font-sans lowercase tracking-tight mb-4 text-white">
            selected work
          </h2>
          <p className="text-gray-400 font-sans text-base md:text-lg max-w-2xl leading-relaxed font-normal">
            A curated index of production full-stack platforms, real-time distributed systems, and applied AI retrieval pipelines.
          </p>
        </div>

        {/* Uniform Engineering Project Index */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h3 className="text-xl sm:text-2xl font-semibold font-sans text-white tracking-tight">
              Engineering Index
            </h3>
            <span className="text-xs font-mono text-gray-400">
              04 engineering projects · hover to preview
            </span>
          </div>

          <div className="space-y-5">
            {caseStudies.map((project) => (
              <div
                key={project.slug}
                onClick={(e) => handleProjectClick(e, project.slug)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleProjectClick(e, project.slug);
                  }
                }}
                className="group relative bg-zinc-950/70 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-white/30 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
              >
                {/* Main Content Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Left: Project Number, Name & Description */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-gray-400">
                        {project.number} /
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-semibold font-sans text-white group-hover:text-blue-400 transition-colors tracking-tight">
                        {project.title}
                      </h4>

                      {project.badgeText ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider ${
                            project.statusType === "internship"
                              ? "bg-blue-950/80 text-blue-400 border border-blue-800/40"
                              : "bg-amber-950/80 text-amber-400 border border-amber-800/40"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              project.statusType === "internship"
                                ? "bg-blue-400"
                                : "bg-amber-400 animate-pulse"
                            }`}
                          />
                          {project.badgeText}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center p-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/40"
                          title="Completed"
                          aria-label="Completed"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300 font-sans font-normal text-sm sm:text-base leading-relaxed mb-4 max-w-3xl">
                      {project.shortDescription}
                    </p>

                    {/* Relevant Technical Focus */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-gray-400 mr-1">Focus:</span>
                      {project.primaryStack.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs font-mono bg-black/60 border border-white/10 rounded text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-3 md:self-center shrink-0">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/20 text-white font-sans font-medium text-xs transition-all duration-200 group-hover:opacity-0 group-hover:invisible group-hover:pointer-events-none">
                      <span>dive deep</span>
                      <span>→</span>
                    </span>

                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 text-gray-300 font-sans font-medium text-xs hover:text-white hover:border-white/30 transition-all"
                      >
                        <span>Demo</span>
                        <span>↗</span>
                      </a>
                    )}

                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 text-gray-300 font-sans font-medium text-xs hover:text-white hover:border-white/30 transition-all"
                      >
                        <span>Source</span>
                        <span>↗</span>
                      </a>
                    )}

                    {project.links.isProprietary && (
                      <span className="text-[11px] font-mono text-gray-400 px-3 py-1.5 rounded bg-zinc-900/60 border border-white/5">
                        Internal / NDA
                      </span>
                    )}

                    {!project.links.isProprietary && !project.links.live && !project.links.github && (
                      <span className="text-[11px] font-mono text-gray-400 px-3 py-1.5 rounded bg-zinc-900/60 border border-white/5">
                        In Development
                      </span>
                    )}
                  </div>
                </div>

                {/* Expandable Image Preview Drawer on Hover (Smooth CSS Grid Accordion) */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <div className="overflow-hidden">
                    <div className="pt-6 mt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-400 delay-75">
                      <div className="relative w-full h-48 sm:h-64 md:h-72 rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                        <img
                          src={project.heroImage}
                          alt={project.heroImageAlt || project.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-[1.015] transition-all duration-700"
                        />
                        {/* Soft Ambient Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                        {/* Bottom Overlay Info Banner */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex items-center justify-between pointer-events-none">
                          <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span>Click to dive deep into architecture & implementation</span>
                          </div>

                          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-mono font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-all">
                            <span>dive deep</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Projects on GitHub */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-sans font-normal text-gray-400 text-center sm:text-left">
              Looking for additional repositories, microservices, and experiments?
            </p>
            <a
              href="https://github.com/Bharadwaj710"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-zinc-950 text-white font-mono text-xs font-medium hover:bg-white hover:text-black hover:border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] group shrink-0"
            >
              <svg
                className="w-4 h-4 fill-current transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Explore more projects on GitHub</span>
              <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
