// ============================================================
// ANIMATED PARTICLE NETWORK CANVAS
// ============================================================
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 0;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };

  const CONFIG = {
    count: 70,
    maxDist: 140,
    mouseInfluence: 180,
    speed: 0.35,
    dotRadius: 1.8,
    dotColor: 'rgba(0, 212, 255, ',
    lineColor: 'rgba(0, 212, 255, ',
  };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed * 2,
      vy: (Math.random() - 0.5) * CONFIG.speed * 2,
      r: CONFIG.dotRadius + Math.random() * 0.8,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.maxDist) {
          const alpha = (1 - dist / CONFIG.maxDist) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = CONFIG.lineColor + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Mouse influence lines
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const mDist = Math.hypot(mdx, mdy);
      if (mDist < CONFIG.mouseInfluence) {
        const alpha = (1 - mDist / CONFIG.mouseInfluence) * 0.35;
        ctx.beginPath();
        ctx.strokeStyle = CONFIG.lineColor + alpha + ')';
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.dotColor + '0.55)';
      ctx.fill();
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Track mouse
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', () => {
    resize();
  });

  init();
  loop();
})();
