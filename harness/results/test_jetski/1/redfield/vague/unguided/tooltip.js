class Tooltip {
  constructor() {
    this.tooltipElement = null;
    this.activeTrigger = null;
    this.showTimeout = null;
    this.init();
  }

  init() {
    // Create the tooltip element once
    this.createTooltipElement();

    // Event delegation for all elements with data-tooltip
    document.body.addEventListener('mouseover', this.handleMouseOver.bind(this));
    document.body.addEventListener('mouseout', this.handleMouseOut.bind(this));
    document.body.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.body.addEventListener('focusout', this.handleFocusOut.bind(this));

    // Accessibility: Cleanup on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeTrigger) {
        this.hide();
      }
    });
  }

  createTooltipElement() {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.classList.add('tooltip');
    this.tooltipElement.setAttribute('role', 'tooltip');
    this.tooltipElement.id = 'global-tooltip';
    document.body.appendChild(this.tooltipElement);
  }

  show(trigger) {
    if (this.activeTrigger === trigger) return;

    this.activeTrigger = trigger;
    const text = trigger.getAttribute('data-tooltip');
    const placement = trigger.getAttribute('data-placement') || 'top';

    this.tooltipElement.textContent = text;
    this.tooltipElement.className = `tooltip ${placement}`; // Reset classes

    // Calculate position
    // Ideally use a library like Floating UI, but for this task manual calculation:
    const rect = trigger.getBoundingClientRect();

    // Note: CSS handles the positioning relative to the trigger if we wrap it, 
    // but since we are using a global tooltip appended to body, we need absolute math.

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Reset transform for calculation
    this.tooltipElement.style.left = '0';
    this.tooltipElement.style.top = '0';

    // We will just use the styles defined in CSS for "relative" parent if we were inside one.
    // But since we are global, we need to manually set top/left.
    // Actually, the CSS I wrote assumes it's inside a .container relative. 
    // Let's adjust the JS to append to the specific container OR adjust styling to be fixed/absolute to body.

    // Let's go with appending to body and calculating absolute position for better z-index handling.

    const tooltipRect = this.tooltipElement.getBoundingClientRect(); // Get size after text update

    let top, left;

    if (placement === 'top') {
      top = rect.top + scrollY - tooltipRect.height - 10; // 10px offset
      left = rect.left + scrollX + (rect.width / 2); // Center horizontally
    } else if (placement === 'bottom') {
      top = rect.bottom + scrollY + 10;
      left = rect.left + scrollX + (rect.width / 2);
    }

    // Apply calculated positions
    this.tooltipElement.style.top = `${top}px`;
    this.tooltipElement.style.left = `${left}px`;

    // Accessibility
    trigger.setAttribute('aria-describedby', this.tooltipElement.id);

    // Trigger reflow for transition
    void this.tooltipElement.offsetWidth;

    this.tooltipElement.classList.add('show');
  }

  hide() {
    if (!this.activeTrigger) return;

    this.tooltipElement.classList.remove('show');
    this.activeTrigger.removeAttribute('aria-describedby');
    this.activeTrigger = null;
  }

  handleMouseOver(e) {
    const trigger = e.target.closest('[data-tooltip]');
    if (trigger) {
      this.show(trigger);
    }
  }

  handleMouseOut(e) {
    const trigger = e.target.closest('[data-tooltip]');
    if (trigger && trigger === this.activeTrigger) {
      // Prevent hiding if moving to a child element
      if (trigger.contains(e.relatedTarget)) {
        return;
      }
      this.hide();
    }
  }

  handleFocusIn(e) {
    const trigger = e.target.closest('[data-tooltip]');
    if (trigger) {
      this.show(trigger);
    }
  }

  handleFocusOut(e) {
    const trigger = e.target.closest('[data-tooltip]');
    if (trigger && trigger === this.activeTrigger) {
      this.hide();
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new Tooltip();
});
