class ModernTooltip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const text = this.getAttribute('text') || 'Tooltip text';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: relative;
                    display: inline-block;
                }
                
                .tooltip-container {
                    position: absolute;
                    bottom: 125%;
                    left: 50%;
                    transform: translateX(-50%) translateY(10px);
                    background-color: #333;
                    color: #fff;
                    text-align: center;
                    padding: 8px 12px;
                    border-radius: 6px;
                    z-index: 100;
                    font-size: 14px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
                    pointer-events: none;
                    white-space: nowrap;
                    width: max-content;
                    max-width: 200px;
                }

                :host([visible]) .tooltip-container {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(-50%) translateY(0);
                }

                .tooltip-arrow {
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #333 transparent transparent transparent;
                }
            </style>
            <slot></slot>
            <div class="tooltip-container" part="tooltip">
                ${text}
                <div class="tooltip-arrow"></div>
            </div>
        `;

        this.trigger = this.shadowRoot.querySelector('slot');
        this.tooltip = this.shadowRoot.querySelector('.tooltip-container');

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);

        this.addEventListener('mouseenter', this.show);
        this.addEventListener('mouseleave', this.hide);
        this.addEventListener('focusin', this.show);
        this.addEventListener('focusout', this.hide);
    }

    disconnectedCallback() {
        this.removeEventListener('mouseenter', this.show);
        this.removeEventListener('mouseleave', this.hide);
        this.removeEventListener('focusin', this.show);
        this.removeEventListener('focusout', this.hide);
    }

    show() {
        this.setAttribute('visible', '');
        this.setAttribute('aria-expanded', 'true');
    }

    hide() {
        this.removeAttribute('visible');
        this.setAttribute('aria-expanded', 'false');
    }
}

customElements.define('modern-tooltip', ModernTooltip);
