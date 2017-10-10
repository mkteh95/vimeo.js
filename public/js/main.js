$(document).ready(function() {
  $('body').scrollspy({
      offset: $('#navbar').height() + 1
  })

  $('.navbar-nav li:not(.icon) a, .navbar-brand').on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({
          scrollTop: $(this.hash).offset().top - $('#navbar').height()
      }, 300);
  });
})