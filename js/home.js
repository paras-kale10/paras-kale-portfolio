// ============================================================
// STAGGER CARD ENTRANCE
// ============================================================
const cards = document.querySelectorAll('.card');
const gridContainer = document.getElementById('gridContainer');

cards.forEach((card, i) => {
  setTimeout(() => {
    card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 80 + i * 100);
});

// ============================================================
// CORNER ACCENT HELPERS
// ============================================================
function addCornerAccents(card) {
  ['corner-tl', 'corner-tr', 'corner-br'].forEach(cls => {
    if (!card.querySelector('.' + cls)) {
      const el = document.createElement('div');
      el.className = cls;
      card.appendChild(el);
    }
  });
}

function removeCornerAccents(card) {
  card.querySelectorAll('.corner-tl, .corner-tr, .corner-br').forEach(el => el.remove());
}

// ============================================================
// EXPAND / COLLAPSE LOGIC
// ============================================================
let expandedCard = null;
let isCollapsing = false;

function expandCard(card) {
  if (expandedCard || isCollapsing) return;

  expandedCard = card;

  // Hide header and other cards
  const header = document.querySelector('.site-header');
  if (header) { header.style.opacity = '0'; header.style.pointerEvents = 'none'; }

  cards.forEach(c => { if (c !== card) c.classList.add('hidden'); });

  // Expand this card with cinematic open
  card.classList.add('expanded');
  addCornerAccents(card);

  // Inject full-screen fade-out overlay for cinematic entry (covers grid → reveals content)
  const overlay = document.createElement('div');
  overlay.className = 'expand-overlay';
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 550);

  // Re-trigger contentSlideUp animation each open via class toggle
  const scrollEl = card.querySelector('.content-scroll');
  if (scrollEl) {
    scrollEl.classList.remove('content-animating');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollEl.classList.add('content-animating');
      });
    });
  }

  document.body.style.overflow = 'hidden';
}

function collapseCard() {
  if (!expandedCard || isCollapsing) return;

  isCollapsing = true;
  const card = expandedCard;

  // Hide close button immediately
  const closeBtn = card.querySelector('.close-btn');
  if (closeBtn) closeBtn.style.opacity = '0';

  // Fade corner accents out
  card.querySelectorAll('.corner-tl, .corner-tr, .corner-br').forEach(el => {
    el.style.transition = 'opacity 0.2s ease';
    el.style.opacity = '0';
  });

  // Play the collapse animation (fades the whole card out)
  card.classList.add('collapsing');

  setTimeout(() => {
    card.classList.remove('expanded', 'collapsing');
    removeCornerAccents(card);
    if (closeBtn) closeBtn.style.opacity = '';

    const header = document.querySelector('.site-header');
    if (header) { header.style.opacity = '1'; header.style.pointerEvents = 'auto'; }

    cards.forEach(c => c.classList.remove('hidden'));

    expandedCard = null;
    isCollapsing = false;
    document.body.style.overflow = '';
  }, 400);
}

// ============================================================
// CLICK HANDLERS
// ============================================================
cards.forEach(card => {
  const face = card.querySelector('.card-face');
  face.addEventListener('click', () => {
    if (!card.classList.contains('expanded')) expandCard(card);
  });
});

// Close button — document-level delegation
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.close-btn');
  if (btn) { e.stopPropagation(); collapseCard(); }
});

// ============================================================
// ESC KEY
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && expandedCard) collapseCard();
});

// ============================================================
// BACK LINK FADE
// ============================================================
const backLink = document.getElementById('backLink');
if (backLink) {
  backLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = backLink.getAttribute('href');
    }, 500);
  });
}
