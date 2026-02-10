document.addEventListener('DOMContentLoaded', () => {
    // --- Hero Image Scroll Animation ---
    const heroImg = document.getElementById('hero-img');

    const observerOptions = {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% visible
        rootMargin: '0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    if (heroImg) {
        imageObserver.observe(heroImg);
    }

    // --- Network Aware Image Loading ---
    const loadResponsiveImage = () => {
        if (!heroImg) return;

        const lowResSrc = heroImg.getAttribute('data-src-low');
        const highResSrc = heroImg.getAttribute('data-src-high');
        
        // Detect connection speed
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let isSlowConnection = false;

        if (connection) {
            // Check for saveData mode (Lite mode) or slow effective type
            // effectiveType can be 'slow-2g', '2g', '3g', or '4g'
            if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                isSlowConnection = true;
            }
        }

        if (isSlowConnection) {
            // Load low quality image
            heroImg.src = lowResSrc;
            console.log('Slow connection detected: Loading low-res image.');
            
            // Optional: Upgrade to high-res after low-res loads, if desired, 
            // but requirements say "load a low-quality placeholder first".
            // We can lazy load the high-res one or just stick to low-res to save data.
            // Let's implement a "blur-up" inspired approach: load low then high if possible,
            // but if data saver is ON explicitly, maybe stick to low? 
            // The prompt says "make sure the image loads a low-quality placeholder first if the user is on a slow network."
            // It implies we should eventually load the real one, or at least show SOMETHING fast.
            
            // Let's try to load high res in background
            const fullImg = new Image();
            fullImg.src = highResSrc;
            fullImg.onload = () => {
                heroImg.src = highResSrc;
                console.log('High-res image loaded and swapped.');
            };

        } else {
            // Fast connection: Load high quality immediately
            heroImg.src = highResSrc;
            console.log('Fast connection detected: Loading high-res image.');
        }
    };

    loadResponsiveImage();
});
