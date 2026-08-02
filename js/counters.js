/* counters.js - Animated number counters for .metric-big-num */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    /**
     * Animate every .metric-big-num from 0 to its target value the first time
     * it enters the viewport. Each element is unobserved right after its
     * animation starts, so the observer retains no references once all
     * counters have run (one-shot, no leak).
     */
    function animateCounters() {
        var counters = document.querySelectorAll('.metric-big-num');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.target.classList.contains('metric-age-pulse') || entry.target.classList.contains('metric-cities-badge')) {
                    return;
                }

                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    observer.unobserve(entry.target);
                    var targetText = entry.target.getAttribute('data-count') || entry.target.innerText.trim();
                    entry.target.setAttribute('data-count', targetText);

                    if (/\d+[\s--]+\d+/.test(targetText) || !/\d/.test(targetText)) {
                        return;
                    }

                    var match = targetText.match(/^([0-9.,]+)(.*)$/);
                    if (!match) return;

                    var numStr = match[1].replace(/,/g, '');
                    var numericVal = parseFloat(numStr);
                    var suffix = match[2];

                    if (isNaN(numericVal)) return;

                    var duration = 1000;
                    var startTime = performance.now();
                    var hasDecimal = numStr.indexOf('.') !== -1;
                    var decimalPlaces = hasDecimal ? (numStr.split('.')[1] || '').length : 0;

                    function updateCount(currentTime) {
                        var elapsed = currentTime - startTime;
                        var progress = Math.min(elapsed / duration, 1);
                        var easeProgress = progress * (2 - progress);
                        var currentVal = (numericVal * easeProgress).toFixed(decimalPlaces);

                        entry.target.innerText = currentVal + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.innerText = targetText;
                        }
                    }

                    requestAnimationFrame(updateCount);
                }
            });
        }, { threshold: 0.2 });

        counters.forEach(function (counter) {
            if (!counter.classList.contains('metric-age-pulse') && !counter.classList.contains('metric-cities-badge')) {
                if (!counter.getAttribute('data-count')) {
                    counter.setAttribute('data-count', counter.innerText.trim());
                }
                observer.observe(counter);
            }
        });
    }

    window.MediaKit.counters = {
        init: animateCounters
    };
})();
