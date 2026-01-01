import React from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

/**
 * PHASE 7: Cinematic Footer
 * - Left: Logo/name + tagline
 * - Right: Navigation links
 * - Social links (Instagram, LinkedIn, GitHub, Twitter)
 * - Smooth fade-in on scroll
 */
export default function CinematicFooter() {
  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/Bharadwaj710",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/bharadwaj-donthikurthi-bb8696288",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",
    },
    {
      label: "Twitter",
      href: "https://twitter.com/bharadwaj710",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/bharadwaj_donthikurthi",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg",
    },
  ];

  const codingLinks = [
    {
      label: "LeetCode",
      href: "https://leetcode.com/u/messironaldo27/",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/leetcode.svg",
    },
    {
      label: "CodeChef",
      href: "https://www.codechef.com/users/messironaldo10",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/codechef.svg",
    },
    {
      label: "Codeforces",
      href: "https://codeforces.com/profile/messironaldo27",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/codeforces.svg",
    },
  ];

  return (
    <footer className="relative bg-black border-t border-gray-800 overflow-hidden">
      {/* Background element */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* LEFT: Logo + Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Logo className="w-10 h-10" />
              <h3 className="text-3xl font-extrabold text-white">
                Bharadwaj
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Full-stack developer crafting elegant solutions to complex
              problems. Focused on performance, accessibility, and user
              experience.
            </p>
          </motion.div>

          {/* CENTER: Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT: Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex flex-col space-y-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm group"
                >
                  <img src={social.icon} alt={social.label} className="w-4 h-4 invert opacity-50 group-hover:opacity-100 transition-opacity" />
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* FAR RIGHT: Coding Profiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h4 className="text-white font-semibold mb-4">Coding Profiles</h4>
            <div className="flex flex-col space-y-3">
              {codingLinks.map((profile) => (
                <a
                  key={profile.label}
                  href={profile.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm group"
                >
                  <img src={profile.icon} alt={profile.label} className="w-4 h-4 invert opacity-50 group-hover:opacity-100 transition-opacity" />
                  {profile.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Bottom section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between text-center md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Bharadwaj. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            Designed & Developed with <span className="text-red-500">❤</span>{" "}
            using React + Tailwind CSS + Framer Motion
          </p>
        </motion.div>
      </div>

      {/* Animated line at the very bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
    </footer>
  );
}
