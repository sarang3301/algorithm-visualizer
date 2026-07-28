/**
 * Each function is a generator that yields a "step" object after every
 * meaningful action (a comparison or a swap). The UI layer decides how fast
 * to consume these steps — the algorithm itself has no concept of timing.
 *
 * Step shape:
 * {
 *   array: number[],          // current state of the array
 *   comparing: [i, j] | null, // indices currently being compared
 *   swapped: boolean,         // whether this step was a swap
 *   sortedIndices: number[],  // indices confirmed to be in final position
 * }
 */

function makeStep(array, comparing, swapped, sortedIndices) {
  return {
    array: [...array],
    comparing,
    swapped,
    sortedIndices: [...sortedIndices],
  };
}

// ---------- Bubble Sort ----------
// Time: O(n^2) worst/avg, O(n) best (with early-exit optimization)
// Space: O(1)
export function* bubbleSort(input) {
  const array = [...input];
  const n = array.length;
  const sortedIndices = [];

  for (let i = 0; i < n - 1; i++) {
    let swappedThisPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      yield makeStep(array, [j, j + 1], false, sortedIndices);

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swappedThisPass = true;
        yield makeStep(array, [j, j + 1], true, sortedIndices);
      }
    }

    sortedIndices.push(n - i - 1);
    if (!swappedThisPass) break; // already sorted, exit early
  }

  yield makeStep(array, null, false, array.map((_, idx) => idx));
}

// ---------- Merge Sort ----------
// Time: O(n log n) all cases
// Space: O(n) — not in-place, needs auxiliary arrays
export function* mergeSort(input) {
  const array = [...input];

  function* mergeSortHelper(start, end) {
    if (end - start <= 1) return;

    const mid = Math.floor((start + end) / 2);
    yield* mergeSortHelper(start, mid);
    yield* mergeSortHelper(mid, end);
    yield* merge(start, mid, end);
  }

  function* merge(start, mid, end) {
    const left = array.slice(start, mid);
    const right = array.slice(mid, end);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      yield makeStep(array, [start + i, mid + j], false, []);

      if (left[i] <= right[j]) {
        array[k] = left[i];
        i++;
      } else {
        array[k] = right[j];
        j++;
      }
      yield makeStep(array, [k, k], true, []);
      k++;
    }

    while (i < left.length) {
      array[k] = left[i];
      yield makeStep(array, [k, k], true, []);
      i++; k++;
    }
    while (j < right.length) {
      array[k] = right[j];
      yield makeStep(array, [k, k], true, []);
      j++; k++;
    }
  }

  yield* mergeSortHelper(0, array.length);
  yield makeStep(array, null, false, array.map((_, idx) => idx));
}

// ---------- Quick Sort ----------
// Time: O(n log n) average, O(n^2) worst case (already-sorted input with
// naive pivot choice) — good one to show the "sorted array" preset with,
// to demonstrate the worst-case trade-off visually.
// Space: O(log n) average (recursion stack)
export function* quickSort(input) {
  const array = [...input];
  const sortedIndices = [];

  function* quickSortHelper(low, high) {
    if (low >= high) {
      if (low === high) sortedIndices.push(low);
      return;
    }

    const pivotIndex = yield* partition(low, high);
    sortedIndices.push(pivotIndex);
    yield* quickSortHelper(low, pivotIndex - 1);
    yield* quickSortHelper(pivotIndex + 1, high);
  }

  function* partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      yield makeStep(array, [j, high], false, sortedIndices);

      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        yield makeStep(array, [i, j], true, sortedIndices);
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    yield makeStep(array, [i + 1, high], true, sortedIndices);
    return i + 1;
  }

  yield* quickSortHelper(0, array.length - 1);
  yield makeStep(array, null, false, array.map((_, idx) => idx));
}

// ---------- Heap Sort ----------
// Time: O(n log n) all cases
// Space: O(1) — in-place, unlike merge sort
export function* heapSort(input) {
  const array = [...input];
  const n = array.length;
  const sortedIndices = [];

  function* heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      yield makeStep(array, [left, largest], false, sortedIndices);
      if (array[left] > array[largest]) largest = left;
    }
    if (right < size) {
      yield makeStep(array, [right, largest], false, sortedIndices);
      if (array[right] > array[largest]) largest = right;
    }

    if (largest !== root) {
      [array[root], array[largest]] = [array[largest], array[root]];
      yield makeStep(array, [root, largest], true, sortedIndices);
      yield* heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    sortedIndices.push(i);
    yield makeStep(array, [0, i], true, sortedIndices);
    yield* heapify(i, 0);
  }

  sortedIndices.push(0);
  yield makeStep(array, null, false, array.map((_, idx) => idx));
}

export const algorithms = {
  bubbleSort: { fn: bubbleSort, label: "Bubble Sort", complexity: "O(n²) avg/worst, O(n) best" },
  mergeSort: { fn: mergeSort, label: "Merge Sort", complexity: "O(n log n) all cases" },
  quickSort: { fn: quickSort, label: "Quick Sort", complexity: "O(n log n) avg, O(n²) worst" },
  heapSort: { fn: heapSort, label: "Heap Sort", complexity: "O(n log n) all cases" },
};
