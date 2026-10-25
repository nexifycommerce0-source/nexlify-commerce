// @ts-nocheck
// Scroll-driven dragon background: 3 stills crossfade + a snow layer that spreads over the screen.
const IW = 1920, IH = 1072;
const IMGS = [
  { key: 'perched', src: '/dragon-perched.jpg', pos: [0.74, 0.5] },
  { key: 'flight', src: '/dragon-flight.jpg', pos: [0.5, 0.5] },
  { key: 'breath', src: '/dragon-breath.jpg', pos: [0.55, 0.5] },
];
const MOUTH = { x: 0.47, y: 0.35 }; // dragon's mouth inside the breath image (0..1)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const rand = (a, b) => a + Math.random() * (b - a);

export function createScrollDragon(root, opts = {}) {
  const dim = opts.dim ?? 0.45; // 0 = bright, 1 = black. Raise it if text is hard to read.
  const reduced = !!opts.reduced;
  const mobile = Math.min(window.innerWidth, window.innerHeight) < 600;

  const els = {};
  const kids = [];
  const add = (el) => { root.appendChild(el); kids.push(el); return el; };
  const abs = (el) => { el.style.cssText += ';position:absolute;inset:0;width:100%;height:100%;'; return el; };

  IMGS.forEach((d) => {
    const im = abs(document.createElement('img'));
    im.alt = ''; im.decoding = 'async'; im.draggable = false; im.src = d.src;
    im.style.objectFit = 'cover';
    im.style.objectPosition = `${d.pos[0] * 100}% ${d.pos[1] * 100}%`;
    im.style.willChange = 'transform, opacity';
    im.style.opacity = d.key === 'perched' ? '1' : '0';
    els[d.key] = add(im);
  });
  const shade = abs(document.createElement('div'));
  shade.style.background =
    `radial-gradient(ellipse at 50% 45%, rgba(5,7,13,${dim * 0.35}) 0%, rgba(5,7,13,${dim}) 100%)`;
  add(shade);
  const canvas = abs(document.createElement('canvas'));
  add(canvas);
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- image layers -------------------------------------------------------
  let breathT = { z: 1, tx: 0 };
  function layout(p) {
    const pe = clamp(1 - sm(0.08, 0.17, p) + sm(0.9, 0.98, p), 0, 1); // perched opacity
    const f = sm(0.16, 0.27, p) * (1 - sm(0.44, 0.52, p)); // flight opacity
    const b = sm(0.5, 0.6, p) * (1 - sm(0.8, 0.89, p)); // breath opacity
    const zoom = 1.04 + 0.06 * p;
    const drift = (0.5 - p) * 1.6;
    const set = (el, o, tx, z) => {
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(${tx.toFixed(2)}%,0,0) scale(${z.toFixed(4)})`;
    };
    set(els.perched, pe, drift, zoom);
    set(els.flight, f, -(1 - sm(0.16, 0.27, p)) * 5 + drift * 0.5, zoom + 0.02);
    const btx = -(1 - sm(0.5, 0.6, p)) * 3 + drift * 0.5;
    set(els.breath, b, btx, zoom + 0.02);
    breathT = { z: zoom + 0.02, tx: btx };
  }

  // ---- snow ---------------------------------------------------------------
  const N = mobile ? 170 : 340;
  const P = Array.from({ length: N }, () => ({ on: false, x: 0, y: 0, vx: 0, vy: 0, r: 1, base: 1, t: 0, life: 1, mouth: false }));
  function mouthPos() {
    const d = IMGS[2];
    const s = Math.max(W / IW, H / IH), dw = IW * s, dh = IH * s;
    let x = (W - dw) * d.pos[0] + MOUTH.x * dw;
    let y = (H - dh) * d.pos[1] + MOUTH.y * dh;
    x = W / 2 + (x - W / 2) * breathT.z + (breathT.tx / 100) * W;
    y = H / 2 + (y - H / 2) * breathT.z;
    return { x, y };
  }
  function spawn(q, p, share, spreadW) {
    const sc = clamp(W / 1400, 0.6, 1.2);
    const m = mouthPos();
    q.t = 0; q.base = rand(0.35, 0.95); q.r = rand(0.8, 2.6) * Math.sqrt(sc); q.on = true;
    if (Math.random() < share) {
      q.mouth = true;
      q.x = m.x + rand(-6, 6); q.y = m.y + rand(-6, 6);
      const ang = Math.PI + rand(-0.6, 0.6), sp = rand(240, 650) * sc;
      q.vx = Math.cos(ang) * sp; q.vy = Math.sin(ang) * sp * 0.6 + 30;
      q.life = rand(2.5, 6);
    } else {
      q.mouth = false;
      q.x = clamp(m.x - (spreadW * W) / 2 + rand(0, spreadW * W), 0, W);
      q.y = rand(-30, H);
      q.vx = rand(-45, -10) * sc; q.vy = rand(25, 80) * sc;
      q.life = rand(5, 11);
    }
  }
  function stepSnow(dt, p) {
    const d = 0.12 + 0.88 * sm(0.46, 0.8, p) * (1 - 0.75 * sm(0.86, 1, p));
    const active = Math.floor(N * d);
    const share = 0.85 * sm(0.5, 0.58, p) * (1 - sm(0.66, 0.84, p));
    const spreadW = 0.3 + 0.7 * sm(0.52, 0.85, p);
    let born = 0;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < N; i++) {
      const q = P[i];
      if (!q.on) { if (i < active && born < 6) { spawn(q, p, share, spreadW); born++; } else continue; }
      q.t += dt;
      if (q.mouth) { const k = Math.exp(-0.9 * dt); q.vx *= k; q.vy = q.vy * k + 22 * dt; }
      q.vx += Math.sin(q.t * 1.4 + q.y * 0.01) * 10 * dt;
      q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.t > q.life || q.x < -20 || q.x > W + 20 || q.y > H + 20) {
        if (i < active) spawn(q, p, share, spreadW); else q.on = false;
        continue;
      }
      const a = q.base * Math.min(1, q.t / 0.6) * Math.min(1, (q.life - q.t) / 1.2);
      ctx.fillStyle = `rgba(200,232,255,${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 6.2832); ctx.fill();
      if (q.r > 1.9) { ctx.fillStyle = `rgba(120,190,255,${(a * 0.18).toFixed(3)})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * 3, 0, 6.2832); ctx.fill(); }
    }
  }

  // ---- loop ---------------------------------------------------------------
  let p = 0, target = 0, last = performance.now(), raf = 0, forced = null;
  function readScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (document.hidden) return;
    target = forced ?? readScroll();
    p += (target - p) * (1 - Math.exp(-dt * 6));
    layout(p);
    stepSnow(dt, p);
  }
  layout(0);
  if (!reduced) raf = requestAnimationFrame(frame);

  return {
    setProgress(v) { forced = v; p = v; },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      kids.forEach((k) => k.remove());
    },
  };
}
