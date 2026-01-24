document.addEventListener('DOMContentLoaded', () => {
  // --- Adaptive Loading ---
  const heroImg = document.getElementById('hero-image');
  const highResUrl = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop';
  const plainHolderColor = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiA5IiB3aWR0aD0iMTYiIGhlaWdodD0iOSI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjkiIGZpbGw9IiMxZTE5MTYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzUwNDAzMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMC41Ij5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==';

  const updateImageSource = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection ? (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) : false;

    if (isSlow) {
      console.log('Adaptive Loading: Slow connection detected. Using placeholder.');
      heroImg.src = plainHolderColor;
      heroImg.alt = "Coffee (Placeholder)";
    } else {
      console.log('Adaptive Loading: Good connection. Loading high-res image.');
      heroImg.src = highResUrl;
      // Preload high-res if needed or just let src handle it
    }
  };

  // Initial check
  updateImageSource();
  
  // Listen for connection changes
  if (navigator.connection) {
    navigator.connection.addEventListener('change', updateImageSource);
  }

  // --- Popover Hover Logic ---
  const detailsBtn = document.getElementById('details-btn');
  const ingredientsPopover = document.getElementById('ingredients-popover');
  
  if (detailsBtn && ingredientsPopover) {
    const show = () => {
      try {
        if (!ingredientsPopover.matches(':popover-open')) {
          ingredientsPopover.showPopover();
        }
      } catch (e) {
        // Ignore errors if already open
      }
    };

    const hide = () => {
      try {
        if (ingredientsPopover.matches(':popover-open')) {
          ingredientsPopover.hidePopover();
        }
      } catch (e) {
        // Ignore
      }
    };

    // Show on enter
    detailsBtn.addEventListener('mouseenter', show);
    
    // Hide on leave 
    // Optimization: Add a small delay effectively or ensure we can move mouse to popover if intended.
    // However, usually "hover popover" implies tooltip-like behavior. 
    // If the popover overlaps the button, we can maintain it. 
    // For this demo, simple leave = hide is sufficient or we can use a timeout.
    detailsBtn.addEventListener('mouseleave', () => {
      // Small timeout to allow intended jitter or very quick movement
      setTimeout(() => {
        // More complex logic would check if mouse is over popover, 
        // but for a strict "hover button" requirement:
        // "triggers a non-modal popover when a user hovers over IT [the button]"
        if (!ingredientsPopover.matches(':hover') && !detailsBtn.matches(':hover')) {
           hide();
        }
      }, 100);
    });

    // Also hide if leaving the popover itself (if we managed to get there)
    ingredientsPopover.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!detailsBtn.matches(':hover')) {
          hide();
        }
      }, 100);
    });
  }
});
