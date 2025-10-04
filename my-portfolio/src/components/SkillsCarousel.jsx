import React from "react";
import skills from "../data/skills";

export default function SkillsCarousel() {
  // We duplicate the list so the animation loops seamlessly.
  const logos = [...skills, ...skills];

  return (
    <div className="marquee-container overflow-hidden bg-black py-4">
      <div className="flex items-center gap-8 animate-marquee">
        {logos.map((s, i) => (
          <div
            key={s.id + "-" + i}
            className="flex-shrink-0 w-28 h-16 flex items-center justify-center bg-gray-900 rounded-lg border border-gray-800"
          >
            <img
              src={s.logo}
              alt={s.name}
              title={s.name}
              className="max-h-12 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
