$(document).ready(function() {
  $('body').scrollspy({
      offset: $('#navbar').height()
  })

  $('.navbar-nav li:not(.icon) a, .navbar-brand').on('click', function(e) {
      e.preventDefault();
      $('body').animate({
          scrollTop: $(this.hash).offset().top - $('#navbar').height()
      }, 300);
  });
})