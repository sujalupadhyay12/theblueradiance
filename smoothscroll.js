name=smoothscroll.js
// ====================================
// SMOOTH SCROLL POLYFILL
// ====================================

(function() {
    'use strict';

    // Smooth scroll implementation
    function smoothScroll(element, options = {}) {
        const startPosition = window.pageYOffset || document.documentElement.scrollTop;
        const elementOffset = element.getBoundingClientRect().top + startPosition;
        const targetPosition = elementOffset - (options.offset || 0);
        const duration = options.duration || 1000;
        const easing = options.easing || 'easeInOutQuad';

        const distance = targetPosition - startPosition;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            const ease = getEaseFunction(easing);
            const position = startPosition + distance * ease(progress);

            window.scrollTo(0, position);

            if (elapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    function getEaseFunction(easing) {
        const easings = {
            linear: (t) => t,
            easeInQuad: (t) => t * t,
            easeOutQuad: (t) => t * (2 - t),
            easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: (t) => t * t * t,
            easeOutCubic: (t) => (--t) * t * t + 1,
            easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
        };

        return easings[easing] || easings.easeInOutQuad;
    }

    // Handle anchor links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;

        e.preventDefault();
        const href = target.getAttribute('href');
        const element = document.querySelector(href);

        if (element) {
            smoothScroll(element, { duration: 800, offset: 100 });
        }
    });

    // Expose to global scope
    window.smoothScroll = smoothScroll;
})();