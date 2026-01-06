document.addEventListener('DOMContentLoaded', () => {
    // 1. Progressive Image Loading (LQIP)
    const heroImg = document.getElementById('heroImage');
    const fullResUrl = heroImg.getAttribute('data-src');

    function loadFullImage() {
        const img = new Image();
        img.src = fullResUrl;
        img.onload = () => {
            heroImg.src = fullResUrl;
            heroImg.classList.add('loaded');
            heroImg.classList.remove('blur-load');
        };
    }

    // Check Network Speed (Simulated or Real)
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection && (connection.saveData || connection.effectiveType === '2g');

    if (isSlow) {
        console.log('Slow network detected. Loading LQIP first, then lazy loading high-res.');
        // Wait a bit or wait for interaction? 
        // User asked to "load a low-quality placeholder first if... slow network".
        // The LQIP is already in src. We delay the swap.
        setTimeout(loadFullImage, 2000); // Simulate delay or wait for idle
    } else {
        // Fast network, load immediately
        loadFullImage();
    }

    // 2. Scroll Animation (Fade in & Grow)
    // We want the image to go from Opacity 0.2 / Scale 0.9 -> Opacity 1 / Scale 1.2
    // as the user scrolls down the first ~window.innerHeight pixels.
    
    const heroStickyContainer = document.querySelector('.hero-sticky-container');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Calculate progress based on how far we've scrolled into the sticky container
        // We want the effect to complete before we scroll past the sticky area completely.
        // Let's say the effect completes over the first 0.8 * viewportHeight pixels.
        const animationRange = viewportHeight * 0.8; 
        const progress = Math.min(Math.max(scrolled / animationRange, 0), 1);
        
        // Map progress to values
        const scale = 0.9 + (progress * 0.2); // 0.9 -> 1.1
        const opacity = 0.2 + (progress * 0.8); // 0.2 -> 1.0
        
        // Apply to image
        requestAnimationFrame(() => {
            heroImg.style.transform = `scale(${scale})`;
            heroImg.style.opacity = opacity;
            
            // Optional: Fade out text as we scroll down to focus on the cup?
            // heroContent.style.opacity = 1 - progress; 
        });
    });
    
    // Initial trigger
    window.dispatchEvent(new Event('scroll'));
});
