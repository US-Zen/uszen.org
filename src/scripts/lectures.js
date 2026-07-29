(function () {
  var lastChecked = null;
  document.addEventListener('click', function (e) {
    var input = e.target.closest('.collapse')
      ? e.target.closest('.collapse').querySelector('input[name="lecture-accordion"]')
      : null;
    if (input && input === lastChecked) {
      setTimeout(function () {
        input.checked = false;
      }, 0);
      lastChecked = null;
    } else if (input) {
      lastChecked = input;
    }
  });
})();
