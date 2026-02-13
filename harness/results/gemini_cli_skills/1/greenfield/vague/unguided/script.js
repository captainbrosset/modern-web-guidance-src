document.addEventListener('DOMContentLoaded', () => {
    const heroImage = document.querySelector('.hero-img');
    const networkStatus = document.getElementById('network-status');
    
    if (!heroImage) return;

    const highResUrl = heroImage.getAttribute('data-high-res');
    
    // Check Network Speed
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection ? (connection.saveData || /2g/.test(connection.effectiveType)) : false;
    
    // Function to load high-res image
    const loadHighRes = () => {
        const highResImg = new Image();
        highResImg.src = highResUrl;
        highResImg.onload = () => {
            heroImage.src = highResUrl;
            heroImage.classList.add('loaded');
        };
    };

    if (isSlow) {
        console.log('Slow network detected. Keeping low-quality placeholder visible longer.');
        if (networkStatus) networkStatus.style.display = 'block';
        
        // On slow networks, we still want the high res eventually, 
        // but maybe we defer it slightly or just let it load normally.
        // Since src is already low-res, it's visible immediately.
        // We start loading high-res.
        loadHighRes();
        
    } else {
        // Fast network: Load high res immediately
        loadHighRes();
    }

    // Scroll Animation: Grow Larger
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        if (!heroSection) return;
        
        const scrollPosition = window.scrollY;
        const heroSectionHeight = heroSection.offsetHeight;
        
        // Only animate if within range of the hero section
        if (scrollPosition < heroSectionHeight) {
            // Scale starts at 1 and grows
            // limit growth to avoid pixelation or excessive zoom
            const scale = 1 + (scrollPosition * 0.0005); 
            
            // Apply transform
            // We use translateZ(0) to force hardware acceleration for smoother animation
            heroImage.style.transform = `scale(${scale}) translateZ(0)`;
        }
    });
});
