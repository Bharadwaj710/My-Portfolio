// src/components/ProjectsSection.jsx
import React from "react";
import { InView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import projects from "../data/projects";

export default function ProjectsSection() {
  return (
    <div className="relative">
      {projects.map((proj, index) => (
        <ProjectSection key={proj.id} project={proj} index={index} />
      ))}
    </div>
  );
}

function ProjectSection({ project, index }) {
  return (
    <InView
      triggerOnce={false} // you may want repeating or just once
      threshold={0.5} // 50% of section must be visible
    >
      {({ ref, inView }) => (
        <div
          ref={ref}
          className="min-h-screen flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={
              inView
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0.5, scale: 0.95, y: 20 }
            }
            transition={{ duration: 0.6 }}
            className="max-w-3xl bg-black rounded-2xl shadow-lg overflow-hidden text-white"
          >
            <img
              src={project.images?.[0]?.src || ""}
              alt={project.images?.[0]?.alt || project.title}
              className="w-full object-cover h-72"
              loading={project.images?.[0]?.preload ? "eager" : "lazy"}
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold">{project.title}</h3>
              <p className="mt-4 text-gray-300">{project.description}</p>
              {/* techs etc */}
            </div>
          </motion.div>
        </div>
      )}
    </InView>
  );
}
