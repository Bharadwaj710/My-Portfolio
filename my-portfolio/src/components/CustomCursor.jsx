import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

/**
 * CustomCursor - Elegant Hollow Ring Design
 * 
 * DESIGN UPDATE:
 * - Matches requested screenshot: A clean, hollow white ring.
 * - Removed the dotted trail for a more minimal, cinematic look.
 * - Maintains robust viewport-fixed logic and interaction handling.
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  
  const cursorHeadRef = useRef(null);
  const requestRef = useRef(null);
  
  // Tracking state in refs to avoid re-renders
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const isFirstMove = useRef(true);

  useEffect(() => {
    // 1. Feature Detection - Completely disable on touch devices
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) {
      setIsVisible(false);
      return;
    }
    
    setIsVisible(true);

    // 2. Event Handlers
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouse.current = { x: clientX, y: clientY };
      
      if (isFirstMove.current) {
         pos.current = { x: clientX, y: clientY };
         isFirstMove.current = false;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a') || 
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('[data-cursor="native"]') ||
        target.closest('.cursor-pointer');

      setIsInteractive(!!interactive);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    // 3. Animation Loop
    const animate = () => {
      const targetX = mouse.current.x;
      const targetY = mouse.current.y;
      
      const dx = targetX - pos.current.x;
      const dy = targetY - pos.current.y;
      
      // Smooth interpolation (lerp) for the ring
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
          pos.current.x = targetX;
          pos.current.y = targetY;
      } else {
          pos.current.x += dx * 0.2; // Slightly softer lerp for premium feel
          pos.current.y += dy * 0.2;
      }

      if (cursorHeadRef.current) {
        cursorHeadRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <>
      <style>{`
        /* Global Hide Default Cursor */
        html, body, #app-root {
          cursor: none !important;
        }
        /* Restore on Interactive Elements */
        a, button, input, textarea, select, [role="button"], .cursor-pointer, .pointer-events-auto {
          cursor: auto !important;
        }
      `}</style>
      
      <div 
        id="custom-cursor-viewport"
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 2147483647,
            overflow: 'hidden',
            opacity: isInteractive ? 0 : 1,
            transition: 'opacity 0.2s ease-out',
            contain: 'strict'
        }}
      >
          {/* MINIMAL HOLLOW RING CURSOR */}
          <div 
             ref={cursorHeadRef}
             className="absolute top-0 left-0 flex items-center justify-center mix-blend-difference"
             style={{
                width: '32px', // Slightly larger for the minimal design
                height: '32px',
                marginTop: '-16px',
                marginLeft: '-16px',
                willChange: 'transform'
             }}
          >
             {/* The Hollow Ring: Clean White Circle as in Screenshot */}
             <div 
                className="w-full h-full border-[1px] border-white/80 rounded-full" 
                style={{
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)' // Very subtle glow
                }}
             />
          </div>
      </div>
    </>,
    document.body
  );
}
