/**
 * scripts.js
 * Handles polyfills and fallback logic for:
 * 1. Adaptive Loading (Network-aware image loading)
 * 2. Interest Invokers ('interestfor' pattern for tooltips)
 * 3. Popover API (fallback for older browsers)
 */

// --- 1. Adaptive Loading Implementation ---
(function initAdaptiveLoading() {
    console.log("Initializing Adaptive Loading check...");
    
    // Check if network is slow
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let isSlow = false;
    
    if (connection) {
        // saveData is true OR effectiveType is slow (2g/3g)
        isSlow = connection.saveData === true || 
                 (connection.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType));
        
        console.log(`Network status: ${connection.effectiveType}, SaveData: ${connection.saveData}, IsSlow: ${isSlow}`);
    }
    
    // For demonstration, we can force simulate slow network if URL param ?slow=true exists
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('slow') === 'true') {
        isSlow = true;
        console.log("Simulating slow network via URL param");
    }

    if (isSlow) {
        document.querySelectorAll('img[loading-placeholder]').forEach(img => {
            const placeholder = img.getAttribute('loading-placeholder');
            if (placeholder) {
                console.log(`Swapping image for placeholder: ${placeholder}`);
                // Swap src
                img.src = placeholder;
                img.classList.add('preview');
                
                // Optional: Provide a way to load the original
                // img.onclick = () => { img.src = img.getAttribute('data-original-src'); img.classList.remove('preview'); }
            }
        });
    }
})();

// --- 2. Interest Invokers Polyfill ---
(function loadInterestPolyfill() {
    // Check if browser supports interestForElement (Interest Invokers API)
    if (!HTMLButtonElement.prototype.hasOwnProperty("interestForElement") && !document.body.dataset.interestPolyfillLoaded) {
        console.log("Interest Invokers not supported natively. Loading polyfill...");
        const script = document.createElement('script');
        // Using the unpkg URL from the skill (or a known working implementation/mirror)
        script.src = "https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js"; 
        script.type = "module";
        script.onload = () => {
            console.log("Interest Invokers polyfill loaded.");
            document.body.dataset.interestPolyfillLoaded = "true";
        };
        script.onerror = () => console.error("Failed to load Interest Invokers polyfill.");
        document.head.appendChild(script);
    } else {
        console.log("Interest Invokers supported natively.");
    }
})();

// --- 3. Popover Polyfill ---
(function loadPopoverPolyfill() {
    // Check if browser supports Popover API
    if (!HTMLElement.prototype.hasOwnProperty("popover") && !document.body.dataset.popoverPolyfillLoaded) {
        console.log("Popover API not supported natively. Loading polyfill...");
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js";
        script.onload = () => {
            console.log("Popover polyfill loaded.");
            document.body.dataset.popoverPolyfillLoaded = "true";
        };
        document.head.appendChild(script);
    } else {
        console.log("Popover API supported natively.");
    }
})();
