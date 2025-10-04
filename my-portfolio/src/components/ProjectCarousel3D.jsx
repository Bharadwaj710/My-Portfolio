import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import projects from "../data/projects";
import "./ProjectCarousel3D.css";

export default function ProjectCarousel3D() {
  const containerRef = useRef();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [detailIndex, setDetailIndex] = useState(null);

  const detailRef = useRef(detailIndex);
  useEffect(() => {
    detailRef.current = detailIndex;
  }, [detailIndex]);
  // inside ProjectCarousel3D component, after state declarations
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && detailRef.current !== null) {
        setDetailIndex(null); // close the detail card
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // close detail on scroll
  useEffect(() => {
    if (!scrollYProgress?.onChange) return;
    const unsub = scrollYProgress.onChange(() => {
      if (detailRef.current !== null) setDetailIndex(null);
    });
    return () => unsub?.();
  }, [scrollYProgress]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) {
    return (
      <div className="px-6 py-10 bg-black text-white">
        <div className="max-w-5xl mx-auto space-y-8">
          {projects.map((p, i) => (
            <div
              key={p.id || i}
              className="bg-white text-black rounded-xl p-6 shadow"
            >
              <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
              <p className="mb-4">{p.description}</p>
              <div className="relative rounded overflow-hidden">
                <ImageCarousel project={p} />
              </div>
              {p.link && (
                <a
                  className="mt-4 inline-block text-indigo-600"
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const containerHeightVh = projects.length * 100;

  return (
    <section
      ref={containerRef}
      className="project-carousel-container relative bg-black"
      style={{ height: `${containerHeightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full">
        {/* Canvas */}
        <div
          className={`canvas-wrap ${
            detailIndex !== null ? "canvas-hidden" : ""
          }`}
        >
          <Canvas
            gl={{ antialias: false, powerPreference: "low-power" }}
            dpr={1}
            camera={{ position: [0, 0, 6], fov: 50 }}
            style={{ background: "transparent" }}
          >
            {/* lights are not required for MeshBasicMaterial; disabling to save cycles */}
            <Suspense fallback={null}>
              <CarouselScene
                scrollYProgress={scrollYProgress}
                projects={projects}
                setActiveIndex={setActiveIndex}
                setDetailIndex={setDetailIndex}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Overlay title/desc */}
        <MemoizedCarouselOverlay
          projects={projects}
          activeIndex={activeIndex}
          visible={detailIndex === null}
          onOpenDetail={() => setDetailIndex(activeIndex)}
        />

        {/* Detail card */}
        <MemoizedProjectDetailOverlay
          project={projects[detailIndex]}
          visible={detailIndex !== null}
          onClose={() => setDetailIndex(null)}
        />
      </div>
    </section>
  );
}

/* ---------- Scene ---------- */
function CarouselScene({
  scrollYProgress,
  projects,
  setActiveIndex,
  setDetailIndex,
}) {
  const groupRef = useRef();
  const meshRefs = useRef([]);
  meshRefs.current = [];
  const textures = useLoader(
    THREE.TextureLoader,
    projects.map((p) => p.images[0].src)
  );

  // Optimize textures for performance
  useEffect(() => {
    if (!textures || textures.length === 0) return;
    textures.forEach((tex) => {
      if (!tex) return;
      try {
        tex.encoding = THREE.sRGBEncoding;
        // use linear filters and disable expensive mipmap generation
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        // limit anisotropy to 1 to reduce sampling cost
        tex.anisotropy = 1;
        tex.needsUpdate = true;
      } catch (e) {
        // safe guard for textures that may be undefined
      }
    });
  }, [textures]);

  const radius = 4.0;
  const angleStep = (2 * Math.PI) / projects.length;
  const fullRotation = 2 * Math.PI;

  const addToRefs = (el) => {
    if (el && !meshRefs.current.includes(el)) meshRefs.current.push(el);
  };

  const frameCount = useRef(0);
  const lastActiveIndexRef = useRef(-1);

  useFrame((state, delta) => {
    const p = scrollYProgress.get();
    const targetRot = -p * fullRotation;
    if (groupRef.current) {
      // apply smoother, delta-based interpolation
      groupRef.current.rotation.y +=
        (targetRot - groupRef.current.rotation.y) * Math.min(1, delta * 5);
    }

    // Throttle heavier updates to every 3rd frame to reduce CPU/GPU work
    frameCount.current = (frameCount.current + 1) % 3;
    if (frameCount.current !== 0) return;

    const progressIndex = p * projects.length;
    const idx =
      ((Math.round(progressIndex) % projects.length) + projects.length) %
      projects.length;

    // Only set state when active index actually changes (reduces re-renders)
    if (idx !== lastActiveIndexRef.current) {
      setActiveIndex(idx);
      lastActiveIndexRef.current = idx;
    }

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      let diff = Math.abs(progressIndex - i);
      if (diff > projects.length / 2) diff = projects.length - diff;
      const t = Math.max(0, 1 - diff);
      const targetScale = 1 + 0.12 * t;

      // Smooth scale interpolation (lighter math)
      mesh.scale.x += (targetScale - mesh.scale.x) * 0.06;
      mesh.scale.y = mesh.scale.x;
      mesh.scale.z = 1;

      if (mesh.material) {
        const desiredOpacity = 0.25 + 0.65 * t;
        mesh.material.opacity +=
          (desiredOpacity - mesh.material.opacity) * 0.06;
        mesh.material.transparent = true;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {projects.map((p, i) => {
        const angle = i * angleStep;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const rotY = angle + Math.PI;
        return (
          <mesh
            key={p.id || i}
            ref={addToRefs}
            position={[x, 0, z]}
            rotation={[0, rotY, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setDetailIndex(i);
            }}
          >
            {/* simplified geometry to reduce vertex count */}
            <planeGeometry args={[2.4, 1.4]} />
            <meshBasicMaterial map={textures[i]} transparent opacity={0.25} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------- Overlay ---------- */
function CarouselOverlay({ projects, activeIndex, visible, onOpenDetail }) {
  const project = projects[activeIndex] || projects[0];
  const pointerClass = visible ? "pointer-events-auto" : "pointer-events-none";

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      } ${pointerClass}`}
    >
      <div className="max-w-3xl text-center px-6">
        <motion.div
          key={project.id || activeIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          <h2
            className="project-title text-4xl md:text-5xl font-extrabold text-white drop-shadow-md cursor-pointer hover:text-indigo-400 transition"
            onClick={onOpenDetail}
            role="button"
            aria-label={`Open details for ${project.title}`}
          >
            {project.title}
          </h2>
          <p className="mt-4 text-lg text-gray-200">{project.description}</p>
        </motion.div>
      </div>
    </div>
  );
}

const MemoizedCarouselOverlay = React.memo(CarouselOverlay);

/* ---------- Image Carousel Component ---------- */
function ImageCarousel({ project }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (project.images.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === project.images.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovered, project.images]);

  // Smoothly fade via CSS class (reduces React layout thrash)
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    img.style.opacity = 0;
    const t = setTimeout(() => {
      img.src = project.images[currentImageIndex].src;
      img.alt = project.images[currentImageIndex].alt || project.title;
      img.loading = project.images[currentImageIndex].preload
        ? "eager"
        : "lazy";
      img.style.transition = "opacity 0.6s ease-in-out";
      img.style.opacity = 1;
    }, 50);

    return () => clearTimeout(t);
  }, [currentImageIndex, project.images, project.title]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent z-10"
        aria-hidden
      />

      {/* Single <img> element is reused to avoid frequent mounting/unmounting */}
      <img
        ref={imgRef}
        src={project.images[0].src}
        alt={project.images[0].alt || project.title}
        className={`w-full h-full object-cover`}
        loading={project.images[0].preload ? "eager" : "lazy"}
        style={{ opacity: 1 }}
      />

      {/* Navigation Arrows */}
      {project.images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex((prev) =>
                prev === 0 ? project.images.length - 1 : prev - 1
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-lg"
            aria-label="Previous image"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex((prev) =>
                prev === project.images.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-lg"
            aria-label="Next image"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {project.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-white scale-110 shadow-lg"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Detail Overlay ---------- */
/* ---------- Project detail overlay (click outside or Close to dismiss) ---------- */
function ProjectDetailOverlay({ project, visible, onClose }) {
  // Disable body scroll when overlay is visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";

      const handleEscKey = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscKey);

      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [visible, onClose]);

  if (!visible || !project) return null;

  return (
    <div className="project-detail-overlay fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <AnimatePresence>
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.9, rotateX: 8 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.95, rotateX: -3 }}
          transition={{
            type: "spring",
            damping: 22,
            stiffness: 300,
            duration: 0.5,
          }}
          className="detail-card dark relative pointer-events-auto w-[90vw] h-[85vh] max-w-7xl bg-white border-3 border-black rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-transparent" />
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{
              scale: 1.1,
              rotate: 90,
              boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-12 h-12 bg-white border-2 border-black rounded-full shadow-lg flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-250"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>

          <div className="flex flex-col lg:flex-row h-full bg-gradient-to-br from-white via-gray-50 to-white">
            {/* Image Section */}
            <div className="lg:w-1/2 relative overflow-hidden group p-6">
              <ImageCarousel project={project} />

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-3 border-t-3 border-black" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-3 border-t-3 border-black" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-3 border-b-3 border-black" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-3 border-b-3 border-black" />
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-start relative overflow-y-auto custom-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-8"
              >
                {/* Title with animated underline */}
                <div className="relative">
                  <motion.h3
                    className="text-3xl lg:text-4xl font-semibold mb-3 text-black leading-tight font-serif"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.div
                    className="h-0.5 bg-black rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <p className="text-lg text-gray-700 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </motion.div>

                {/* Features Section */}
                {project.features && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h4 className="text-2xl font-medium text-black font-serif gradient-text">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {project.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.7 + i * 0.1,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 100,
                          }}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }}
                          className="group"
                        >
                          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-lg">
                            <div className="flex items-start gap-3">
                              <motion.div
                                className="w-2 h-2 bg-black rounded-full flex-shrink-0 mt-2"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                              <span className="text-base text-gray-700 group-hover:text-black transition-colors duration-300">
                                {feature}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tech Stack Section */}
                {project.tech && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="space-y-4"
                  >
                    <h4 className="text-2xl font-medium text-black font-serif">
                      Tech Stack
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {project.tech.map((tech, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: 0.9 + i * 0.08,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 100,
                          }}
                          whileHover={{
                            scale: 1.05,
                            rotate: 1,
                            transition: {
                              duration: 0.28,
                              type: "spring",
                              stiffness: 200,
                            },
                            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                          }}
                          className="relative group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/0 rounded-xl transform group-hover:scale-105 transition-transform duration-300 ease-out" />
                          <motion.div
                            className="px-4 py-3 bg-white backdrop-blur-sm bg-opacity-90 rounded-xl border border-gray-200 hover:border-black transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-xl"
                            whileHover={{ y: -2 }}
                          >
                            <span className="text-sm font-medium text-black">
                              {tech}
                            </span>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="pt-4"
                >
                  {project.link ? (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                        y: -2,
                      }}
                      whileTap={{ scale: 0.98, y: 0 }}
                      className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-white/95 text-black rounded-xl font-medium text-lg border-2 border-white/10 hover:bg-black hover:text-white transition-all duration-300 shadow-md"
                    >
                      <span className="relative z-10 font-normal">
                        View Project
                      </span>
                      <motion.svg
                        className="w-5 h-5 relative z-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </motion.svg>

                      <motion.div
                        className="absolute inset-0 bg-white"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gray-200 text-gray-600 rounded-xl font-medium text-lg cursor-not-allowed border-2 border-gray-300"
                    >
                      <span className="font-normal">Coming Soon</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Infinity Moving Line at Bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full w-20 bg-gradient-to-r from-transparent via-black to-transparent"
              animate={{
                x: [-80, window.innerWidth + 80],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const MemoizedProjectDetailOverlay = React.memo(ProjectDetailOverlay);
