import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectCard({ project }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance carousel when not hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (project.images?.length > 1) {
        setCurrentImageIndex((prev) =>
          prev === project.images.length - 1 ? 0 : prev + 1
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, project.images]);

  // Get current image source
  const currentImage = project.images?.[currentImageIndex] || {
    src: project.image,
    alt: project.title,
  };

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noreferrer"
      className="group block"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-black text-white h-full">
        {/* Project Title - Always Visible */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-xl truncate">
            {project.title}
          </h3>
        </div>

        {/* Image Carousel */}
        <div className="relative aspect-video">
          <img
            src={currentImage.src}
            alt={currentImage.alt || project.title}
            loading={currentImage.preload ? "eager" : "lazy"}
            className={`w-full h-full object-cover`}
          />

          {/* Carousel Indicators */}
          {project.images?.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Always-visible details (footer) */}
        <div className="p-4 bg-transparent">
          <p className="text-sm text-gray-300 mb-3 line-clamp-3">
            {project.description}
          </p>
          {project.tech && (
            <div className="flex flex-wrap gap-2">
              {project.tech.slice(0, 6).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
          <div className="p-4 pt-20">
            <p className="text-sm text-gray-100 line-clamp-4">
              {project.description}
            </p>
            {project.tech && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile View Details */}
        <div className="p-4 sm:hidden">
          <p className="text-sm text-gray-300 line-clamp-2">
            {project.description}
          </p>
          {project.tech && (
            <div className="mt-2 flex flex-wrap gap-2">
              {project.tech.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
}
