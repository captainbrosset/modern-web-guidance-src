/**
 * Progressive Image Loading
 */
const heroImg = document.getElementById('hero-img');

function loadHighResImage() {
    const fullSrc = heroImg.dataset.fullSrc;
    if (!fullSrc) return;

    // Create a new image to preload the high-res version
    const tempImg = new Image();
    tempImg.src = fullSrc;
    
    tempImg.onload = () => {
        heroImg.src = fullSrc;
        heroImg.classList.add('loaded');
        // Remove the blurry class if we used one, mostly relied on CSS transition on filter
    };
}

// Initial state is already inline low-quality, so we just trigger high-res load
if (heroImg.complete) {
    loadHighResImage();
} else {
    heroImg.onload = loadHighResImage;
}

/**
 * Polyfill Loader for Modern Features
 */
async function loadPolyfillsIfNeeded() {
    // 1. Interest Invokers (for Hover capability on buttons)
    if (!HTMLButtonElement.prototype.hasOwnProperty("interestForElement")) {
        console.log("Loading interest-invoker polyfill...");
        const script = document.createElement('script');
        script.src = "https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js";
        script.type = "module";
        document.body.appendChild(script);
    }

    // 2. CSS Anchor Positioning
    // Check if browser supports 'position-anchor' in CSS or JS API
    const supportsAnchor = CSS.supports("position-anchor: --foo");
    if (!supportsAnchor) {
        console.log("Loading css-anchor-positioning polyfill...");
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@oddbird/css-anchor-positioning@0.8.0/dist/css-anchor-positioning.js";
        script.type = "module";
        document.body.appendChild(script);
    }
    
    // 3. Popover API (Already widely supported, but good safety net)
    if (!HTMLElement.prototype.hasOwnProperty("popover")) {
         console.log("Loading popover polyfill...");
         const script = document.createElement('script');
         script.src = "https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js";
         script.type = "module";
         document.body.appendChild(script);
    }
}

loadPolyfillsIfNeeded();
