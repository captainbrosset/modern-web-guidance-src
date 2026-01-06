
/**
 * Main JavaScript for Coffee Shop Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main JS loaded.');
  
  // 1. Adaptive Loading Implementation
  // Manual check because the polyfill URL was not reliable.
  if (!('loadingPlaceholder' in HTMLImageElement.prototype)) {
    handleAdaptiveLoading();
  }

  // 2. Log Support Status
  checkSupport();
});

function handleAdaptiveLoading() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = connection ? connection.effectiveType : '4g';
  const saveData = connection ? connection.saveData : false;

  console.log(`[Adaptive Loading] Effective Connection Type: ${effectiveType}, SaveData: ${saveData}`);

  // Determine if we should load the placeholder (Low Quality)
  // We treat '4g' as good, but '2g', '3g', or 'slow-2g' as poor.
  const isSlow = ['slow-2g', '2g', '3g'].includes(effectiveType) || saveData;

  // FOR DEMONSTRATION PURPOSES:
  // We will force 'isSlow' to true if the URL has ?slow=true
  // This allows manual verification without throttling devtools.
  const urlParams = new URLSearchParams(window.location.search);
  const forceSlow = urlParams.get('slow') === 'true';

  if (isSlow || forceSlow) {
    if (forceSlow) console.log('[Adaptive Loading] Forcing slow mode via URL parameter.');
    
    document.querySelectorAll('img[loading-placeholder]').forEach(img => {
      const originalSrc = img.src;
      const placeholderSrc = img.getAttribute('loading-placeholder');
      
      if (placeholderSrc) {
        console.log(`[Adaptive Loading] Swapping ${originalSrc} -> ${placeholderSrc}`);
        img.src = placeholderSrc;
      }
    });
  }
}

function checkSupport() {
  console.log('--- Feature Support ---');
  console.log('Popover:', HTMLElement.prototype.hasOwnProperty('popover') ? 'Supported (or Polyfilled)' : 'Not Supported');
  console.log('Interest For:', HTMLButtonElement.prototype.hasOwnProperty('interestForElement') || document.body.interestForElement !== undefined ? 'Supported (maybe)' : 'Not natively supported (Polyfill might attach strictly to elements)');
  console.log('Anchor Positioning:', window.CSS && CSS.supports('position-anchor: --foo') ? 'Supported' : 'Not natively supported (Polyfill handles via JS)');
  console.log('Animation Timeline:', window.CSS && CSS.supports('animation-timeline: view()') ? 'Supported' : 'Not Supported (Fallback opacity: 1)');
}
