import { useState, useRef, useCallback } from "react";

// Generic hook: give it a function that RETURNS a generator, and it will
// pull one step at a time on an interval, exposing the latest step + controls.
// This is the same pattern as useSortAnimation.js, generalized so the DP
// visualizer (and any future visualizer) can reuse it instead of duplicating
// the animation-loop logic.
export function useStepAnimation() {
  const [step, setStep] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const timeoutRef = useRef(null);

  const stop = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
  }, []);

  const run = useCallback(
    (generatorFactory, speedMs = 400) => {
      stop();
      const gen = generatorFactory();
      setIsRunning(true);

      const pump = () => {
        const { value, done } = gen.next();
        if (done) {
          setIsRunning(false);
          return;
        }
        setStep(value);
        timeoutRef.current = setTimeout(pump, speedMs);
      };

      pump();
    },
    [stop]
  );

  return { step, isRunning, run, stop };
}
