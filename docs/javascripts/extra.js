document.addEventListener("DOMContentLoaded", function() {
    // Находим блок с заголовком в шапке сайта
    var titleBlock = document.querySelector('.md-header__title');
    
    if (titleBlock) {
        // Меняем курсор на "палец", чтобы пользователь понимал, что можно кликнуть
        titleBlock.style.cursor = 'pointer';
        
        // Добавляем действие при клике
        titleBlock.addEventListener('click', function() {
            // Берём ссылку главной страницы из логотипа, чтобы переход работал
            // и на собственном домене, и на стандартном адресе GitHub Pages.
            var homeLink = document.querySelector('.md-header__button.md-logo');
            window.location.href = homeLink ? homeLink.href : '/';
        });
    }
});

(function() {
    var highlightClass = "indy-section-highlight";
    var highlightDuration = 1250;
    var highlightedHeading = null;
    var highlightTimer = null;
    var pendingHighlightTimers = [];

    function findHeading(hash) {
        if (!hash || hash === "#") {
            return null;
        }

        var id;

        try {
            id = decodeURIComponent(hash.slice(1));
        } catch (error) {
            return null;
        }

        var heading = document.getElementById(id);

        if (!heading || !heading.matches(".md-content__inner h2[id], .md-content__inner h3[id], .md-content__inner h4[id], .md-content__inner h5[id], .md-content__inner h6[id]")) {
            return null;
        }

        return heading;
    }

    function clearHeadingHighlight() {
        if (highlightedHeading) {
            highlightedHeading.classList.remove(highlightClass);
        }

        if (highlightTimer) {
            window.clearTimeout(highlightTimer);
        }

        highlightedHeading = null;
        highlightTimer = null;
    }

    function clearPendingHighlightTimers() {
        pendingHighlightTimers.forEach(function(timer) {
            window.clearTimeout(timer);
        });
        pendingHighlightTimers = [];
    }

    function highlightHeading(heading) {
        clearHeadingHighlight();

        // Перезапускаем CSS-анимацию и при повторном клике по тому же пункту.
        heading.classList.remove(highlightClass);
        void heading.offsetWidth;
        heading.classList.add(highlightClass);
        highlightedHeading = heading;

        highlightTimer = window.setTimeout(function() {
            heading.classList.remove(highlightClass);

            if (highlightedHeading === heading) {
                highlightedHeading = null;
            }

            highlightTimer = null;
        }, highlightDuration);
    }

    function scheduleHighlight(hash) {
        clearPendingHighlightTimers();

        if (!hash || hash === "#") {
            return;
        }

        var highlightedForRun = null;

        // Material может заменить содержимое страницы уже после события click.
        [0, 120, 320].forEach(function(delay) {
            var timer = window.setTimeout(function() {
                var heading = findHeading(hash);

                if (heading && heading !== highlightedForRun) {
                    highlightHeading(heading);
                    highlightedForRun = heading;
                }
            }, delay);

            pendingHighlightTimers.push(timer);
        });
    }

    function highlightCurrentHash() {
        scheduleHighlight(window.location.hash);
    }

    if (window.indySectionNavigationInitialized) {
        return;
    }

    window.indySectionNavigationInitialized = true;

    document.addEventListener("click", function(event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        var eventTarget = event.target;

        if (!(eventTarget instanceof Element)) {
            return;
        }

        var link = eventTarget.closest('.md-nav--secondary > .md-nav__list[data-md-component="toc"] a.md-nav__link');

        if (!link) {
            return;
        }

        var linkUrl = new URL(link.href, window.location.href);

        if (linkUrl.origin !== window.location.origin || linkUrl.pathname !== window.location.pathname || linkUrl.search !== window.location.search) {
            return;
        }

        var hash = linkUrl.hash;
        var heading = findHeading(hash);

        if (heading) {
            if (window.location.hash === hash) {
                var drawerToggle = document.getElementById("__drawer");
                var tocToggle = document.getElementById("__toc");

                if (drawerToggle) {
                    drawerToggle.checked = false;
                }

                if (tocToggle) {
                    tocToggle.checked = false;
                }
            }

            // Нативный переход по якорю сохраняет URL, scroll spy и мобильное меню.
            scheduleHighlight(hash);
        }
    }, true);

    window.addEventListener("hashchange", highlightCurrentHash);

    if (typeof document$ !== "undefined") {
        document$.subscribe(highlightCurrentHash);
    } else if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", highlightCurrentHash);
    } else {
        highlightCurrentHash();
    }
})();
