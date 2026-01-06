/**
 * Nebula Coffee - App Logic & Feature Detection
 */

// Feature detection and polyfill loading helper
const loadPolyfill = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

(async () => {
  console.log('Nebula Coffee: Initializing...');

  // 1. Check for Popover API
  if (!HTMLElement.prototype.hasOwnProperty('popover')) {
    console.warn('Popover API not supported, loading polyfill...');
    try {
      await loadPolyfill('https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js');
      console.log('Popover polyfill loaded.');
    } catch (e) {
      console.error('Failed to load popover polyfill', e);
    }
  } else {
    console.log('Popover API supported natively.');
  }

  // 2. Check for Interest Invokers (interestfor)
  if (!HTMLButtonElement.prototype.hasOwnProperty('interestForElement')) {
    console.warn('Interest Invokers not supported, loading polyfill...');
    try {
      // Note: This URL is illustrative based on the prompt's best practices. 
      // If it fails, we might need a backup or local implementation.
      await loadPolyfill('https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js');
      console.log('Interest Invokers polyfill loaded.');
    } catch (e) {
      console.error('Failed to load Interest Invokers polyfill', e);
    }
  } else {
    console.log('Interest Invokers supported natively.');
  }

  // 3. Check for Anchor Positioning (CSS)
  // Basic JS check
  if (!('positionAnchor' in document.documentElement.style)) {
     console.warn('CSS Anchor Positioning not supported, loading polyfill...');
     try {
       await loadPolyfill('https://unpkg.com/@oddbird/css-anchor-positioning@0.8.0/dist/css-anchor-positioning.js');
       console.log('Anchor Positioning polyfill loaded.');
     } catch (e) {
       console.error('Failed to load Anchor Positioning polyfill', e);
     }
  } else {
    console.log('CSS Anchor Positioning supported natively.');
  }

  // 4. Adaptive Loading Placeholder
  // This is a very new/experimental feature. If not supported, we can manually implement a fallback
  // or just let it fail gracefully (it will just ignore the attribute).
  // However, for "Adaptive Loading", we might want to manually swap the source if the network is slow
  // and native support is missing.
  
  if ('loadingPlaceholder' in HTMLImageElement.prototype) {
    console.log('Adaptive Loading (loading-placeholder) supported natively.');
  } else {
    console.log('Adaptive Loading not natively supported. Checking network status...');
    // Manual fallback logic for slow networks
    if (navigator.connection) {
      const { saveData, effectiveType } = navigator.connection;
      console.log(`Network status: ${effectiveType}, saveData: ${saveData}`);
      
      if (saveData || effectiveType === '2g' || effectiveType === '3g') {
        const images = document.querySelectorAll('img[loading-placeholder]');
        images.forEach(img => {
          const placeholder = img.getAttribute('loading-placeholder');
          if (placeholder) {
            console.log('Slow network detected. Swapping to placeholder:', placeholder);
            // We can set the src to the placeholder
            // But usually we want to keep the high-res one available if they want it?
            // For this demo, let's swap it.
            img.src = placeholder;
          }
        });
      }
    }
  }
})();
