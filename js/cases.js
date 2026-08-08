/* cases.js - Section 7 interactive hero case switcher + live TikTok metrics fetcher */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    var v1CasesData = window.MediaKit.config.v1CasesData;
    var tiktokVideoIds = window.MediaKit.config.tiktokVideoIds;
    var formatCompact = window.MediaKit.utils.formatCompact;

    var brandItems = [];
    var heroCover, heroTitle, heroCategory, heroViews, heroLikes,
        heroTag, heroDesc, heroStatus, heroSource, heroPlayLink, heroBtn, syncStatus;

    /** Cache all hero-player and brand-list DOM references once. */
    function cacheDom() {
        brandItems = Array.prototype.slice.call(document.querySelectorAll('.v1-brand-item'));
        heroCover = document.getElementById('v1-hero-cover');
        heroTitle = document.getElementById('v1-hero-title');
        heroCategory = document.getElementById('v1-hero-category');
        heroViews = document.getElementById('v1-hero-views');
        heroLikes = document.getElementById('v1-hero-likes');
        heroTag = document.getElementById('v1-hero-tag');
        heroDesc = document.getElementById('v1-hero-desc');
        heroStatus = document.getElementById('v1-hero-status');
        heroSource = document.getElementById('v1-hero-source');
        heroPlayLink = document.getElementById('v1-hero-play-link');
        heroBtn = document.getElementById('v1-hero-btn');
        syncStatus = document.querySelector('#case-sync-status .case-sync-text');
    }

    /**
     * Switch the hero player to the case at the given index.
     * @param {number} index - Zero-based index into v1CasesData.
     */
    function selectCaseV1(index) {
        var data = v1CasesData[index];
        if (!data) return;

        brandItems.forEach(function (item, idx) {
            var isActive = idx === index;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        heroCover.src = data.cover;
        heroTitle.innerText = data.title;
        heroCategory.innerText = data.category;
        heroViews.innerText = data.views;
        heroLikes.innerText = data.likes;
        heroTag.innerText = data.tag;
        heroDesc.innerText = data.desc;
        heroStatus.innerText = data.status;
        heroSource.innerText = data.source;
        heroPlayLink.href = data.link;
        heroBtn.href = data.link;
    }

    /** Bind click handlers to the brand list items. */
    function bindBrandItems() {
        brandItems.forEach(function (item, idx) {
            item.addEventListener('click', function () {
                selectCaseV1(idx);
            });
        });
    }

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

                    v1CasesData[video.idx].views = viewsFormatted + ' Переглядів';
                    var sideEl = document.getElementById('v1-side-views-' + video.idx);
                    if (sideEl) sideEl.innerText = viewsFormatted;

                    var activeItem = document.querySelector('.v1-brand-item.active');
                    if (activeItem && brandItems.indexOf(activeItem) === video.idx) {
                        if (heroViews) heroViews.innerText = viewsFormatted + ' Переглядів';
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
     * Fetch live metrics for all configured TikTok videos in parallel.
     * Promise.allSettled keeps per-item isolation: one failure never
     * affects the others and no rejection is ever unhandled.
     */
    function fetchLiveTikTokMetrics() {
        Promise.allSettled(tiktokVideoIds.map(fetchVideoMetrics)).then(function (results) {
            if (!syncStatus) return;

            var updatedCount = results.filter(function (result) {
                return result.status === 'fulfilled' && result.value;
            }).length;

            syncStatus.innerText = updatedCount > 0
                ? 'Оновлено автоматично: ' + updatedCount + ' із ' + tiktokVideoIds.length
                : 'Показано збережені дані';
        });
    }

    /** Initialise the cases module. */
    function init() {
        cacheDom();
        bindBrandItems();
        selectCaseV1(0);
        fetchLiveTikTokMetrics();
    }

    window.MediaKit.cases = {
        init: init,
        selectCaseV1: selectCaseV1
    };
})();
