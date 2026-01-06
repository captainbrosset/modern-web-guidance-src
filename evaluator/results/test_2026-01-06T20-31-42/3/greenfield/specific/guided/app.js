
// Feature Detection and Polyfill Loading
(async () => {
  const polyfills = [];

  // 1. Interest Invokers (for 'interestfor')
  if (!HTMLButtonElement.prototype.hasOwnProperty("interestForElement")) {
    console.log("Polyfilling Interest Invokers...");
    polyfills.push(import("https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js"));
  }

  // 2. Popover API (Baseline 2024, generally widely supported now, but safety first)
  if (!HTMLElement.prototype.hasOwnProperty("popover")) {
     console.log("Polyfilling Popover API...");
     polyfills.push(import("https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js"));
  }

  // 3. CSS Anchor Positioning
  if (!CSS.supports("position-anchor: --foo")) {
    console.log("Polyfilling Anchor Positioning...");
    polyfills.push(import("https://unpkg.com/@oddbird/css-anchor-positioning@0.8.0/dist/css-anchor-positioning.js"));
  }

  // 4. Adaptive Loading
  if (!('loadingPlaceholder' in HTMLImageElement.prototype)) {
    console.log("Polyfilling Adaptive Loading...");
    polyfills.push(import("http://example.github.io/adaptive-loading-polyfill/adaptive-loading.min.js"));
  }

  await Promise.all(polyfills);
  console.log("All required polyfills loaded.");
})();

// console logging for verification
console.log("App script loaded.");
