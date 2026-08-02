/* analytics.js - Google Analytics (gtag.js) bootstrap.
   The external async script tag for gtag/js remains in <head>. */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    var gaId = (window.MediaKit.config && window.MediaKit.config.gaId) || 'G-BXNRM9J4Q9';

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', gaId);
})();
