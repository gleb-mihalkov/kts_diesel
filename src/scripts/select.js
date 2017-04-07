/// ------------------
/// Выпадающий список.
/// ------------------
!(function($) {

  function getNode($item) {
    return $item.closest('.select');
  }

  function getHidden($node) {
    return $node.find('input[type=hidden]');
  }

  function getText($node) {
    return $node.find('.select__text');
  }

  var $active = null;

  function show($node) {
    if ($active) $active.removeClass('active');
    $active = $node;
    $active.addClass('active');
  }

  function hide() {
    if ($active) $active.removeClass('active');
    $active = null;
  }

  function toggle($node) {
    if ($node.hasClass('active')) hide($node);
    else show($node);
  }

  function onTitle(e) {
    e.preventDefault();

    var $item = $(e.target);
    var $node = getNode($item);
    toggle($node);
  }

  function onValue(e) {
    e.preventDefault();

    var $item = $(e.target);
    var $node = getNode($item);
    var $hidden = getHidden($node);
    var $text = getText($node);

    var value = $item.attr('data-value');
    var text = value ? $item.text() : '';

    $hidden.val(value);
    $text.text(text);
    $hidden.trigger('change');

    hide();
  }

  function onSpace(e) {
    var $item = $(e.target);
    var $node = getNode($item);

    if ($node.length) {
      e.preventDefault();
      return;
    }

    hide();
  }

  $(document)
    .on('click', '.select [data-value]', onValue)
    .on('click', '.select__text', onTitle)
    .on('click', onSpace);

})(window.jQuery);