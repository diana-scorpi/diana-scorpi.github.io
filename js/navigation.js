/* navigation.js - Slide navigation, scroll spy and back-to-top */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    var slides = [];
    var sideDots = [];
    var backToTopBtn = null;
    var currentSlideIndex = 0;
    var isSlideTransitioning = false;
    var wheelCooldownTimer = null;
    var scrollTicking = false;

    /**
     * Mark the side-nav dot at the given index as active (no-op if unchanged).
     * @param {number} idx - Zero-based slide index.
     */
    function updateActiveDots(idx) {
        sideDots.forEach(function (dot, dIdx) {
            if (dIdx === idx) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Recompute the current slide index from the scroll position.
     * Layout reads (offsetTop/clientHeight) are batched before the single
     * class/attribute write to avoid layout thrashing.
     */
    function updateCurrentIndex() {
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        var newIndex = currentSlideIndex;
        slides.forEach(function (slide, idx) {
            if (scrollPos >= slide.offsetTop - slide.clientHeight / 2) {
                newIndex = idx;
            }
        });
        if (newIndex !== currentSlideIndex) {
            currentSlideIndex = newIndex;
            updateActiveDots(newIndex);
        }
    }

    /**
     * Scroll to a slide and update navigation state.
     * @param {number} index - Zero-based slide index.
     */
    function scrollToSlideFast(index) {
        if (!slides[index]) return;

        isSlideTransitioning = true;
        currentSlideIndex = index;
        updateActiveDots(index);

        var targetY = slides[index].offsetTop;
        window.scrollTo({
            top: targetY,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });

        clearTimeout(wheelCooldownTimer);
        wheelCooldownTimer = setTimeout(function () {
            isSlideTransitioning = false;
        }, 650);
    }

    /**
     * Scroll to a slide by index (public API).
     * @param {number} index - Zero-based slide index.
     */
    function scrollToSlide(index) {
        scrollToSlideFast(index);
    }

    /** Scroll back to the first slide (public API). */
    function scrollToTop() {
        scrollToSlideFast(0);
    }

    /** Scroll handler body: scroll-spy + back-to-top visibility. */
    function onScroll() {
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        updateCurrentIndex();

        if (!backToTopBtn) return;

        if (scrollPos > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    /** rAF-throttled scroll listener (runs at most once per frame). */
    function onScrollThrottled() {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(function () {
            onScroll();
            scrollTicking = false;
        });
    }

    /** Move exactly one section per deliberate vertical wheel gesture. */
    function onWheel(e) {
        if (Math.abs(e.deltaY) < 8 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

        updateCurrentIndex();

        var direction = e.deltaY > 0 ? 1 : -1;
        var nextIndex = currentSlideIndex + direction;

        // Keep normal browser scrolling before the first and after the last slide.
        if (nextIndex < 0 || nextIndex >= slides.length) return;

        e.preventDefault();
        if (isSlideTransitioning) return;

        scrollToSlideFast(nextIndex);
    }

    /** Bind click handlers to side-nav dots (native <button> elements). */
    function bindSideNav() {
        sideDots.forEach(function (dot, idx) {
            dot.addEventListener('click', function () {
                scrollToSlide(idx);
            });
        });
    }

    /** Bind the floating back-to-top button and any [data-action="scroll-top"]. */
    function bindBackToTop() {
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }
        var topBtns = document.querySelectorAll('[data-action="scroll-top"]');
        Array.prototype.forEach.call(topBtns, function (btn) {
            btn.addEventListener('click', scrollToTop);
        });
    }

    /** Cache DOM references, bind controls and global listeners. */
    function init() {
        slides = Array.prototype.slice.call(document.querySelectorAll('.section-slide'));
        sideDots = Array.prototype.slice.call(document.querySelectorAll('.side-nav-dot'));
        backToTopBtn = document.getElementById('backToTop');

        bindSideNav();
        bindBackToTop();

        window.addEventListener('scroll', onScrollThrottled, { passive: true });
        window.addEventListener('wheel', onWheel, { passive: false });
        onScroll();
    }

    window.MediaKit.navigation = {
        init: init,
        scrollToSlide: scrollToSlide,
        scrollToTop: scrollToTop
    };
})();
