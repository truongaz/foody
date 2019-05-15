$(function () {
  var b = $("#button");
  var w = $("#wrapper");
  var l = $("#list");
  w.height(0);

  b.click(function () {
    if (w.hasClass('open')) {
      w.removeClass('open'); w.height(0);
    } else {
      w.addClass('open');
      w.height(l.outerHeight(true));
    }

  });
});