/**
 * Adaptive Loading & Polyfills
 */

// Feature detection helpers
const hasInterestFor = 'interestForElement' in HTMLButtonElement.prototype;
const hasPopover = 'popover' in HTMLElement.prototype;

// Simple simulation of 'interestfor' if not supported
// Note: This is a very basic fallback for demonstration. 
// Real-world would use the proper polyfill mentioned in the guide.
if (!hasInterestFor || !hasPopover) {
    console.warn("Interest Invokers/Popover not deeply supported. Applying basic mouseover fallback.");
    
    const triggers = document.querySelectorAll('[interestfor]');
    
    triggers.forEach(trigger => {
        // Fallback for popover API if completely missing (older browsers)
        // If popover is supported but interestfor isn't, we can try manual toggle.
        const targetId = trigger.getAttribute('interestfor');
        const target = document.getElementById(targetId);
        
        if (target) {
            trigger.addEventListener('mouseenter', () => {
                try {
                    target.showPopover();
                } catch (e) {
                    // Fallback for no popover API
                    target.style.display = 'block';
                    target.style.position = 'absolute';
                    // Positioning would require floating-ui or similar manual math here
                }
            });
            
            trigger.addEventListener('mouseleave', () => {
                try {
                    target.hidePopover();
                } catch (e) {
                     target.style.display = 'none';
                }
            });
        }
    });
}

/**
 * Adaptive Loading Implementation
 * Checks network status and swaps image src if needed.
 */
function handleAdaptiveLoading() {
    // 1. Check if navigator.connection is available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return; // Feature not supported, do nothing (browser loads default src)

    // 2. Determine if network is "slow"
    // 'save-data' mode or effectiveType is 2g/3g
    const isSlow = connection.saveData || 
                   connection.effectiveType === '2g' || 
                   connection.effectiveType === '3g';

    if (isSlow) {
        console.log("Slow network detected. Adapting content...");
        
        const images = document.querySelectorAll('img[loading-placeholder]');
        
        images.forEach(img => {
            const placeholder = img.getAttribute('loading-placeholder');
            if (placeholder) {
                // Swap the source to the placeholder
                img.src = placeholder;
            }
        });
    } else {
        console.log("Network status: " + connection.effectiveType + ". Loading high-res content.");
    }
}

// Run adaptive loading check on load
document.addEventListener('DOMContentLoaded', handleAdaptiveLoading);
