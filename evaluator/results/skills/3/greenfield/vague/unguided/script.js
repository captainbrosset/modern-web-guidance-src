document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Network-Aware Image Loading (LQIP) ---
    const heroImage = document.getElementById('heroImage');
    const highResUrl = heroImage.getAttribute('data-src');
    
    // Check for Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    const isSlowNetwork = connection && (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType));
    
    const loadImage = (imageEl, src) => {
        const tempImg = new Image();
        tempImg.src = src;
        tempImg.onload = () => {
            imageEl.src = src;
            imageEl.classList.add('loaded');
        };
    };

    // If slow network, we keep the low-res (already in src) and maybe load high-res on interaction or delay.
    // Requirement: "load a low-quality placeholder first if the user is on a slow network"
    // Interpretation: If slow, show LQIP. Logic below implies we ALWAYS show LQIP first (that's the HTML src),
    // and then decide when to swap.
    
    if (isSlowNetwork) {
        console.log('Slow network detected. Keeping/Loading optimized assets.');
        // Even on slow network, we might want to eventually load it, 
        // strictly following "load ... first" suggests priority.
        // We'll lazy load the high res one only when we are sure or maybe let the user browse a bit.
        // For this demo, let's load it but with lower priority or keep it low res until view.
        
        // Let's just mark it as "lazy-loaded-low" to ensure it fades in.
        heroImage.classList.add('lazy-loaded-low');
        
        // Optional: Trigger high-res load after a delay or interaction
        setTimeout(() => {
            loadImage(heroImage, highResUrl);
        }, 3000); 
    } else {
        // Fast network immediately swap
        // Mark low res as visible first so we see something
        heroImage.classList.add('lazy-loaded-low');
        
        // Preload and swap
        loadImage(heroImage, highResUrl);
    }

    // --- 2. Hero Animation on Scroll (Fade In & Grow) ---
    // "image fade in and grow larger as I scroll down the page"
    
    // Initial fade in is handled by the loading logic above (.loaded opacity: 1).
    // The "Grow larger as I scroll" implies a parallax scaling effect.
    
    const heroSection = document.querySelector('.hero');
    
    // Option A: IntersectionObserver for entrance (if "as I scroll down" means trigger)
    // Option B: scroll event listener for continuous effect (Parallax)
    
    // I will use a simple scroll listener for the 'Grow' effect.
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Only animate if the hero is somewhat visible to save performance
        if (scrollPosition < window.innerHeight) {
            // Scale grows from 1 upwards
            // Opacity can fade out as we scroll away, but prompt says "Fade In ... as I scroll down" 
            // This phrasing is tricky. "Fade in AND grow larger AS I scroll down".
            // If it starts invisible, and scrolling down makes it visible, that's an entrance.
            // If it's the hero at the top, usually you scroll AWAY from it.
            // Interpretation 1: It's an entrance animation triggered by scroll. (Standard)
            // Interpretation 2: Parallax effect where it grows.
            
            // Given "Hero image", it's at the top. So "scrolling down" usually hides it. 
            // Unless the user starts with it invisible?
            // "make the main hero image fade in and grow larger as I scroll down the page"
            // Re-reading: Maybe the user means "Parallax zoom" effects? 
            // OR maybe the hero image IS NOT at the very top? But "Hero" usually is.
            
            // I'll stick to:
            // 1. Initial Load: Fades in (Standard hero behavior).
            // 2. Scroll Down: The image scales up (Parallax Zoom) so it looks like it's growing.
            
            const scaleValue = 1 + (scrollPosition * 0.0005); // Subtle grow
            // Apply transform. Note: We need to preserve the centering if needed, but object-fit covers it.
            heroImage.style.transform = `scale(${scaleValue})`;
            
            // If they strictly meant "Fade IN as I scroll down", that implies it starts invisible (opacity 0) 
            // and as you scroll pixels 0 -> 100, it becomes opacity 1. 
            // Let's add that just in case it's what they meant, though it's weird for a hero.
            // Start opacity is handled by CSS (0). 
            // If I just let the loader handle opacity -> 1, that covers "Fade In".
            // The "As I scroll" might refer to the growing.
        }
    });

    // We also use IntersectionObserver to ensure it fades in if it hasn't loaded yet 
    // or to trigger the 'visible' state if we want strict scroll-triggering.
    
    const observerOptions = {
        threshold: 0.1
    };

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
               // Ensure visibility if logic above didn't catch it
               // heroImage.classList.add('visible'); 
               // We are relying on the image load to set opacity for now.
            }
        });
    }, observerOptions);
    
    heroObserver.observe(heroSection);
});
