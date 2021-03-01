const btnScreenSize = document.querySelector('.btn-screen-size');

btnScreenSize.addEventListener('click', () => {
    alert(`Данные размера экрана:
      Размер экрана - Ширина: ${window.screen.width} Высота:${window.screen.height}
      Размер окна браузера (с учётом полосы прокрутки) - Ширина: ${window.innerWidth} Высота:${window.innerHeight}
      Размер окна браузера (без учета полосы прокрутки) - Ширина: ${document.documentElement.clientWidth} Высота:${document.documentElement.clientHeight}`);
});