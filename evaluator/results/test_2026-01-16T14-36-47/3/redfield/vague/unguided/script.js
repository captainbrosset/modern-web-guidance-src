document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('tooltip-trigger');
    const tooltip = document.getElementById('tooltip');

    // Accessibility Setup
    trigger.setAttribute('aria-describedby', 'tooltip');
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');

    // Show/Hide Logic
    const showTooltip = () => {
        tooltip.setAttribute('data-visible', 'true');
        tooltip.setAttribute('aria-hidden', 'false');
    };

    const hideTooltip = () => {
        tooltip.setAttribute('data-visible', 'false');
        tooltip.setAttribute('aria-hidden', 'true');
    };

    // Event Listeners for Mouse
    trigger.addEventListener('mouseenter', showTooltip);
    trigger.addEventListener('mouseleave', hideTooltip);

    // Event Listeners for Keyboard (Focus)
    trigger.addEventListener('focus', showTooltip);
    trigger.addEventListener('blur', hideTooltip);

    // Close on Escape key if focused
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideTooltip();
        }
    });
});
