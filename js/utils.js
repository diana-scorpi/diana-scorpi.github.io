/* utils.js - Shared helpers */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    window.MediaKit.utils = {
        /**
         * Format a raw number as compact K-notation (>=1000 → "X.XK").
         * @param {number} n - Raw count.
         * @returns {string|number} Compact string, or the number itself if < 1000.
         */
        formatCompact: function (n) {
            return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n;
        }
    };
})();
