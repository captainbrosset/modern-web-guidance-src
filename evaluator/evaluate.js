const glob = require('glob');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

const checkGreenfield = require('./checks/greenfield');
const checkBrownfield = require('./checks/brownfield');
const checkRedfield = require('./checks/redfield');

async function main() {
  console.log('Starting Static Evaluation...'.cyan.bold);

  // Find all leaf directories with an index.html or just strict structure
  // Structure: {scenario}/{type}/{agent}
  // e.g. greenfield/specific/guided
  const directories = glob.sync('*/*/*/', {
    absolute: true,
    ignore: 'node_modules/**'
  });

  const results = {};

  for (const dir of directories) {
    const relPath = path.relative(process.cwd(), dir);
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

    results[testName] = scenarioResults;
  }

  generateReport(results);
}

function generateReport(results) {
  let md = '# Evaluation Results\n\n';
  let totalPass = 0;
  let totalTests = 0;

  const scenarioOrder = { 'greenfield': 1, 'brownfield': 2, 'redfield': 3 };
  const promptOrder = { 'vague': 1, 'specific': 2 };
  const agentOrder = { 'unguided': 1, 'guided': 2 };

  const sortedKeys = Object.keys(results).sort((a, b) => {
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

  for (const name of sortedKeys) {
    const checks = results[name];
    const groupPass = checks.filter(c => c.passed).length;
    const groupTotal = checks.length;
    md += `## ${name.toUpperCase()} (${groupPass}/${groupTotal})\n\n`;

    // Sort checks by passed/failed for better readability
    const tableHeader = '| Status | Expectation |\n|---|---|\n';
    let tableRows = '';

    checks.forEach(check => {
      totalTests++;
      if (check.passed) totalPass++;

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

  const passRate = totalTests > 0 ? Math.round((totalPass / totalTests) * 100) : 0;
  let guidedPass = 0;
  let guidedTotal = 0;
  let unguidedPass = 0;
  let unguidedTotal = 0;

  for (const [name, checks] of Object.entries(results)) {
    const isGuided = name.includes(' - guided');
    const isUnguided = name.includes(' - unguided');

    checks.forEach(check => {
      if (isGuided) {
        guidedTotal++;
        if (check.passed) guidedPass++;
      }
      if (isUnguided) {
        unguidedTotal++;
        if (check.passed) unguidedPass++;
      }
    });
  }

  const guidedRate = guidedTotal > 0 ? Math.round((guidedPass / guidedTotal) * 100) : 0;
  const unguidedRate = unguidedTotal > 0 ? Math.round((unguidedPass / unguidedTotal) * 100) : 0;

  const summary = `
| Group | Passing | Total | Rate |
|---|---|---|---|
| **Unguided** | ${unguidedPass} | ${unguidedTotal} | ${unguidedRate}% |
| **Guided** | ${guidedPass} | ${guidedTotal} | ${guidedRate}% |

`;

  // Prepend summary
  md = '# Evaluation Results\n\n' + summary + md.substring('# Evaluation Results\n\n'.length);

  fs.writeFileSync('evaluation_results.md', md);
  console.log(`\nReport generated: ${path.resolve('evaluation_results.md')}`.green.bold);
  console.log(`Pass Rate: ${passRate}%`.cyan);
}

main().catch(console.error);
