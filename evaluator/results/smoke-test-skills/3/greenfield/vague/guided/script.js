document.addEventListener('DOMContentLoaded', () => {
    // === Network Aware Image Loading ===
    const heroImg = document.getElementById('hero-img');
    const highQualitySrc = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80';
    const lowQualitySrc = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=480&q=20&blur=50';

    // Check connection speed
    // navigator.connection is supported in Chromium browsers
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let isSlowConnection = false;

    if (connection) {
        // If effectiveType is "2g" or "slow-2g", or if saveData is true, treat as slow
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData) {
            isSlowConnection = true;
        }
    }

    if (isSlowConnection) {
        console.log('Slow connection detected. Loading optimized assets.');
        heroImg.src = lowQualitySrc;
        // Optional: Load high quality if user clicks or interaction happens, 
        // but for now we just stick to LQ for bandwidth saving unless they are on wifi/fast
        
        // Let's add a small mechanic to upgrade on click for demo purposes? 
        // Or simply lazily upgrade it later. 
        // For this task, "load a low-quality placeholder first" is the key.
        // We can upgrade it in the background if we want, or just leave it.
        // Let's try to upgrade after window load if it's not TOO slow (e.g. 3g) or just leave it for 2g.
        
    } else {
        heroImg.src = highQualitySrc;
    }

    // Fade in image when loaded
    heroImg.onload = () => {
        heroImg.classList.add('loaded');
    };

    // Fallback if image is already cached/loaded
    if (heroImg.complete) {
        heroImg.classList.add('loaded');
    }

    // === Scroll Effect (Grow & Fade) ===
    // "Hero image fade in and grow larger as I scroll down the page" regarding the "Grow larger as I scroll"
    // usually means a parallax scale effect.
    
    // We already have a CSS transition for 'fade in' on load (opacity).
    // The "grow larger" usually implies `transform: scale()` increasing as we scroll down.
    
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Only animate if the hero is somewhat visible to save performance
        if (scrollY > windowHeight) return;

        // Calculate scale
        // Start at 1.0, grow to ~1.1 or 1.2 as we scroll down
        const scale = 1 + (scrollY * 0.0005); 
        
        // Apply transform
        // We can also adjust opacity if we want it to fade OUT as we scroll, 
        // but the prompt said "fade in and grow larger as I scroll down".
        // Wait, "fade in ... as I scroll down"? usually fade in happens on load, or as it SCROLLS INTO VIEW.
        // But since it's the hero, it's ALREADY in view at the top.
        // Maybe the user means "fade in" (on load) AND "grow larger" (on scroll).
        // I will assume standard "parallax zoom" behavior for the "grow larger" part.
        
        heroImg.style.transform = `scale(${scale})`;
    });
});
