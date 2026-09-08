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
                id: '7665250133474315540',
                publishedAt: '2026-07-22',
                viewsCount: 30600,
                category: "Beverage",
                views: "25.3K",
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
                id: '7652416548442852629',
                publishedAt: '2026-06-17',
                viewsCount: 20500,
                category: "Events",
                views: "20.3K",
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
                id: '7639679991541665045',
                publishedAt: '2026-05-14',
                viewsCount: 14200,
                category: "Beauty",
                views: "13.9K",
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
                id: '7625945472674417941',
                publishedAt: '2026-04-07',
                viewsCount: 25200,
                category: "Perfumery",
                views: "25.2K",
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
                id: '7624536127499717908',
                publishedAt: '2026-04-03',
                viewsCount: 13400,
                category: "Home Care",
                views: "13.3K",
                likes: "182 Лайків",
                tag: "+13.3K Охоплення",
                status: "Опубліковано",
                source: "Рекомендації (FYP)",
                desc: "Атмосферний влог про прибирання та затишок у домі із засобами Luxord Home. Природна порада бренда для домашнього догляду.",
                cover: "assets/images/video5-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7624536127499717908"
            },
            {
                title: "Kursach - Студентський лайфхак",
                id: '7681689198004391189',
                publishedAt: '2026-09-04',
                viewsCount: 7705,
                category: "Education",
                views: "7.8K",
                likes: "210 Лайків",
                tag: "Промокод СКОРПІО20",
                status: "Опубліковано",
                source: "TikTok органіка",
                desc: "Нативний ролик про навчання, два університети та рішення для студентів із промокодом СКОРПІО20.",
                cover: "assets/images/video6-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7681689198004391189"
            },
            {
                title: "Soika - Ензимна пудра",
                id: '7680939390176120085',
                publishedAt: '2026-09-02',
                viewsCount: 19200,
                category: "Beauty",
                views: "19.2K",
                likes: "423 Лайків",
                tag: "Beauty integration",
                status: "Опубліковано",
                source: "TikTok органіка",
                desc: "Живий beauty-контент із демонстрацією ензимної пудри у звичному ранковому форматі.",
                cover: "assets/images/video7-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7680939390176120085"
            },
            {
                title: "Tesori d'Oriente Ukraine - Part 01",
                id: '7679505692327267604',
                publishedAt: '2026-08-29',
                viewsCount: 2951,
                category: "Beauty",
                views: "3.0K",
                likes: "35 Лайків",
                tag: "Beauty & Home",
                status: "Опубліковано",
                source: "TikTok органіка",
                desc: "Атмосферна інтеграція Tesori d'Oriente Ukraine з фокусом на аромат і щоденний догляд.",
                cover: "assets/images/video8-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7679505692327267604"
            },
            {
                title: "Tesori d'Oriente Ukraine - Part 02",
                id: '7678020032286215444',
                publishedAt: '2026-08-25',
                viewsCount: 5883,
                category: "Beauty",
                views: "5.9K",
                likes: "105 Лайків",
                tag: "Beauty & Home",
                status: "Опубліковано",
                source: "TikTok органіка",
                desc: "Друга нативна інтеграція бренду з продуктом у сюжеті та рекомендацією для аудиторії.",
                cover: "assets/images/video9-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7678020032286215444"
            },
            {
                title: "Safe Baby - 3D іграшки",
                id: '7678259066111528213',
                publishedAt: '2026-08-26',
                viewsCount: 8763,
                category: "Kids",
                views: "8.7K",
                likes: "120 Лайків",
                tag: "Kids & Gifts",
                status: "Опубліковано",
                source: "TikTok органіка",
                desc: "Нативний огляд дитячих іграшок, надрукованих на 3D-принтері, у форматі ідеї для подарунка.",
                cover: "assets/images/video10-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7678259066111528213"
            },
            {
                title: "Safe Baby - Подарунок",
                id: '7677199513466981652',
                publishedAt: '2026-08-23',
                viewsCount: 17200,
                category: "Kids",
                views: "17.2K",
                likes: "282 Лайків",
                tag: "Kids & Gifts",
                status: "Опубліковано",
                source: "TikTok органіка",
                desc: "Щира рекомендація Safe Baby як подарунка: продукт показаний через емоцію та реальну ситуацію.",
                cover: "assets/images/video11-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7677199513466981652"
            },
            {
                title: "Food Fest - Анонс події",
                id: '7674668351829970197',
                publishedAt: '2026-08-16',
                viewsCount: 10800,
                category: "Events",
                views: "10.8K",
                likes: "240 Лайків",
                tag: "Event coverage",
                status: "Опубліковано",
                source: "TikTok органіка",
                desc: "Яскравий анонс Food Fest із прямим запрошенням аудиторії на подію у Тернополі.",
                cover: "assets/images/video12-cover.jpg",
                link: "https://www.tiktok.com/@diana.scorpi/video/7674668351829970197"
            }
        ],

        /** TikTok videos polled for live view/like metrics (idx maps to v1CasesData). */
        tiktokVideoIds: [
            { id: '7665250133474315540', url: 'https://www.tiktok.com/@diana.scorpi/video/7665250133474315540', idx: 0 },
            { id: '7652416548442852629', url: 'https://www.tiktok.com/@diana.scorpi/video/7652416548442852629', idx: 1 },
            { id: '7639679991541665045', url: 'https://www.tiktok.com/@diana.scorpi/video/7639679991541665045', idx: 2 },
            { id: '7625945472674417941', url: 'https://www.tiktok.com/@diana.scorpi/video/7625945472674417941', idx: 3 },
            { id: '7624536127499717908', url: 'https://www.tiktok.com/@diana.scorpi/video/7624536127499717908', idx: 4 },
            { id: '7681689198004391189', url: 'https://www.tiktok.com/@diana.scorpi/video/7681689198004391189', idx: 5 },
            { id: '7680939390176120085', url: 'https://www.tiktok.com/@diana.scorpi/video/7680939390176120085', idx: 6 },
            { id: '7679505692327267604', url: 'https://www.tiktok.com/@diana.scorpi/video/7679505692327267604', idx: 7 },
            { id: '7678020032286215444', url: 'https://www.tiktok.com/@diana.scorpi/video/7678020032286215444', idx: 8 },
            { id: '7678259066111528213', url: 'https://www.tiktok.com/@diana.scorpi/video/7678259066111528213', idx: 9 },
            { id: '7677199513466981652', url: 'https://www.tiktok.com/@diana.scorpi/video/7677199513466981652', idx: 10 },
            { id: '7674668351829970197', url: 'https://www.tiktok.com/@diana.scorpi/video/7674668351829970197', idx: 11 }
        ]
    };
})();
