/* utils.js — Shared helpers: DOM query cache & number formatting */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    var domCache = {};

    window.MediaKit.utils = {
        /**
         * Cached document.getElementById
         */
        byId: function (id) {
            if (!(id in domCache)) {
                domCache[id] = document.getElementById(id);
            }
            return domCache[id];
        },

        /**
         * Cached document.querySelectorAll (as Array)
         */
        all: function (selector) {
            var key = 'all:' + selector;
            if (!(key in domCache)) {
                domCache[key] = Array.prototype.slice.call(document.querySelectorAll(selector));
            }
            return domCache[key];
        },

        /**
         * Format a raw number as compact K-notation (>=1000 → "X.XK")
         */
        formatCompact: function (n) {
            return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n;
        }
    };
})();
