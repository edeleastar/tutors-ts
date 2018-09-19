$(document).on('keydown', function(e) {
  e = e || window.event;
  var nextTab;
  switch (e.which || e.keyCode) {
    case 37: // left
      nextTab = $('.tab-menu a[data-tab].active').prev('a[data-tab]');
      if (!nextTab.length) nextTab = $('.tab-menu a[data-tab]').last();
      nextTab.click();
      $('.pusher').focus();
      break;

    case 39: // right
      nextTab = $('.tab-menu a[data-tab].active').next('a[data-tab]');
      if (!nextTab.length) nextTab = $('.tab-menu a[data-tab]').first();
      nextTab.click();
      $('.pusher').focus();
      break;
  }
});
