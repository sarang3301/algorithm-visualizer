/**
 * Grid is a 2D array of cell types: "empty" | "wall" | "start" | "end"
 * Each generator yields a step describing the current traversal state:
 * {
 *   visited: Set of "row,col" strings visited so far,
 *   current: [row, col] | null,   // node being processed this step
 *   path: [[row,col], ...] | null // final path, only set on the last yield
 * }
 */

function key(r, c) {
  return `${r},${c}`;
}

function getNeighbors(grid, r, c) {
  const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const neighbors = [];
  for (const [dr, dc] of deltas) {
    const nr = r + dr, nc = c + dc;
    if (
      nr >= 0 && nr < grid.length &&
      nc >= 0 && nc < grid[0].length &&
      grid[nr][nc] !== "wall"
    ) {
      neighbors.push([nr, nc]);
    }
  }
  return neighbors;
}

function reconstructPath(cameFrom, start, end) {
  const path = [];
  let current = key(end[0], end[1]);
  const startKey = key(start[0], start[1]);

  while (current !== startKey) {
    const [r, c] = current.split(",").map(Number);
    path.push([r, c]);
    current = cameFrom.get(current);
    if (!current) return []; // no path found
  }
  path.push(start);
  return path.reverse();
}

// ---------- BFS ----------
// Time: O(V + E). Guarantees shortest path on an unweighted grid.
export function* bfs(grid, start, end) {
  const visited = new Set([key(start[0], start[1])]);
  const cameFrom = new Map();
  const queue = [start];
  let found = false;

  while (queue.length && !found) {
    const [r, c] = queue.shift();
    yield { visited: new Set(visited), current: [r, c], path: null };

    if (r === end[0] && c === end[1]) {
      found = true;
      break;
    }

    for (const [nr, nc] of getNeighbors(grid, r, c)) {
      const k = key(nr, nc);
      if (!visited.has(k)) {
        visited.add(k);
        cameFrom.set(k, key(r, c));
        queue.push([nr, nc]);
      }
    }
  }

  const path = found ? reconstructPath(cameFrom, start, end) : [];
  yield { visited, current: null, path };
}

// ---------- DFS ----------
// Time: O(V + E). Does NOT guarantee shortest path — good contrast to BFS,
// worth calling out explicitly in your design notes.
export function* dfs(grid, start, end) {
  const visited = new Set();
  const cameFrom = new Map();
  const stack = [start];
  let found = false;

  while (stack.length && !found) {
    const [r, c] = stack.pop();
    const k = key(r, c);
    if (visited.has(k)) continue;
    visited.add(k);

    yield { visited: new Set(visited), current: [r, c], path: null };

    if (r === end[0] && c === end[1]) {
      found = true;
      break;
    }

    for (const [nr, nc] of getNeighbors(grid, r, c)) {
      const nk = key(nr, nc);
      if (!visited.has(nk)) {
        if (!cameFrom.has(nk)) cameFrom.set(nk, k);
        stack.push([nr, nc]);
      }
    }
  }

  const path = found ? reconstructPath(cameFrom, start, end) : [];
  yield { visited, current: null, path };
}

export const pathfindingAlgorithms = {
  bfs: { fn: bfs, label: "BFS", note: "Guarantees shortest path (unweighted)" },
  dfs: { fn: dfs, label: "DFS", note: "Explores deep first — no shortest-path guarantee" },
};
