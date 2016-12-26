$(document).ready(function () {
  // show learnMore scroll-link on page load
  $('.learnMoreScrollButton').css('opacity', '1');

  // When user scrolls, hide learnMore scroll-link
  $(window).on('scroll', function () {
    $('.learnMoreScrollButton').addClass('hidden');
  });

  // Function for smooth scrolling upon scroll-link click
  $(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 500);
          return false;
        }
      }
    });
  });
})
