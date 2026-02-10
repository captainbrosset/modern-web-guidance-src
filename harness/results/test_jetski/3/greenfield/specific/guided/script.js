/**
 * Adaptive Loading Logic
 * Switches the hero image source based on network connection type.
 */
function handleAdaptiveLoading() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  const highResSrc = heroImg.getAttribute('data-high-res');
  const lowResSrc = heroImg.getAttribute('data-low-res');

  if ('connection' in navigator) {
    const connection = navigator.connection;
    const effectiveType = connection.effectiveType;
    const saveData = connection.saveData;

    console.log(`Network status: ${effectiveType}, Save-Data: ${saveData}`);

    if (saveData || effectiveType === '2g' || effectiveType === '3g') {
      // Use low res image
      heroImg.src = lowResSrc;
      console.log('Serving low-resolution image');
    } else {
      // Use high res image
      heroImg.src = highResSrc;
      console.log('Serving high-resolution image');
    }
    
    // Listen for changes
    connection.addEventListener('change', handleAdaptiveLoading);
  } else {
    // Fallback to high res if API not supported
    heroImg.src = highResSrc;
  }
}

/**
 * Popover Hover Logic (Fallback/Polyfill-like behavior)
 * Although `interestfor` is the modern standard, browser support is limited.
 * We add a simple mouseover listener if needed, or rely on explicit support.
 * The `interestfor` attribute should handle this natively in supporting browsers.
 */
function setupPopover() {
  // Check if `interestForElement` is supported on buttons
  const isInterestSupported = 'interestForElement' in HTMLButtonElement.prototype;
  
  if (!isInterestSupported) {
    console.log('interestfor not supported natively, adding fallback listeners');
    const triggers = document.querySelectorAll('[interestfor]');
    
    triggers.forEach(trigger => {
      const popoverId = trigger.getAttribute('interestfor');
      const popover = document.getElementById(popoverId);
      
      if (popover) {
        trigger.addEventListener('mouseenter', () => {
          try {
            popover.showPopover();
          } catch(e) { 
            // popover API might not be supported either, but we focus on interestfor fallback
             console.error('Popover API not supported', e);
          }
        });
        
        trigger.addEventListener('mouseleave', () => {
             // Optional: hide on leave, though standard behavior might vary.
             // "hint" popovers usually close on mouse leave or focus out.
             try {
                popover.hidePopover();
             } catch(e) {}
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  handleAdaptiveLoading();
  setupPopover();
});
