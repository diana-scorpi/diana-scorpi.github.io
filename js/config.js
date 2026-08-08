/* config.js - Shared data & constants */
(function () {
    'use strict';

    window.MediaKit = window.MediaKit || {};

    window.MediaKit.config = {
        /** Google Analytics measurement ID (used by analytics.js). */
        gaId: 'G-BXNRM9J4Q9',

        /** Static fallback data for the Section 7 hero case switcher. */
        v1CasesData: [
            {
                title: "Лимонади «ТернОпілля»",
                category: "Beverage",
                views: "25.3K Переглядів",
                likes: "657 Лайків",
                tag: "+25.3K FYP Reach",
                status: "Опубліковано",
                source: "Рекомендації (FYP)",
                desc: "Нативна літня інтеграція лимонадів «ТернОпілля» від компанії Опілля. Органічний сценарій пікніка з адаптацією під тренди TikTok.",
                cover: "assets/images/video1-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7665250133474315540"
            },
            {
                title: "Гастро Фестиваль Food Fest",
                category: "Events",
                views: "20.3K Переглядів",
                likes: "301 Лайків",
                tag: "+20.3K Охоплення",
                status: "Опубліковано",
                source: "Рекомендації (FYP)",
                desc: "Анонс та яскравий репортаж із фестивалю у Тернополі. Активне залучення молодіжної аудиторії та прямі продажі квитків.",
                cover: "assets/images/video2-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7652416548442852629"
            },
            {
                title: "Догляд За Волоссям (Hair Care)",
                category: "Beauty",
                views: "13.9K Переглядів",
                likes: "197 Лайків",
                tag: "+13.9K Охоплення",
                status: "Опубліковано",
                source: "Рекомендації (FYP)",
                desc: "Мій щоденний туторіал із догляду за волоссям. Щирий огляд доглядових засобів з високим рівнем довіри дівчат.",
                cover: "assets/images/video3-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7639679991541665045"
            },
            {
                title: "Parfum City - Огляд Ароматів",
                category: "Perfumery",
                views: "25.2K Переглядів",
                likes: "476 Лайків",
                tag: "+25.2K • Промокод TIK927",
                status: "Опубліковано",
                source: "Рекомендації (FYP)",
                desc: "Огляд улюблених ароматів із персональним промокодом TIK927. Чудова конверсія та велика кількість переходів на сайт.",
                cover: "assets/images/video4-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7625945472674417941"
            },
            {
                title: "Luxord Home - Затишний Огляд",
                category: "Home Care",
                views: "13.3K Переглядів",
                likes: "182 Лайків",
                tag: "+13.3K Охоплення",
                status: "Опубліковано",
                source: "Рекомендації (FYP)",
                desc: "Атмосферний влог про прибирання та затишок у домі із засобами Luxord Home. Природна порада бренда для домашнього догляду.",
                cover: "assets/images/video5-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7624536127499717908"
            }
        ],

        /** TikTok videos polled for live view/like metrics (idx maps to v1CasesData). */
        tiktokVideoIds: [
            { id: '7665250133474315540', url: 'https://www.tiktok.com/@diana.scorpi/video/7665250133474315540', idx: 0 },
            { id: '7652416548442852629', url: 'https://www.tiktok.com/@diana.scorpi/video/7652416548442852629', idx: 1 },
            { id: '7639679991541665045', url: 'https://www.tiktok.com/@diana.scorpi/video/7639679991541665045', idx: 2 },
            { id: '7625945472674417941', url: 'https://www.tiktok.com/@diana.scorpi/video/7625945472674417941', idx: 3 },
            { id: '7624536127499717908', url: 'https://www.tiktok.com/@diana.scorpi/video/7624536127499717908', idx: 4 }
        ]
    };
})();
