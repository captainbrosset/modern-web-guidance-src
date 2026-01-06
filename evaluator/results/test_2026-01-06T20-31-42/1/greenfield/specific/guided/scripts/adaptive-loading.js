/**
 * Adaptive Loading Polyfill/Helper
 * 
 * Checks for NetworkInformation API and swaps src with loading-placeholder
 * if the connection is effectiveType '3g', '2g', or 'slow-2g', or if saveData is true.
 */

(function() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  function isSlowConnection() {
    if (!connection) return false;
    if (connection.saveData) return true;
    const effectiveType = connection.effectiveType;
    return effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g';
  }

  function applyAdaptiveLoading() {
    if (!isSlowConnection()) return;

    const images = document.querySelectorAll('img[loading-placeholder]');
    images.forEach(img => {
      const placeholder = img.getAttribute('loading-placeholder');
      if (placeholder) {
        // Store original src in case we want to lazy load it later or similar
        img.dataset.originalSrc = img.src;
        img.src = placeholder;
        console.log(`[Adaptive Loading] Swapped ${img.dataset.originalSrc} for ${placeholder} due to slow connection.`);
      }
    });

    const sources = document.querySelectorAll('source[loading-placeholder]');
    sources.forEach(source => {
        const placeholder = source.getAttribute('loading-placeholder');
        if (placeholder) {
            source.dataset.originalSrc = source.srcset;
            source.srcset = placeholder;
            console.log(`[Adaptive Loading] Swapped source ${source.dataset.originalSrc} for ${placeholder} due to slow connection.`);
        }
    });
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAdaptiveLoading);
  } else {
    applyAdaptiveLoading();
  }
})();
