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

    /** Toggle collapsible analytics detail grid */
    function bindAnalyticsToggle() {
        var toggleBtn = document.getElementById('toggleAnalyticsBtn');
        var detailGrid = document.getElementById('analyticsDetailGrid');
        if (!toggleBtn || !detailGrid) return;

        toggleBtn.addEventListener('click', function () {
            var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            var nextState = !isExpanded;
            toggleBtn.setAttribute('aria-expanded', nextState ? 'true' : 'false');
            detailGrid.classList.toggle('is-collapsed', !nextState);
            var label = toggleBtn.querySelector('span:first-child');
            var arrow = toggleBtn.querySelector('.toggle-arrow');
            if (label) {
                label.textContent = nextState
                    ? 'Сховати розширену статистику Instagram'
                    : 'Детальніша статистика Instagram (Reels & Дії)';
            }
            if (arrow) {
                arrow.textContent = nextState ? '↑' : '↓';
            }
        });
    }

    /** Initialise all MediaKit modules (each guard-checked) and page controls. */
    function init() {
        var MK = window.MediaKit;

        if (MK.navigation) MK.navigation.init();
        if (MK.counters) MK.counters.init();
        if (MK.charts) MK.charts.init();
        if (MK.animations) MK.animations.init();
        if (MK.videoCatalog) MK.videoCatalog.init();
        if (MK.cases) MK.cases.init();
        if (MK.packages) MK.packages.init();
        if (MK.slide4_1) MK.slide4_1.init();

        bindPrintButtons();
        bindAnalyticsToggle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
