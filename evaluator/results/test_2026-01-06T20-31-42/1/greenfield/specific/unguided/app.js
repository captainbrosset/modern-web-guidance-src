document.addEventListener('DOMContentLoaded', () => {
    initAdaptiveLoading();
    initPopoverHover();
});

function initAdaptiveLoading() {
    const heroImg = document.getElementById('hero-img');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
        // If user is on slow connection (2g, 3g) or has Data Saver enabled
        if (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g') {
            console.log('Slow connection detected. Loading placeholder.');
            // Ideally we would load a smaller image here.
            // Since we generated only one image, let's simulate this by applying a blur 
            // and maybe preventing high-res load if we had an alternative.
            // For this demo, we'll add a class to style it differently or log it.
            heroImg.classList.add('low-bandwidth');
            // Example: heroImg.src = 'hero-small.jpg';
        } else {
            console.log('Fast connection detected. Loading high-res image.');
            // heroImg.src = 'hero-highres.jpg';
        }
    }
}

function initPopoverHover() {
    const btn = document.getElementById('details-btn');
    const popover = document.getElementById('ingredients-popover');
    let timeout;

    if (!btn || !popover) return;

    // Show on enter
    btn.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        try {
            popover.showPopover();
        } catch (e) {
            // Already open or not supported
        }
    });

    // Hide on leave, but give a grace period to move to the popover
    btn.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            try {
                popover.hidePopover();
            } catch (e) {
                // Already hidden
            }
        }, 300);
    });

    // Keep open if hovering the popover itself
    popover.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
    });

    popover.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            try {
                popover.hidePopover();
            } catch (e) {
                // Already hidden
            }
        }, 300);
    });
}
