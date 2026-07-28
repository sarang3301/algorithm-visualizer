# Design Notes

## Architecture: generators decoupled from animation timing

Every algorithm (`bubbleSort`, `mergeSort`, `quickSort`, `heapSort`, `bfs`, `dfs`)
is implemented as a JavaScript generator function. Each `yield` hands back a
snapshot of state after one meaningful step (a comparison, a swap, a node
visit) — the algorithm itself has zero knowledge of timing or animation.

The animation layer (`useSortAnimation` hook, and the equivalent logic in
`PathfindingVisualizer`) is the *only* place that calls `setTimeout`. It pulls
one step at a time via `.next()` and decides how fast to render it.

**Why this separation matters:** it keeps the algorithm implementations
pure and testable — you could unit test `bubbleSort([5,3,1])` and assert on
the final yielded array without ever touching React or timing logic. It also
means swapping in a new algorithm (e.g. adding Insertion Sort) requires zero
changes to the animation or UI code — just register it in `algorithms`.

## Trade-off: Quick Sort vs. Merge Sort

Both are O(n log n) on average, but they were chosen here specifically to
contrast:

- **Merge Sort** guarantees O(n log n) in all cases, but requires O(n)
  auxiliary space — it copies subarrays on every merge (`left`/`right` slices
  in `merge()`). Good when worst-case time matters more than memory.
- **Quick Sort** is in-place (O(log n) space, recursion stack only) and
  faster in practice due to better cache locality, but degrades to O(n²) on
  already-sorted or reverse-sorted input with a naive last-element pivot.
  **Try feeding it `[1,2,...,30]`** in the visualizer — you'll see it thrash
  through nearly every element instead of dividing evenly, which is exactly
  the worst-case behavior textbooks describe.

This is a real engineering choice, not just an academic footnote: systems
that sort user-supplied or already-partially-sorted data (e.g. re-sorting a
list after a small update) sometimes prefer Merge Sort's guaranteed bound
over Quick Sort's better average case, precisely to avoid this failure mode.

## Trade-off: BFS vs. DFS for pathfinding

- **BFS** explores level-by-level using a queue, which guarantees the
  shortest path on an unweighted grid — at the cost of higher memory use,
  since it holds an entire "frontier" of nodes at once.
- **DFS** explores as deep as possible before backtracking, using a stack.
  It's more memory-efficient in sparse graphs but gives **no shortest-path
  guarantee** — try drawing a maze with a long winding wall and compare the
  two: DFS may find a much longer path even though a short one exists.

This maps to a real production trade-off: BFS-style breadth-first exploration
is preferred when correctness (shortest path) matters, e.g. routing or
network-latency-sensitive paths; DFS-style exploration is preferred when
memory is constrained and any valid path will do, e.g. exhaustive search in
constraint-satisfaction problems.

## What I'd change for a production version

- Merge Sort's repeated array slicing (`array.slice(start, mid)`) is fine for
  visualization clarity but wasteful for large inputs — a production
  implementation would sort into a single pre-allocated auxiliary array
  instead of allocating new slices on every merge call.
- The pathfinding grid uses unweighted edges (BFS/DFS). A natural extension
  is Dijkstra's algorithm or A* with weighted cells (e.g. "swamp" tiles
  costing more to cross) — same generator pattern, just a priority queue
  instead of a plain queue/stack.
