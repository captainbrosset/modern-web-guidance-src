
document.addEventListener('DOMContentLoaded', () => {
    // LQIP Handling
    const heroImage = document.querySelector('.hero-image');
    
    // Function to load high-res image
    const loadHighRes = () => {
        const fullSrc = heroImage.getAttribute('data-src');
        if (!fullSrc) return;

        // Create a new image to preload
        const newImg = new Image();
        newImg.src = fullSrc;
        
        newImg.onload = () => {
            heroImage.src = fullSrc;
            heroImage.classList.remove('blur');
            heroImage.classList.add('loaded');
        };
    };

    // Initially add blur class
    if (heroImage) {
        heroImage.classList.add('blur');
        
        // Simulate network delay to show off LQIP (optional, but good for demo)
        // In production, we'd just call loadHighRes() immediately or when in view.
        // using setTimeout just to ensure the user sees the blur for a moment in this local demo
        setTimeout(loadHighRes, 1000); 
    }
});
