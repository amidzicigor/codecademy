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

  // Functino for changing to exact replica
  $('#exactCopy').click(function () {
    $('#mainPageGrabber').text('Learn to code interactively, for free.');
    $('.ToS').html('By signing up, you agree to our <a href="#">Terms of service</a>');
    $('.ToS').css('font-size', '13.5px');
  })
})
