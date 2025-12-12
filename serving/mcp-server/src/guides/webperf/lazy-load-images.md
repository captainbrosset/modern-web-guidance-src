# Best Practices for Lazy Loading Images

Lazy loading images helps reduce initial page weight and network contention, ensuring critical resources (like the LCP candidate) load faster.

## The `loading="lazy"` Attribute
The standard way to lazy load images is the native HTML attribute:

```html
<img src="image.jpg" loading="lazy" alt="..." width="800" height="600">
```

## When TO Use It
- Images that are **below the fold** (off-screen initially).
- Non-critical decorative images.

## When NOT To Use It
- **The LCP candidate**: The largest image in the viewport (often the hero image) should NEVER be lazy-loaded. It delays the Largest Contentful Paint metric.
- Icons or small UI elements that are always visible.

## Browser Support
Native lazy loading is supported in all modern browsers (Chrome, Firefox, Safari).
Baseline Status: [Widely available](https://web.dev/baseline).

## Feature Detection & Fallback
If you need to support very old browsers (like IE), you can use a polyfill or a library like lazysizes, but for modern web development, the native attribute is usually sufficient.

## Anti-Pattern: CSS Background Images
Native `loading="lazy"` does NOT apply to CSS `background-image`. For those, you generally need JavaScript (IntersectionObserver) to apply a class when the element is near the viewport.
