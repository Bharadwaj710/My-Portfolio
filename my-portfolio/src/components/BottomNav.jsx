import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { id: "root", label: "root", href: "#hero", targetPath: "/" },
  { id: "about", label: "about", href: "#about", targetPath: "/" },
  { id: "work", label: "work", href: "#projects", targetPath: "/" },
  { id: "contact", label: "contact", href: "#contact", targetPath: "/" },
];

export default function BottomNav({ currentPath = "/", onNavigate }) {
  const isCaseStudy = currentPath.startsWith("/work/");
  const [activeSection, setActiveSection] = useState(isCaseStudy ? "work" : "root");

  useEffect(() => {
    if (isCaseStudy) {
      setActiveSection("work");
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      const sections = NAV_ITEMS.map((item) => {
        if (item.id === "root") {
          return { id: item.id, top: 0, bottom: window.innerHeight * 0.7 };
        }
        const element = document.querySelector(item.href);
        if (element) {
          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          return { id: item.id, top, bottom: top + rect.height };
        }
        return null;
      }).filter(Boolean);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (scrollPosition >= section.top - 100) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCaseStudy, currentPath]);

  const handleClick = (e, item) => {
    e.preventDefault();
    setActiveSection(item.id);

    if (isCaseStudy) {
      if (onNavigate) {
        onNavigate(`/${item.href}`);
      } else {
        window.history.pushState({}, "", `/${item.href}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
      return;
    }

    if (item.id === "root") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return ReactDOM.createPortal(
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <div
        className="glass-nav-dock relative flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 border border-white/[0.08] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
        style={{
          WebkitBackdropFilter: "blur(14px)",
          backdropFilter: "blur(14px)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={(e) => handleClick(e, item)}
              className="relative py-1.5 px-3.5 sm:px-4 text-xs md:text-sm font-sans font-medium tracking-normal lowercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 rounded-full"
            >
              {/* Fluid Liquid Glass Blob Indicator */}
              {isActive && (
                <motion.div
                  layoutId="liquidActiveBlob"
                  className="liquid-glass-blob absolute inset-0 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 26,
                    mass: 0.6,
                  }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? "text-white font-medium" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>,
    document.body
  );
}
