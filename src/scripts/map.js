/// ----------------------
/// Подключение карты.
/// ----------------------
!(function($, ymaps) {
  if ($ == null) return console.warn('jQuery is required.');
  if (ymaps == null) return console.warn('Yandex.Maps is required.');

  var init = function($map) {
    var zoom = $map.data('zoom') || 7;
    var coords = $map.data('coords');

    ymaps.ready(function() {
      var map = new ymaps.Map($map[0], {
        center: coords,
        zoom: zoom,
        controls: ['zoomControl']
      });
      
      map.behaviors.disable('scrollZoom');

      var params = {};

      var icon = $map.data('icon');
      if (icon) {
        params.iconLayout = 'default#image';
        params.iconImageHref = icon;

        var iconSize = $map.data('icon-size');
        if (iconSize) {
          params.iconImageSize = iconSize;
          params.iconImageOffset = [
            -iconSize[0] / 2,
            -iconSize[1]
          ];
        }
      }

      var pointer = new ymaps.Placemark(coords, {}, params);
      map.geoObjects.add(pointer);
    });
  };

  $(document).ready(function() {

    $('.map').each(function() {
      var $map = $(this);
      init($map);
    });
  });

})(window.jQuery, window.ymaps);