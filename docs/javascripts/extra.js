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
