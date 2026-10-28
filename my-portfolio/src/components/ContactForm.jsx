import React, { useState } from "react";
import { motion } from "framer-motion";
import { handleEmail } from "../utils/emailHelper";
import usePerformanceMode from "../hooks/usePerformanceMode";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // loading | success | error
  const { shouldReduceMotion } = usePerformanceMode();

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");
    
    // For email intents/mailto to work on modern mobile browsers, 
    // they MUST be triggered directly by a user gesture.
    // We remove the 1.5s delay to ensure the action is allowed.
    const subject = `Portfolio Contact from ${name}`;
    const bodyText = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    
    // Trigger the email app/web instantly
    handleEmail(subject, bodyText);
    
    // Set success state after a tiny delay for visual transition
    setTimeout(() => setStatus("success"), 500);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-12 items-stretch">
      
      {/* LEFT: Levitating Glass Contact Details */}
      <motion.div 
        className="w-full md:w-1/2 relative min-h-[400px]"
        animate={shouldReduceMotion ? { y: 0 } : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
         <div className="relative h-full w-full bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between overflow-hidden group hover:bg-zinc-900/40 hover:border-white/20 transition-all duration-500 shadow-2xl">
            {/* Ambient Light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-10" />

            <div>
                <h3 className="text-4xl sm:text-5xl font-semibold font-sans text-white mb-6 tracking-tight leading-[1.05]">
                    Let's <br/> <span className="text-gray-400">Connect.</span>
                </h3>
                <p className="text-gray-300 text-base md:text-lg font-normal font-sans leading-relaxed max-w-sm">
                    Have a project in mind or just want to chat? feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
            </div>

            <div className="space-y-4 mt-10">
                <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEmail();
                      }}
                      className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2 group text-sm md:text-base"
                    >
                        <span>bharadwajflasmup@gmail.com</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 group-hover:text-white transition-colors">Email me ↗</span>
                    </a>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span className="text-sm md:text-base">Remote / Worldwide</span>
                </div>

                {/* Social Profiles: GitHub & LinkedIn */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                    <a
                      href="https://github.com/Bharadwaj710"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all text-xs font-mono group"
                      aria-label="GitHub Profile"
                    >
                      <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0022 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                      <span className="text-[10px] text-gray-500 group-hover:text-gray-300">↗</span>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/bharadwaj-donthikurthi-bb8696288"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all text-xs font-mono group"
                      aria-label="LinkedIn Profile"
                    >
                      <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>LinkedIn</span>
                      <span className="text-[10px] text-gray-500 group-hover:text-gray-300">↗</span>
                    </a>
                </div>
            </div>
         </div>
      </motion.div>


      {/* RIGHT: Contact Form */}
      <div className="w-full md:w-1/2 flex items-center">
         <form onSubmit={handleSubmit} className="w-full space-y-6 bg-transparent p-2">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-400 ml-1">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-white/50 focus:bg-zinc-900 transition-all placeholder-zinc-700 font-sans text-sm"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-400 ml-1">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Dan@gmail.com"
                        type="email"
                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-white/50 focus:bg-zinc-900 transition-all placeholder-zinc-700 font-sans text-sm"
                        required
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400 ml-1">Message</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project..."
                    rows="5"
                    className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-white/50 focus:bg-zinc-900 transition-all placeholder-zinc-700 font-sans text-sm resize-none"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-white text-black rounded-2xl font-sans text-sm font-medium hover:bg-gray-200 transition-all transform active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {status === 'loading' ? (
                     <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : status === 'success' ? (
                    <span>Message Sent!</span>
                ) : (
                    <>
                      <span>Send Message</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                )}
            </button>

         </form>
      </div>
    </div>
  );
}
