/* Canvas particle fireworks for v10 demo card.
   Targets every <canvas data-fireworks> on the page; runs one
   independent emitter per canvas. ~150 lines, no deps. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const COLORS = ['#ffd680','#ff8a5a','#ff5577','#ffb347','#fff2cc','#ff9966','#ff6b9d','#ffe9a8'];
  const GRAVITY = 0.04;
  const DRAG = 0.985;
  // Slow-motion factor for the explosion only — rocket rise (Firework
  // class) is unchanged. 0.4 = ~40% of full speed.
  const BURST_TIME = 0.4;

  class Firework {
    constructor(w, h) {
      this.x = w * (0.2 + Math.random() * 0.6);
      this.y = h;
      this.targetY = h * (0.15 + Math.random() * 0.4);
      this.vy = -(2.4 + Math.random() * 0.8);
      this.color = COLORS[(Math.random() * COLORS.length) | 0];
      this.trail = [];
      this.done = false;
      // 0 = low burst (~0.55h up), 1 = high burst (~0.85h up). Drives
      // particle count, spread, and lifetime so high shots feel bigger.
      this.power = 1 - this.targetY / h;
    }
    step() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 6) this.trail.shift();
      this.y += this.vy;
      this.vy += 0.012;
      if (this.y <= this.targetY || this.vy >= 0) this.done = true;
    }
    draw(ctx) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      for (let i = 1; i < this.trail.length; i++) {
        const a = i / this.trail.length;
        ctx.globalAlpha = a * 0.9;
        ctx.beginPath();
        ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  class Particle {
    constructor(x, y, color, power) {
      const angle = Math.random() * Math.PI * 2;
      // High shots spread wider and live longer.
      const speedScale = 0.8 + power * 0.9;
      const lifeScale = 0.85 + power * 0.9;
      const speed = (0.6 + Math.random() * 2.4) * speedScale;
      this.x = x; this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = color;
      this.life = (((60 + Math.random() * 30) * lifeScale) / BURST_TIME) | 0;
      this.age = 0;
      this.size = 1.2 + Math.random() * 1.6;
    }
    step() {
      this.x += this.vx * BURST_TIME;
      this.y += this.vy * BURST_TIME;
      this.vy += GRAVITY * BURST_TIME;
      this.vx *= DRAG;
      this.vy *= DRAG;
      this.age++;
    }
    draw(ctx) {
      const t = 1 - this.age / this.life;
      if (t <= 0) return;
      ctx.globalAlpha = t;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    get dead() { return this.age >= this.life; }
  }

  function attach(canvas) {
    const ctx = canvas.getContext('2d');
    const slow = canvas.hasAttribute('data-slow');
    // "Slow" is now just slightly mellower than demo speed so the
    // ambient layer behind Tonight reads as active without being hectic.
    const launchMin = slow ? 60 : 30;
    const launchSpread = slow ? 80 : 40;
    const burstMin = slow ? 24 : 28;
    const burstSpread = slow ? 16 : 18;
    let fireworks = [];
    let particles = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function sizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();
    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(canvas);

    let launchTimer = 0;
    function frame() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Erase faster than before so trails don't hang around as a
      // bright haze (previous 'lighter' blend + slow fade was the cause
      // of the visual artifact near explosions).
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      if (--launchTimer <= 0) {
        fireworks.push(new Firework(w, h));
        launchTimer = launchMin + (Math.random() * launchSpread) | 0;
      }

      for (const fw of fireworks) {
        fw.step();
        fw.draw(ctx);
        if (fw.done) {
          // Scale particle count by power too: a high shot gets ~70%
          // more particles than a low one.
          const base = burstMin + (Math.random() * burstSpread) | 0;
          const n = (base * (1 + fw.power * 0.7)) | 0;
          for (let i = 0; i < n; i++) particles.push(new Particle(fw.x, fw.y, fw.color, fw.power));
        }
      }
      fireworks = fireworks.filter(f => !f.done);

      for (const p of particles) { p.step(); p.draw(ctx); }
      particles = particles.filter(p => !p.dead);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll('canvas[data-fireworks]').forEach(attach);

  // "Tonight at the Pier" date label — light touch JS to set today's
  // day-of-week + month/date so the demo doesn't feel frozen.
  const dateEl = document.getElementById('tonightDate');
  if (dateEl) {
    const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    dateEl.textContent = fmt.format(new Date());
  }
})();
