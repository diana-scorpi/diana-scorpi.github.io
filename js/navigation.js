/* navigation.js - native scrolling with boundary section snap */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    var slides = [];
    var sideDots = [];
    var backToTopBtn = null;
    var currentSlideIndex = 0;
    var scrollTicking = false;
    var sectionObserver = null;
    var snapReleaseTimer = null;
    var snapInProgress = false;
    var boundaryDelta = 0;
    var touchStartY = null;
    var initialized = false;

    var BOUNDARY_TOLERANCE = 28;
    var WHEEL_TRIGGER = 18;
    var TOUCH_TRIGGER = 48;
    var SNAP_LOCK_MS = 760;
    var SCROLL_POSITION_KEY = 'diana-media-kit-scroll-y';
    var SCROLL_POSITION_PENDING_KEY = 'diana-media-kit-scroll-pending';

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function getSlideBounds(slide) {
        var rect = slide.getBoundingClientRect();
        var scrollTop = getScrollTop();

        return {
            top: rect.top + scrollTop,
            bottom: rect.bottom + scrollTop
        };
    }

    function updateActiveDots(index) {
        sideDots.forEach(function (dot, dotIndex) {
            if (dotIndex === index) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
    }

    function setCurrentSlide(index) {
        if (index < 0 || index >= slides.length) return;

        currentSlideIndex = index;
        updateActiveDots(index);
    }

    function updateCurrentIndexFromViewport() {
        if (!slides.length) return;

        var viewportTop = getScrollTop();
        var viewportBottom = viewportTop + window.innerHeight;
        var mostVisibleIndex = 0;
        var mostVisiblePixels = -1;

        slides.forEach(function (slide, index) {
            var bounds = getSlideBounds(slide);
            var visiblePixels = Math.max(0, Math.min(viewportBottom, bounds.bottom) - Math.max(viewportTop, bounds.top));

            if (visiblePixels > mostVisiblePixels) {
                mostVisiblePixels = visiblePixels;
                mostVisibleIndex = index;
            }
        });

        setCurrentSlide(mostVisibleIndex);
    }

    function observeSlides() {
        if (!('IntersectionObserver' in window)) return;

        sectionObserver = new IntersectionObserver(function () {
            updateCurrentIndexFromViewport();
        }, {
            rootMargin: '-30% 0px -30% 0px',
            threshold: [0, 0.1, 0.25, 0.5]
        });

        slides.forEach(function (slide) { sectionObserver.observe(slide); });
    }

    function releaseSnapLock() {
        snapInProgress = false;
        snapReleaseTimer = null;
    }

    function lockSnap() {
        snapInProgress = true;
        window.clearTimeout(snapReleaseTimer);
        snapReleaseTimer = window.setTimeout(releaseSnapLock, SNAP_LOCK_MS);
    }

    function scrollToSlide(index) {
        if (!slides[index]) return;

        lockSnap();
        slides[index].scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start'
        });
        setCurrentSlide(index);
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
    }

    function saveScrollPosition() {
        try {
            window.sessionStorage.setItem(SCROLL_POSITION_KEY, String(Math.round(getScrollTop())));
        } catch (error) {
            // Storage can be unavailable in private browsing; native restoration still works there.
        }
    }

    function restoreScrollPosition(event) {
        // Only restore when returning via browser back/forward (bfcache).
        // Restoring on a normal load or refresh would unexpectedly skip the hero section.
        var returningToPage = Boolean(event && event.persisted);
        if (!returningToPage) return;

        var savedPosition = null;
        try {
            savedPosition = Number(window.sessionStorage.getItem(SCROLL_POSITION_KEY));
            // Clear the pending flag so a subsequent normal load does not restore position.
            window.sessionStorage.removeItem(SCROLL_POSITION_PENDING_KEY);
        } catch (error) {
            return;
        }

        if (!Number.isFinite(savedPosition) || savedPosition <= 0) return;

        window.requestAnimationFrame(function () {
            window.scrollTo({ top: savedPosition, behavior: 'auto' });
            window.requestAnimationFrame(updateCurrentIndexFromViewport);
        });
    }

    function bindSectionLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            var targetId = link.getAttribute('href').slice(1);
            var targetIndex = slides.findIndex(function (slide) { return slide.id === targetId; });

            if (targetIndex === -1) return;

            link.addEventListener('click', function (event) {
                if (event.defaultPrevented) return;

                event.preventDefault();
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', '#' + targetId);
                }
                scrollToSlide(targetIndex);
            });
        });
    }

    function canAdvanceAtBoundary(direction) {
        if (!slides.length || direction === 0) return false;

        var slide = slides[currentSlideIndex];
        if (!slide) return false;

        var bounds = getSlideBounds(slide);
        var viewportTop = getScrollTop();
        var viewportBottom = viewportTop + window.innerHeight;

        if (direction > 0) {
            return currentSlideIndex < slides.length - 1 && viewportBottom >= bounds.bottom - BOUNDARY_TOLERANCE;
        }

        return currentSlideIndex > 0 && viewportTop <= bounds.top + BOUNDARY_TOLERANCE;
    }

    function triggerBoundarySnap(direction, event) {
        if (!canAdvanceAtBoundary(direction)) {
            boundaryDelta = 0;
            return false;
        }

        var delta = Math.abs(event && event.deltaY ? event.deltaY : 0);
        boundaryDelta += event && event.deltaMode === 1 ? delta * 16 : delta;

        if (boundaryDelta < WHEEL_TRIGGER) return false;

        if (event && event.cancelable) event.preventDefault();
        boundaryDelta = 0;

        if (snapInProgress) return true;

        if (direction > 0) {
            scrollToSlide(currentSlideIndex + 1);
        } else {
            scrollToSlide(currentSlideIndex - 1);
        }

        return true;
    }

    function onWheel(event) {
        if (!event || !event.deltaY) return;

        updateCurrentIndexFromViewport();

        var direction = event.deltaY > 0 ? 1 : -1;

        if (snapInProgress) {
            if (event.cancelable) event.preventDefault();
            return;
        }

        if (!triggerBoundarySnap(direction, event)) boundaryDelta = 0;
    }

    function onTouchStart(event) {
        if (event.touches && event.touches.length === 1) {
            touchStartY = event.touches[0].clientY;
        }
    }

    function onTouchEnd(event) {
        if (touchStartY === null || !event.changedTouches || !event.changedTouches.length) return;

        var endY = event.changedTouches[0].clientY;
        var swipeDistance = touchStartY - endY;
        touchStartY = null;

        if (Math.abs(swipeDistance) < TOUCH_TRIGGER) return;

        updateCurrentIndexFromViewport();
        var direction = swipeDistance > 0 ? 1 : -1;

        if (canAdvanceAtBoundary(direction)) {
            if (event.cancelable) event.preventDefault();
            if (direction > 0) {
                scrollToSlide(currentSlideIndex + 1);
            } else {
                scrollToSlide(currentSlideIndex - 1);
            }
        }
    }

    function onScroll() {
        var scrollPosition = getScrollTop();
        if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollPosition > 400);
        saveScrollPosition();
        updateCurrentIndexFromViewport();
    }

    function onScrollThrottled() {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(function () {
            onScroll();
            scrollTicking = false;
        });
    }

    function bindSideNav() {
        sideDots.forEach(function (dot, index) {
            dot.addEventListener('click', function () { scrollToSlide(index); });
        });
    }

    function bindBackToTop() {
        if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTop);
        document.querySelectorAll('[data-action="scroll-top"]').forEach(function (button) {
            button.addEventListener('click', scrollToTop);
        });
    }

    function init() {
        if (initialized) return;
        initialized = true;

        slides = Array.prototype.slice.call(document.querySelectorAll('.section-slide'));
        sideDots = Array.prototype.slice.call(document.querySelectorAll('.side-nav-dot'));
        backToTopBtn = document.getElementById('backToTop');

        if (window.history && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        bindSideNav();
        bindBackToTop();
        bindSectionLinks();
        observeSlides();
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: false });
        window.addEventListener('scroll', onScrollThrottled, { passive: true });
        window.addEventListener('pagehide', saveScrollPosition);
        window.addEventListener('pageshow', restoreScrollPosition);
        onScroll();
    }

    window.MediaKit.navigation = {
        init: init,
        scrollToSlide: scrollToSlide,
        scrollToTop: scrollToTop,
        canAdvanceAtBoundary: canAdvanceAtBoundary
    };
})();
