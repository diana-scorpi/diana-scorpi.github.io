/* app.js - Bootstrap / init on DOMContentLoaded */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    /** Bind window.print() to every [data-action="print"] button. */
    function bindPrintButtons() {
        var printBtns = document.querySelectorAll('[data-action="print"]');
        Array.prototype.forEach.call(printBtns, function (btn) {
            btn.addEventListener('click', function () {
                window.print();
            });
        });
    }

    /** Initialise all MediaKit modules (each guard-checked) and page controls. */
    function init() {
        var MK = window.MediaKit;

        if (MK.navigation) MK.navigation.init();
        if (MK.counters) MK.counters.init();
        if (MK.charts) MK.charts.init();
        if (MK.animations) MK.animations.init();
        if (MK.cases) MK.cases.init();

        bindPrintButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
