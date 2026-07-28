# Algorithm Visualizer

Interactive visualizer for sorting algorithms and grid-based pathfinding
(BFS/DFS), built with React and Vite. Animates each step of the algorithm
in real time with adjustable speed.

## Features

- **Sorting:** Bubble Sort, Merge Sort, Quick Sort, Heap Sort — animated
  bar chart showing comparisons, swaps, and sorted-position tracking.
- **Pathfinding:** BFS and DFS on a draggable grid — draw walls, move
  start/end points (extendable), watch the search frontier expand and the
  final path highlight.
- Adjustable animation speed for both views.
- See [`DESIGN_NOTES.md`](./DESIGN_NOTES.md) for the engineering trade-offs
  behind each algorithm choice.

## Tech stack

React 18, Vite — no backend, fully client-side.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Deploying

This is a static Vite app — deploys for free on Vercel, Netlify, or GitHub
Pages with zero configuration beyond pointing the platform at this repo and
running `npm run build`.

## Project structure

```
src/
├── algorithms/
│   ├── sortingAlgorithms.js       # generator functions: bubble/merge/quick/heap sort
│   └── pathfindingAlgorithms.js   # generator functions: BFS/DFS
├── components/
│   ├── SortingVisualizer.jsx
│   ├── PathfindingVisualizer.jsx
│   └── useSortAnimation.js        # animation-timing hook, decoupled from algorithm logic
├── App.jsx
└── main.jsx
```

## Why generators?

Each algorithm is a generator function that yields a snapshot of state after
every meaningful step. The animation layer (`setTimeout`-based) is the only
part of the codebase that knows about timing — the algorithms themselves are
pure and would work identically if driven by a test runner instead of a UI.
See `DESIGN_NOTES.md` for more on this and other trade-offs.
