document.addEventListener('DOMContentLoaded', () => {
    initPopoverHover();
    initAdaptiveLoading();
});

function initPopoverHover() {
    const btn = document.getElementById('details-btn');
    const popover = document.getElementById('ingredients-popover');

    if (!btn || !popover) return;

    // Show on hover
    btn.addEventListener('mouseenter', () => {
        try {
            popover.showPopover();
        } catch (e) {
            console.error('Popover API not supported or error:', e);
        }
    });

    // Hide when leaving button or popover?
    // The requirement says "triggers a non-modal popover when a user hovers over it".
    // Usually hover triggers require hide on mouseleave, but the native popover API 
    // with 'auto' behavior (default for non-modal) handles clicking outside.
    // However, for a true hover experience, we might want to hide it when mouse leaves?
    // The prompt just says "triggers ... when a user hovers over it". 
    // I will stick to showing it. Native popover 'auto' will handle dismissal on outside click
    // or we could add a mouseleave to hidePopover() if we wanted a tooltip behavior.
    
    // Let's add mouseleave to hide for a better "hover" feel if it's meant to be like a tooltip
    // but the Prompt says popover.
    // I'll leave it as just triggering open for now to ensure it works, 
    // but normally a hover trigger implies a hover dismiss too unless it's a click-to-dismiss pattern triggered by hover.
    // Let's add a mouseleave listener to the *container* of button+popover if possible, 
    // or just the button. If I hide on button leave, user can't hover the popover content.
    // I'll keep it simple: Hover to open. Click outside to close (default behavior for popover=auto).
}

function initAdaptiveLoading() {
    const heroImg = document.getElementById('hero-img');
    if (!heroImg) return;

    // Check if Network Information API is supported
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
        // Log for debugging
        console.log('Effective Type:', connection.effectiveType);
        console.log('Save Data:', connection.saveData);

        const isSlow = connection.effectiveType === '2g' || connection.effectiveType === '3g';
        const isSaveData = connection.saveData;

        if (isSlow || isSaveData) {
            console.log('Slow connection or Data Saver detected. Using placeholder.');
            // Use a lightweight placeholder or lower quality image
            // Applying a class to style it differently if needed, or swapping SRC
            
            // For this demo, let's swap to a smaller/different image
            // Current: https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071...
            // Placeholder: A tiny version or different image
            
            heroImg.src = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=30&w=400&auto=format&fit=crop';
            heroImg.alt = 'Coffee (Low Res)';
        }
    }
}
