import React from "react";

export function AeroStreamlines({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none w-full h-full flex items-center justify-center ${className}`}
    >
      <style>{`
        @keyframes aeroFlow {
          from {
            stroke-dashoffset: 280;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .aero-streamline {
          stroke-dasharray: 140 70;
          animation: aeroFlow 7.5s linear infinite;
        }
        .aero-stream-1 { animation-delay: 0s; animation-duration: 8s; }
        .aero-stream-2 { animation-delay: -1.6s; animation-duration: 6.8s; }
        .aero-stream-3 { animation-delay: -3.2s; animation-duration: 7.4s; }
        .aero-stream-4 { animation-delay: -4.8s; animation-duration: 8.2s; }
        .aero-stream-5 { animation-delay: -2.4s; animation-duration: 7s; }

        @media (prefers-reduced-motion: reduce) {
          .aero-streamline {
            animation: none !important;
            stroke-dasharray: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 540 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        {/* Streamline 1: High laminar flow */}
        <path
          d="M 15 52 Q 150 48 280 50 T 450 50 T 530 48"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="aero-streamline aero-stream-1"
        />

        {/* Streamline 2: Nose to rear wing with turbulent kink */}
        <path
          d="M 15 112 Q 115 96 195 86 T 330 74 T 440 76 Q 465 68 488 84 T 530 76"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="aero-streamline aero-stream-2"
        />

        {/* Streamline 3: Cockpit / sidepod flow with vortex separation */}
        <path
          d="M 15 132 Q 95 124 175 116 T 310 116 T 430 122 Q 462 134 488 120 T 530 130"
          stroke="rgba(255, 255, 255, 0.26)"
          strokeWidth="1.35"
          strokeLinecap="round"
          className="aero-streamline aero-stream-3"
        />

        {/* Streamline 4: Front wing to sidepod undercut */}
        <path
          d="M 15 148 Q 65 144 140 136 T 280 138 T 410 132 T 530 126"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="aero-streamline aero-stream-4"
        />

        {/* Streamline 5: Underfloor ground-effect venturi line */}
        <path
          d="M 20 162 Q 100 160 220 160 T 380 160 Q 420 152 460 146 T 530 140"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="aero-streamline aero-stream-5"
        />

        {/* Aerodynamic Annotation */}
        <polyline
          points="464,74 480,36 505,36"
          fill="none"
          stroke="rgba(156, 163, 175, 0.45)"
          strokeWidth="1"
          strokeDasharray="2.5 2.5"
        />
        <circle cx="464" cy="74" r="2" fill="rgba(96, 165, 250, 0.85)" />

        <text
          x="205"
          y="32"
          fill="rgba(156, 163, 175, 0.75)"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          fontSize="9.5"
          letterSpacing="0.05em"
        >
          inference → flow separation · rear wing · 0.91
        </text>
      </svg>
    </div>
  );
}

export default function AeroCar({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none relative w-full max-w-[520px] flex items-center justify-center ${className}`}
    >
      <AeroStreamlines />

      {/* 2D Line Art Overlay */}
      <svg
        viewBox="0 0 540 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
      >
        <g
          stroke="rgba(255, 255, 255, 0.55)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Front Wing Assembly */}
          <path d="M 42 142 L 42 160" />
          <path d="M 42 158 L 98 158" />
          <path d="M 45 152 L 92 152" />

          {/* Nose & Monocoque */}
          <path d="M 75 148 Q 110 136 150 126 T 215 112" />
          <path d="M 215 112 L 230 114 L 275 114" />
          <path d="M 226 112 Q 248 94 274 104 L 276 114" />
          <path d="M 275 114 L 288 88 L 302 88 L 396 108 L 396 136" />
          <path d="M 168 146 Q 185 126 210 126 L 276 126 Q 340 128 392 145" />
          <path d="M 158 158 L 396 158 L 440 142" />

          {/* Rear Wing */}
          <path d="M 456 78 L 478 78 L 478 136 L 456 136 Z" />
          <path d="M 440 86 L 476 86" />
          <path d="M 442 96 L 476 96" />
          <path d="M 396 138 Q 420 114 446 88" />

          {/* Wheels */}
          <circle cx="135" cy="146" r="22" />
          <circle cx="135" cy="146" r="9" strokeWidth="1.2" />
          <circle cx="425" cy="146" r="22" />
          <circle cx="425" cy="146" r="9" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}
