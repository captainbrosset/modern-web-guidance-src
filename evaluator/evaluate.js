const glob = require('glob');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

const checkGreenfield = require('./checks/greenfield');
const checkBrownfield = require('./checks/brownfield');
const checkRedfield = require('./checks/redfield');

async function main() {
  console.log('Starting Static Evaluation...'.cyan.bold);

  // Find all test run directories
  const testRunsDir = 'test_runs';
  if (!fs.existsSync(testRunsDir)) {
    console.error('test_runs directory not found!'.red);
    return;
  }

  const runDirs = fs.readdirSync(testRunsDir)
    .filter(name => {
      const fullPath = path.join(testRunsDir, name);
      return fs.statSync(fullPath).isDirectory();
    })
    .sort((a, b) => parseInt(a) - parseInt(b));

  if (runDirs.length === 0) {
    console.error('No test runs found in test_runs directory!'.red);
    return;
  }

  console.log(`Found ${runDirs.length} test run(s)`.cyan);

  // Store results by test name, with each run's results
  const allResults = {};

  for (const runDir of runDirs) {
    console.log(`\n${'='.repeat(60)}`.cyan);
    console.log(`Evaluating Run ${runDir}`.cyan.bold);
    console.log(`${'='.repeat(60)}`.cyan);

    const runPath = path.join(testRunsDir, runDir);
    
    // Find all leaf directories with an index.html or just strict structure
    // Structure: test_runs/{runNumber}/{scenario}/{type}/{agent}
    const directories = glob.sync('*/*/*/', {
      cwd: runPath,
      absolute: true
    });

    for (const dir of directories) {
      const relPath = path.relative(runPath, dir);
      const parts = relPath.split(path.sep);

      if (parts.length < 3) continue;

      const [scenario, promptType, agentType] = parts;
      const testName = `${scenario} - ${promptType} - ${agentType}`;

      console.log(`Evaluating: ${testName}`.yellow);

      const files = fs.readdirSync(dir);

      let scenarioResults = [];

      if (scenario === 'greenfield') {
        scenarioResults = checkGreenfield(dir, files);
      } else if (scenario === 'brownfield') {
        scenarioResults = checkBrownfield(dir, files);
      } else if (scenario === 'redfield') {
        scenarioResults = checkRedfield(dir, files);
      } else {
        console.log(`Unknown scenario type: ${scenario}`.red);
        continue;
      }

      if (!allResults[testName]) {
        allResults[testName] = [];
      }
      allResults[testName].push({
        runNumber: parseInt(runDir),
        results: scenarioResults
      });
    }
  }

  generateReport(allResults, runDirs.length);
}

function generateReport(allResults, numRuns) {
  let md = '# Evaluation Results\n\n';

  const scenarioOrder = { 'greenfield': 1, 'brownfield': 2, 'redfield': 3 };
  const promptOrder = { 'vague': 1, 'specific': 2 };
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

  // Calculate pass rates for each test across all runs
  const testPassRates = {};
  for (const name of sortedKeys) {
    const runs = allResults[name];
    const passRates = runs.map(run => {
      const checks = run.results;
      const passCount = checks.filter(c => c.passed).length;
      const totalCount = checks.length;
      return totalCount > 0 ? (passCount / totalCount) * 100 : 0;
    }).sort((a, b) => a - b);
    
    // Calculate median
    const mid = Math.floor(passRates.length / 2);
    const median = passRates.length % 2 === 0 
      ? (passRates[mid - 1] + passRates[mid]) / 2 
      : passRates[mid];
    
    testPassRates[name] = {
      median: Math.round(median),
      rates: passRates.map(r => Math.round(r))
    };
  }

  // Calculate overall statistics
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

  const calculateMedian = (arr) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  };

  const unguidedMedian = Math.round(calculateMedian(unguidedMedians));
  const guidedMedian = Math.round(calculateMedian(guidedMedians));

  const summary = `
| Group | Median Pass Rate | Test Runs |
|---|---|---|
| **Unguided** | ${unguidedMedian}% | ${numRuns} |
| **Guided** | ${guidedMedian}% | ${numRuns} |

`;

  md += summary;

  // Generate detailed sections for each test
  for (const name of sortedKeys) {
    const runs = allResults[name];
    const stats = testPassRates[name];
    
    md += `## ${name.toUpperCase()} (Median: ${stats.median}%)\n\n`;
    md += `**Pass rates across runs:** ${stats.rates.join('%, ')}%\n\n`;

    // Show the median run's detailed results
    const medianRunIndex = runs.findIndex(run => {
      const checks = run.results;
      const passCount = checks.filter(c => c.passed).length;
      const totalCount = checks.length;
      const rate = Math.round((passCount / totalCount) * 100);
      return rate === stats.median;
    });

    const displayRun = medianRunIndex >= 0 ? runs[medianRunIndex] : runs[0];
    const checks = displayRun.results;
    const groupPass = checks.filter(c => c.passed).length;
    const groupTotal = checks.length;

    md += `### Run ${displayRun.runNumber} Details (${groupPass}/${groupTotal})\n\n`;

    const tableHeader = '| Status | Expectation |\n|---|---|\n';
    let tableRows = '';

    checks.forEach(check => {
      const symbol = check.passed ? '✅' : '❌';
      const safeMessage = check.message.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
      tableRows += `| ${symbol} | ${safeMessage} |\n`;
    });

    md += tableHeader + tableRows + '\n';
  }

  fs.writeFileSync('evaluation_results.md', md);
  console.log(`\nReport generated: ${path.resolve('evaluation_results.md')}`.green.bold);
  console.log(`Median Pass Rate - Unguided: ${unguidedMedian}%, Guided: ${guidedMedian}%`.cyan);

  const jsonOutput = {
    summary: {
      unguidedMedian,
      guidedMedian,
      numRuns
    },
    results: allResults,
    stats: testPassRates
  };

  fs.writeFileSync('evaluation_results.json', JSON.stringify(jsonOutput, null, 2));
  console.log(`JSON Report generated: ${path.resolve('evaluation_results.json')}`.green.bold);
}

main().catch(console.error);
