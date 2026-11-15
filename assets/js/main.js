/* ============================================================
   星际首席爱乐乐团 · 交互
   1) 星尘粒子背景  2) 滚动入场  3) 移动端菜单
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 星尘 ---------- */
  var canvas = document.getElementById('starfield');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, raf = null;

    var PALETTE = ['255, 255, 255', '214, 240, 248', '143, 227, 240', '245, 169, 97'];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var count = Math.round(Math.min(180, (w * h) / 11000));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.25,
          a: Math.random() * 0.55 + 0.12,
          vy: (Math.random() * 0.10 + 0.02),
          vx: (Math.random() - 0.5) * 0.06,
          tw: Math.random() * Math.PI * 2,
          ts: Math.random() * 0.012 + 0.004,
          c: PALETTE[Math.random() < 0.06 ? 3 : (Math.random() < 0.3 ? 2 : (Math.random() < 0.5 ? 1 : 0))]
        });
      }
    }

    function paint(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduceMotion) {
          s.y += s.vy;
          s.x += s.vx;
          s.tw += s.ts;
          if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w; }
          if (s.x < -2) s.x = w + 2;
          if (s.x > w + 2) s.x = -2;
        }
        var alpha = reduceMotion ? s.a : s.a * (0.7 + 0.3 * Math.sin(s.tw));
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + s.c + ',' + alpha.toFixed(3) + ')';
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fill();
      }
      if (!reduceMotion) raf = requestAnimationFrame(paint);
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        resize();
        if (reduceMotion) paint();
      }, 180);
    });

    resize();
    if (reduceMotion) paint(); else raf = requestAnimationFrame(paint);

    document.addEventListener('visibilitychange', function () {
      if (reduceMotion) return;
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        raf = requestAnimationFrame(paint);
      }
    });
  }

  /* ---------- 2. 滚动入场 ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(siblings, 4) * 70 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 3. 移动端菜单 ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    var close = function () {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) close();
    });
  }

  /* ---------- 4. 声部行：让 hover 与「当前项」互不打架 ---------- */
  var voices = document.querySelectorAll('.voice');
  if (voices.length) {
    Array.prototype.forEach.call(voices, function (row) {
      row.addEventListener('focusin', function () {
        Array.prototype.forEach.call(voices, function (r) { r.classList.remove('is-active'); });
        row.classList.add('is-active');
      });
    });
  }
})();
