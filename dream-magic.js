(function () {
  "use strict";

  var WISH_STAR_COUNT = 14;
  var wishStarsInited = false;

  var catClickLines = [
    "生日快乐喵～",
    "今天要开心喵～",
    "去留学也要好好吃饭喵～",
    "蔡蔡最棒喵～",
    "梦里也会陪着你喵～",
  ];

  var sceneGuideLines = {
    "scene-intro": "欢迎来到梦境入口喵～",
    "scene-cake": "甜甜的夹心要选自己喜欢的喵～",
    "scene-celebrate": "哗——庆祝的彩带落下来喵～",
    "scene-gallery": "这张照片我也喜欢喵～",
    "scene-wish": "把愿望轻轻交给星星喵～",
    "scene-letter": "下一页有一封藏在梦里的信喵～",
  };

  var canvas;
  var ctx;
  var particles = [];
  var lastMx = 0;
  var lastMy = 0;
  var lastEmit = 0;
  var burstBoost = 0;
  var isWishScene = false;
  var rafId;

  function $(id) {
    return document.getElementById(id);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawnParticle(x, y, opts) {
    opts = opts || {};
    var strong = opts.strong || burstBoost > 0 || isWishScene;
    var baseChance = isWishScene ? 0.26 : 0.09;
    var n = strong ? (opts.burst ? 1 : 0.58) : baseChance;
    if (Math.random() > n && !opts.force) return;
    var ang = Math.random() * Math.PI * 2;
    var sp = (strong ? 0.35 : 0.15) + Math.random() * (strong ? 0.9 : 0.35);
    particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - (strong ? 0.25 : 0.12),
      life: strong ? 0.85 + Math.random() * 0.35 : 0.45 + Math.random() * 0.25,
      r: strong ? 1.2 + Math.random() * 2.2 : 0.7 + Math.random() * 1.2,
      a: strong ? 0.55 + Math.random() * 0.25 : 0.22 + Math.random() * 0.12,
      hue: Math.random() < 0.55 ? "warm" : "cool",
    });
  }

  function burstAt(x, y, count) {
    burstBoost = 22;
    for (var i = 0; i < count; i++) {
      spawnParticle(x, y, { force: true, burst: true, strong: true });
    }
  }

  function tickParticles() {
    if (!ctx) return;
    if (particles.length > 480) particles.splice(0, 340);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.012;
      p.life -= 0.018;
      p.a *= 0.985;
      if (p.life <= 0 || p.a < 0.02) {
        particles.splice(i, 1);
        continue;
      }
      var grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      if (p.hue === "warm") {
        grd.addColorStop(0, "rgba(255, 251, 235, " + p.a + ")");
        grd.addColorStop(0.5, "rgba(253, 224, 171, " + p.a * 0.65 + ")");
        grd.addColorStop(1, "rgba(251, 191, 36, 0)");
      } else {
        grd.addColorStop(0, "rgba(255, 255, 255, " + p.a + ")");
        grd.addColorStop(0.45, "rgba(224, 231, 255, " + p.a * 0.55 + ")");
        grd.addColorStop(1, "rgba(196, 181, 253, 0)");
      }
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (burstBoost > 0) burstBoost--;
  }

  function loop() {
    tickParticles();
    rafId = requestAnimationFrame(loop);
  }

  function onMove(e) {
    var mx = e.clientX;
    var my = e.clientY;
    var now = performance.now();
    var dt = now - lastEmit;
    var minGap = isWishScene ? 22 : 42;
    if (dt < minGap) {
      lastMx = mx;
      lastMy = my;
      updateCatLook(mx, my);
      return;
    }
    lastEmit = now;
    var dx = mx - lastMx;
    var dy = my - lastMy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1.5) {
      updateCatLook(mx, my);
      return;
    }
    var steps = Math.min(4, 1 + Math.floor(dist / 28));
    for (var s = 0; s < steps; s++) {
      var t = s / Math.max(1, steps - 1);
      spawnParticle(lastMx + (mx - lastMx) * t, lastMy + (my - lastMy) * t, {});
    }
    lastMx = mx;
    lastMy = my;
    updateCatLook(mx, my);
  }

  function initStardust() {
    canvas = $("magic-stardust-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches.length !== 1) return;
        var t = e.touches[0];
        onMove({ clientX: t.clientX, clientY: t.clientY });
      },
      { passive: true }
    );
    lastMx = innerWidth / 2;
    lastMy = innerHeight / 2;
    loop();
  }

  function setWishScene(active) {
    isWishScene = !!active;
    document.body.classList.toggle("wish-scene-active", !!active);
  }

  function onDreamScene(e) {
    var id = e.detail && e.detail.id;
    setWishScene(id === "scene-wish");
    showCatSceneTip(id);
  }

  var bubbleTimer;
  var bubbleEl;
  var catHit;
  var catVisual;
  var lastTipId = "";
  var lastTipTime = 0;

  function applyWandCursor() {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">' +
      '<circle cx="22" cy="13" r="9" fill="#fef3c7" opacity="0.52"/>' +
      '<path fill="#fffbeb" stroke="#c4a574" stroke-width="1.25" stroke-linejoin="round" d="M22 4l2.4 6 6.5.5-5 4 1.6 6.2-5.5-3.3-5.5 3.3L18 14.5l-5-4 6.5-.5z"/>' +
      '<path fill="none" stroke="#7c4a2a" stroke-width="3.8" stroke-linecap="round" d="M22 20q-2.5 9 1.5 18q1.5 6-1 14"/>' +
      '<path fill="none" stroke="#f8ecd4" stroke-width="1.45" stroke-linecap="round" opacity="0.9" d="M21 21q1 7 0.5 15"/>' +
      "</svg>";
    var enc = encodeURIComponent(svg);
    document.documentElement.style.setProperty(
      "--cursor-wand",
      'url("data:image/svg+xml,' + enc + '") 14 46, auto'
    );
    document.documentElement.style.setProperty(
      "--cursor-wand-pointer",
      'url("data:image/svg+xml,' + enc + '") 14 46, pointer'
    );
  }

  function showBubble(text, ms) {
    if (!bubbleEl) return;
    bubbleEl.textContent = text;
    bubbleEl.hidden = false;
    bubbleEl.classList.add("guide-cat-bubble--show");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () {
      bubbleEl.classList.remove("guide-cat-bubble--show");
      bubbleEl.hidden = true;
    }, ms || 4200);
  }

  function showCatSceneTip(sceneId) {
    var line = sceneGuideLines[sceneId];
    if (!line) return;
    var now = Date.now();
    if (sceneId === lastTipId && now - lastTipTime < 900) return;
    lastTipId = sceneId;
    lastTipTime = now;
    showBubble(line, 4800);
  }

  function updateCatLook(mx, my) {
    if (!catHit || !catVisual) return;
    var r = catHit.getBoundingClientRect();
    var cx = r.left + r.width * 0.55;
    var cy = r.top + r.height * 0.35;
    var dx = mx - cx;
    var dy = my - cy;
    var ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    var near = Math.hypot(dx, dy) < 220;
    catVisual.classList.toggle("guide-cat-visual--peek", near);
    ang = Math.max(-22, Math.min(22, ang * 0.28));
    catVisual.style.setProperty("--cat-look", ang + "deg");
  }

  function randomClickLine() {
    return catClickLines[(Math.random() * catClickLines.length) | 0];
  }

  function initCat() {
    bubbleEl = $("guide-cat-bubble");
    catHit = $("guide-cat-hit");
    catVisual = $("guide-cat-visual");
    if (!catHit) return;
    catHit.addEventListener("click", function (ev) {
      ev.stopPropagation();
      burstAt(ev.clientX, ev.clientY, isWishScene ? 28 : 14);
      showBubble(randomClickLine(), 4000);
    });
    setInterval(function () {
      if (!catVisual) return;
      catVisual.classList.add("guide-cat-visual--blink");
      setTimeout(function () {
        catVisual.classList.remove("guide-cat-visual--blink");
      }, 140);
    }, 3200 + Math.random() * 2400);
    setInterval(function () {
      if (!catVisual) return;
      catVisual.classList.toggle("guide-cat-visual--sit", Math.random() > 0.55);
    }, 9000);
  }

  function buildWishStars() {
    var wrap = $("wish-stars");
    if (!wrap || wishStarsInited) return;
    wishStarsInited = true;
    wrap.innerHTML = "";
    for (var i = 0; i < WISH_STAR_COUNT; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "wish-star";
      b.textContent = "✦";
      b.setAttribute("aria-label", "星星 " + (i + 1));
      var sz = 14 + ((i * 7) % 18);
      var op = 0.45 + ((i * 13) % 40) / 100;
      b.style.width = sz + "px";
      b.style.height = sz + "px";
      b.style.opacity = String(op);
      b.style.animationDelay = i * 0.35 + "s";
      b.addEventListener("click", function (ev) {
        this.classList.toggle("lit");
        burstAt(ev.clientX, ev.clientY, 36);
        showBubble("叮——愿望被星星记住喵～", 3200);
      });
      wrap.appendChild(b);
    }
  }

  function initWishPage() {
    var btnCast = $("wish-cast-btn");
    var btnLetter = $("wish-to-letter");
    if (btnCast) {
      btnCast.addEventListener("click", function (ev) {
        document.querySelectorAll(".wish-star").forEach(function (star, index) {
          setTimeout(function () {
            star.classList.add("lit");
          }, index * 90);
        });
        burstAt(ev.clientX, ev.clientY, 48);
        showBubble("呼啦～施了一次小魔法喵～", 3500);
      });
    }
    if (btnLetter) {
      btnLetter.addEventListener("click", function () {
        if (typeof window.__birthdayEnterLetter === "function") {
          window.__birthdayEnterLetter();
        }
      });
    }
  }

  document.addEventListener("dreamscene", onDreamScene);

  document.addEventListener("DOMContentLoaded", function () {
    applyWandCursor();
    initStardust();
    initCat();
    initWishPage();
    buildWishStars();
    var active = document.querySelector(".scene.scene-active");
    if (active && active.id) {
      setWishScene(active.id === "scene-wish");
      showCatSceneTip(active.id);
    }
  });
})();
