# Modern Carousel

A modern carousel (or slider) should rely primarily on CSS for layout and scrolling behavior, using JavaScript only for progressive enhancement (e.g., navigation buttons, tracking).

## Key Features
- **CSS Scroll Snap**: Provides the core "snap-to-slide" functionality.
- **`scroll-behavior: smooth`**: Ensures smooth scrolling when navigating programmatically.
- **Accessibility**: Uses semantic HTML and ensures keyboard navigability.
- **Responsive**: Adapts to different screen sizes naturally.

## Best Practices

### 1. Structure
Use a scrolling container with child items.

```html
<div class="carousel" role="region" aria-label="Image Carousel">
  <ul class="carousel-track">
    <li class="carousel-slide" id="slide1">
      <img src="image1.jpg" alt="Description 1" loading="lazy">
    </li>
    <li class="carousel-slide" id="slide2">
      <img src="image2.jpg" alt="Description 2" loading="lazy">
    </li>
    <li class="carousel-slide" id="slide3">
      <img src="image3.jpg" alt="Description 3" loading="lazy">
    </li>
  </ul>
</div>
```

### 2. CSS Scroll Snap
The magic happens in CSS.

```css
.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory; /* Snap horizontally */
  scroll-behavior: smooth;
  gap: 1rem;
  padding: 1rem;
  list-style: none;
}

.carousel-slide {
  flex: 0 0 100%; /* Each slide takes full width */
  scroll-snap-align: center; /* Snap to center of viewport */
}
```

### 3. Progressive Enhancement (Optional)
Add "Next" and "Previous" buttons that scroll the container.

```javascript
/*
  Example:
  track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
*/
```

## Anti-Patterns
- **Avoid absolute positioning** for layout calculations.
- **Avoid heavy JS libraries** that reimplement scrolling physics.
- **Don't hide scrollbars** without ensuring the content is clearly scrollable (e.g., using arrows or cut-off content).
