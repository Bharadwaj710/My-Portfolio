import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import AboutFloatingSkills from "./components/AboutFloatingSkills";
import IntroLoader from "./components/IntroLoader";
import ImmersiveSkillsSection from "./components/ImmersiveSkillsSection";
import ProjectCards from "./components/ProjectCards";
import ContactForm from "./components/ContactForm";
import CinematicCTA from "./components/CinematicCTA";
import CinematicFooter from "./components/CinematicFooter";
import CurvedSection from "./components/CurvedSection";

import HeroWithCurve from "./components/HeroWithCurve";
import Navigation from "./components/Navigation";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  const [showLoader, setShowLoader] = useState(true);

  // ✅ Default browser scrolling (Lenis removed)
  // The user requested to remove custom smooth scrolling effects.

  return (
    <div id="app-root" className="relative min-h-screen bg-black">
      <CustomCursor />
      
      {/* Intro Loader */}
      <AnimatePresence mode="wait">
        {showLoader && (
          <IntroLoader onComplete={() => setShowLoader(false)} />
        )}
      </AnimatePresence>

      <Navigation />

      {/* Main Content */}
      <main className="relative text-gray-100 antialiased">
        {/* Hero with scroll-animated curved bottom edge */}
        <HeroWithCurve />

        {/* Curved Sections START AFTER HERO */}
        <CurvedSection>
          <AboutFloatingSkills />
        </CurvedSection>

        <CurvedSection>
          <ImmersiveSkillsSection />
        </CurvedSection>

        <CurvedSection>
          <ProjectCards />
        </CurvedSection>

        {/* Contact */}
        <section id="contact" className="bg-black pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10">
              Get in Touch
            </h2>
            <ContactForm />
          </div>
        </section>

        <CinematicCTA />
      </main>

      <CinematicFooter />
    </div>
  );
}
