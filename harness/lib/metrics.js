/**
 * @typedef {Object} ScenarioCheck
 * @property {string} id
 * @property {boolean} passed
 * @property {string} message
 */

/**
 * @typedef {Object} RunResult
 * @property {number} runNumber
 * @property {ScenarioCheck[]} results
 */

/**
 * @typedef {Object} Metrics
 * @property {Object} summary
 * @property {number} summary.unguidedMedian
 * @property {number} summary.guidedMedian
 * @property {number} summary.unguidedPassRate
 * @property {number} summary.guidedPassRate
 * @property {number} summary.unguidedPassed
 * @property {number} summary.unguidedTotal
 * @property {number} summary.guidedPassed
 * @property {number} summary.guidedTotal
 * @property {number} summary.numRuns
 * @property {Record<string, { median: number, rates: number[] }>} testPassRates
 * @property {string[]} sortedKeys
 */

/**
 * @param {Record<string, RunResult[]>} allResults
 * @param {number} numRuns
 * @returns {Metrics}
 */
export function calculateMetrics(allResults, numRuns) {
  /** @type {Record<string, number>} */
  const scenarioOrder = { 'greenfield': 1, 'brownfield': 2, 'redfield': 3 };
  /** @type {Record<string, number>} */
  const promptOrder = { 'vague': 1, 'specific': 2 };
  /** @type {Record<string, number>} */
  const agentOrder = { 'unguided': 1, 'guided': 2 };

  const sortedKeys = Object.keys(allResults).sort((a, b) => {
    const [scenA, promptA, agentA] = a.split(' - ');
    const [scenB, promptB, agentB] = b.split(' - ');

    if (scenA !== scenB) {
      return (scenarioOrder[scenA] || 99) - (scenarioOrder[scenB] || 99);
    }
    if (promptA !== promptB) {
      return (promptOrder[promptA] || 99) - (promptOrder[promptB] || 99);
    }
    return (agentOrder[agentA] || 99) - (agentOrder[agentB] || 99);
  });

  /** @type {Record<string, any>} */
  const testPassRates = {};
  for (const name of sortedKeys) {
    const runs = allResults[name];
    const passRates = runs.map((/** @type {any} */ run) => {
      const checks = run.results;
      const passCount = checks.filter((/** @type {any} */ c) => c.passed).length;
      const totalCount = checks.length;
      return totalCount > 0 ? (passCount / totalCount) * 100 : 0;
    }).sort((/** @type {number} */ a, /** @type {number} */ b) => a - b);
    
    // Calculate median
    const mid = Math.floor(passRates.length / 2);
    const median = passRates.length % 2 === 0 
      ? (passRates[mid - 1] + passRates[mid]) / 2 
      : passRates[mid];
    
    testPassRates[name] = {
      median: Math.round(median),
      rates: passRates.map((/** @type {number} */ r) => Math.round(r))
    };
  }

  // Calculate overall statistics (Median)
  let guidedMedians = [];
  let unguidedMedians = [];
  
  for (const [name, stats] of Object.entries(testPassRates)) {
    if (name.includes(' - guided')) {
      guidedMedians.push(stats.median);
    }
    if (name.includes(' - unguided')) {
      unguidedMedians.push(stats.median);
    }
  }

  /** @param {number[]} arr */
  const calculateMedianFunc = (arr) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  };

  const unguidedMedian = Math.round(calculateMedianFunc(unguidedMedians));
  const guidedMedian = Math.round(calculateMedianFunc(guidedMedians));

  // Calculate total pass rates (Weighted/True Average)
  let unguidedPassed = 0;
  let unguidedTotal = 0;
  let guidedPassed = 0;
  let guidedTotal = 0;

  for (const name of sortedKeys) {
    const runs = allResults[name];
    runs.forEach((/** @type {any} */ run) => {
      const checks = run.results;
      const passCount = checks.filter((/** @type {any} */ c) => c.passed).length;
      const totalCount = checks.length;

      if (name.includes(' - unguided')) {
        unguidedPassed += passCount;
        unguidedTotal += totalCount;
      } else if (name.includes(' - guided')) {
        guidedPassed += passCount;
        guidedTotal += totalCount;
      }
    });
  }

  const unguidedRate = unguidedTotal > 0 ? Math.round((unguidedPassed / unguidedTotal) * 100) : 0;
  const guidedRate = guidedTotal > 0 ? Math.round((guidedPassed / guidedTotal) * 100) : 0;

  return {
    summary: {
      unguidedMedian,
      guidedMedian,
      unguidedPassRate: unguidedRate,
      guidedPassRate: guidedRate,
      unguidedPassed,
      unguidedTotal,
      guidedPassed,
      guidedTotal,
      numRuns
    },
    testPassRates,
    sortedKeys
  };
}
