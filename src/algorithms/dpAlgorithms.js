// Each generator yields a snapshot of the DP table's state after each cell
// is computed. The generator has no idea it's being animated — it just
// yields { table, current, relation } after every step.

export function* fibonacciSteps(n) {
  const dp = new Array(n + 1).fill(null);
  dp[0] = 0;
  yield {
    table: [...dp],
    current: 0,
    relation: `dp[0] = 0 (base case)`,
  };

  if (n >= 1) {
    dp[1] = 1;
    yield {
      table: [...dp],
      current: 1,
      relation: `dp[1] = 1 (base case)`,
    };
  }

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    yield {
      table: [...dp],
      current: i,
      relation: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
      deps: [i - 1, i - 2],
    };
  }
}

export function* lcsSteps(strA, strB) {
  const m = strA.length;
  const n = strB.length;
  // dp[i][j] = length of LCS of strA[0..i) and strB[0..j)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  yield {
    table: dp.map((row) => [...row]),
    current: [0, 0],
    relation: `dp[0][j] = dp[i][0] = 0 (empty string base case)`,
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let relation;
      let deps;
      if (strA[i - 1] === strB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        relation = `'${strA[i - 1]}' matches '${strB[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`;
        deps = [[i - 1, j - 1]];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        relation = `'${strA[i - 1]}' ≠ '${strB[j - 1]}' → dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}`;
        deps = [
          [i - 1, j],
          [i, j - 1],
        ];
      }

      yield {
        table: dp.map((row) => [...row]),
        current: [i, j],
        relation,
        deps,
      };
    }
  }

  return dp[m][n]; // final LCS length
}
