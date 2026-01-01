import { useState } from "react";
import { motion } from "framer-motion";
import FloatingSkillIcon from "./FloatingSkillIcon";

// Import local images from assets
import reactImg from "../assets/skills/react.png";
import jsImg from "../assets/skills/js.png";
import nodeImg from "../assets/skills/node.png";
import mongoImg from "../assets/skills/mongodb.png";
import expressImg from "../assets/skills/express.png";
import gitImg from "../assets/skills/git.png";

export default function AboutFloatingSkills() {
  const [paused, setPaused] = useState(false);

  // Local pictures for the about section
  const localSkills = [
    { name: "React", img: reactImg },
    { name: "JavaScript", img: jsImg },
    { name: "Node.js", img: nodeImg },
    { name: "MongoDB", img: mongoImg },
    { name: "Express", img: expressImg },
    { name: "Git", img: gitImg },
  ];

  return (
    <section
      id="about"
      className="relative bg-black py-32 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            About Me
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mb-6 font-urbanist">
            I’m Bharadwaj Donthikurthi a full-stack developer who enjoys building products that solve real problems and make workflows simpler for users. Most of my work revolves around modern web applications, where full-stack development and AI-powered features come together to create practical, scalable solutions.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed mb-6 font-urbanist">
            I like taking ideas from an initial concept to a fully working product, whether that means designing clean and responsive React interfaces, building reliable Node.js and Express backends, or integrating Python-based AI services into web systems. I focus on writing clean, maintainable code and building features that actually matter.  
          </p>
          <p className="text-gray-400 text-lg leading-relaxed mb-6 font-urbanist">
            My goal is simple: to build fast, scalable, and meaningful applications that people enjoy using and teams can rely on.  
          </p>

          <button
            onClick={() => setPaused((p) => !p)}
            className="px-6 py-3 rounded-full border border-gray-500 text-white hover:bg-white hover:text-black transition font-urbanist"
          >
            {paused ? "Play animation" : "Pause animation"}
          </button>
        </motion.div>

        {/* FLOATING ICON STAGE */}
        <div className="relative h-[450px]">
          {localSkills.map((skill, index) => (
            <FloatingSkillIcon
              key={skill.name}
              icon={skill.img}
              size={index % 2 === 0 ? 80 : 60} // Varied sizes for better feel
              duration={4 + index}
              isPaused={paused}
              style={{
                top: `${15 + index * 14}%`,
                left: `${(index % 3) * 30 + 10}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
