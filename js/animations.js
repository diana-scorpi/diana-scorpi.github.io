/* animations.js - IntersectionObserver scroll-reveal */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    function initReveal() {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.glass-box, .section-title, .feature-card, .metric-big-num, .case-item-row').forEach(function (el) {
            el.classList.add('reveal-element');
            revealObserver.observe(el);
        });
    }

    window.MediaKit.animations = {
        init: initReveal
    };
})();
