import { motion } from "framer-motion";

export default function AnimatedNavLink({ href, label }) {
  return (
    <motion.a
      href={href}
      className="relative text-sm uppercase tracking-wide text-white"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <motion.span
        variants={{
          rest: { y: 0, opacity: 0.8 },
          hover: { y: -2, opacity: 1 }
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {label}
      </motion.span>

      {/* underline */}
      <motion.span
        className="absolute left-0 -bottom-1 h-[1px] bg-white"
        variants={{
          rest: { width: "0%" },
          hover: { width: "100%" }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.a>
  );
}
