import './style.css'

const trigger = document.getElementById('tooltip-trigger') as HTMLButtonElement | null;
const tooltip = document.getElementById('tooltip-content') as HTMLDivElement | null;

if (trigger && tooltip) {
  const showTooltip = () => {
    tooltip.classList.remove('hidden');
    tooltip.classList.add('showing');
    trigger.setAttribute('aria-expanded', 'true');
  };

  const hideTooltip = () => {
    tooltip.classList.remove('showing');
    tooltip.classList.add('hidden');
    trigger.setAttribute('aria-expanded', 'false');
  };

  // Mouse events
  trigger.addEventListener('mouseenter', showTooltip);
  trigger.addEventListener('mouseleave', hideTooltip);

  // Keyboard focus events for accessibility
  trigger.addEventListener('focus', showTooltip);
  trigger.addEventListener('blur', hideTooltip);

  // Escape key to close tooltip
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideTooltip();
    }
  });
}
