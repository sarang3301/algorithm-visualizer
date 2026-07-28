import { useState, useRef, useCallback } from "react";
import { pathfindingAlgorithms } from "../algorithms/pathfindingAlgorithms";

const ROWS = 15;
const COLS = 30;

function emptyGrid() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill("empty"));
  grid[7][5] = "start";
  grid[7][24] = "end";
  return grid;
}

function findCell(grid, type) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === type) return [r, c];
    }
  }
  return null;
}

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState(emptyGrid());
  const [visited, setVisited] = useState(new Set());
  const [current, setCurrent] = useState(null);
  const [path, setPath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mouseMode, setMouseMode] = useState(null); // "wall" | "erase" | null
  const [speedMs, setSpeedMs] = useState(20);

  const generatorRef = useRef(null);
  const timeoutRef = useRef(null);

  const clearRun = () => {
    clearTimeout(timeoutRef.current);
    setVisited(new Set());
    setCurrent(null);
    setPath([]);
  };

  const runStep = useCallback(() => {
    if (!generatorRef.current) return;
    const { value, done } = generatorRef.current.next();
    if (done) {
      setIsRunning(false);
      return;
    }
    setVisited(value.visited);
    setCurrent(value.current);
    if (value.path) setPath(value.path);
    timeoutRef.current = setTimeout(runStep, speedMs);
  }, [speedMs]);

  const start = (key) => {
    clearRun();
    const startCell = findCell(grid, "start");
    const endCell = findCell(grid, "end");
    if (!startCell || !endCell) return;

    setIsRunning(true);
    generatorRef.current = pathfindingAlgorithms[key].fn(grid, startCell, endCell);
    timeoutRef.current = setTimeout(runStep, speedMs);
  };

  const toggleWall = (r, c) => {
    if (isRunning) return;
    if (grid[r][c] === "start" || grid[r][c] === "end") return;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = next[r][c] === "wall" ? "empty" : "wall";
      return next;
    });
  };

  const handleMouseDown = (r, c) => {
    const mode = grid[r][c] === "wall" ? "erase" : "wall";
    setMouseMode(mode);
    toggleWall(r, c);
  };

  const handleMouseEnter = (r, c) => {
    if (!mouseMode || isRunning) return;
    if (grid[r][c] === "start" || grid[r][c] === "end") return;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = mouseMode === "wall" ? "wall" : "empty";
      return next;
    });
  };

  const resetGrid = () => {
    clearRun();
    setGrid(emptyGrid());
  };

  const clearWalls = () => {
    clearRun();
    setGrid((prev) =>
      prev.map((row) => row.map((cell) => (cell === "wall" ? "empty" : cell)))
    );
  };

  const cellColor = (r, c) => {
    const k = `${r},${c}`;
    const cell = grid[r][c];
    if (cell === "start") return "#4caf50";
    if (cell === "end") return "#f44336";
    if (cell === "wall") return "#263238";
    if (path.some(([pr, pc]) => pr === r && pc === c)) return "#ffca28";
    if (current && current[0] === r && current[1] === c) return "#ab47bc";
    if (visited.has(k)) return "#90caf9";
    return "#fff";
  };

  return (
    <div
      style={{ padding: 20, fontFamily: "sans-serif", userSelect: "none" }}
      onMouseUp={() => setMouseMode(null)}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(pathfindingAlgorithms).map(([key, algo]) => (
          <button key={key} disabled={isRunning} onClick={() => start(key)} title={algo.note}>
            Run {algo.label}
          </button>
        ))}
        <button onClick={clearWalls} disabled={isRunning}>Clear Walls</button>
        <button onClick={resetGrid} disabled={isRunning}>Reset Grid</button>
        <label style={{ marginLeft: 12 }}>
          Speed:
          <input
            type="range"
            min="5"
            max="100"
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
          />
        </label>
      </div>

      <p style={{ fontSize: 13, color: "#555" }}>
        Click and drag to draw walls. Green = start, Red = end, Purple = current node,
        Blue = visited, Yellow = final path.
      </p>

      <div style={{ display: "inline-block", border: "1px solid #ccc" }}>
        {grid.map((row, r) => (
          <div key={r} style={{ display: "flex" }}>
            {row.map((_, c) => (
              <div
                key={c}
                onMouseDown={() => handleMouseDown(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                style={{
                  width: 22,
                  height: 22,
                  border: "1px solid #eee",
                  backgroundColor: cellColor(r, c),
                  transition: "background-color 0.1s linear",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
