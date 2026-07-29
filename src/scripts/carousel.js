document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.getElementById('carousel');
  if (!carousel) return;
  var nodes = Array.from(carousel.childNodes).filter(function (c) {
    return c.nodeType !== 3;
  });
  var prevLink = document.getElementById('prev-link-1');
  var nextLink = document.getElementById('next-link-' + nodes.length);
  if (prevLink) prevLink.href = '#slide' + nodes.length;
  if (nextLink) nextLink.href = '#slide1';
});
