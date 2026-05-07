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
    var baseChance = isWishScene ? 0.6 : 0.3;
    var n = strong ? (opts.burst ? 1 : 0.8) : baseChance;
    if (Math.random() > n && !opts.force) return;
    var ang = Math.random() * Math.PI * 2;
    var sp = (strong ? 0.5 : 0.3) + Math.random() * (strong ? 1.2 : 0.5);
    particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - (strong ? 0.4 : 0.2),
      life: strong ? 1.2 + Math.random() * 0.6 : 0.8 + Math.random() * 0.5,
      r: strong ? 2.0 + Math.random() * 4.0 : 1.5 + Math.random() * 3.0,
      a: strong ? 0.8 + Math.random() * 0.2 : 0.5 + Math.random() * 0.2,
      hue: Math.random() < 0.7 ? "warm" : "cool",
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
    var minGap = isWishScene ? 15 : 25;
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

  function createShootingStar() {
    var container = $("shooting-stars");
    if (!container) return;
    var star = document.createElement("span");
    star.className = "shooting-star";
    var startTop = 6 + Math.random() * 22;
    var duration = 1.8 + Math.random() * 1.2;
    var length = 100 + Math.random() * 80;
    var rotate = 18 + Math.random() * 18;
    var colorSets = [
      ["rgba(255, 235, 190, 0.22)", "rgba(255, 237, 197, 0.48)"],
      ["rgba(255, 209, 229, 0.22)", "rgba(255, 225, 241, 0.48)"],
      ["rgba(223, 200, 255, 0.22)", "rgba(236, 226, 255, 0.48)"]
    ];
    var colors = colorSets[(Math.random() * colorSets.length) | 0];
    star.style.top = startTop + "%";
    star.style.left = "100%";
    star.style.width = length + "px";
    star.style.setProperty("--star-length", length + "px");
    star.style.setProperty("--star-duration", duration + "s");
    star.style.setProperty("--star-rotate", rotate + "deg");
    star.style.setProperty("--shooting-color-1", colors[0]);
    star.style.setProperty("--shooting-color-2", colors[1]);
    container.appendChild(star);
    star.addEventListener("animationend", function () {
      if (star && star.parentNode) {
        star.parentNode.removeChild(star);
      }
    });
  }

  function initShootingStars() {
    function scheduleNext() {
      var delay = 3000 + Math.random() * 4000;
      setTimeout(function () {
        createShootingStar();
        scheduleNext();
      }, delay);
    }
    scheduleNext();
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
      '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">' +
      '<defs>' +
      '<radialGradient id="glow" cx="50%" cy="40%" r="70%">' +
      '<stop offset="0%" stop-color="#fff7d4" stop-opacity="1"/>' +
      '<stop offset="60%" stop-color="#f8d17a" stop-opacity="0.8"/>' +
      '<stop offset="100%" stop-color="#f3b63f" stop-opacity="0"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<circle cx="22" cy="22" r="18" fill="url(#glow)" opacity="0.85"/>' +
      '<path d="M14 24 C12 18 18 14 22 14 C26 14 32 18 30 24 C30 28 28 32 22 34 C16 32 14 28 14 24 Z" fill="#f5d77a" stroke="#b58f2c" stroke-width="1.4"/>' +
      '<path d="M11 20 C9 16 13 13 17 15" fill="none" stroke="#b58f2c" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M33 20 C35 16 31 13 27 15" fill="none" stroke="#b58f2c" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="17.5" cy="23.5" r="1.8" fill="#603d06"/>' +
      '<circle cx="26.5" cy="23.5" r="1.8" fill="#603d06"/>' +
      '<path d="M20 29 Q22 31 24 29" fill="none" stroke="#7c4a2a" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M22 6 L22 2" stroke="#fbe5a4" stroke-width="2" stroke-linecap="round" opacity="0.9"/>' +
      '<path d="M26 8 L29 4" stroke="#fbe5a4" stroke-width="2" stroke-linecap="round" opacity="0.8"/>' +
      '</svg>';
    var enc = encodeURIComponent(svg);
    document.documentElement.style.setProperty(
      "--cursor-wand",
      'url("data:image/svg+xml,' + enc + '") 22 22, auto'
    );
    document.documentElement.style.setProperty(
      "--cursor-wand-pointer",
      'url("data:image/svg+xml,' + enc + '") 22 22, pointer'
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
    initShootingStars();
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
