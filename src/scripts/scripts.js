$(document).ready(function(){
  !(function(){
    $(document).on('click','.dropdown > a' , function(e){
      var $self = $(e.target);
      $self.toggleClass('active');
      $self.next('ul').slideToggle();
      return false;
    });
  })(jQuery)
});
