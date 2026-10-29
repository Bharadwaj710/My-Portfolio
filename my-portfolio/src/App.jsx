import React, { useState, useEffect, useCallback } from "react";

import HeroWithCurve from "./components/HeroWithCurve";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import WorkSection from "./components/WorkSection";
import CaseStudy from "./components/CaseStudy";
import ContactForm from "./components/ContactForm";
import CinematicFooter from "./components/CinematicFooter";
import CurvedSection from "./components/CurvedSection";
import BottomNav from "./components/BottomNav";
import EmailChooser from "./components/EmailChooser";

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const isCaseStudy = currentPath.startsWith("/work/");

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = useCallback((to) => {
    let targetPath = to;
    let targetHash = "";

    if (to.includes("#")) {
      const parts = to.split("#");
      targetPath = parts[0] || "/";
      targetHash = `#${parts[1]}`;
    }

    if (targetPath === window.location.pathname && targetHash) {
      const el = document.querySelector(targetHash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    window.history.pushState({}, "", to);
    setCurrentPath(targetPath);

    if (targetHash) {
      setTimeout(() => {
        const el = document.querySelector(targetHash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  const rawSlug = isCaseStudy
    ? currentPath.replace(/^\/work\/?/, "").split("/")[0]
    : null;
  const caseStudySlug = rawSlug === "proedx" ? "proedxai" : rawSlug;

  return (
    <div id="app-root" className="relative min-h-screen bg-black">
      <EmailChooser />

      {/* Floating Bottom Section Navigation Dock */}
      <BottomNav currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Route-driven View */}
      {isCaseStudy ? (
        <main className="relative text-gray-100 antialiased">
          <CaseStudy slug={caseStudySlug} onNavigate={handleNavigate} />
          <CinematicFooter />
        </main>
      ) : (
        <main className="relative text-gray-100 antialiased">
          {/* 1. Hero — Introduce Me */}
          <HeroWithCurve />

          {/* 2. About — Get to Know Me */}
          <CurvedSection>
            <AboutSection />
          </CurvedSection>

          {/* 3. Experience — Show My Practical Work */}
          <ExperienceSection onNavigate={handleNavigate} />

          {/* 4. Work — What I can Demonstrate */}
          <CurvedSection>
            <WorkSection onNavigate={handleNavigate} />
          </CurvedSection>

          {/* 5. Contact — How someone can reach me */}
          <section id="contact" className="bg-black pt-20 pb-28 border-t border-white/10">
            <div className="max-w-6xl mx-auto px-6">
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-mono tracking-wider text-gray-400">
                    05 · Contact
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold font-sans lowercase tracking-tight heading-matte-section">
                  contact
                </h2>
              </div>
              <ContactForm />
            </div>
          </section>

          <CinematicFooter />
        </main>
      )}
    </div>
  );
}
