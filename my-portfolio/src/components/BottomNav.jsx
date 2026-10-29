import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PillNav from "./PillNav";

const NAV_ITEMS = [
  { id: "root", label: "home", href: "#hero", targetPath: "/" },
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

  const handleItemClick = (item, index, event) => {
    event.preventDefault();
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

    if (item.href === "#hero" || item.id === "root") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const activeHref = isCaseStudy
    ? "#projects"
    : NAV_ITEMS.find((item) => item.id === activeSection)?.href || "#hero";

  return ReactDOM.createPortal(
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
      role="region"
      aria-label="Floating Navigation Bar"
    >
      <PillNav
        items={NAV_ITEMS}
        activeHref={activeHref}
        onItemClick={handleItemClick}
        theme="dark"
        layout="joined"
        size="md"
        surface="glass"
        itemStyle="plain"
        hoverEffect="glide"
        indicator="pill"
        bounce={0.12}
        stretch={0.18}
        intro={false}
        collapse="never"
        textColor="#a1a1aa"
        highlightTextColor="#ffffff"
        ariaLabel="Bottom Navigation"
        className="glass-nav-dock"
        style={{
          "--pn-surface": "rgba(16, 16, 22, 0.55)",
          "--pn-blur": "blur(18px) saturate(190%)",
          "--pn-edge": "rgba(255, 255, 255, 0.13)",
          "--pn-rim": "rgba(255, 255, 255, 0.22)",
          "--pn-shadow":
            "0 12px 36px -6px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.24), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.45)",
          "--pn-text": "rgba(161, 161, 170, 0.88)",
          "--pn-strong": "#ffffff",
          "--pn-pill":
            "radial-gradient(130% 130% at 50% -20%, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(18, 22, 34, 0.65) 100%)",
          "--pn-pill-ink": "#ffffff",
          "--pn-pill-shadow":
            "0 4px 14px -1px rgba(0, 0, 0, 0.5), 0 0 12px -1px rgba(59, 130, 246, 0.35), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.6), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.6), inset 1px 0 2px 0 rgba(96, 165, 250, 0.45)",
          "--pn-ring": "rgba(59, 130, 246, 0.75)",
        }}
      />
    </div>,
    document.body
  );
}
