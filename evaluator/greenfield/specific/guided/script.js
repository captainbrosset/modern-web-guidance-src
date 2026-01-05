/**
 * Aura Brew Scripts
 */

// Adaptive Loading
function initAdaptiveLoading() {
    // Check for Network Information API support
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const heroImg = document.getElementById('hero-img');
    
    if (!heroImg) return;

    const highResSrc = heroImg.getAttribute('src');
    const lowResSrc = heroImg.getAttribute('loading-placeholder');

    if (connection) {
        // If Save-Data is on OR connection is slow (2g/3g)
        if (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g') {
            console.log('Adaptive Loading: using low-res placeholder due to network conditions.');
            if (lowResSrc) {
                heroImg.src = lowResSrc;
            }
        } else {
            // Ensure high-res is used
             console.log('Adaptive Loading: using high-res image.');
            heroImg.src = highResSrc;
        }
    } else {
        // Fallback for no API support - usually assume high-res is fine, or simple lazy loading.
        // Or we could check for low bandwidth via other means, but for now we stick to high-res default.
        console.log('Network Information API not supported. Using default source.');
    }
}

// Popover Hover Behavior (Mocking 'interestfor' if not natively supported for hover)
function initPopoverHover() {
    const trigger = document.getElementById('details-btn');
    const popover = document.getElementById('ingredients-popover');
    
    if (!trigger || !popover) return;

    // Browser support check for 'interestfor' is tricky as it's experimental.
    // We will just add manual mouse listeners to ensure the "hover" requirement is met 
    // regardless of native support, as 'interestfor' is NOT widely supported yet.
    
    trigger.addEventListener('mouseenter', () => {
        try {
            popover.showPopover();
        } catch (e) {
            // Fallback or ignore if already open/not supported
        }
    });

    trigger.addEventListener('mouseleave', () => {
        try {
            popover.hidePopover();
        } catch (e) {
            // Fallback
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initAdaptiveLoading();
    initPopoverHover();
});
