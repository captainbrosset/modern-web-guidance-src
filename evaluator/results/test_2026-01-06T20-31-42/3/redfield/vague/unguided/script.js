export class Tooltip {
    constructor(triggerElement, tooltipElement) {
        this.trigger = triggerElement;
        this.tooltip = tooltipElement;
        
        this.init();
    }

    init() {
        if (!this.trigger || !this.tooltip) return;

        // Set initial ARIA state
        this.trigger.setAttribute('aria-expanded', 'false');
        this.tooltip.setAttribute('role', 'tooltip');
        this.tooltip.setAttribute('aria-hidden', 'true');

        // Bind events
        this.trigger.addEventListener('mouseenter', () => this.show());
        this.trigger.addEventListener('mouseleave', () => this.hide());
        
        // Keyboard accessibility
        this.trigger.addEventListener('focus', () => this.show());
        this.trigger.addEventListener('blur', () => this.hide());
        
        // Dismiss on Escape
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.hide();
            }
        });
    }

    show() {
        this.trigger.setAttribute('aria-expanded', 'true');
        this.tooltip.setAttribute('aria-hidden', 'false');
    }

    hide() {
        this.trigger.setAttribute('aria-expanded', 'false');
        this.tooltip.setAttribute('aria-hidden', 'true');
    }

    isVisible() {
        return this.tooltip.getAttribute('aria-hidden') === 'false';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('tooltip-trigger');
    const tooltip = document.getElementById('tooltip');
    new Tooltip(trigger, tooltip);
});
