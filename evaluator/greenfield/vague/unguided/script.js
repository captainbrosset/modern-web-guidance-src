document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Logic
    const heroImage = document.querySelector('.hero-image');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            // Add visibility and scale up
            entry.target.style.opacity = 1;
            entry.target.style.transform = "scale(1)";
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    if (heroImage) {
        appearOnScroll.observe(heroImage);
    }

    // Network-Aware Image Loading
    const loadImage = async () => {
        const img = document.querySelector('#hero-img');
        if (!img) return;

        const dataSrc = img.getAttribute('data-src');
        if (!dataSrc) return;

        // Check Connection
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlow = connection && (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType));

        console.log(`Network status detected: ${isSlow ? 'Slow/DataSaver' : 'Fast'}`);

        if (isSlow) {
            // Keep the low-res placeholder (src is already hero-small.jpg)
            // Maybe just remove the blur if we want it to be sharp but pixelated, 
            // or keep it if we want it to look "loading".
            // For this demo, let's say we WANT to keep it low-res but maybe load high-res if user requests or interacts (omitted for simplicity),
            // OR we can decide to load it anyway but lazily.
            
            // Let's implement the specific requirement: "load a low-quality placeholder first"
            // It IS loaded first (src attribute).
            // "If the user is on a slow network", we might STOP here and NOT load the high-res.
            console.log('Skipping high-res image download due to network conditions.');
            return; 
        }

        // Simulating a load delay to show the effect if needed, but better to just load it.
        const highResImg = new Image();
        highResImg.src = dataSrc;
        
        highResImg.onload = () => {
            img.src = dataSrc;
            img.classList.add('loaded'); // Removes blur if applied
        };
    };

    // Initialize loading logic
    loadImage();
});
