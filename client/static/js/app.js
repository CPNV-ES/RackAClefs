(function () {
  $('#menu-toggle').on('click', function (e) {
    e.preventDefault()
    $('#menu').toggleClass('is-active')
  })

  $('.field-input').focus(function () {
    $(this).parent().addClass('is-focused has-label')
  })

  $('.field-input').each(function () {
    if ($(this).val() !== '') {
      $(this).parent().addClass('has-label')
    }
  })

  $('.field-input').blur(function () {
    var $parent = $(this).parent()
    if ($(this).val() === '') {
      $parent.removeClass('has-label')
    }
    $parent.removeClass('is-focused')
  })
})(jQuery)