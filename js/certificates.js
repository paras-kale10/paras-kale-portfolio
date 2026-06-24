// ============================================================
// CERTIFICATE LIGHTBOX
// ============================================================
(function () {
  const lightbox = document.getElementById('certLightbox');
  const lightboxImg = document.getElementById('certLightboxImg');
  const lightboxCaption = document.getElementById('certLightboxCaption');
  const lightboxClose = document.getElementById('certLightboxClose');
  const backdrop = lightbox ? lightbox.querySelector('.cert-lightbox-backdrop') : null;

  if (!lightbox) return;

  // Open lightbox when "View Certificate" is clicked
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-cert-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const certPath = btn.getAttribute('data-cert');
    const title = btn.closest('.achievement-info')?.querySelector('h3')?.textContent || 'Certificate';

    lightboxImg.src = certPath;
    lightboxImg.alt = title;
    lightboxCaption.textContent = title;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    // Small delay to let transition finish before removing overflow lock
    setTimeout(() => {
      // Only restore if lightbox is still closed (user may have reopened)
      if (!lightbox.classList.contains('active')) {
        // Don't override the expanded card's overflow:hidden
        const expandedCard = document.querySelector('.card.expanded');
        if (!expandedCard) {
          document.body.style.overflow = '';
        }
      }
    }, 400);
  }

  // Close via X button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Close via backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Close via Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      e.stopPropagation();
      closeLightbox();
    }
  });

  // Handle image load error — show a friendly message
  lightboxImg.addEventListener('error', () => {
    lightboxImg.alt = 'Certificate image not found';
    lightboxCaption.textContent += ' — Image not found. Add the file to the images/certificates/ folder.';
  });
})();
