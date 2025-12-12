# Modern Tooltip

Modern tooltips leverage platform features like the **Popover API** and **Interest Invokers** to provide accessible, performant, and easy-to-implement contextual information.

## Key Features
- **Popover API**: Handles the "top-layer" behavior, ensuring tooltips break out of containers (z-index wars are over!).
- **Interest Invokers**: Provides native `hover` and `focus` triggers for showing/hiding popovers without custom JavaScript event listeners.
- **CSS Anchor Positioning**: Allows positioning the tooltip relative to the trigger element using CSS alone (with fallbacks if needed).

## Best Practices

### 1. Basic Structure (Popover + Interest Invoker)
Use the `popover` attribute on the tooltip and `interesttarget` (experimental) on the trigger.

> [!NOTE]
> The `interesttarget` attribute is experimental. As of late 2024/early 2025, it is being standardized as `interestfor` (or similar) in some contexts. Always check browser support.
> For broad compatibility today, you might still need a small JS polyfill or fallback for the trigger behavior.

```html
<!-- Trigger -->
<button type="button" interestfor="my-tooltip">
  Hover me
</button>

<!-- Tooltip -->
<div id="my-tooltip" popover role="tooltip">
  This is a modern tooltip!
</div>
```

### 2. Positioning with CSS Anchors
Link the tooltip to the trigger visually.

```css
/* Assign anchor name to the trigger */
button[interestfor] {
  anchor-name: --tooltip-trigger;
}

/* Position the tooltip */
[popover] {
  position-anchor: --tooltip-trigger;
  top: anchor(bottom); /* Position below the trigger */
  left: anchor(center); /* Center horizontally */
  margin: 0.5rem 0; /* Add some spacing */
  
  /* Reset default popover styles */
  margin: 0; 
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

### 3. Fallback (If Interest Invokers not supported)
If `interestfor` isn't fully supported yet, you can use `popovertarget` for click-toggles, or minimal JS for hover.

```javascript
// Minimal hover support if native interestfor is missing
const trigger = document.querySelector('button[interestfor]');
const tooltip = document.getElementById(trigger.getAttribute('interestfor'));

trigger.addEventListener('mouseenter', () => tooltip.showPopover());
trigger.addEventListener('mouseleave', () => tooltip.hidePopover());
trigger.addEventListener('focus', () => tooltip.showPopover());
trigger.addEventListener('blur', () => tooltip.hidePopover());
```

## Anti-Patterns
- **Avoid global event listeners** to manage open/close state if possible.
- **Don't use `title` attribute** for rich tooltips; it's not accessible enough and styling is impossible.
- **Avoid purely CSS-based tooltips** (e.g., generic `::after` content) if the content is important for accessibility trees.
