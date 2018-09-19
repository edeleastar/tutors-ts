$(document).ready(function() {
  const $images = $('.lab img');
  jQuery.each($images, function(i) {
    if ($images[i].alt.length > 0) {
      const divImg = $(document.createElement('div')).addClass('');
      $($images[i]).wrap(divImg);
      const divLabel = $(document.createElement('div')).addClass('uk-label uk-text-lowercase');
      divLabel.append($images[i].alt);
      $(divLabel).insertAfter($images[i]);
      $('<br>').insertAfter($images[i]);
    }
  });
});
