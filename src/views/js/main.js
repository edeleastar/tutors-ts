$(document).ready(function() {
  $('img').addClass('ui image');

  $('.ui.embed').embed();

  const $images = $('.lab img');
  jQuery.each($images, function(i) {
    if ($images[i].alt.length > 0) {
      const divImg = $(document.createElement('div')).addClass(
        'ui basic segment',
      );
      $($images[i]).wrap(divImg);
      const divLabel = $(document.createElement('div')).addClass(
        'ui blue ribbon label',
      );
      divLabel.append($images[i].alt);
      $(divLabel).insertBefore($images[i]);
    }
  });

  $('.ui.menu .item').tab({
    history: true,
    historyType: 'hash',
  });

  $('.popup').popup();

  $('.ui.sidebar')
    .sidebar({ context: $('.pushable') })
    .sidebar('setting', 'transition', 'slide out')
    .sidebar('attach events', '#toc');
});
