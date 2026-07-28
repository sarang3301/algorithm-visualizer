import { useState } from "react";
import SortingVisualizer from "./components/SortingVisualizer";
import PathfindingVisualizer from "./components/PathfindingVisualizer";

export default function App() {
  const [tab, setTab] = useState("sorting");

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <header style={{ padding: "20px 20px 0" }}>
        <h1 style={{ marginBottom: 4 }}>Algorithm Visualizer</h1>
        <p style={{ marginTop: 0, color: "#666" }}>
          Sorting algorithms and grid pathfinding, animated step-by-step.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button
            onClick={() => setTab("sorting")}
            style={{ fontWeight: tab === "sorting" ? "bold" : "normal" }}
          >
            Sorting
          </button>
          <button
            onClick={() => setTab("pathfinding")}
            style={{ fontWeight: tab === "pathfinding" ? "bold" : "normal" }}
          >
            Pathfinding (BFS/DFS)
          </button>
        </div>
      </header>

      {tab === "sorting" ? <SortingVisualizer /> : <PathfindingVisualizer />}
    </div>
  );
}
