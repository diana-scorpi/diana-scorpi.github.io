/* consent-banner.js
   Minimal GA Consent Mode v2 cookie banner.
   – Displays once, persists choice in localStorage.
   – On accept: updates consent to 'granted', calls gtag('config').
   – On decline: keeps consent 'denied', banner hidden permanently.
   – Zero external dependencies; uses existing design tokens.

   Relies on window.gtag being the canonical push function (set by either
   the inline head script or analytics.js, whichever runs first). */
(function () {
    'use strict';

    var STORAGE_KEY = 'diana-media-kit-cookie-consent';
    var ACCEPTED = 'accepted';
    var DECLINED = 'declined';

    function getStoredChoice() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function storeChoice(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* private/quota */ }
    }

    /** Call gtag safely — window.gtag is guaranteed to exist by analytics.js. */
    function callGtag() {
        if (typeof window.gtag === 'function') {
            window.gtag.apply(window, arguments);
        }
    }

    function updateConsent(granted) {
        var state = granted ? 'granted' : 'denied';
        callGtag('consent', 'update', {
            analytics_storage: state,
            ad_storage: state,
            functionality_storage: state,
            personalization_storage: state
        });

        if (granted) {
            var gaId = (window.MediaKit && window.MediaKit.gaId) || 'G-BXNRM9J4Q9';
            callGtag('config', gaId);
        }
    }

    function removeBanner(banner) {
        if (banner && banner.parentNode) {
            banner.parentNode.removeChild(banner);
        }
    }

    function createBanner() {
        var banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Повідомлення про файли cookie');
        banner.setAttribute('aria-describedby', 'cookie-banner-desc');

        var p = document.createElement('p');
        p.id = 'cookie-banner-desc';
        p.className = 'cookie-banner-text';
        p.innerHTML =
            'Цей сайт використовує Google Analytics для аналізу відвідуваності. ' +
            'Дані анонімізовані та не передаються третім особам. ' +
            '<a href="https://policies.google.com/privacy" target="_blank" ' +
            'rel="noopener noreferrer" class="cookie-banner-link">' +
            'Політика конфіденційності Google</a>';

        var actions = document.createElement('div');
        actions.className = 'cookie-banner-actions';

        var acceptBtn = document.createElement('button');
        acceptBtn.type = 'button';
        acceptBtn.className = 'btn btn-glow cookie-btn';
        acceptBtn.textContent = 'Прийняти';

        var declineBtn = document.createElement('button');
        declineBtn.type = 'button';
        declineBtn.className = 'btn btn-quiet cookie-btn';
        declineBtn.textContent = 'Відхилити';

        actions.appendChild(acceptBtn);
        actions.appendChild(declineBtn);
        banner.appendChild(p);
        banner.appendChild(actions);

        document.body.appendChild(banner);

        // Move focus to accept button so keyboard users are immediately aware.
        // Use rAF to ensure the element is painted before focus is set.
        var previouslyFocused = document.activeElement;
        window.requestAnimationFrame(function () { acceptBtn.focus(); });

        function dismiss(granted) {
            // Restore focus to the element that had it before the banner appeared.
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
            removeBanner(banner);
            if (granted) {
                storeChoice(ACCEPTED);
                updateConsent(true);
            } else {
                storeChoice(DECLINED);
                updateConsent(false);
            }
        }

        acceptBtn.addEventListener('click', function () { dismiss(true); });
        declineBtn.addEventListener('click', function () { dismiss(false); });

        return banner;
    }

    function init() {
        var choice = getStoredChoice();

        if (choice === ACCEPTED) {
            updateConsent(true);
            return;
        }

        if (choice === DECLINED) {
            updateConsent(false);
            return;
        }

        // No stored choice — show banner.
        createBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
