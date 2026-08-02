/* navigation.js - Scroll spy, side-dot nav, wheel/keyboard slide transitions, back-to-top */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    var slides = [];
    var sideDots = [];
    var backToTopBtn = null;
    var currentSlideIndex = 0;
    var isScrolling = false;
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
     * Smooth-scroll to a slide and update nav state, with a short cooldown
     * during which wheel gestures are ignored.
     * @param {number} index - Zero-based slide index.
     */
    function scrollToSlideFast(index) {
        isScrolling = true;
        currentSlideIndex = index;
        updateActiveDots(index);

        var targetY = slides[index].offsetTop;
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });

        clearTimeout(wheelCooldownTimer);
        wheelCooldownTimer = setTimeout(function () {
            isScrolling = false;
        }, 350);
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

    /**
     * Wheel handler: hijacks the wheel to snap between full-screen slides.
     * Must stay non-passive because it calls preventDefault().
     * @param {WheelEvent} e
     */
    function onWheel(e) {
        e.preventDefault();
        if (isScrolling) return;
        if (Math.abs(e.deltaY) < 6) return;

        updateCurrentIndex();

        if (e.deltaY > 0) {
            if (currentSlideIndex < slides.length - 1) {
                currentSlideIndex++;
                scrollToSlideFast(currentSlideIndex);
            }
        } else if (e.deltaY < 0) {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                scrollToSlideFast(currentSlideIndex);
            }
        }
    }

    /**
     * Keyboard handler: Arrow/Page Up/Down snap between slides.
     * @param {KeyboardEvent} e
     */
    function onKeydown(e) {
        if (['ArrowDown', 'PageDown'].indexOf(e.code) !== -1) {
            e.preventDefault();
            if (currentSlideIndex < slides.length - 1) {
                currentSlideIndex++;
                scrollToSlideFast(currentSlideIndex);
            }
        } else if (['ArrowUp', 'PageUp'].indexOf(e.code) !== -1) {
            e.preventDefault();
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                scrollToSlideFast(currentSlideIndex);
            }
        }
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
        window.addEventListener('keydown', onKeydown);
    }

    window.MediaKit.navigation = {
        init: init,
        scrollToSlide: scrollToSlide,
        scrollToTop: scrollToTop
    };
})();
