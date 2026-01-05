const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

module.exports = function checkGreenfield(dirPath, files) {
  const results = [];

  // 1. Load HTML
  const htmlFile = files.find(f => f.endsWith('.html'));
  if (!htmlFile) {
    results.push({ id: 'html-exists', passed: false, message: 'No HTML file found' });
    return results;
  }

  const htmlContent = fs.readFileSync(path.join(dirPath, htmlFile), 'utf8');
  const $ = cheerio.load(htmlContent);

  // 2. Check loading-placeholder
  const imgWithPlaceholder = $('img[loading-placeholder]');
  results.push({
    id: 'img-loading-placeholder',
    passed: imgWithPlaceholder.length > 0,
    message: 'Found img with loading-placeholder attribute'
  });

  // 3. Check interestfor (not interesttarget)
  const buttonInterestFor = $('button[interestfor]');
  const buttonInterestTarget = $('button[interesttarget]');

  results.push({
    id: 'button-interestfor',
    passed: buttonInterestFor.length > 0,
    message: 'Found button with interestfor attribute'
  });

  if (buttonInterestTarget.length > 0) {
    results.push({
      id: 'no-interesttarget',
      passed: false,
      message: 'Found deprecated interesttarget attribute (should be interestfor)'
    });
  }

  // 4. Check JS Polyfills
  const jsFiles = files.filter(f => f.endsWith('.js'));
  let interestForPolyfillFound = false;
  let loadingPlaceholderPolyfillFound = false;

  const checkContent = (content) => {
    // Check for interestfor polyfill / feature detection
    // Match: .hasOwnProperty('interestForElement') or "interestForElement" with flexible quotes/spacing
    if (/\.hasOwnProperty\(\s*["']interestForElement["']\s*\)/.test(content)) {
      interestForPolyfillFound = true;
    }

    // Check for loading-placeholder manual handling (simplified check for logic)
    // Look for generic pattern: reading the attribute and doing something
    if (content.includes('getAttribute("loading-placeholder")') || content.includes("getAttribute('loading-placeholder')")) {
      loadingPlaceholderPolyfillFound = true;
    }
  };

  jsFiles.forEach(file => {
    const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
    checkContent(content);
  });

  // Check inline scripts too
  $('script').each((i, el) => {
    const content = $(el).html();
    if (content && content.trim()) {
      checkContent(content);
    }
  });

  results.push({
    id: 'js-interestfor-polyfill',
    passed: interestForPolyfillFound,
    message: 'JS contains interestfor feature detection (hasOwnProperty("interestForElement"))'
  });

  results.push({
    id: 'js-loading-placeholder-support',
    passed: loadingPlaceholderPolyfillFound,
    message: 'JS handles loading-placeholder manually'
  });

  // 5. Check CSS Features
  const cssFiles = files.filter(f => f.endsWith('.css'));
  let viewTimelineFound = false;
  let reducedMotionFound = false;

  cssFiles.forEach(file => {
    const content = fs.readFileSync(path.join(dirPath, file), 'utf8');

    if (content.includes('animation-timeline: view()') || content.includes('animation-timeline:view()')) {
      viewTimelineFound = true;
    }

    if (content.includes('@media (prefers-reduced-motion')) {
      reducedMotionFound = true;
    }
  });

  results.push({
    id: 'css-view-timeline',
    passed: viewTimelineFound,
    message: 'CSS uses animation-timeline: view()'
  });

  results.push({
    id: 'css-reduced-motion',
    passed: reducedMotionFound,
    message: 'CSS respects prefers-reduced-motion'
  });

  return results;
};
