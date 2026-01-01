import { motion } from "framer-motion";

export default function FloatingSkillIcon({
  icon,
  size = 56,
  duration = 6,
  isPaused,
  style,
}) {
  return (
    <motion.div
      className="absolute"
      style={style}
      animate={isPaused ? {} : { y: [0, -18, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <img
        src={icon}
        alt=""
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
}
