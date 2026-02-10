// Feature detection and polyfill loading

async function loadPolyfills() {
    const polyfills = [];

    // Interest Invokers (Tooltip)
    if (!HTMLButtonElement.prototype.hasOwnProperty("interestForElement")) {
        console.log("Polyfilling Interest Invokers...");
        polyfills.push(import('./js/vendor/interestfor.min.js'));
    }

    // Popover API
    if (!HTMLElement.prototype.hasOwnProperty("popover")) {
        console.log("Polyfilling Popover API...");
        polyfills.push(import('./js/vendor/popover.min.js'));
    }

    // Adaptive Loading
    if (!('loadingPlaceholder' in HTMLImageElement.prototype)) {
        console.log("Polyfilling Adaptive Loading...");
        // This polyfill is a script, not a module, so we load it via script tag or just import it for side effects if it supports it.
        // The one we downloaded is a global script mostly.
        const script = document.createElement('script');
        script.src = 'js/vendor/adaptive-loading.min.js';
        document.head.appendChild(script);
    }

    await Promise.all(polyfills);
    console.log("Polyfills check complete.");
}

loadPolyfills();
