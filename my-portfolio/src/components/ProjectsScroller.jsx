import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import projects from "../data/projects";
import "./ProjectsScroller.css";

export default function ProjectsScroller() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="projects-stack">
      {projects.map((project, index) => {
        const start = index / projects.length;
        const end = (index + 1) / projects.length;

        // fade in/out
        const opacity = useTransform(
          scrollYProgress,
          [start, start + 0.1, end - 0.1, end],
          [0, 1, 1, 0]
        );

        // slide up (stack motion)
        const y = useTransform(scrollYProgress, [start, end], ["10%", "-20%"]);

        // scale effect (top card slightly bigger)
        const scale = useTransform(scrollYProgress, [start, end], [1, 0.9]);

        // rotation for deck feel
        const rotate = useTransform(
          scrollYProgress,
          [start, end],
          ["0deg", "-3deg"]
        );

        return (
          <motion.div
            key={index}
            className="project-card"
            style={{ zIndex: projects.length - index }}
          >
            <motion.div
              className="project-card-content"
              style={{ opacity, y, scale, rotate }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
              <p className="text-lg mb-6">{project.description}</p>
              <img
                src={project.images?.[0]?.src || ""}
                alt={project.images?.[0]?.alt || project.title}
                className="rounded-lg shadow-lg w-full object-cover"
                loading={project.images?.[0]?.preload ? "eager" : "lazy"}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
