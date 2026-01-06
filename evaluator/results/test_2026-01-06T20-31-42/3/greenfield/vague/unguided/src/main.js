import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const heroImg = document.getElementById('hero-img');

  // 1. Network-Aware Image Loading
  const loadHighResImage = () => {
    const highResUrl = heroImg.getAttribute('data-src');
    if (!highResUrl) return;

    const img = new Image();
    img.src = highResUrl;
    img.onload = () => {
      heroImg.src = highResUrl;
      heroImg.classList.add('loaded'); // Removes blur filter if any
    };
  };

  const handleImageLoading = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    // Default to loading high-res if API not supported
    let shouldLoadHighRes = true;

    if (connection) {
      if (connection.saveData ||
        ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
        console.log('Slow connection or Data Saver detected. Keeping LQIP.');
        shouldLoadHighRes = false;
        // Note: We could load an intermediate resolution here if we wanted, 
        // but for now we stick to the placeholder as requested for "slow network".
        // Actually, let's load it if it's 3g, but maybe keep it for 2g.
        // The prompt says "loads a low-quality placeholder first".
        // Let's decide: strict slow network = keep LQIP.
        // Actually, usually users want to see the image eventually. 
        // Let's lazy load the high res one? 
        // For this demo, let's strictly respect the "if on slow network" part implies *differential* behavior.
        // So: Slow = Keep LQIP (maybe forever? or maybe load on explicit interaction?).
        // Let's toggle it: Slow = keep LQIP. Fast = swap.
      }
    }

    if (shouldLoadHighRes) {
      loadHighResImage();
    } else {
      // Even if we keep LQIP, we want it to fade in.
      // Since 'loaded' class removes blur, maybe we want to keep blur on LQIP?
      // Or maybe just show it.
    }
  };

  handleImageLoading();

  // 2. Initial Fade In Animation
  // Trigger after a slight delay to ensure layout is stable
  setTimeout(() => {
    heroImg.classList.add('animate-in');
  }, 100);

  // 3. Scroll Animation (Grow)
  const handleScroll = () => {
    const scrollY = window.scrollY;
    // Scale starts at 1 (after animate-in) and grows as we scroll down
    // Limit the growth to avoid pixelation or layout breaking too much
    const scale = 1 + (scrollY * 0.0005);

    // Apply transform only if the image has already animated in
    if (heroImg.classList.contains('animate-in')) {
      heroImg.style.transform = `scale(${scale})`;
    }
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(handleScroll);
  });
});
