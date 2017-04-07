/// ----------------------
/// Сворачивающийся блок.
/// ----------------------
!(function($) {
  if ($ == null) return console.warn('jQuery is required.');

  var show = function($collapse, $content) {
    $collapse.addClass('active');

    var height = $collapse.data('collapse');
    $content.css('height', height + 'px');
  };

  var hide = function($collapse, $content) {
    $collapse.removeClass('active');
    $content.css('height', '0px');
  };

  var init = function($collapse) {
    var $content = $collapse.find('.collapse__content');
    var $heading = $collapse.find('.collapse__heading');

    var height = $content.children().first().outerHeight();
    $collapse.data('collapse', height);

    if ($collapse.hasClass('active')) show($collapse, $content);

    $heading.click(function() {
      var func = $collapse.hasClass('active') ? hide : show;
      func($collapse, $content);
    });
  };

  $(window).on('load', function() {

    $('.collapse').each(function() {
      var $item = $(this);
      init($item);
    });
  });

})(window.jQuery);