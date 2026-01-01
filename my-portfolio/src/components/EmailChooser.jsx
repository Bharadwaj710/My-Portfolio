import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic Email Chooser
 * 
 * Provides a premium, branded "Open With" experience on mobile.
 * Listens for 'open-email-chooser' custom event.
 */
export default function EmailChooser() {
  const [data, setData] = useState(null); // { subject, body }

  useEffect(() => {
    const handleOpen = (e) => {
      setData(e.detail || { subject: "", body: "" });
    };

    window.addEventListener("open-email-chooser", handleOpen);
    return () => window.removeEventListener("open-email-chooser", handleOpen);
  }, []);

  const close = () => setData(null);

  const email = "bharadwajflasmup@gmail.com";
  const encodedSubject = data ? encodeURIComponent(data.subject) : "";
  const encodedBody = data ? encodeURIComponent(data.body) : "";

  const options = [
    {
      id: "gmail-app",
      name: "Gmail App",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.39l-9 6.58-9-6.58V21H1.5C.65 21 0 20.35 0 19.5v-15c0-1.1.9-2 2-2h1.5l8.5 6.19 8.5-6.19H22c1.1 0 2 .9 2 2z"/>
        </svg>
      ),
      description: "Fastest experience",
      action: () => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const url = isAndroid 
          ? `intent:#Intent;action=android.intent.action.VIEW;data=mailto:${email}?subject=${encodedSubject}&body=${encodedBody};package=com.google.android.gm;end`
          : `googlegmail:///co?to=${email}&subject=${encodedSubject}&body=${encodedBody}`;
        window.location.href = url;
        close();
      }
    },
    {
      id: "browser",
      name: "Gmail Web",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      description: "Open in Browser",
      action: () => {
        const url = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;
        window.location.href = url;
        close();
      }
    },
    {
      id: "default",
      name: "Default Mail",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      description: "Any client",
      action: () => {
        window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
        close();
      }
    }
  ];

  return (
    <AnimatePresence>
      {data && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white font-urbanist tracking-tight">Open with</h3>
                  <p className="text-gray-500 text-sm mt-1">Choose your preferred method</p>
                </div>
                <button 
                  onClick={close}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={opt.action}
                    className="w-full flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl transition-all group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-zinc-800 rounded-2xl group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold">{opt.name}</div>
                      <div className="text-gray-500 text-xs">{opt.description}</div>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={close}
                className="w-full mt-8 p-4 text-center text-gray-500 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            {/* Accent light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
