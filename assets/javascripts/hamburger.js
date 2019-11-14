$('body').on('click', '.hamburger-menu', function () {
  $('.hamburger-menu-list').removeClass('hidden');
  $('main, footer').css('z-index', -1);
});

$('body').on('click', '.close-button', function () {
  $('.hamburger-menu-list').addClass('hidden');
  $('main, footer').css('z-index', 1);
});
