/* analytics.js - Google Analytics (gtag.js) bootstrap.
   The consent default (denied) is set inline in <head> before GTM loads.
   This module fires gtag('js') to timestamp the script load, and exposes
   the GA measurement ID for consent-banner.js to use after user consent.
   gtag('config') is intentionally NOT called here. */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    // Read gaId from config, with a hard fallback.
    var gaId = (window.MediaKit.config && window.MediaKit.config.gaId) || 'G-BXNRM9J4Q9';

    // Expose gaId for consent-banner.js.
    window.MediaKit.gaId = gaId;

    // Ensure dataLayer exists (GTM may or may not have created it yet).
    window.dataLayer = window.dataLayer || [];

    // Use the canonical window.gtag if GTM already defined it (async script may
    // have resolved before this defer fires). Otherwise fall back to a local push.
    if (typeof window.gtag !== 'function') {
        window.gtag = function gtag() { window.dataLayer.push(arguments); };
    }

    // Timestamp the script load. Always safe to call regardless of consent state.
    window.gtag('js', new Date());

    // gtag('config', gaId) is intentionally omitted here.
    // It will be called by consent-banner.js only after the user grants consent.
})();
