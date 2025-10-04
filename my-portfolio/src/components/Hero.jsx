import React from "react";

export default function Hero() {
  return (
    <section className="mt-8 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
          Hi — I’m YourName. I build thoughtful & performant web apps.
        </h1>
        <p className="mt-4 text-gray-300 max-w-xl text-lg">
          Full-stack developer focused on building user-centred products using
          React, Node.js, and AI tools. I care about UX, clean code and shipping
          fast.
        </p>
        <div className="mt-6 flex gap-4">
          <a
            href="#projects"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow font-semibold"
          >
            See Projects
          </a>
          <a
            href="#contact"
            className="px-5 py-2 rounded-lg border border-gray-400 text-sm text-white font-semibold"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="hidden md:block">
        {/* Optional: put a mockup image or a small interactive preview */}
        <div className="bg-gradient-to-tr from-gray-900 to-black rounded-2xl p-6 shadow-lg">
          <img
            src="/projects/hero-mockup.png"
            alt="mockup"
            className="w-full h-56 object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
