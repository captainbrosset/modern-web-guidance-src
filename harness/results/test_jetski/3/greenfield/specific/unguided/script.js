document.addEventListener('DOMContentLoaded', () => {
    // 1. Popover Hover Logic
    const detailsBtn = document.getElementById('details-btn');
    const popover = document.getElementById('ingredients-popover');

    if (detailsBtn && popover) {
        // Show on hover
        detailsBtn.addEventListener('mouseenter', () => {
            try {
                // Check if already open to avoid error
                if (!popover.matches(':popover-open')) {
                    popover.showPopover();
                }
            } catch (e) {
                console.error('Popover API not supported or error:', e);
            }
        });

        // Hide when leaving the button AND the popover itself (to allow selecting text in popover)
        // A simple implementation: hide when leaving the button, unless entering the popover.
        // We can use a small timeout to allow moving to the popover.
        
        let hideTimeout;

        const startHide = () => {
            hideTimeout = setTimeout(() => {
                try {
                    popover.hidePopover();
                } catch (e) {}
            }, 200); // 200ms grace period
        };

        const cancelHide = () => {
            clearTimeout(hideTimeout);
        };

        detailsBtn.addEventListener('mouseleave', startHide);
        
        // If user moves into the popover, cancel hiding
        popover.addEventListener('mouseenter', cancelHide);
        
        // If user leaves the popover, hide it
        popover.addEventListener('mouseleave', () => {
             try {
                popover.hidePopover();
            } catch (e) {}
        });
    }

    // 2. Adaptive Loading API
    const heroImg = document.getElementById('hero-img');
    
    if (heroImg) {
        const highResSrc = heroImg.getAttribute('data-high-res');
        
        // Effective connection type check (if available in browser)
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        const isSlow = connection && (
            connection.saveData === true || 
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g'
        );

        if (!isSlow && highResSrc) {
            // High speed or generic: Load high-res
            // We create a new Image to load it in background to avoid jank, then swap
            const imgLoader = new Image();
            imgLoader.src = highResSrc;
            imgLoader.onload = () => {
                heroImg.src = highResSrc;
            };
        } else {
            console.log('Adaptive Loading: Using placeholder/low-res image due to slow connection or preference.');
        }
    }
});
