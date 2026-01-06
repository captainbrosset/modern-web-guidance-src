document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Reveal (Fade in + Scale up entry)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const minimalObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealTarget = document.querySelector('.reveal-target');
    if (revealTarget) minimalObserver.observe(revealTarget);

    // 2. Progressive Image Loading
    const fullResImg = document.querySelector('.full-res');
    
    const loadHighRes = () => {
        if (!fullResImg) return;
        
        const src = fullResImg.getAttribute('data-src');
        if (!src) return;

        // Create a temporary image to preload
        const tempImg = new Image();
        tempImg.src = src;
        
        tempImg.onload = () => {
            fullResImg.src = src;
            fullResImg.classList.add('loaded');
        };
    };

    // Check connection type to decide on loading strategy
    // In a real app, we might check navigator.connection.saveData
    // For this demo, we'll delay slightly to ensure the LQIP is seen, then load.
    // This emphasizes the "loads low-quality first" requirement visually.
    setTimeout(loadHighRes, 100);


    // 3. "Grow larger as I scroll down" - Scroll-linked Parallax
    // We apply this to the image wrapper or the image itself
    const imageWrapper = document.querySelector('.image-wrapper');
    const heroSection = document.querySelector('.hero');

    if (imageWrapper && heroSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const heroHeight = heroSection.offsetHeight;

            // Only animate if we are in or near the hero section
            if (scrollY <= heroHeight) {
                // simple calc: scale increases by 0.0005 per pixel
                // starts at 1 (assuming entry animation finishes or we add to it)
                // We use transform directly. Note: This conflicts with the CSS transition if we aren't careful.
                // Best practice: Apply this to a CHILD element of the entry-animation element, 
                // OR wait for entry animation to finish.
                
                // CSS transition is on .hero-visual (parent of imageWrapper)
                // So we can safely transform .image-wrapper or the .hero-img
                
                // Let's transform the Images directly to avoid layout shift issues
                const scaleValue = 1 + (scrollY * 0.0005);
                const safeScale = Math.min(scaleValue, 1.2); // Cap at 1.2x
                
                requestAnimationFrame(() => {
                    imageWrapper.style.transform = `scale(${safeScale})`;
                });
            }
        });
    }

    // Detailed Button Tooltip Logic (Accessibility enhancement)
    // The CSS handles hover, but for keyboard/mobile toggling:
    const detailsBtn = document.querySelector('.btn-secondary');
    const tooltip = document.querySelector('.tooltip');

    if (detailsBtn && tooltip) {
        detailsBtn.addEventListener('click', (e) => {
            // Toggle visibility for touch devices
            const currentOpacity = window.getComputedStyle(tooltip).opacity;
            if (currentOpacity === '0') {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
                tooltip.style.transform = 'translateX(-50%) translateY(0)';
            } else {
                tooltip.style.opacity = ''; // Reset to CSS hover state
                tooltip.style.visibility = '';
                tooltip.style.transform = '';
            }
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tooltip-container')) {
                tooltip.style.opacity = '';
                tooltip.style.visibility = '';
                tooltip.style.transform = '';
            }
        });
    }
});
