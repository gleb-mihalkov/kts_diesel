/// ----------------------
/// Карусель изображений.
/// ----------------------
!(function($) {
  if ($ == null) return console.warn('jQuery is required.');

  var duration = 500;

  function setClass($node, name) {
    var defer = new $.Deferred();
    $node.addClass(name);

    var onFinish = function() {
      $node.removeClass(name);
      defer.resolve();
    };

    setTimeout(onFinish, duration);
    return defer.promise();
  }

  function wrap(item) {
    return item == null ? null : (item instanceof $ ? item : $(item));
  }

  function getCarousel(item, attr) {
    var id = wrap(item).attr(attr);
    var carousel = document.getElementById(id);
    if (carousel == null) return null;

    var $carousel = $(carousel);
    return $carousel.length ? $carousel : null;
  }

  var count = 0;

  function getElement(id, attr) {
    var selector = '[' + attr + '="' + id + '"]';
    var $element = $(selector);
    return $element.length ? $element : null;
  }

  function toInner($carousel, index, effect) {
    if (typeof(index) === 'object') index = wrap(index).index();

    var promise = $.when();

    var $slides = $carousel.children();
    var $active = $slides.filter('.active');

    if (effect == null) {
      var current = $active.index();
      if (current < index) effect = 'next';
      if (current > index) effect = 'back';
    }

    $slides.removeClass('active');

    var $slide = $slides.eq(index);
    $slide.addClass('active');

    if (effect) {
      var pA = setClass($carousel, effect);
      var pB = setClass($active, 'leave');
      var pC = setClass($slide, 'enter');

      promise = $.when(pA, pB, pC);
    }

    var id = $carousel.attr('id');
    if (id == null) return promise;

    var $index = getElement(id, 'data-index');
    if ($index) $index.text(index + 1);

    var $dots = getElement(id, 'data-dots');
    if ($dots == null) return promise;

    $dots = $dots.children();
    $dots.removeClass('active');
    $dots.eq(index).addClass('active');

    return promise;
  }

  function to($carousel, index, type) {
    var args = $carousel.data('carouselArgs');
    
    if (args != null) {
      $carousel.data('carouselArgs', [index, type]);
      return;
    }

    var promise = toInner($carousel, index, type);
    $carousel.data('carouselArgs', 0);

    var handler = function() {
      var args = $carousel.data('carouselArgs');
      $carousel.data('carouselArgs', null);
      if (!args) return;

      var promise = toInner($carousel, args[0], args[1]);
      $carousel.data('carouselArgs', 0);
      promise.then(handler);
    };

    promise.then(handler);
  }

  function seed($carousel, type) {
    var $slides = $carousel.children();
    var index = $slides.filter('.active').index();
    var count = $slides.length;

    var value = type == 'next' ? 1 : -1;
    var next = index + value;

    if (next < 0) next = count - 1;
    if (next >= count) next = 0;

    to($carousel, next, type);
  }

  function onDots(e) {
    var $dots = $(e.target).closest('[data-dots]');

    var $carousel = getCarousel($dots, 'data-dots');    
    if ($carousel == null) return;

    e.preventDefault();
    to($carousel, this);
  }

  function onSeed(e, node, type) {
    var $carousel = getCarousel(node, 'data-' + type);
    if ($carousel == null) return;

    e.preventDefault();
    seed($carousel, type);
  }

  function onNext(e) {
    return onSeed(e, this, 'next');
  }

  function onBack(e) {
    return onSeed(e, this, 'back');
  }

  $(document)
    .on('click', '[data-dots] > *', onDots)
    .on('click', '[data-back]', onBack)
    .on('click', '[data-next]', onNext);
})(window.jQuery);