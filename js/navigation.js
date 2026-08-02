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

    function updateCurrentIndex() {
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        slides.forEach(function (slide, idx) {
            if (scrollPos >= slide.offsetTop - slide.clientHeight / 2) {
                currentSlideIndex = idx;
                updateActiveDots(idx);
            }
        });
    }

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

    function scrollToSlide(index) {
        scrollToSlideFast(index);
    }

    function scrollToTop() {
        scrollToSlideFast(0);
    }

    function onScroll() {
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        updateCurrentIndex();

        if (scrollPos > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

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

    function bindSideNav() {
        sideDots.forEach(function (dot, idx) {
            dot.addEventListener('click', function () {
                scrollToSlide(idx);
            });
        });
    }

    function bindBackToTop() {
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }
        var topBtns = document.querySelectorAll('[data-action="scroll-top"]');
        Array.prototype.forEach.call(topBtns, function (btn) {
            btn.addEventListener('click', scrollToTop);
        });
    }

    function init() {
        slides = Array.prototype.slice.call(document.querySelectorAll('.section-slide'));
        sideDots = Array.prototype.slice.call(document.querySelectorAll('.side-nav-dot'));
        backToTopBtn = document.getElementById('backToTop');

        bindSideNav();
        bindBackToTop();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKeydown);
    }

    window.MediaKit.navigation = {
        init: init,
        scrollToSlide: scrollToSlide,
        scrollToTop: scrollToTop
    };
})();
