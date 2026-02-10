export class Tooltip {
    constructor(triggerElement) {
        this.trigger = triggerElement;
        this.content = this.trigger.getAttribute('data-tooltip') || 'Tooltip';
        this.tooltip = null;
        this.isVisible = false;

        this.init();
    }

    init() {
        // Accessibility
        this.trigger.setAttribute('aria-label', this.content);
        
        // Bind events
        this.trigger.addEventListener('mouseenter', () => this.show());
        this.trigger.addEventListener('mouseleave', () => this.hide());
        this.trigger.addEventListener('focus', () => this.show());
        this.trigger.addEventListener('blur', () => this.hide());
        
        // Keyboard support (Escape to close)
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
        });
    }

    createTooltip() {
        if (this.tooltip) return;

        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.textContent = this.content;
        this.tooltip.setAttribute('role', 'tooltip');
        this.tooltip.id = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
        this.trigger.setAttribute('aria-describedby', this.tooltip.id);
        
        this.trigger.parentElement.appendChild(this.tooltip);
        // Force reflow to enable transition
        this.tooltip.offsetHeight; 
    }

    show() {
        if (this.isVisible) return;
        
        this.createTooltip();
        requestAnimationFrame(() => {
             this.tooltip.classList.add('is-active');
        });
        this.isVisible = true;
    }

    hide() {
        if (!this.isVisible || !this.tooltip) return;

        this.tooltip.classList.remove('is-active');
        
        // Wait for transition to finish before removing
        this.tooltip.addEventListener('transitionend', () => {
            if (this.tooltip && !this.tooltip.classList.contains('is-active')) {
                this.tooltip.remove();
                this.tooltip = null;
                this.trigger.removeAttribute('aria-describedby');
            }
        }, { once: true });
        
        this.isVisible = false;
    }
}
