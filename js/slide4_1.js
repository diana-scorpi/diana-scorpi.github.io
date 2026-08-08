/* Section 4.1 sparkline reveal */

(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    function initSlide4_1() {
        var slide = document.getElementById('live-stats');
        if (!slide) return;

        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            var sparklineObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var sparklines = entry.target.querySelectorAll('.stats-sparkline');
                        sparklines.forEach(function (sparkline) {
                            sparkline.classList.add('sparkline-animated');
                        });
                        sparklineObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            sparklineObserver.observe(slide);
        } else {
            slide.querySelectorAll('.stats-sparkline').forEach(function (sparkline) {
                sparkline.classList.add('sparkline-animated');
            });
        }
    }

    window.MediaKit.slide4_1 = {
        init: initSlide4_1
    };

})();
