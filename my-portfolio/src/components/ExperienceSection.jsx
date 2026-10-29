import React from "react";

export default function ExperienceSection({ onNavigate }) {
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

  const experiences = [
    {
      id: "navy",
      role: "AI Backend Engineer Intern",
      organization: "Naval Dockyard (Indian Navy) — AI Department",
      location: "Visakhapatnam, India",
      period: "May 2026 – June 2026",
      statusBadge: "Offline AI & Systems",
      caseStudySlug: "navy-ai-prediction",
      caseStudyLabel: "Navy AI Case Study",
      points: [
        "Engineered a FastAPI REST endpoint (POST /predict) that accepts defect logs and returns the predicted department with a confidence score as structured JSON, enabling integration with existing applications.",
        "Configured local model loading and PostgreSQL connectivity to support offline inference with no external AI API dependencies.",
        "Deployed the web interface on IIS and validated end-to-end prediction requests from networked PCs against the backend service.",
      ],
      stack: [
        "FastAPI",
        "Python",
        "PostgreSQL",
        "pgvector",
        "Sentence Transformers",
        "IIS",
      ],
    },
    {
      id: "velocitix",
      role: "Full-Stack Developer Intern",
      organization: "Velocitix AI",
      location: "Remote",
      period: "Jun 2025 – Aug 2025",
      statusBadge: "MERN & Flask AI",

      points: [
        "Contributed to full-stack development of a web-based platform using MERN stack and Flask.",
        "Integrated speech-to-text and LLM APIs to automate mock interview transcription and response evaluation workflows.",
        "Developed REST APIs for data flow and real-time notifications, improving system responsiveness and reliability.",
      ],
      stack: [
        "React.js",
        "Node.js",
        "Express.js",
        "Flask",
        "Python",
        "MongoDB",
        "Whisper",
        "Google Gemini API",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="bg-black text-white py-20 px-6 md:px-12 relative w-full border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-mono font-normal tracking-wider text-gray-400">
              03 · Practical Experience
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold font-sans lowercase tracking-tight mb-4 heading-matte-section">
            experience
          </h2>
          <p className="text-gray-400 font-sans text-base md:text-lg max-w-2xl leading-relaxed font-normal">
            Practical engineering experience in applied AI workflows, offline inference, and full-stack backend systems.
          </p>
        </div>

        {/* Experience Timeline Cards */}
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="relative bg-zinc-950/70 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-white/20 shadow-xl"
            >
              {/* Top Header Row */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl sm:text-3xl font-semibold font-sans tracking-tight heading-matte-hero">
                      {exp.role}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-blue-950/80 text-blue-400 border border-blue-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {exp.statusBadge}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-mono text-gray-300">
                    {exp.organization}{" "}
                    <span className="text-gray-600">·</span> {exp.location}
                  </p>
                </div>
                <div className="text-xs sm:text-sm font-mono text-gray-400 shrink-0">
                  {exp.period}
                </div>
              </div>

              {/* Verified Contributions List */}
              <div className="py-6 border-b border-white/10">
                <ul className="space-y-3.5 text-sm sm:text-base text-gray-300 font-sans font-normal leading-relaxed">
                  {exp.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Footer: Technologies and Case Study Link */}
              <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-gray-500 mr-1">
                    Technologies:
                  </span>
                  {exp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-xs font-mono text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {exp.caseStudySlug && (
                  <a
                    href={`/work/${exp.caseStudySlug}`}
                    onClick={(e) =>
                      handleNavigate(e, `/work/${exp.caseStudySlug}`)
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors shrink-0 group"
                  >
                    <span>{exp.caseStudyLabel}</span>
                    <span className="transform group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
