/* video-catalog.js - filterable and sortable advertising video catalogue */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    var filters = [];
    var sortButtons = [];
    var cards = [];
    var catalog = null;
    var countLabel = null;
    var activeFilter = 'all';
    var activeSort = 'newest';
    var initialized = false;

    function getCasesData() {
        return (window.MediaKit.config && window.MediaKit.config.v1CasesData) || [];
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        var parts = dateString.split('-');
        return parts.length === 3 ? parts[2] + '.' + parts[1] + '.' + parts[0] : dateString;
    }

    function formatViews(value) {
        if (window.MediaKit.utils && window.MediaKit.utils.formatCompact) {
            return window.MediaKit.utils.formatCompact(value);
        }
        return value;
    }

    function decorateCards() {
        cards.forEach(function (card, index) {
            var data = getCasesData()[index];
            if (!data) return;

            card.setAttribute('data-video-id', data.id);
            card.setAttribute('data-video-published', data.publishedAt);
            card.setAttribute('data-video-views', String(data.viewsCount));

            var viewsLabel = card.querySelector('.video-catalog-views');
            if (viewsLabel) viewsLabel.innerText = formatViews(data.viewsCount);

            var meta = card.querySelector('.video-catalog-meta');
            if (meta && !meta.querySelector('.video-catalog-date')) {
                var dateLabel = document.createElement('span');
                dateLabel.className = 'video-catalog-date';
                dateLabel.innerText = formatDate(data.publishedAt);
                meta.insertBefore(dateLabel, meta.querySelector('.video-catalog-action'));
            }
        });
    }

    function cardMatchesFilter(card, filter) {
        if (filter === 'all') return true;
        return (card.getAttribute('data-video-category') || '').toLowerCase() === filter;
    }

    function updateSortControls() {
        sortButtons.forEach(function (button) {
            var isActive = button.getAttribute('data-video-sort') === activeSort;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function applyFilter(filter) {
        activeFilter = filter || 'all';
        var visibleCount = 0;
        var firstVisibleCard = null;
        var activeCardIsVisible = false;

        cards.forEach(function (card) {
            var isVisible = cardMatchesFilter(card, activeFilter);
            card.classList.toggle('is-hidden', !isVisible);
            card.setAttribute('aria-hidden', isVisible ? 'false' : 'true');

            if (isVisible) {
                card.removeAttribute('tabindex');
                if (!firstVisibleCard) firstVisibleCard = card;
                if (card.classList.contains('active')) activeCardIsVisible = true;
                visibleCount += 1;
            } else {
                card.setAttribute('tabindex', '-1');
            }
        });

        filters.forEach(function (button) {
            var isActive = button.getAttribute('data-video-filter') === activeFilter;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        if (countLabel) countLabel.innerText = visibleCount;

        if (!activeCardIsVisible && firstVisibleCard && window.MediaKit.cases) {
            var firstId = firstVisibleCard.getAttribute('data-video-id');
            if (window.MediaKit.cases.selectCaseById) {
                window.MediaKit.cases.selectCaseById(firstId);
            }
        }
    }

    function sortCards(sort) {
        activeSort = sort === 'views' ? 'views' : 'newest';
        cards.sort(function (first, second) {
            if (activeSort === 'views') {
                return Number(second.getAttribute('data-video-views')) - Number(first.getAttribute('data-video-views'));
            }
            return second.getAttribute('data-video-published').localeCompare(first.getAttribute('data-video-published'));
        });

        cards.forEach(function (card) { catalog.appendChild(card); });
        updateSortControls();
        applyFilter(activeFilter);
    }

    function cacheDom() {
        catalog = document.getElementById('videoCatalog');
        filters = Array.prototype.slice.call(document.querySelectorAll('[data-video-filter]'));
        sortButtons = Array.prototype.slice.call(document.querySelectorAll('[data-video-sort]'));
        cards = Array.prototype.slice.call(document.querySelectorAll('.video-catalog-card'));
        countLabel = document.getElementById('videoCatalogCount');
    }

    function bindFilters() {
        filters.forEach(function (button) {
            button.addEventListener('click', function () {
                applyFilter(button.getAttribute('data-video-filter') || 'all');
            });
        });

        sortButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                sortCards(button.getAttribute('data-video-sort') || 'newest');
            });
        });
    }

    function init() {
        if (initialized) return;
        initialized = true;
        cacheDom();
        if (!catalog || !cards.length) return;
        decorateCards();
        bindFilters();
        sortCards('newest');
    }

    window.MediaKit.videoCatalog = {
        init: init,
        applyFilter: applyFilter,
        sortCards: sortCards
    };
})();
