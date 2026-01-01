import { useEffect, useRef, useState } from "react";

export default function TypewriterText({
  lines = [],
  typingDelay = 80,
  lineDelay = 600,
  restartDelay = 5000,
}) {
  const [output, setOutput] = useState([""]);

  const configRef = useRef({
    lines,
    typingDelay,
    lineDelay,
    restartDelay,
  });

  const stateRef = useRef({
    line: 0,
    char: 0,
    phase: "typing",
    lastTick: Date.now(),
  });

  // Store config once (prevents scroll-trigger resets)
  useEffect(() => {
    configRef.current = {
      lines,
      typingDelay,
      lineDelay,
      restartDelay,
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const { lines, typingDelay, lineDelay, restartDelay } =
        configRef.current;

      const now = Date.now();
      const state = stateRef.current;
      const currentLine = lines[state.line];

      if (!currentLine) return;

      if (state.phase === "typing") {
        if (now - state.lastTick < typingDelay) return;

        state.lastTick = now;
        state.char++;

        setOutput((prev) => {
          const copy = [...prev];
          copy[state.line] = currentLine.slice(0, state.char);
          return copy;
        });

        if (state.char === currentLine.length) {
          state.phase =
            state.line < lines.length - 1 ? "linePause" : "restartPause";
          state.lastTick = now;
        }
      }

      else if (state.phase === "linePause") {
        if (now - state.lastTick < lineDelay) return;

        state.line++;
        state.char = 0;
        state.phase = "typing";
        state.lastTick = now;

        setOutput((prev) => [...prev, ""]);
      }

      else if (state.phase === "restartPause") {
        if (now - state.lastTick < restartDelay) return;

        state.line = 0;
        state.char = 0;
        state.phase = "typing";
        state.lastTick = now;

        setOutput([""]);
      }
    }, 16);

    return () => clearInterval(interval);
  }, []); // 🔒 NEVER reruns

  return (
    <span className="inline-flex flex-col">
      {output.map((line, i) => (
        <span key={i} className="inline-flex items-center">
          <span>{line}</span>
          {i === output.length - 1 && (
            <span className="ml-1 animate-pulse opacity-70">▍</span>
          )}
        </span>
      ))}
    </span>
  );
}
