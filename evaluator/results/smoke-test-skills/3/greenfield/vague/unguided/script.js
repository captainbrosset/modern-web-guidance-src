document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.getElementById('hero-img');

    // Network Awareness Logic
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveMode = connection ? connection.saveData : false;
    const effectiveType = connection ? connection.effectiveType : '4g';
    
    // Determine if network is slow (2g, slow-2g, 3g) or if Data Saver is on
    const isSlowNetwork = saveMode || effectiveType === '2g' || effectiveType === 'slow-2g' || effectiveType === '3g';

    const highResUrl = heroImg.getAttribute('data-high-res');
    const lowResUrl = heroImg.getAttribute('data-low-res');

    if (isSlowNetwork) {
        console.log('Slow network detected or Data Saver enabled. Loading low quality image.');
        heroImg.src = lowResUrl;
    } else {
        console.log('Fast network detected. Loading high quality image.');
        heroImg.src = highResUrl;
    }

    // Initialize opacity to 1 AFTER loading starts to avoid FOUC or allow transition
    // Actually, we want it to start hidden (opacity 0 in CSS) and then fade in once loaded? 
    // Or fade in based on scroll? The request was "fade in and grow larger as I scroll down".
    // Usually "fade in" implies as it enters view or as you scroll. 
    // Let's assume the user means "parallax grow and fade in ON SCROLL" or "Initial fade in"?
    // "make the main hero image fade in and grow larger as I scroll down" -> Sounds like a scroll-linked animation.
    
    // However, if it's the HERO image, it's at the top. So "scrolling down" usually hides it or moves it out.
    // OR maybe it starts small and transparent and grows/fades in as you scroll? That's unusual for a top-of-page hero.
    // BUT, I will interpret it as: As you scroll, the image gets LARGER (scale up) and maybe OPAQUE if it started transparent?
    // Let's assume standard behavior: Starts opacity 0.5/0 and scale 0.9, and as we scroll (or on load), it goes to 1.
    // Let's re-read: "fade in and grow larger as I scroll down".
    // If it's at the very top, scrolling down *increases* scrollTop.
    // Maybe they mean "Reveal on Scroll" effect?
    // Let's implement a scroll handler that maps scrollTop to scale/opacity.
    
    // Initial state set in CSS: opacity: 0; transform: scale(0.95);
    // Wait, if it starts at 0 opacity, you can't see it.
    // Maybe they mean it starts hidden and reveals as you scroll?
    // OR, maybe it's the standard "Parallax Zoom" where it grows as you scroll past it?
    // Let's do this: 
    // 1. Initial Load: Fade in to opacity 1, scale 1. (Standard Entry)
    // 2. On Scroll: Grow LARGER (scale > 1) and maybe fade out? 
    // Wait, "fade in ... as I scroll down". This implies it starts invisible.
    // If it's the hero, you see it immediately.
    // maybe they mean "Fade in and grow larger as I SCROLL DOWN (to it)?" - but it's the hero, it's already there.
    
    // Interpretation B: The user wants a Parallax Scale effect where scrolling down makes it Zoom In.
    // And "fade in" might be the initial load animation, or they confusedly want it to get more opaque as you scroll (which implies it's semi-transparent initially?).
    // I'll stick to: Initial Load -> Fade In. Scroll -> Grow Larger.
    
    // Let's set initial loaded state.
    heroImg.onload = () => {
        heroImg.style.opacity = '1';
        heroImg.style.transform = 'scale(1)';
    };
    
    // If it's already cached/loaded
    if (heroImg.complete) {
        heroImg.style.opacity = '1';
        heroImg.style.transform = 'scale(1)';
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Grow larger as we scroll down
        const scaleValue = 1 + (scrollY * 0.0005); 
        // We limit it mostly to avoid crazy growth
        const limitedScale = Math.min(scaleValue, 1.2);
        
        // As we scroll down, if we strictly follow "fade in", it implies opacity increases.
        // But if it's fully visible, maybe they mean "fade OUT"?
        // Ill assume "Grow larger" is the key scroll effect. 
        // If I strictly follow "fade in as I scroll", it means opacity 0 -> 1 on scroll.
        // That would mean the hero is invisible at the top? That's bad UX.
        // I will assume "Fade In" refers to the *Initial* entry, and "Grow Larger" is the scroll effect.
        // OR handling the case where opacity might fade slightly on scroll? No, "Grow larger".
        
        heroImg.style.transform = `scale(${limitedScale})`;
    });
});
