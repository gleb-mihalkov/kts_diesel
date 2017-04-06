$(document).ready(function(){
  !(function(){
    $(document).on('click','.dropdown > a' , function(e){
      var $self = $(e.target);
      $self.toggleClass('active');
      $self.next('ul').slideToggle();
      return false;
    });
  })(jQuery)
  $(function(){
    var $tab_nav = $('.tabs_nav .tabs_nav__item');
    var $tab_content = $('.tabs_content .tabs_content__item');
    $(document).on('click', $tab_nav, function(e){
      var $self = $(e.target);
      $tab_nav.removeClass('active');
      $self.addClass('active');
      var $index = $(e.target).index();
      $tab_content.removeClass('active');
      $tab_content.eq($index).addClass('active');
    });
    $('.tabs_nav .tabs_nav__item:first').addClass('active');
    $('.tabs_content .tabs_content__item:first').addClass('active');
    return false;
  })
});
