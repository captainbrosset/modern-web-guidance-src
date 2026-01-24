document.addEventListener('DOMContentLoaded', () => {
    // 1. Adaptive Loading Logic
    handleAdaptiveLoading();

    // 2. Popover Hover Logic
    setupPopoverHover();
});

function handleAdaptiveLoading() {
    const heroImage = document.getElementById('hero-image');
    if (!heroImage) return;

    // High quality image
    const highResUrl = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1600&auto=format&fit=crop';
    
    // Low quality placeholder (smaller, lower quality)
    const lowResUrl = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=30&w=400&auto=format&fit=crop';

    const updateImageSource = () => {
        let isSlow = false;
        
        // Check if Navigator Connection API is available
        if (navigator.connection) {
            const effectiveType = navigator.connection.effectiveType;
            console.log(`Current connection type: ${effectiveType}`);
            
            // Consider 2g and slow-2g as slow. 3g is debatable, but let's include it for "adaptive" demo purposes
            if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
                isSlow = true;
            }
            
            // Also check saveData (Lite Mode)
            if (navigator.connection.saveData) {
                isSlow = true;
            }
        }

        // Apply source
        if (isSlow) {
            console.log('Using low-res image due to slow connection.');
            heroImage.src = lowResUrl;
            heroImage.style.filter = 'blur(2px)'; // Optional visual cue for low-res
        } else {
            console.log('Using high-res image.');
            heroImage.src = highResUrl;
            heroImage.style.filter = 'none';
        }
    };

    // Initial check
    updateImageSource();

    // Listen for connection changes
    if (navigator.connection) {
        navigator.connection.addEventListener('change', updateImageSource);
    }
}

function setupPopoverHover() {
    const btn = document.getElementById('details-btn');
    const popover = document.getElementById('ingredients-popover');
    
    if (!btn || !popover) return;

    // Show on hover
    btn.addEventListener('mouseenter', () => {
        try {
            popover.showPopover();
        } catch (e) {
            // Already open or not supported
            console.warn('Popover API error or already open', e);
        }
    });

    // Hide on mouseleave
    // Note: If we want user to be able to select text in popover, we need to handle enter/leave on popover too.
    // The request said: "triggers a non-modal popover when a user hovers over it"
    // Usually simple tooltips hide when you leave the trigger.
    btn.addEventListener('mouseleave', (e) => {
        // We add a small delay or check if moving to popover to be nicer, 
        // but strict interpretation of "hover over [button]" implies leaving button hides it.
        // I'll add a check to see if we moved TO the popover so it's not frustrating.
        
        setTimeout(() => {
            if (!popover.matches(':hover') && !btn.matches(':hover')) {
                try {
                    popover.hidePopover();
                } catch (e) {
                    // Already closed
                }
            }
        }, 100);
    });

    // Also close if leaving the popover itself (if they moved mouse there)
    popover.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!btn.matches(':hover')) {
                popover.hidePopover();
            }
        }, 100);
    });
}
