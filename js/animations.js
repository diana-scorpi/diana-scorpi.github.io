/* animations.js - IntersectionObserver scroll-reveal */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    /**
     * One-shot scroll reveal: adds .revealed the first time each element
     * enters the viewport, then unobserves it so the observer does no
     * further work for that element.
     */
    function initReveal() {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
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
