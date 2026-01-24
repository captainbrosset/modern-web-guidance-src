// Feature Detection and Polyfill Loading

(async () => {
    // 1. Popover API
    if (!HTMLElement.prototype.hasOwnProperty("popover")) {
        console.log("Polyfilling Popover API...");
        await import('../lib/popover.min.js');
    }

    // 2. Interest Invokers (interestfor)
    if (!HTMLButtonElement.prototype.hasOwnProperty("interestForElement")) {
        console.log("Polyfilling Interest Invokers...");
        await import('../lib/interestfor.min.js');
    }

    // 3. CSS Anchor Positioning
    // Simple check for the CSS object or supports
    if (!('positionAnchor' in document.documentElement.style) && !CSS.supports('position-anchor: --foo')) {
        console.log("Polyfilling CSS Anchor Positioning...");
        await import('../lib/css-anchor-positioning.js');
    }
})();
