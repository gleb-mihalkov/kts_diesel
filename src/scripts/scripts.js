$(document).ready(function(){
  !(function(){
    var $self = $('.dropdown a');
    $(document).on('click', $self, function(){
      $self.addClass('active');
      $self.next().slidetoggle();
    });
    console.log('322323');
    return false;
  })(jQuery)
});
