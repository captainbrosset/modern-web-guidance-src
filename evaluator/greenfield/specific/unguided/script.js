// Adaptive Loading
document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.getElementById('hero-img');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const useHighRes = () => {
        heroImg.src = 'hero.png'; // High res image
        heroImg.classList.add('loaded');
    };

    const useLowRes = () => {
        heroImg.src = 'hero-small.png'; // Low res placeholder
    };

    if (connection) {
        // Check effective connection type
        const effectiveType = connection.effectiveType; // '4g', '3g', '2g', 'slow-2g'
        const saveData = connection.saveData; // Data Saver mode

        console.log(`Current connection: ${effectiveType}, SaveData: ${saveData}`);

        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
            useLowRes();
        } else {
            useHighRes();
        }

        // Optional: Listen for connection changes
        connection.addEventListener('change', () => {
            console.log(`Connection changed to: ${connection.effectiveType}`);
            // We might not want to swap image mid-scroll if it's already loaded, but here's logic:
            if (!connection.saveData && (connection.effectiveType === '4g')) {
                useHighRes();
            }
        });
    } else {
        // Fallback for browsers without Network Information API
        useHighRes();
    }
});

// Popover Hover Interaction
// Native Popover API is click-based by default. We add mouseover listeners to satisfy "hover".
const detailsBtn = document.getElementById('details-btn');
const popover = document.getElementById('ingredients-popover');

if (detailsBtn && popover) {
    // Show on hover
    detailsBtn.addEventListener('mouseenter', () => {
        try {
            popover.showPopover();
        } catch (e) {
            // Already open or error
        }
    });

    // Hide when leaving button AND popover
    // We need a slight delay or check to allow moving from button to popover if we want it interactive.
    // Simple implementation: Hide when mouse leaves button.
    // If popover needs to be interactive (copy text), we need to handle that.
    
    let hideTimeout;

    const show = () => {
        clearTimeout(hideTimeout);
        try { popover.showPopover(); } catch(e){}
    };

    const hide = () => {
        hideTimeout = setTimeout(() => {
            try { popover.hidePopover(); } catch(e){}
        }, 300); // 300ms grace period
    };

    detailsBtn.addEventListener('mouseenter', show);
    detailsBtn.addEventListener('mouseleave', hide);
    
    popover.addEventListener('mouseenter', show);
    popover.addEventListener('mouseleave', hide);
}
