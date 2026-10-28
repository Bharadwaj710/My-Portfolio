import React, { useState, useEffect } from "react";
import caseStudies from "../data/caseStudies";

export default function CaseStudy({ slug, onNavigate }) {
  const normalizedSlug = slug === "proedx" ? "proedxai" : slug;
  const currentIndex = caseStudies.findIndex((p) => p.slug === normalizedSlug);
  const project = caseStudies[currentIndex] || caseStudies[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image on project change
  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const handleNavigate = (e, path) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const gallery =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [{ src: project.heroImage, caption: project.heroImageAlt, alt: project.heroImageAlt }];

  const isProedX = project.slug === "proedxai";

  return (
    <article className="min-h-screen bg-black text-gray-100 pt-12 pb-32 px-6 md:px-12 relative selection:bg-white selection:text-black">
      {/* Background Subtle Dot Matrix */}
      <div className="fixed inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* TOP BREADCRUMB / BACK LINK */}
        <nav aria-label="Breadcrumb" className="mb-12">
          <a
            href="/#projects"
            onClick={(e) => handleNavigate(e, "/#projects")}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span>Back to Selected Work</span>
          </a>
        </nav>

        {/* SECTION 1 — HERO */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-mono text-gray-400">
              {project.number} / {project.category}
            </span>
            <span className="text-gray-600">•</span>
            {project.badgeText ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider ${
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

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold font-sans text-white tracking-tight leading-[1.08] mb-4">
            {project.title}
          </h1>

          <p className="text-xl sm:text-2xl font-sans text-gray-200 font-medium leading-snug mb-6">
            {project.headline || project.subtitle}
          </p>

          <p className="text-base sm:text-lg text-gray-300 font-sans font-normal leading-relaxed mb-8">
            {project.caseStudyIntro || project.shortDescription}
          </p>

          {/* Structured Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 rounded-2xl bg-zinc-950/90 border border-white/10 text-xs font-mono mb-8">
            <div>
              <span className="block text-gray-400 uppercase tracking-wider mb-1">
                Role
              </span>
              <span className="text-white font-medium">{project.role}</span>
            </div>
            <div>
              <span className="block text-gray-400 uppercase tracking-wider mb-1">
                Timeline
              </span>
              <span className="text-white font-medium">{project.timeline}</span>
            </div>
            <div>
              <span className="block text-gray-400 uppercase tracking-wider mb-1">
                Project Type
              </span>
              <span className="text-white font-medium">Full-Stack Web App</span>
            </div>
            <div>
              <span className="block text-gray-400 uppercase tracking-wider mb-1">
                Status
              </span>
              <span className="text-white font-medium">{project.status}</span>
            </div>
          </div>

          {/* Verified Tech Stack Monospace Pills */}
          <div className="mb-8">
            <span className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-3">
              Verified Technology Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {project.primaryStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono bg-zinc-900 border border-white/10 rounded-md text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-sans text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span>Launch Live Application</span>
                <span>↗</span>
              </a>
            )}

            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white font-sans text-xs sm:text-sm font-medium hover:bg-white hover:text-black transition-all"
              >
                <span>View GitHub Repository</span>
                <span>↗</span>
              </a>
            )}

            {project.links?.isProprietary && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-zinc-900/80 text-gray-300 font-mono text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Internal / Restricted Environment — Source & Deployment Confidential</span>
              </div>
            )}
          </div>
        </header>

        {/* SECTION 2 — PROBLEM AND PRODUCT APPROACH */}
        <section className="mb-20 pb-16 border-b border-white/10">
          <h2 className="text-2xl sm:text-3xl font-semibold font-sans text-white mb-6 tracking-tight">
            Problem & Product Approach
          </h2>
          <div className="text-gray-300 font-sans font-normal text-base sm:text-lg leading-relaxed mb-8">
            <p className="mb-4">{project.problemStatement}</p>
          </div>

          {/* Structured 6-Step Visual Journey */}
          {project.productWorkflow && (
            <div className="mb-10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-4">
                {project.workflowTitle || "Intended Product Workflow"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.productWorkflow.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded">
                          Step {item.step}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold font-sans text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs font-sans font-normal text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intended Users Personas */}
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-4">
              Target User Personas
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.intendedUsers.map((user, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm font-sans text-gray-300"
                >
                  <span className="text-blue-400 font-mono mt-0.5">•</span>
                  <span>{user}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 3 — PRODUCT WALKTHROUGH */}
        <section aria-label="Product Walkthrough" className="mb-20 pb-16 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold font-sans text-white tracking-tight">
              Product Walkthrough
            </h2>
            <span className="text-xs font-mono text-gray-400">
              Verified UI Interfaces
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-zinc-950 shadow-2xl mb-4">
            <img
              src={gallery[activeImageIndex].src}
              alt={gallery[activeImageIndex].alt || project.title}
              className="w-full h-auto object-cover max-h-[580px] bg-black"
            />
            {gallery[activeImageIndex].caption && (
              <div className="p-4 bg-zinc-950 border-t border-white/10 text-xs font-mono text-gray-300">
                {gallery[activeImageIndex].caption}
              </div>
            )}
          </div>

          {/* Clean Static Thumbnail Switcher */}
          {gallery.length > 1 && (
            <div className="mt-4">
              <span className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider">
                Select View ({activeImageIndex + 1} of {gallery.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`text-left p-2.5 rounded-xl border text-xs font-mono transition-all ${
                      idx === activeImageIndex
                        ? "border-white bg-zinc-900 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        : "border-white/10 bg-zinc-950 text-gray-400 hover:border-white/20 hover:text-gray-200"
                    }`}
                  >
                    <span className="block font-semibold mb-1 truncate">
                      0{idx + 1}. {img.title || img.alt.replace(" Interface", "")}
                    </span>
                    <span className="text-[10px] text-gray-500 block truncate">
                      Inspect view
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 4 — MY CONTRIBUTION */}
        <section className="mb-20 pb-16 border-b border-white/10">
          <h2 className="text-2xl sm:text-3xl font-semibold font-sans text-white mb-6 tracking-tight">
            My Contributions
          </h2>
          <p className="text-sm font-sans font-normal text-gray-400 mb-6">
            {project.contributionIntro ||
              "Key areas of full-stack development, API integration, and platform architecture contributed to the platform:"}
          </p>
          <div className="space-y-4">
            {project.specificContributions.map((contrib, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-1 rounded shrink-0">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold font-sans text-white mb-1.5">
                      {contrib.area || contrib}
                    </h3>
                    {contrib.detail && (
                      <p className="text-gray-300 font-sans font-normal text-sm leading-relaxed">
                        {contrib.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — ARCHITECTURE */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold font-sans text-white mb-6 tracking-tight">
            System Architecture
          </h2>

          {/* Architecture Narrative Sections */}
          <div className="space-y-6">
            {project.architecture.map((arch, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-950 border border-white/10"
              >
                <h3 className="text-lg font-semibold font-sans text-white mb-3">
                  {arch.title}
                </h3>
                <p className="text-gray-300 font-sans font-normal text-sm sm:text-base leading-relaxed">
                  {arch.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
