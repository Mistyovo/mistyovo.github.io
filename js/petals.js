/* ============================================================
   KiraKira —— 樱花飘落 + 星光闪烁画布
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.KK || {};
  if (CFG.petals === false) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('kk-petals');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var petals = [];
  var sparks = [];
  var running = true;

  var PETAL_COLORS = [
    'rgba(255, 183, 213, A)',
    'rgba(255, 158, 196, A)',
    'rgba(255, 205, 226, A)',
    'rgba(240, 171, 252, A)'
  ];

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function targetCount() { return window.innerWidth < 640 ? 10 : 22; }

  function makePetal(anyY) {
    return {
      x: Math.random() * W,
      y: anyY ? Math.random() * H : -20 - Math.random() * 40,
      size: 7 + Math.random() * 8,
      speedY: 0.5 + Math.random() * 0.9,
      swayAmp: 0.6 + Math.random() * 1.4,
      swaySpeed: 0.008 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      alpha: 0.55 + Math.random() * 0.4,
      color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]
    };
  }

  function makeSpark() {
    return {
      x: Math.random() * W,
      y: Math.random() * H * 0.75,
      size: 2.5 + Math.random() * 3.5,
      life: 0,
      maxLife: 140 + Math.random() * 120,
      rot: Math.random() * Math.PI
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color.replace('A', p.alpha);
    var s = p.size;
    ctx.beginPath();
    ctx.moveTo(0, -s / 2);
    ctx.quadraticCurveTo(s * 0.65, -s * 0.28, s * 0.42, s * 0.4);
    ctx.quadraticCurveTo(s * 0.2, s * 0.62, 0, s * 0.5);
    ctx.quadraticCurveTo(-s * 0.2, s * 0.62, -s * 0.42, s * 0.4);
    ctx.quadraticCurveTo(-s * 0.65, -s * 0.28, 0, -s / 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSpark(s) {
    var t = s.life / s.maxLife;
    var a = t < 0.25 ? t / 0.25 : 1 - (t - 0.25) / 0.75;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot + t * 0.6);
    ctx.globalAlpha = Math.max(0, a) * 0.85;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowBlur = 6;
    var r = s.size * (0.7 + t * 0.5);
    ctx.beginPath();
    ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
    ctx.moveTo(0, -r); ctx.lineTo(0, r);
    ctx.stroke();
    ctx.restore();
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    var want = targetCount();
    while (petals.length < want) petals.push(makePetal(false));
    if (petals.length > want) petals.length = want;
    if (sparks.length < 6 && Math.random() < 0.03) sparks.push(makeSpark());

    for (var i = 0; i < petals.length; i++) {
      var p = petals[i];
      p.phase += p.swaySpeed;
      p.x += Math.sin(p.phase) * p.swayAmp * 0.35;
      p.y += p.speedY;
      p.angle += p.spin;
      if (p.y > H + 24) { petals[i] = makePetal(false); continue; }
      drawPetal(p);
    }

    for (var j = sparks.length - 1; j >= 0; j--) {
      var s = sparks[j];
      s.life++;
      if (s.life >= s.maxLife) { sparks.splice(j, 1); continue; }
      drawSpark(s);
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { running = false; }
    else if (!running) { running = true; requestAnimationFrame(tick); }
  });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });

  resize();
  for (var k = 0; k < targetCount(); k++) petals.push(makePetal(true));
  requestAnimationFrame(tick);
})();
