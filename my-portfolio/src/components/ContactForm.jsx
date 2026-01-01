import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // loading | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate send
    setTimeout(() => {
        const email = "bharadwajflasmup@gmail.com";
        const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const bodyArr = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        const bodyContent = encodeURIComponent(bodyArr);
        
        if (isMobile) {
          // Mobile: Open Gmail App directly with official URI
          // This avoids "mailto:" appearing in the recipient field
          window.location.href = `googlegmail:///co?to=${email}&subject=${subject}&body=${bodyContent}`;
        } else {
          // Desktop: Open Gmail web compose in new tab
          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${bodyContent}`;
          window.open(gmailUrl, '_blank');
        }
        
        setStatus("success");
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-12 items-stretch">
      
      {/* LEFT: Levitating Glass Contact Details */}
      <motion.div 
        className="w-full md:w-1/2 relative min-h-[400px]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
         <div className="relative h-full w-full bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between overflow-hidden group hover:bg-zinc-900/40 hover:border-white/20 transition-all duration-500 shadow-2xl">
            {/* Ambient Light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-10" />

            <div>
                <h3 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter font-urbanist">
                    Let's <br/> <span className="text-gray-500">Connect.</span>
                </h3>
                <p className="text-gray-400 text-lg font-light font-urbanist max-w-sm">
                    Have a project in mind or just want to chat? feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
            </div>

            <div className="space-y-4 mt-12">
                <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <a 
                      onClick={(e) => {
                        const email = "bharadwajflasmup@gmail.com";
                        const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        
                        if (isMobile) {
                          window.location.href = `googlegmail:///co?to=${email}`;
                        } else {
                          window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
                        }
                      }}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                        bharadwajflasmup@gmail.com
                    </a>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span>Remote / Worldwide</span>
                </div>
            </div>
         </div>
      </motion.div>


      {/* RIGHT: Contact Form */}
      <div className="w-full md:w-1/2 flex items-center">
         <form onSubmit={handleSubmit} className="w-full space-y-6 bg-transparent p-2">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-white/50 focus:bg-zinc-900 transition-all placeholder-zinc-700 font-urbanist"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        type="email"
                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-white/50 focus:bg-zinc-900 transition-all placeholder-zinc-700 font-urbanist"
                        required
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Message</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project..."
                    rows="5"
                    className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-white/50 focus:bg-zinc-900 transition-all placeholder-zinc-700 font-urbanist resize-none"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-wider hover:bg-gray-200 transition-all transform active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
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
