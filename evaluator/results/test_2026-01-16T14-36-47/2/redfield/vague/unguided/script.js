class TooltipManager {
  constructor(triggerElement) {
    this.trigger = triggerElement;
    this.tooltipId = this.trigger.getAttribute('aria-describedby');
    this.tooltip = document.getElementById(this.tooltipId);

    if (!this.tooltip) {
      console.warn(`Tooltip with id "${this.tooltipId}" not found.`);
      return;
    }

    this.init();
  }

  init() {
    // Event Listeners for Mouse
    this.trigger.addEventListener('mouseenter', () => this.show());
    this.trigger.addEventListener('mouseleave', () => this.hide());

    // Event Listeners for Keyboard (Focus)
    this.trigger.addEventListener('focus', () => this.show());
    this.trigger.addEventListener('blur', () => this.hide());
    
    // Accessibility: Escape key to close
    this.trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hide();
      }
    });
  }

  show() {
    this.tooltip.setAttribute('aria-hidden', 'false');
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  hide() {
    this.tooltip.setAttribute('aria-hidden', 'true');
    this.trigger.setAttribute('aria-expanded', 'false');
  }
}

// Initialize all tooltips on the page
document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.tooltip-trigger');
  triggers.forEach(trigger => new TooltipManager(trigger));
});
