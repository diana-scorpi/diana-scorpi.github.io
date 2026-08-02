/* charts.js - Chart.js doughnut for canvas#reachChartFull */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    function initCharts() {
        var canvas = document.getElementById('reachChartFull');
        if (!canvas || typeof Chart === 'undefined') return;

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

    window.MediaKit.charts = {
        init: initCharts
    };
})();
