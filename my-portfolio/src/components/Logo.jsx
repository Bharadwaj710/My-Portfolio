import React from "react";
import { motion } from "framer-motion";

export default function Logo({ className = "w-10 h-10", onClick }) {
  return (
    <motion.a
      href="#"
      onClick={onClick}
      className={`relative inline-block group ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Stylized 'B' */}
        <path
          d="M20 20V80H50C65 80 75 70 75 57.5C75 50 70 45 62 42.5C68 40 72 35 72 27.5C72 17.5 62 10 50 10H20V20Z"
          fill="currentColor"
          className="text-white"
        />
        {/* Contrast Cut for 'D' or Stylization - mimicking the gap in user's image */}
        <path
          d="M35 25V42.5H45C52 42.5 58 37.5 58 30C58 22.5 52 17.5 45 17.5H35V25Z"
          fill="black"
        />
        <path
          d="M35 50V72.5H50C60 72.5 65 67.5 65 57.5C65 47.5 60 42.5 50 42.5H35V50Z"
          fill="black"
        />
        
        {/* Subtle decorative "cut" across the logo to match the user's reference image style */}
        <motion.path
          d="M85 10 L45 90"
          stroke="black"
          strokeWidth="8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 2.2 }}
        />
      </svg>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.a>
  );
}
