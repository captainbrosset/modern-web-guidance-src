/**
 * Adaptive Loading Polyfill
 * Implements loading-placeholder logic based on Network Information API.
 */
(function() {
  if ('loadingPlaceholder' in HTMLImageElement.prototype) {
    return; // Native support
  }

  function applyAdaptiveLoading() {
    const images = document.querySelectorAll('img[loading-placeholder]');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return; // Network Info API not supported, use default (high-res)
    
    // Effective Connection Type: slow-2g, 2g, 3g, 4g
    const isSlow = ['slow-2g', '2g', '3g'].includes(connection.effectiveType) || connection.saveData;

    if (isSlow) {
      images.forEach(img => {
        const placeholder = img.getAttribute('loading-placeholder');
        if (placeholder) {
          // Store original src just in case
          img.dataset.originalSrc = img.src;
          img.src = placeholder;
          console.log(`[Adaptive Loading] Swapped ${img.dataset.originalSrc} for ${placeholder} due to ${connection.effectiveType} connection.`);
        }
      });
    }
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAdaptiveLoading);
  } else {
    applyAdaptiveLoading();
  }
})();
