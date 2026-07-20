/* ============================================================
   KiraKira —— 主交互脚本
   加载 / 暗色 / 抽屉 / 渐入 / 打字机 / 卡片倾斜 / 进度
   回顶 / 代码复制 / 图片放大 / 目录高亮 / 本地搜索 / 光标特效
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.KK || {};
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  if (!reducedMotion) {
    document.documentElement.classList.add('anim');
  }

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = $('.kk-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'kk-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }

  /* ---------- 开场加载（每会话一次） ---------- */
  (function initLoading() {
    var el = document.getElementById('kk-loading');
    if (!el) return;
    if (reducedMotion || CFG.loading === false) { el.remove(); return; }
    var played = false;
    try { played = sessionStorage.getItem('kk-loaded') === '1'; } catch (e) {}
    if (played) { el.remove(); return; }
    var done = function () {
      el.classList.add('is-done');
      try { sessionStorage.setItem('kk-loaded', '1'); } catch (e) {}
      setTimeout(function () { el.remove(); }, 700);
    };
    window.addEventListener('load', function () { setTimeout(done, 800); });
    setTimeout(done, 3200);
  })();

  /* ---------- 暗色模式 ---------- */
  (function initTheme() {
    var btn = document.getElementById('kk-theme-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var root = document.documentElement;
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('kk-theme', next); } catch (e) {}
    });
  })();

  /* ---------- 移动端抽屉 ---------- */
  (function initDrawer() {
    var btn = document.getElementById('kk-menu-btn');
    var mask = document.getElementById('kk-drawer-mask');
    if (btn) btn.addEventListener('click', function () {
      document.body.classList.toggle('kk-drawer-open');
    });
    if (mask) mask.addEventListener('click', function () {
      document.body.classList.remove('kk-drawer-open');
    });
  })();

  /* ---------- 滚动渐入 ---------- */
  (function initReveal() {
    if (reducedMotion) return;
    var items = $$('[data-reveal]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }
    var count = new Map();
    items.forEach(function (el) {
      var p = el.parentNode;
      var n = count.get(p) || 0;
      count.set(p, n + 1);
      el.style.setProperty('--reveal-delay', Math.min(n * 0.08, 0.4) + 's');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 首页随机头图（加载完成后淡入，失败则保留渐变底） ---------- */
  (function initRandomHero() {
    var el = document.querySelector('[data-random-cover]');
    if (!el) return;
    var api = el.getAttribute('data-random-cover');
    var sep = api.indexOf('?') === -1 ? '?' : '&';
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = 'url("' + img.src + '")';
      el.classList.add('is-loaded');
    };
    img.src = api + sep + '_=' + Date.now();
  })();

  /* ---------- Hero 打字机 ---------- */  (function initTyping() {
    var el = document.getElementById('kk-typed');
    var phrases = CFG.typed || [];
    if (!el || !phrases.length) return;
    if (reducedMotion || CFG.typing === false) { el.textContent = phrases[0]; return; }
    var pi = 0, ci = 0, deleting = false;
    function step() {
      var phrase = phrases[pi];
      el.textContent = phrase.slice(0, ci);
      var delay = deleting ? 40 : 110;
      if (!deleting && ci === phrase.length) {
        deleting = true;
        delay = 2100;
      } else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        delay = 500;
      } else {
        ci += deleting ? -1 : 1;
      }
      setTimeout(step, delay);
    }
    step();
  })();

  /* ---------- 卡片 3D 倾斜 ---------- */
  (function initTilt() {
    if (reducedMotion || CFG.cardTilt === false || !finePointer) return;
    $$('[data-tilt]').forEach(function (card) {
      var raf = null;
      card.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = card.getBoundingClientRect();
          var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
          var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
          card.style.transform = 'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
        });
      });
      card.addEventListener('pointerleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = '';
      });
    });
  })();

  /* ---------- 阅读进度 + 回顶 ---------- */
  (function initProgress() {
    var bar = $('#kk-progress span');
    var topBtn = document.getElementById('kk-top');
    var ring = topBtn ? topBtn.querySelector('.kk-top-ring circle') : null;
    var RING_LEN = 119.4;
    var ticking = false;
    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? (window.scrollY || doc.scrollTop) / max : 0;
      ratio = Math.min(Math.max(ratio, 0), 1);
      if (bar) bar.style.width = (ratio * 100) + '%';
      if (ring) ring.style.strokeDashoffset = String(RING_LEN * (1 - ratio));
      if (topBtn) topBtn.classList.toggle('is-visible', window.scrollY > 380);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
    if (topBtn) topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  })();

  /* ---------- 代码块工具条 + 复制 ---------- */
  (function initCodebars() {
    if (CFG.codeCopy === false) return;
    $$('figure.highlight').forEach(function (fig) {
      var lang = '';
      fig.className.split(/\s+/).forEach(function (c) {
        if (c && c !== 'highlight' && c !== 'plain') lang = c;
      });
      var bar = document.createElement('div');
      bar.className = 'kk-codebar';
      bar.innerHTML =
        '<span class="kk-codebar-dots"><i></i><i></i><i></i></span>' +
        '<span class="kk-codebar-lang">' + (lang || 'code') + '</span>';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kk-copy-btn';
      btn.textContent = '复制';
      btn.addEventListener('click', function () {
        var codeEl = fig.querySelector('.code pre') || fig.querySelector('pre');
        var text = codeEl ? codeEl.innerText : '';
        function ok() {
          btn.textContent = '已复制 ✦';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = '复制';
            btn.classList.remove('copied');
          }, 1600);
        }
        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); ok(); } catch (e) { toast('复制失败'); }
          ta.remove();
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(ok, fallback);
        } else fallback();
      });
      bar.appendChild(btn);
      fig.insertBefore(bar, fig.firstChild);
    });
  })();

  /* ---------- 图片点击放大 ---------- */
  (function initImageZoom() {
    if (CFG.imageZoom === false) return;
    $$('.kk-content img').forEach(function (img) {
      img.addEventListener('click', function () {
        var overlay = document.createElement('div');
        overlay.className = 'kk-img-zoom';
        var clone = document.createElement('img');
        clone.src = img.src;
        clone.alt = img.alt || '';
        overlay.appendChild(clone);
        overlay.addEventListener('click', function () { overlay.remove(); });
        document.addEventListener('keydown', function esc(e) {
          if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
        });
        document.body.appendChild(overlay);
      });
    });
  })();

  /* ---------- 目录滚动高亮 ---------- */
  (function initTocSpy() {
    var tocEl = document.getElementById('kk-toc');
    if (!tocEl || !('IntersectionObserver' in window)) return;
    var links = $$('a[href^="#"]', tocEl);
    if (!links.length) return;
    var map = new Map();
    links.forEach(function (a) {
      var id = null;
      try { id = decodeURIComponent(a.getAttribute('href').slice(1)); } catch (e) { return; }
      var target = document.getElementById(id);
      if (target) map.set(target, a);
    });
    if (!map.size) return;
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible.add(en.target);
        else visible.delete(en.target);
      });
      var first = null;
      map.forEach(function (a, target) {
        if (visible.has(target) && (!first || target.offsetTop < first.offsetTop)) first = target;
      });
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (first) map.get(first).classList.add('is-active');
    }, { rootMargin: '-90px 0px -62% 0px', threshold: 0 });
    map.forEach(function (a, target) { io.observe(target); });
  })();

  /* ---------- 本地搜索 ---------- */
  (function initSearch() {
    var modal = document.getElementById('kk-search-modal');
    if (!modal) return;
    var openBtn = document.getElementById('kk-search-btn');
    var closeBtn = document.getElementById('kk-search-close');
    var mask = document.getElementById('kk-search-mask');
    var input = document.getElementById('kk-search-input');
    var stats = document.getElementById('kk-search-stats');
    var list = document.getElementById('kk-search-results');
    var entries = null;
    var loading = false;

    function open() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      setTimeout(function () { input.focus(); }, 60);
      load();
    }
    function close() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (mask) mask.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.hidden) open(); else close();
      }
    });

    function normalizeUrl(u) {
      u = (u || '').trim();
      if (/^https?:\/\//i.test(u)) {
        try { u = new URL(u).pathname; } catch (e) {}
      }
      if (u.charAt(0) !== '/') u = '/' + u;
      return u;
    }

    function htmlToText(s) {
      var d = document.createElement('div');
      d.innerHTML = s;
      return d.textContent || d.innerText || '';
    }

    function load() {
      if (entries || loading) return;
      loading = true;
      stats.textContent = '索引加载中…';
      fetch(CFG.searchPath || '/search.xml')
        .then(function (r) {
          if (!r.ok) throw new Error('http ' + r.status);
          return r.text();
        })
        .then(function (xml) {
          var doc = new DOMParser().parseFromString(xml, 'text/xml');
          entries = $$('entry', doc).map(function (en) {
            var t = en.querySelector('title');
            var c = en.querySelector('content');
            var u = en.querySelector('url');
            return {
              title: t ? t.textContent : '',
              content: c ? htmlToText(c.textContent).replace(/\s+/g, ' ').trim() : '',
              url: normalizeUrl(u ? u.textContent : '')
            };
          });
          stats.textContent = '共收录 ' + entries.length + ' 篇文章 ✦';
          loading = false;
          if (input.value.trim()) run();
        })
        .catch(function () {
          stats.textContent = '索引加载失败（需 hexo-generator-search）';
          loading = false;
        });
    }

    function highlight(text, kw) {
      var frag = document.createDocumentFragment();
      var lower = text.toLowerCase();
      var k = kw.toLowerCase();
      var i = 0, idx;
      while ((idx = lower.indexOf(k, i)) !== -1 && k) {
        frag.appendChild(document.createTextNode(text.slice(i, idx)));
        var mark = document.createElement('mark');
        mark.textContent = text.slice(idx, idx + kw.length);
        frag.appendChild(mark);
        i = idx + kw.length;
      }
      frag.appendChild(document.createTextNode(text.slice(i)));
      return frag;
    }

    function run() {
      var kw = input.value.trim();
      list.innerHTML = '';
      if (!kw) {
        stats.textContent = entries ? '共收录 ' + entries.length + ' 篇文章 ✦' : '输入关键词开始搜索 ✦';
        return;
      }
      if (!entries) return;
      var k = kw.toLowerCase();
      var hits = entries.filter(function (en) {
        return en.title.toLowerCase().indexOf(k) !== -1 || en.content.toLowerCase().indexOf(k) !== -1;
      }).slice(0, 30);
      stats.textContent = '找到 ' + hits.length + ' 篇相关文章';
      hits.forEach(function (en) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = en.url;
        var title = document.createElement('div');
        title.className = 'kk-sr-title';
        title.appendChild(highlight(en.title, kw));
        var excerpt = document.createElement('div');
        excerpt.className = 'kk-sr-excerpt';
        var ci = en.content.toLowerCase().indexOf(k);
        var snippet = ci === -1
          ? en.content.slice(0, 90)
          : en.content.slice(Math.max(0, ci - 36), ci + 72);
        excerpt.appendChild(highlight(snippet, kw));
        a.appendChild(title);
        a.appendChild(excerpt);
        a.addEventListener('click', close);
        li.appendChild(a);
        list.appendChild(li);
      });
    }

    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(run, 160);
    });
  })();

  /* ---------- 光标光环 + 星星拖尾 ---------- */
  (function initCursorFx() {
    if (reducedMotion || CFG.cursorFx === false || !finePointer) return;
    var canvas = document.getElementById('kk-cursor');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H;
    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var mx = -100, my = -100, rx = -100, ry = -100;
    var hoverLink = false;
    var stars = [];
    var STAR_COLORS = ['#ff9ecb', '#a18cd1', '#7aa2ff', '#ffd1a9', '#8fd3f4'];
    var running = true;

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      hoverLink = !!(e.target && e.target.closest && e.target.closest('a, button'));
      if (stars.length < 60 && Math.random() < 0.5) {
        stars.push({
          x: mx + (Math.random() - 0.5) * 14,
          y: my + (Math.random() - 0.5) * 14,
          size: 2 + Math.random() * 3.5,
          life: 0,
          maxLife: 34 + Math.random() * 22,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 0.3 + Math.random() * 0.5,
          rot: Math.random() * Math.PI,
          color: STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0]
        });
      }
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) running = false;
      else if (!running) { running = true; requestAnimationFrame(tick); }
    });

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // 光环缓动跟随
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ctx.beginPath();
      ctx.arc(rx, ry, hoverLink ? 16 : 10, 0, Math.PI * 2);
      ctx.strokeStyle = hoverLink ? 'rgba(255, 111, 165, 0.85)' : 'rgba(167, 139, 250, 0.65)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(rx, ry, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 111, 165, 0.9)';
      ctx.fill();

      // 星星拖尾
      for (var i = stars.length - 1; i >= 0; i--) {
        var s = stars[i];
        s.life++;
        if (s.life >= s.maxLife) { stars.splice(i, 1); continue; }
        var t = s.life / s.maxLife;
        var a = 1 - t;
        s.x += s.vx;
        s.y += s.vy;
        s.rot += 0.05;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = a;
        ctx.fillStyle = s.color;
        var r = s.size * (1 - t * 0.5);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

})();
