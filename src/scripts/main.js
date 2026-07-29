document.addEventListener('click', function (e) {
  var banner = document.getElementById('banner');
  if (banner && e.target.closest('[data-close-banner]')) {
    banner.style.display = 'none';
  }
});
