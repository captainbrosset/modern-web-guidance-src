/**
 * TooltipManager
 * A lightweight, accessible, and premium tooltip controller.
 */
class TooltipManager {
    constructor() {
        this.tooltips = new Map(); // Map trigger -> tooltip element
        this._init();
    }

    _init() {
        // Delegate events
        document.addEventListener('mouseover', this._handleMouseOver.bind(this));
        document.addEventListener('mouseout', this._handleMouseOut.bind(this));
        document.addEventListener('focusin', this._handleFocus.bind(this)); // For keyboard
        document.addEventListener('focusout', this._handleBlur.bind(this));
        
        // Handle ESC key to close all
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this._hideAll();
            }
        });
    }

    _handleMouseOver(e) {
        const trigger = e.target.closest('[data-tooltip]');
        if (trigger) this.show(trigger);
    }

    _handleMouseOut(e) {
        const trigger = e.target.closest('[data-tooltip]');
        if (trigger) this.hide(trigger);
    }

    _handleFocus(e) {
        const trigger = e.target.closest('[data-tooltip]');
        if (trigger) this.show(trigger);
    }

    _handleBlur(e) {
        const trigger = e.target.closest('[data-tooltip]');
        if (trigger) this.hide(trigger);
    }

    _hideAll() {
        this.tooltips.forEach((tooltip, trigger) => {
            this.hide(trigger);
        });
    }

    show(trigger) {
        // If already showing, don't recreate
        if (this.tooltips.has(trigger)) return;

        const content = trigger.getAttribute('data-tooltip');
        if (!content) return;

        // A11y: Connect trigger and tooltip
        const tooltipId = 'tooltip-' + Math.random().toString(36).substr(2, 9);
        trigger.setAttribute('aria-describedby', tooltipId);

        // Create tooltip DOM
        const tooltip = document.createElement('div');
        tooltip.id = tooltipId;
        tooltip.className = 'tooltip';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.textContent = content;
        
        // Default placement
        const placement = trigger.getAttribute('data-placement') || 'top';
        tooltip.setAttribute('data-placement', placement);

        document.body.appendChild(tooltip);
        this.tooltips.set(trigger, tooltip);

        // Calculate Position
        this._position(trigger, tooltip, placement);

        // Trigger animation
        requestAnimationFrame(() => {
            tooltip.classList.add('is-visible');
        });
    }

    hide(trigger) {
        const tooltip = this.tooltips.get(trigger);
        if (!tooltip) return;

        // A11y: Cleanup
        trigger.removeAttribute('aria-describedby');

        // Animation Out
        tooltip.classList.remove('is-visible');

        // Remove from DOM after transition
        tooltip.addEventListener('transitionend', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, { once: true });

        this.tooltips.delete(trigger);
    }

    _position(trigger, tooltip, placement) {
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const gap = 12; // Space between trigger and tooltip

        let top, left;

        switch (placement) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - gap;
                left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = triggerRect.bottom + gap;
                left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.left - tooltipRect.width - gap;
                break;
            case 'right':
                top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.right + gap;
                break;
        }

        // Basic Viewport Boundary Protection (simplified)
        // Adjust if going off-screen (left/top)
        if (left < 10) left = 10;
        if (top < 10) top = 10;
        
        // Apply + Scroll offset
        tooltip.style.top = `${top + window.scrollY}px`;
        tooltip.style.left = `${left + window.scrollX}px`;
    }
}

// Initialize
const tooltips = new TooltipManager();
