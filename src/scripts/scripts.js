!(function($) {
  $('.tabs_nav .tabs_nav__item:first').addClass('active');
  $('.tabs_content .tabs_content__item:first').addClass('active');
    $(document).on('click', '.tabs_nav .tabs_nav__item', function(e){
      var $tab_nav = $('.tabs_nav .tabs_nav__item');
      var $tab_content = $('.tabs_content .tabs_content__item');
      var $self = $(e.target);
      $tab_nav.removeClass('active');
      $self.addClass('active');
      var $index = $(e.target).index();
      $tab_content.removeClass('active');
      $tab_content.eq($index).addClass('active');
      return false;
    });
})(window.jQuery);