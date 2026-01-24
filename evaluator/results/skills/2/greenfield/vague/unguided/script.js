document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimation();
  initImageLoading();
});

/**
 * Handles the logic for loading the hero image based on network speed.
 * Chooses between a high-quality asset and a low-quality placeholder.
 */
function initImageLoading() {
  const imgElement = document.querySelector('.hero-img');
  if (!imgElement) return;

  // Define assets
  const highQualitySrc = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2500&auto=format&fit=crop';
  const lowQualitySrc = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=10&w=200&blur=5&auto=format&fit=crop';

  // Check Network Information API
  // default to high quality if API is not supported
  let useLowQuality = false;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection) {
    // If Save-Data is on, or if the connection is slow (2g/3g)
    if (connection.saveData === true) {
      useLowQuality = true;
      console.log('Using low quality image: Save-Data is enabled');
    } else if (['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
      useLowQuality = true;
      console.log(`Using low quality image: Connection type is ${connection.effectiveType}`);
    }
  }

  // Set the source
  imgElement.src = useLowQuality ? lowQualitySrc : highQualitySrc;
  
  // Add load event to ensure opacity transition works after load if needed
  imgElement.onload = () => {
    imgElement.dataset.loaded = 'true';
  };
}

/**
 * Uses IntersectionObserver to trigger the fade-in and grow animation 
 * as the user interacts/scrolls.
 */
function initHeroAnimation() {
  const heroImg = document.querySelector('.hero-img');
  const triggerSection = document.querySelector('.hero');
  
  if (!heroImg || !triggerSection) return;

  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of the element is visible
    rootMargin: "-50px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Logic: As simple as adding a class when in view?
      // The prompt asks: "make the main hero image fade in and grow larger as I scroll down the page"
      // This often implies a parallax or scroll-linked effect, OR just a reveal effect on scroll.
      // "As I scroll down" usually implies continuous movement or a trigger.
      // Given the "grow larger" description, a reveal effect (opacity 0->1, scale 0.9->1) when it enters view is standard and performant.
      
      if (entry.isIntersecting) {
        heroImg.classList.add('visible');
      } else {
        // Optional: Remove class to replay animation when scrolling back up? 
        // Usually better to keep it once revealed for smoother UX.
        // But for "fade in... as I scroll down", if it's already at the top, it should trigger immediately.
      }
    });
  }, observerOptions);

  observer.observe(triggerSection);
  
  // Fallback trigger if already in view (e.g. page reload at top)
  setTimeout(() => {
     const rect = heroImg.getBoundingClientRect();
     if(rect.top < window.innerHeight) {
       heroImg.classList.add('visible');
     }
  }, 100);
}
