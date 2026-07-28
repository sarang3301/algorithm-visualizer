import { algorithms } from "../algorithms/sortingAlgorithms";
import { useSortAnimation } from "./useSortAnimation";

function randomArray(size = 30, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 5);
}

export default function SortingVisualizer() {
  const {
    array, comparing, sortedIndices, isRunning,
    speedMs, setSpeedMs, start, reset,
  } = useSortAnimation();

  const currentArray = array.length ? array : randomArray();

  const handleStart = (key) => {
    const algo = algorithms[key];
    start(algo.fn, currentArray.length ? currentArray : randomArray());
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(algorithms).map(([key, algo]) => (
          <button key={key} disabled={isRunning} onClick={() => handleStart(key)}>
            {algo.label}
          </button>
        ))}
        <button onClick={() => reset(randomArray())} disabled={isRunning}>
          New Array
        </button>
        <label style={{ marginLeft: 12 }}>
          Speed:
          <input
            type="range"
            min="5"
            max="200"
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
          />
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", height: 220, gap: 2 }}>
        {currentArray.map((value, idx) => {
          const isComparing = comparing && comparing.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          return (
            <div
              key={idx}
              style={{
                width: 18,
                height: value * 2,
                backgroundColor: isSorted ? "#4caf50" : isComparing ? "#ffca28" : "#42a5f5",
                transition: "height 0.05s linear, background-color 0.05s linear",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
