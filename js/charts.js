/* charts.js - Chart.js doughnut for canvas#reachChartFull */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    /**
     * Create the FYP reach doughnut chart on #reachChartFull.
     * No-op when the canvas is missing or Chart.js failed to load.
     */
    function createReachChart(canvas) {
        var ctxReachFull = canvas.getContext('2d');
        new Chart(ctxReachFull, {
            type: 'doughnut',
            data: {
                labels: ['Не підписники (FYP)', 'Підписники'],
                datasets: [{
                    data: [93.6, 6.4],
                    backgroundColor: ['#ff2e93', 'rgba(255, 255, 255, 0.12)'],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '78%',
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    /**
     * Lazily initialise the doughnut: the Chart.js instance is only created
     * when the canvas approaches the viewport (IntersectionObserver), which
     * keeps it off the critical rendering path. Falls back to immediate
     * creation when IntersectionObserver is unavailable. Requires Chart.js
     * to be already loaded (deferred CDN script runs before this file).
     */
    function initCharts() {
        var canvas = document.getElementById('reachChartFull');
        if (!canvas || typeof Chart === 'undefined') return;

        if (!('IntersectionObserver' in window)) {
            createReachChart(canvas);
            return;
        }

        var chartObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    chartObserver.disconnect();
                    createReachChart(canvas);
                }
            });
        }, { rootMargin: '200px' });

        chartObserver.observe(canvas);
    }

    window.MediaKit.charts = {
        init: initCharts
    };
})();
