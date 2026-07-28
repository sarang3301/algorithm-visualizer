import { useState } from "react";
import { fibonacciSteps, lcsSteps } from "../algorithms/dpAlgorithms";
import { useStepAnimation } from "./useStepAnimation";

const cellStyle = (isCurrent, isDep) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  margin: 2,
  border: "1px solid #ccc",
  borderRadius: 4,
  fontWeight: isCurrent ? "bold" : "normal",
  background: isCurrent ? "#facc15" : isDep ? "#bfdbfe" : "#f3f4f6",
  transition: "background 0.2s ease",
});

function FibonacciView() {
  const { step, isRunning, run } = useStepAnimation();
  const [n, setN] = useState(10);

  const start = () => run(() => fibonacciSteps(n), 350);

  const table = step?.table ?? [];
  const deps = step?.deps ?? [];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label>
          n:{" "}
          <input
            type="number"
            min={2}
            max={20}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ width: 60 }}
          />
        </label>{" "}
        <button onClick={start} disabled={isRunning}>
          Run Fibonacci
        </button>
      </div>

      <div>
        {table.map((val, i) => (
          <span
            key={i}
            style={cellStyle(step?.current === i, deps.includes(i))}
          >
            {val ?? ""}
          </span>
        ))}
      </div>

      <p style={{ fontFamily: "monospace", marginTop: 12 }}>
        {step?.relation ?? "Click Run to start."}
      </p>
    </div>
  );
}

function LCSView() {
  const { step, isRunning, run } = useStepAnimation();
  const [strA, setStrA] = useState("ABCBDAB");
  const [strB, setStrB] = useState("BDCABA");

  const start = () => run(() => lcsSteps(strA, strB), 250);

  const table = step?.table ?? [];
  const [curI, curJ] = step?.current ?? [-1, -1];
  const deps = step?.deps ?? [];
  const isDep = (i, j) => deps.some(([di, dj]) => di === i && dj === j);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label>
          String A:{" "}
          <input
            value={strA}
            onChange={(e) => setStrA(e.target.value.toUpperCase())}
            style={{ width: 120 }}
          />
        </label>{" "}
        <label>
          String B:{" "}
          <input
            value={strB}
            onChange={(e) => setStrB(e.target.value.toUpperCase())}
            style={{ width: 120 }}
          />
        </label>{" "}
        <button onClick={start} disabled={isRunning}>
          Run LCS
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>
            {table.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j} style={{ padding: 0 }}>
                    <span style={cellStyle(curI === i && curJ === j, isDep(i, j))}>
                      {val}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontFamily: "monospace", marginTop: 12 }}>
        {step?.relation ?? "Click Run to start."}
      </p>
    </div>
  );
}

export default function DPVisualizer() {
  const [mode, setMode] = useState("fibonacci");

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setMode("fibonacci")}
          style={{ fontWeight: mode === "fibonacci" ? "bold" : "normal" }}
        >
          Fibonacci (1D)
        </button>
        <button
          onClick={() => setMode("lcs")}
          style={{ fontWeight: mode === "lcs" ? "bold" : "normal" }}
        >
          Longest Common Subsequence (2D)
        </button>
      </div>

      {mode === "fibonacci" ? <FibonacciView /> : <LCSView />}
    </div>
  );
}
