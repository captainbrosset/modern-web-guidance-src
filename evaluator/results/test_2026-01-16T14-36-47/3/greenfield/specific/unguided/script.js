document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Adaptive Loading API Logic ---
    const imgElement = document.getElementById('hero-img');
    const placeholder = document.getElementById('hero-placeholder');
    
    // High-res Unsplash image
    const highResUrl = "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop";
    // For placeholder, we'll use a very small encoded SVG or just rely on CSS color.
    // But let's set a low-quality src if needed.
    const lowResUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMzMzMiLz48L3N2Zz4=";

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    let isSlow = false;
    
    if (connection) {
        // Check for saveData or slow connection type
        if (connection.saveData === true || 
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' || 
            connection.effectiveType === '3g') {
            isSlow = true;
        }
    }

    if (isSlow) {
        console.log("Slow connection detected: Using placeholder.");
        imgElement.src = lowResUrl;
        imgElement.style.display = 'none'; // Hide the img tag initially
        placeholder.style.display = 'block'; // Show CSS placeholder
        placeholder.innerText = "Image not loaded (Slow Network)";
        placeholder.style.color = "#aaa";
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
    } else {
        console.log("Fast connection: Loading high-res image.");
        imgElement.src = highResUrl;
    }


    // --- 2. Details Popover Interaction (Hover) ---
    const btn = document.getElementById('details-btn');
    const popover = document.getElementById('ingredients-popover');

    // Button Hover
    btn.addEventListener('mouseenter', () => {
        try {
            // Position it near the button? 
            // For now, let's just show it. The CSS centers it.
            // If we wanted anchor positioning we'd need more complex CSS/JS polyfill.
            popover.showPopover();
            
            // Optional: crude manual positioning if we want it *near* the button
            const rect = btn.getBoundingClientRect();
            popover.style.top = `${rect.bottom + window.scrollY + 10}px`;
            popover.style.left = `${rect.left + window.scrollX}px`;
            popover.style.margin = '0'; // override auto center
        } catch (e) {
            console.error("Popover API not supported or error:", e);
        }
    });

    btn.addEventListener('mouseleave', () => {
        try {
            // We want to hide it, but maybe allow moving mouse TO the popover?
            // User requirement: "triggers ... when a user hovers over it".
            // Strict interpretation: Mouse leaves button -> hide.
            popover.hidePopover();
        } catch (e) {
            // ignore
        }
    });


    // --- 3. Scroll Animation (Fade & Scale) ---
    // User wants: "fade into view and scale up as the user scrolls down"
    // We already put the image in .hero-section (which is the SECOND section).
    // So scrolling down brings it into view.
    // valid approach: IntersectionObserver.

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% visible
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                // Optional: remove class to re-animate when scrolling back up?
                // The prompt implies a one-time "fade into view". But "as user scrolls down" 
                // could imply continuous mapping. 
                // Given "fade into view", usually means entrance animation.
                // I'll stick to one-way or toggle. Let's toggle for fun responsiveness.
                entry.target.classList.remove('in-view'); 
            }
        });
    }, observerOptions);

    scrollObserver.observe(imgElement);

});
