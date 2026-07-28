import { useState, useRef, useCallback } from "react";

/**
 * Drives any sorting generator at a controllable speed.
 * The generator doesn't know or care that it's being animated —
 * this hook is the only place that deals with timing.
 */
export function useSortAnimation() {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState(null);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speedMs, setSpeedMs] = useState(60);

  const generatorRef = useRef(null);
  const timeoutRef = useRef(null);

  const runStep = useCallback(() => {
    if (!generatorRef.current) return;

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsRunning(false);
      return;
    }

    setArray(value.array);
    setComparing(value.comparing);
    setSortedIndices(value.sortedIndices);

    timeoutRef.current = setTimeout(runStep, speedMs);
  }, [speedMs]);

  const start = useCallback((generatorFn, initialArray) => {
    clearTimeout(timeoutRef.current);
    setArray(initialArray);
    setSortedIndices([]);
    setIsRunning(true);
    generatorRef.current = generatorFn(initialArray);
    timeoutRef.current = setTimeout(runStep, speedMs);
  }, [runStep, speedMs]);

  const reset = useCallback((newArray) => {
    clearTimeout(timeoutRef.current);
    generatorRef.current = null;
    setIsRunning(false);
    setComparing(null);
    setSortedIndices([]);
    setArray(newArray);
  }, []);

  return {
    array,
    comparing,
    sortedIndices,
    isRunning,
    speedMs,
    setSpeedMs,
    start,
    reset,
  };
}
