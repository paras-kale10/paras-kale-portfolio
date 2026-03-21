// ============================================================
// EYE TRACKING
// ============================================================
const eyeLeft  = document.getElementById('eyeLeft');
const eyeRight = document.getElementById('eyeRight');
const pupilLeft  = document.getElementById('pupilLeft');
const pupilRight = document.getElementById('pupilRight');

function movePupil(eye, pupil, mouseX, mouseY) {
  const rect = eye.getBoundingClientRect();
  const eyeCX = rect.left + rect.width  / 2;
  const eyeCY = rect.top  + rect.height / 2;

  const dx = mouseX - eyeCX;
  const dy = mouseY - eyeCY;
  const angle = Math.atan2(dy, dx);
  const maxDist = (rect.width / 2) - (pupil.offsetWidth / 2) - 6;
  const dist = Math.min(Math.hypot(dx, dy), maxDist);

  const tx = Math.cos(angle) * dist;
  const ty = Math.sin(angle) * dist;
  pupil.style.transform = `translate(${tx}px, ${ty}px)`;
}

document.addEventListener('mousemove', (e) => {
  movePupil(eyeLeft,  pupilLeft,  e.clientX, e.clientY);
  movePupil(eyeRight, pupilRight, e.clientX, e.clientY);
});

// ============================================================
// PAGE TRANSITION
// ============================================================
const ctaBtn = document.getElementById('ctaBtn');

ctaBtn.addEventListener('click', () => {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = 'home.html';
  }, 600);
});
