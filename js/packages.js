/* packages.js - goal-based package spotlight */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    var goalButtons = [];
    var cards = [];
    var initialized = false;

    function cardMatchesGoal(card, goal) {
        if (goal === 'all') return true;
        return card.getAttribute('data-package-goal') === goal;
    }

    function applyGoal(goal) {
        var activeGoal = goal || 'all';

        goalButtons.forEach(function (button) {
            var isActive = button.getAttribute('data-package-goal') === activeGoal;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        cards.forEach(function (card) {
            var isMatch = cardMatchesGoal(card, activeGoal);
            card.classList.toggle('is-goal-match', isMatch);
            card.classList.toggle('is-goal-muted', !isMatch);
        });
    }

    function decorateCards() {
        var goalByPosition = ['test', 'hero', 'campaign', 'campaign'];
        cards.forEach(function (card, index) {
            if (!card.getAttribute('data-package-goal')) {
                card.setAttribute('data-package-goal', goalByPosition[index] || 'campaign');
            }
        });
    }

    function init() {
        if (initialized) return;
        initialized = true;
        goalButtons = Array.prototype.slice.call(document.querySelectorAll('.pricing-goal-btn'));
        cards = Array.prototype.slice.call(document.querySelectorAll('.pricing-card'));
        if (!goalButtons.length || !cards.length) return;

        decorateCards();
        goalButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                applyGoal(button.getAttribute('data-package-goal') || 'all');
            });
        });
        applyGoal('all');
    }

    window.MediaKit.packages = {
        init: init,
        applyGoal: applyGoal
    };
})();
