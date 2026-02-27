import { useEffect, useState } from "react";

export default function usePerformanceMode() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => setPrefersReducedMotion(motionQuery.matches);
    onMotionChange();

    const nav = navigator;
    const lowCpu = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const saveData = !!nav.connection && !!nav.connection.saveData;
    setIsLowPerformance(lowCpu || lowMemory || saveData);

    motionQuery.addEventListener("change", onMotionChange);
    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  return {
    isLowPerformance,
    prefersReducedMotion,
    shouldReduceMotion: isLowPerformance || prefersReducedMotion,
  };
}
