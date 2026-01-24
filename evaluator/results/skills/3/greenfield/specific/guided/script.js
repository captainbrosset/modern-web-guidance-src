(function() {
    'use strict';

    // Polyfill Configuration
    const polyfills = [
        {
            name: 'popover',
            check: () => HTMLElement.prototype.hasOwnProperty('popover'),
            src: 'https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js'
        },
        {
            name: 'interestfor',
            // Check for Interest Invokers support
            check: () => HTMLButtonElement.prototype.hasOwnProperty('interestForElement') || 'interestFor' in HTMLButtonElement.prototype,
            src: 'https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js'
        },
        {
            name: 'anchor-positioning',
            check: () => 'positionAnchor' in document.documentElement.style || CSS.supports('position-anchor: --foo'),
            src: 'https://unpkg.com/@oddbird/css-anchor-positioning@0.8.0/dist/css-anchor-positioning.js'
        },
        {
            name: 'adaptive-loading',
            check: () => 'loadingPlaceholder' in HTMLImageElement.prototype,
            src: 'http://example.github.io/adaptive-loading-polyfill/adaptive-loading.min.js',
            fallback: () => {
                // Manual fallback for Adaptive Loading
                console.log('Running manual Adaptive Loading check...');
                const images = document.querySelectorAll('img[loading-placeholder]');
                if (images.length === 0) return;

                const isSlow = () => {
                    if ('connection' in navigator) {
                        const conn = navigator.connection;
                        return conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
                    }
                    return false;
                };

                if (isSlow()) {
                    console.log('Slow connection detected. Swapping to placeholders.');
                    images.forEach(img => {
                        const placeholder = img.getAttribute('loading-placeholder');
                        if (placeholder) {
                            img.src = placeholder;
                        }
                    });
                } else {
                    console.log('Connection is fast enough. Keeping original source.');
                }
            }
        }
    ];

    polyfills.forEach(feature => {
        if (!feature.check()) {
            console.log(`Polyfilling ${feature.name}...`);
            if (feature.src) {
                const script = document.createElement('script');
                script.src = feature.src;
                script.async = true;
                script.onerror = () => {
                    console.warn(`Failed to load polyfill for ${feature.name} from ${feature.src}`);
                    if (feature.fallback) feature.fallback();
                };
                
                // If it's the adaptive loading example URL, we might want to just run the fallback immediately 
                // if we suspect it doesn't exist, but we'll let it fail naturally first?
                // Actually, for adaptive loading, let's run the fallback logic *anyway* if the script fails, which is handled above.
                // But since that specific URL is likely a placeholder from the Skill, let's anticipate it might 404.
                
                document.head.appendChild(script);
            } else if (feature.fallback) {
                feature.fallback();
            }
        } else {
            console.log(`${feature.name} is supported natively.`);
        }
    });

    // Interest Invokers simple fallback if the polyfill doesn't cover everything or for demo purposes if needed
    // The interestfor polyfill should handle it, but just in case:
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('details-btn');
        const popover = document.getElementById('ingredients-popover');
        
        // If interestFor is technically supported but maybe not working fully in this environment,
        // or if we rely on the polyfill which might take a moment to load.
        // We do nothing, relying on the attribute.
    });

})();
