
document.addEventListener('DOMContentLoaded', () => {
    initHeroImage();
    initScrollAnimation();
});

/**
 * Handles the logic for loading the hero image based on network conditions.
 * "Make sure the image loads a low-quality placeholder first if the user is on a slow network."
 */
function initHeroImage() {
    const imgElement = document.getElementById('hero-img');
    const lowResUrl = imgElement.dataset.lowRes;
    const highResUrl = imgElement.dataset.highRes;

    // Check for Network Information API support
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    // Determine if network is considered "slow"
    // 'save-data' mode or effectiveType like '2g' or '3g'
    const isSlowNetwork = connection && (
        connection.saveData === true || 
        ['slow-2g', '2g', '3g'].includes(connection.effectiveType)
    );

    if (isSlowNetwork) {
        console.log('Slow network detected using Low Res image initially.');
        // Load low res first
        imgElement.src = lowResUrl;
        
        // Optional: Attempt to load high res in background or on user interaction
        // For this demo, we can upgrade it after a delay or just leave it for "bandwidth saving"
        // But usually "placeholder first" implies we define the intention to upgrade eventually.
        // Let's implement a "blur up" strategy: Load low, then try high.
        
        const highResLoader = new Image();
        highResLoader.src = highResUrl;
        highResLoader.onload = () => {
            imgElement.src = highResUrl;
        };
    } else {
        // Fast network: Go straight to high res, 
        // OR still use LQP pattern for perceived performance if desired.
        // Prompt asks: "load a low-quality placeholder first IF the user is on a slow network"
        // Implication: If fast, we might just load high res directly to avoid double flash.
        console.log('Fast network detected. Loading High Res image.');
        imgElement.src = highResUrl;
    }

    // Fade in the image once set
    imgElement.onload = () => {
        imgElement.style.opacity = 1;
    };
}

/**
 * Handles the scroll animation: "make the main hero image fade in and grow larger as I scroll down"
 * Note: The image fades in initially on load.
 * The prompt likely means "fade out" or "continue to grow" or specific scroll-bound effects.
 * "Grow larger as I scroll down" -> Suggests parallax zoom.
 * "Fade in... as I scroll down"? Usually heroes fade OUT on scroll, or fade IN on load.
 * Interpretation: I will interpret "fade in" as the initial load effect (handled above)
 * and "grow larger" as the scroll effect.
 * However, strictly reading "fade in AND grow larger AS I scroll down" might imply 
 * the image starts invisible/small and scrolling reveals it? 
 * That's unusual for a Hero at the top of the page. 
 * 
 * Alternate interpretation: The user might mean effects applied to elements *as they appear into view*.
 * But it says "main hero image".
 * 
 * Decision: 
 * 1. Initial Load: Fade Opacity 0 -> 1 (Done in CSS/JS onload)
 * 2. Scroll Down: Scale 1 -> 1.x (Grow)
 */
function initScrollAnimation() {
    const imgElement = document.getElementById('hero-img');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        // Calculate scroll percentage relative to hero height
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        // Don't animate if hero is out of view
        if (scrollY > heroHeight) return;

        // Grow effect: Scale from 1.0 to 1.2 based on scroll
        const scaleValue = 1 + (scrollY / heroHeight) * 0.2; 
        
        // Apply transform
        imgElement.style.transform = `scale(${scaleValue})`;
    });
}
