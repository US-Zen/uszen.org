(function () {
  var modalImage = document.getElementById('modalImage');
  var imageModal = document.getElementById('imageModal');
  if (!modalImage || !imageModal) return;

  document.addEventListener('click', function (e) {
    var galleryItem = e.target.closest('[data-gallery-item]');
    if (!galleryItem) return;
    var img = galleryItem.querySelector('img');
    if (img) {
      modalImage.src = img.src;
      if (typeof imageModal.showModal === 'function') {
        imageModal.showModal();
      }
    }
  });
})();
