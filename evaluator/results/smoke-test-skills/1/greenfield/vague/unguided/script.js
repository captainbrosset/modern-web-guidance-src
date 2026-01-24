document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.getElementById('mainHeroImage');
    const heroSection = document.querySelector('.hero-section');

    // ---------------------------------------------------------
    // 1. Network-Aware Image Loading (Blur-up Pattern)
    // ---------------------------------------------------------
    
    // Function to load the high-res image
    const loadHighRes = () => {
        const hdUrl = heroImg.dataset.src;
        if (!hdUrl) return;

        // Create a temporary image to preload
        const tempImg = new Image();
        tempImg.src = hdUrl;
        
        tempImg.onload = () => {
            // Swap src
            heroImg.src = hdUrl;
            heroImg.classList.add('full-loaded');
            // Remove blur trigger class if present
            heroImg.classList.remove('blur-loaded');
        };
    };

    // Check Network conditions
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection ? 
        (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) : 
        false;

    // Apply initial blur
    heroImg.classList.add('blur-loaded');

    if (isSlowConnection) {
        console.log('Slow connection detected. Prioritizing layout, loading HD image lazily or with lower priority.');
        // logic: wait a bit longer or wait for some idle time
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                setTimeout(loadHighRes, 2000); // Wait a bit to let critical text render
            });
        } else {
            setTimeout(loadHighRes, 2000);
        }
    } else {
        // Good connection: load immediately
        loadHighRes();
    }


    // ---------------------------------------------------------
    // 2. Scroll Animation (Fade In + Grow)
    // ---------------------------------------------------------
    
    // We want the image to grow *larger* as we scroll *down*.
    // Using simple parallax logic on scroll event for smoothness.
    
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollAnimations();
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateScrollAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // --- 2a. Grow/Scale Logic on Scroll ---
        // Only apply if hero is in view
        if (scrollY <= windowHeight) {
            // Scale starts at 1.0 (after initially loading usually) or 1.1
            // Let's make it grow from 1.0 to 1.2 as we scroll down
            const scaleValue = 1 + (scrollY * 0.0005); 
            
            // Limit the scale so it doesn't get ridiculous
            const safeScale = Math.min(scaleValue, 1.3);
            
            // Also fade out slightly as we scroll down to focus on content?
            // User asked: "fade in and grow larger as I scroll down"
            // Wait, "Fade IN" usually means starting from invisible.
            // If it's a Hero image, it's usually visible at top. 
            // Maybe they mean: "When the page loads, it fades in. Then as I scroll, it grows."
            // OR "As I scroll down the page, elements *below* fade in?"
            // Given "Hero Image", I assume the first interpretation:
            // 1. Initial Load: Fades In.
            // 2. Scroll Down: Grows Larger.
            
            heroImg.style.transform = `scale(${safeScale})`;
        }
    }

    // --- 2b. Initial Fade In ---
    // Trigger this slightly after load
    setTimeout(() => {
        // If we haven't handled opacity in CSS fully (we did transition: opacity),
        // we ensure it is visible here if not handled by the loading logic.
        // Actually the loading logic handles opacity changes (blur-loaded -> full-loaded).
        // Let's just double check the base opacity.
        // The CSS has .hero-img { opacity: 0; ... }
        // .blur-loaded { opacity: 1; }
        // So as soon as we added 'blur-loaded' it should have faded in.
    }, 100);

});
