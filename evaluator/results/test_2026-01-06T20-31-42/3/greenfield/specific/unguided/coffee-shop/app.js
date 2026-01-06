/**
 * App Logic
 * 1. Adaptive Loading for Hero Image
 * 2. Hover behavior for Popover Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
    initAdaptiveLoading();
    initPopoverHover();
});

function initAdaptiveLoading() {
    const heroImg = document.getElementById('hero-img');
    if (!heroImg) return;

    // Default high-res image
    const highResUrl = 'hero.svg';
    const placeholderUrl = 'placeholder.svg';

    let isSlow = false;

    // Check Network Information API
    if (navigator.connection) {
        const conn = navigator.connection;
        // Check for Save-Data mode or slow connection types
        if (conn.saveData === true || 
            conn.effectiveType === 'slow-2g' || 
            conn.effectiveType === '2g') {
            isSlow = true;
            console.log('Slow connection detected or Save-Data enabled. Loading placeholder.');
        } else {
            console.log('Fast connection detected. Loading high-res image.');
        }
    }

    // Set source based on connection
    heroImg.src = isSlow ? placeholderUrl : highResUrl;
}

function initPopoverHover() {
    const btn = document.getElementById('details-btn');
    const popover = document.getElementById('ingredients-popover');
    
    if (!btn || !popover) return;

    // Open on mouse enter
    btn.addEventListener('mouseenter', () => {
        try {
            // Check if already open to avoid specific errors (though showPopover is idempotent-ish usually, logic varies)
            // The API says explicitly that showPopover throws if already open, so we check or wrap in try/catch or use :popover-open check
             if (!popover.matches(':popover-open')) {
                popover.showPopover();
             }
        } catch (e) {
            console.warn('Could not show popover:', e);
        }
    });

    // Close on mouse leave
    // Optional: Add a small delay so user can move mouse TO the popover if needed?
    // Request didn't specify interaction with popover content, just "triggers... when a user hovers over it".
    // Usually hover triggers imply closing on hover out.
    // If we want the user to be able to select text in the popover, we should verify logic.
    // For now, simple mouseleave on the button closes it.
    
    // Better UX: wrapper container logic or timeout, 
    // but for "simple native features" demo, explicit hover on button is fine.
    // Let's make it so if they enter the POPOVER it stays open too.
    
    let closeTimeout;

    const show = () => {
        clearTimeout(closeTimeout);
        try {
             if (!popover.matches(':popover-open')) {
                popover.showPopover();
             }
        } catch(e) {}
    };

    const hide = () => {
        closeTimeout = setTimeout(() => {
             try {
                 if (popover.matches(':popover-open')) {
                    popover.hidePopover();
                 }
            } catch(e) {}
        }, 100); // Small grace period
    };

    btn.addEventListener('mouseenter', show);
    btn.addEventListener('mouseleave', hide);

    popover.addEventListener('mouseenter', show);
    popover.addEventListener('mouseleave', hide);
}
