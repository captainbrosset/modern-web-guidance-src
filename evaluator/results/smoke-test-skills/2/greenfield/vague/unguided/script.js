document.addEventListener('DOMContentLoaded', () => {
    // 1. Network-aware Image Loading
    const heroImg = document.getElementById('hero-img');
    
    // Low quality (smaller, more compressed)
    const lowQualitySrc = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=400&auto=format&fit=crop';
    // High quality (large, detailed)
    const highQualitySrc = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop';

    let selectedSrc = highQualitySrc;

    // Check for Network Information API support
    if (navigator.connection) {
        const connection = navigator.connection;
        // If effectiveType is 2g or 3g, or save-data is on
        if (connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' || 
            connection.effectiveType === '3g' || 
            connection.saveData) {
            
            console.log(`Slow network detected (${connection.effectiveType}). Loading low-quality image.`);
            selectedSrc = lowQualitySrc;
        } else {
            console.log(`Fast network detected (${connection.effectiveType}). Loading high-quality image.`);
        }
    } else {
        console.log('Network Information API not supported. Defaulting to high-quality image.');
    }

    // Set the source
    heroImg.src = selectedSrc;


    // 2. Scroll-triggered Animation (Intersection Observer)
    const observerOptions = {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% visible
        rootMargin: "0px"
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInObserver.observe(heroImg);
});
