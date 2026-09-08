/* cases.js - Section 7 interactive hero case switcher + live TikTok metrics fetcher */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    // Guard: config and utils must be loaded before this module runs.
    if (!window.MediaKit.config || !window.MediaKit.utils) {
        console.warn('cases.js: config or utils not loaded — module skipped.');
        return;
    }

    var v1CasesData = window.MediaKit.config.v1CasesData || [];
    // tiktokVideoIds and formatCompact are kept in config/utils but not used here
    // while live fetch is disabled. Re-add when re-enabling fetchLiveTikTokMetrics.

    var brandItems = [];
    var heroCover, heroTitle, heroCategory, heroViews, heroLikes,
        heroTag, heroDesc, heroStatus, heroSource, heroPlayLink, heroBtn, syncStatus;

    /** Cache all hero-player and brand-list DOM references once. */
    function cacheDom() {
        brandItems = Array.prototype.slice.call(document.querySelectorAll('.v1-brand-item'));
        heroCover   = document.getElementById('v1-hero-cover');
        heroTitle   = document.getElementById('v1-hero-title');
        heroCategory = document.getElementById('v1-hero-category');
        heroViews   = document.getElementById('v1-hero-views');
        heroLikes   = document.getElementById('v1-hero-likes');
        heroTag     = document.getElementById('v1-hero-tag');
        heroDesc    = document.getElementById('v1-hero-desc');
        heroStatus  = document.getElementById('v1-hero-status');
        heroSource  = document.getElementById('v1-hero-source');
        heroPlayLink = document.getElementById('v1-hero-play-link');
        heroBtn     = document.getElementById('v1-hero-btn');
        syncStatus  = document.querySelector('#case-sync-status .case-sync-text');
    }

    function getCaseIndexById(id) {
        for (var index = 0; index < v1CasesData.length; index += 1) {
            if (v1CasesData[index].id === id) return index;
        }
        return -1;
    }

    /**
     * Switch the hero player to the case at the given index.
     * @param {number} index - Zero-based index into v1CasesData.
     */
    function selectCaseV1(index) {
        var data = v1CasesData[index];
        if (!data) return;

        brandItems.forEach(function (item, idx) {
            var itemIndex = getCaseIndexById(item.getAttribute('data-video-id'));
            var isActive = itemIndex === index || (itemIndex === -1 && idx === index);
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Null-guard each hero element — DOM may differ from expected structure.
        if (heroCover)    { heroCover.src = data.cover; heroCover.alt = 'Обкладинка кейсу: ' + data.title; }
        if (heroTitle)    heroTitle.textContent    = data.title;
        if (heroCategory) heroCategory.textContent = data.category;
        if (heroViews)    heroViews.textContent    = data.views;
        if (heroLikes)    heroLikes.textContent    = data.likes;
        if (heroTag)      heroTag.textContent      = data.tag;
        if (heroDesc)     heroDesc.textContent     = data.desc;
        if (heroStatus)   heroStatus.textContent   = data.status;
        if (heroSource)   heroSource.textContent   = data.source;
        if (heroPlayLink) heroPlayLink.href = data.link;
        if (heroBtn)      heroBtn.href      = data.link;
    }

    /** Bind click handlers to the brand list items. */
    function bindBrandItems() {
        brandItems.forEach(function (item, idx) {
            item.addEventListener('click', function () {
                var itemIndex = getCaseIndexById(item.getAttribute('data-video-id'));
                selectCaseV1(itemIndex === -1 ? idx : itemIndex);
            });
        });
    }

    /**

    /**
     * Fetch live view/like counts for one TikTok video through a CORS proxy
     * and update the case data + DOM. Aborts after 8s so a slow proxy can
     * never hang the UI; any failure falls back to the static values.
     * @param {{id: string, url: string, idx: number}} video
     * @returns {Promise<void>} Always resolves (never rejects).
     */
    function fetchVideoMetrics(video) {
        var controller = new AbortController();
        var timeoutId = setTimeout(function () { controller.abort(); }, 8000);

        var proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(video.url);

        return fetch(proxyUrl, { signal: controller.signal })
            .then(function (res) {
                if (!res.ok) return null;
                return res.json();
            })
            .then(function (data) {
                if (!data) return false;
                var html = data.contents || '';
                var wasUpdated = false;

                var diggMatch = html.match(/"diggCount":(\d+)/);
                var playMatch = html.match(/"playCount":(\d+)/);

                if (playMatch && playMatch[1]) {
                    wasUpdated = true;
                    var viewsNum = parseInt(playMatch[1], 10);
                    var viewsFormatted = formatCompact(viewsNum);

                    v1CasesData[video.idx].views = viewsFormatted;
                    var sideEl = document.getElementById('v1-side-views-' + video.idx);
                    if (sideEl) sideEl.innerText = viewsFormatted;

                    var activeItem = document.querySelector('.v1-brand-item.active');
                    if (activeItem && brandItems.indexOf(activeItem) === video.idx) {
                        if (heroViews) heroViews.innerText = viewsFormatted;
                    }
                }

                if (diggMatch && diggMatch[1]) {
                    wasUpdated = true;
                    var likesNum = parseInt(diggMatch[1], 10);
                    var likesFormatted = formatCompact(likesNum);

                    v1CasesData[video.idx].likes = likesFormatted + ' Лайків';
                    var activeItem2 = document.querySelector('.v1-brand-item.active');
                    if (activeItem2 && brandItems.indexOf(activeItem2) === video.idx) {
                        if (heroLikes) heroLikes.innerText = likesFormatted + ' Лайків';
                    }
                }

                return wasUpdated;
            })
            .catch(function () {
                // Graceful fallback to static pre-rendered values (incl. abort/timeout)
                return false;
            })
            .then(function (wasUpdated) {
                clearTimeout(timeoutId);
                return wasUpdated;
            });
    }

    /**
     * [DISABLED] Fetch live metrics for all configured TikTok videos in parallel.
     * Promise.allSettled keeps per-item isolation: one failure never
     * affects the others and no rejection is ever unhandled.
     *
     * Re-enable by removing the comment markers and calling fetchLiveTikTokMetrics()
     * from init() — but ONLY after moving the fetch to a server-side/build-time process
     * with schema validation, caching and rate-limit handling.
     */
    // function fetchLiveTikTokMetrics() {
    //     Promise.allSettled(tiktokVideoIds.map(fetchVideoMetrics)).then(function (results) {
    //         if (!syncStatus) return;
    //         var updatedCount = results.filter(function (result) {
    //             return result.status === 'fulfilled' && result.value;
    //         }).length;
    //         syncStatus.innerText = updatedCount > 0
    //             ? 'Оновлено автоматично: ' + updatedCount + ' із ' + tiktokVideoIds.length
    //             : 'Показано збережені дані';
    //     });
    // }

    /** Initialise the cases module. */
    function init() {
        cacheDom();
        bindBrandItems();
        var firstCaseIndex = brandItems.length ? getCaseIndexById(brandItems[0].getAttribute('data-video-id')) : 0;
        selectCaseV1(firstCaseIndex === -1 ? 0 : firstCaseIndex);
        // Live TikTok metrics fetch is intentionally disabled.
        // The public CORS proxy (api.allorigins.win) is uncontrolled and unreliable.
        // To re-enable, move fetchLiveTikTokMetrics() to a server-side/build-time process
        // with schema validation, caching and rate-limit handling, then call it here.
        // fetchLiveTikTokMetrics();
    }

    window.MediaKit.cases = {
        init: init,
        selectCaseV1: selectCaseV1,
        selectCaseById: function (id) {
            var index = getCaseIndexById(id);
            if (index !== -1) selectCaseV1(index);
        }
    };
})();
