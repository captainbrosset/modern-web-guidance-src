document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.querySelector('.hero-img');
    const lqipImg = document.querySelector('.hero-img-lqip');
    
    // LQIP Logic
    if (heroImg && lqipImg) {
        // If the image is already cached/loaded
        if (heroImg.complete) {
            onImageLoaded();
        } else {
            heroImg.addEventListener('load', onImageLoaded);
        }

        function onImageLoaded() {
            // Fade in high-res
            heroImg.style.opacity = '1';
            // Hide LQIP after transition
            setTimeout(() => {
                lqipImg.style.display = 'none';
            }, 1000); // Match CSS transition duration
        }
    }

    // Scroll Animation Logic
    const heroSection = document.querySelector('.hero');
    const heroImageNodes = document.querySelectorAll('.hero-img, .hero-img-lqip');
    
    let isTicking = false;

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                updateScroll();
                isTicking = false;
            });
            isTicking = true;
        }
    });

    function updateScroll() {
        const scrollY = window.scrollY;
        
        // Only animate if we are in or near the hero section
        if (heroSection && scrollY < heroSection.offsetHeight) {
            // Growth factor: 1 + (scroll pos / height * factor)
            // e.g., at 500px scroll, scale might be 1.1
            const scale = 1 + (scrollY / window.innerHeight) * 0.2; 
            
            heroImageNodes.forEach(img => {
                // Apply scale
                img.style.transform = `scale(${scale})`;
            });
        }
    }
    
    // Initial call to set state
    updateScroll();
});
