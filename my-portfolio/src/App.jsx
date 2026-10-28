import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

import AboutSection from "./components/AboutSection";
import IntroLoader from "./components/IntroLoader";
import WorkSection from "./components/WorkSection";
import CaseStudy from "./components/CaseStudy";
import ContactForm from "./components/ContactForm";
import CinematicFooter from "./components/CinematicFooter";
import CurvedSection from "./components/CurvedSection";

import HeroWithCurve from "./components/HeroWithCurve";
import BottomNav from "./components/BottomNav";
import EmailChooser from "./components/EmailChooser";

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const isCaseStudy = currentPath.startsWith("/work/");
  const [showLoader, setShowLoader] = useState(() => !isCaseStudy);

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

      {/* Intro Loader (Home only) */}
      <AnimatePresence mode="wait">
        {showLoader && (
          <IntroLoader onComplete={() => setShowLoader(false)} />
        )}
      </AnimatePresence>

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
          {/* Hero with scroll-animated curved bottom edge */}
          <HeroWithCurve />

          {/* Unified About & What I Do Section */}
          <CurvedSection>
            <AboutSection />
          </CurvedSection>

          {/* Curated Work Section: Featured + Editorial Index */}
          <CurvedSection>
            <WorkSection onNavigate={handleNavigate} />
          </CurvedSection>

          {/* Contact */}
          <section id="contact" className="bg-black pt-20 pb-28">
            <div className="max-w-6xl mx-auto px-6">
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono tracking-wider text-gray-400">
                    03 · Contact
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold font-sans lowercase tracking-tight text-white">
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
