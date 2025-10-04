// src/App.jsx
import React from "react";
import { motion } from "framer-motion";
import { InView } from "react-intersection-observer";
import Hero from "./components/Hero";
import SkillsCarousel from "./components/SkillsCarousel";
import ProjectCarousel3D from "./components/ProjectCarousel3D";
import ContactForm from "./components/ContactForm";

export default function App() {
  return (
    <div className="bg-black text-white antialiased">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-semibold text-white">YourName</div>
            <div className="space-x-6">
              <a
                href="#projects"
                className="text-sm text-white hover:text-indigo-400 transition-colors"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-sm text-white hover:text-indigo-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <InView threshold={0.5} triggerOnce>
          {({ ref, inView }) => (
            <section ref={ref} className="py-16 md:py-28 bg-black">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: inView ? 1 : 0,
                  y: inView ? 0 : 20,
                }}
                transition={{ duration: 0.8 }}
                className="w-full"
              >
                <div className="max-w-6xl mx-auto px-6">
                  <Hero />
                </div>
              </motion.div>
            </section>
          )}
        </InView>

        {/* Skills Section - reduced bottom padding to allow first project card to overlap */}
        <InView threshold={0.3} triggerOnce>
          {({ ref, inView }) => (
            <section
              ref={ref}
              className="py-16 bg-black"
              style={{ paddingBottom: "60px" }} // reduced from 16 (64px) to allow overlap
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: inView ? 1 : 0,
                  y: inView ? 0 : 20,
                }}
                transition={{ duration: 0.8 }}
                className="w-full"
              >
                <div className="max-w-6xl mx-auto px-6">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                    Skills & Tools
                  </h2>
                  <SkillsCarousel />
                </div>
              </motion.div>
            </section>
          )}
        </InView>

        {/* Projects Section - overlaps with Skills section */}
        <section
          id="projects"
          className="bg-black relative py-20"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Projects
            </h2>
            <ProjectCarousel3D />
          </div>
        </section>

        {/* Contact Section - with top margin to account for projects overlap */}
        <section
          id="contact"
          className="bg-black pt-12 pb-16"
          style={{ marginTop: "40px" }} // spacing after projects
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-10 tracking-tight">
              Get in Touch
            </h2>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="bg-black border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} YourName — built with React + Tailwind
        </div>
      </footer>
    </div>
  );
}

/* 
Alternative approach if you prefer using CSS classes:

Add these styles to your global CSS file:

.skills-section {
  padding-bottom: 80px !important;
}

.projects-section {
  position: relative;
  z-index: 10;
}

.contact-section {
  margin-top: 40px;
}

Then use:
<section id="skills" className="min-h-screen bg-gray-50 py-20 skills-section">
<section id="projects" className="projects-section">
<section id="contact" className="min-h-screen bg-white py-20 contact-section">
*/
