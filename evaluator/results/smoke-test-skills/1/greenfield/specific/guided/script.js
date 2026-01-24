/**
 * Script for Espresso Emporium
 * Handles Adaptive Loading and Popover Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initAdaptiveLoading();
    initPopoverHover();
});

/**
 * Initialize Adaptive Loading
 * Checks network connection and swaps image source if needed.
 */
function initAdaptiveLoading() {
    const heroImg = document.getElementById('hero-img');
    if (!heroImg) return;

    // Default high-res image
    const highResUrl = heroImg.getAttribute('src');
    // Placeholder/Low-res image
    const placeholderUrl = heroImg.getAttribute('loading-placeholder');

    if ('connection' in navigator) {
        const connection = navigator.connection;
        // Check if user is on slow connection (save-data mode or 3g/2g)
        const isSlow = connection.saveData || 
                       connection.effectiveType === '2g' || 
                       connection.effectiveType === '3g';

        if (isSlow && placeholderUrl) {
            console.log(`[Adaptive Loading] Slow connection detected (${connection.effectiveType}). Using placeholder.`);
            heroImg.src = placeholderUrl;
        } else {
            console.log(`[Adaptive Loading] Fast connection detected (${connection.effectiveType}). Using high-res.`);
            // Ensure high-res is set (it's already in src, but good for clarity)
            heroImg.src = highResUrl;
        }
    }
}

/**
 * Initialize Popover Hover Behavior
 * Native popover API is click-based for accessibility, but prompt requested hover.
 * We will use mouseenter/mouseleave to trigger showPopover/hidePopover.
 */
function initPopoverHover() {
    const detailsBtn = document.getElementById('details-btn');
    const popover = document.getElementById('ingredients-popover');

    if (!detailsBtn || !popover) return;

    // Show on enter
    detailsBtn.addEventListener('mouseenter', () => {
        try {
            // Check if already open to avoid errors/flicker
            if (!popover.matches(':popover-open')) {
                popover.showPopover();
                // Position it manually if we wanted, but for now let's trust basic CSS centering or default.
                // Since it's "non-modal", it shouldn't block interaction, but native popover 'auto' does light dismiss.
                // We might want 'manual' for a pure tooltip feel, but 'auto' is fine if we manage it.
                // Let's keep it simple: show on hover.
            }
        } catch (e) {
            console.warn('Popover API not fully supported or error:', e);
        }
    });

    // Hide on leave
    detailsBtn.addEventListener('mouseleave', () => {
        try {
            if (popover.matches(':popover-open')) {
                popover.hidePopover();
            }
        } catch (e) {
            // Ignore
        }
    });
    
    // Also handle keyboard focus for accessibility if we want strictly hover-like behavior behavior?
    // Usually hover = focus too for a11y.
    detailsBtn.addEventListener('focus', () => {
        try {
            popover.showPopover();
        } catch(e) {}
    });
    
    detailsBtn.addEventListener('blur', () => {
        try {
            popover.hidePopover();
        } catch(e) {}
    });
}
