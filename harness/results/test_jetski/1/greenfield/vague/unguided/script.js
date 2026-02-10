document.addEventListener('DOMContentLoaded', () => {
    
    // --- Hero Scroll Animation ---
    const heroImg = document.querySelector('.hero-img');
    const heroContent = document.querySelector('.hero-content');
    
    // Optimize scroll performance with RAF
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Only animate if we are in/near the hero view
                if (scrollY <= windowHeight) {
                    // Parallax & Scale Effect
                    // Scale grows from 1 to 1.1 as you scroll down
                    const scale = 1 + (scrollY * 0.0005); 
                    // Opacity fades out slightly as you scroll down
                    const opacity = 1 - (scrollY * 0.002);
                    
                    if (heroImg) {
                        heroImg.style.transform = `scale(${scale})`;
                    }
                    
                    if (heroContent) {
                        heroContent.style.opacity = Math.max(0, 1 - (scrollY * 0.003));
                        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                    }
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // --- Progressive Image Loading (Blur Up) ---
    // Select all images with class 'lazy-load' or just handle our specific ones
    const lazyImages = document.querySelectorAll('img[data-src], img[data-high-res]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src') || img.getAttribute('data-high-res');

                if (!src) return;

                // Create a temporary image to check load status
                const tempImg = new Image();
                tempImg.src = src;
                
                tempImg.onload = () => {
                    // Update the actual image
                    img.src = src;
                    img.classList.add('loaded');
                    
                    // If the parent has a background image placeholder, we can optionally remove/fade it
                    // But usually just fading in the high-res img over it is enough if handled via CSS opacity
                };

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading slightly before
        threshold: 0.01
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
        
        // Handle greedy loading for hero image if it's already in viewport or eager
        if (img.getAttribute('loading') === 'eager') {
             const src = img.getAttribute('data-high-res');
             const tempImg = new Image();
             tempImg.src = src;
             tempImg.onload = () => {
                 img.src = src;
                 img.classList.add('loaded');
             };
        }
    });
});
