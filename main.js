(function () {
  "use strict";

  /** @type {const} 可按需修改 */
  var CONFIG = {
    userName: "蔡诗晨",
    cakeTopOptions: [
      "蓝莓果酱",
      "火龙果肉",
      "奥巧脆脆珠",
      "菠萝果酱",
      "草莓果酱",
      "巧克力榛子酱",
    ],
    cakeBottomOptions: [
      "蓝莓果酱",
      "火龙果肉",
      "奥巧脆脆珠",
      "菠萝果酱",
      "草莓果酱",
      "巧克力榛子酱",
    ],
    /** 照片与评论顺序与提供的素材一致 */
    photos: [
      { url: "assets/photo01.png", comment: "拳击有力量！" },
      { url: "assets/photo02.png", comment: "有种你来试试看的感觉，所以又选了一张，pick❤" },
      { url: "assets/photo03.png", comment: "探头探脑，蝴蝶结非常合适，萌死我了~" },
      { url: "assets/photo04.png", comment: "y2k风格，酷酷的，喜欢(≧∇≦)ﾉ" },
      { url: "assets/photo05.png", comment: "又选一张，有种大人感的千禧年间的洒拓，语言打结了哈哈~" },
      { url: "assets/photo06.png", comment: "嗯这个配色很千禧，多巴胺撞色很帅，姿态婉约，气质很独特的一张" },
      { url: "assets/photo07.png", comment: "这张发现是12岁的时候有点惊讶，太可爱了，萌之，我还做了包装袋的图，抠图排版了咧，可惜没用上，会给你看哒~" },
      { url: "assets/photo08.png", comment: "这个就很美式乡村田野风格公主，很美丽端坐，稀饭" },
      { url: "assets/photo09.png", comment: "古典风格的一张，居然小小的年纪很像大人，很神奇呢，温婉的感觉，神态很可爱~" },
      { url: "assets/photo10.png", comment: "啊一下子长大了，青春期的年纪，也是我们第一年初识彼此的年纪，这时候有了少年的成熟感，有点想喊姐姐~" },
      { url: "assets/photo11.png", comment: "十八岁，非常非常美丽的一张公主裙照片，其他几张也很美，让我想到刘亦菲的孔雀公主那张，在我看来是年纪与风格风味最为融合的一张，喜欢！" },
      { url: "assets/photo12.png", comment: "最打动我的一张，配色蓝黄撞色，发型轻熟，戴着田园风的帽子，淑女婉约文艺风，美丽的宝宝，是姐姐和妹妹的综合体~" },
    ],
    letterIntro:
      "亲爱的蔡诗晨：\n今天是你的生日，我想把这些温暖的回忆和小小心意送给你……\n希望你每天都开心、幸福，就像每次看到你笑容一样美好。\n爱你的朋友",
    letterBody:
      "亲爱的诗晨：\n很多个时刻，我们在相见，很多个世界，我们在重逢。\n首先，生日快乐！\n很荣幸与蔡蔡从少年走到青年，我想你的青年时期也会有新的迷茫和困难，就像少年时期一样。但又不一样。少年时期，满腔热血，那时候的我们什么都不害怕。谈天说地，说着彼此的梦想欢笑。\n流年些许逝，我总是不停地回想，如今浮现在脑海的是，某一天傍晚，我奔跑着去寝室洗头发，那头走廊里金色的光芒震慑了我。好似我是活在金色里，死在金色里。\n于是不由自主想到死亡。我想我会这样走向死亡吗？\n阒寂无声的傍晚。令我不安的傍晚。思及神往的傍晚。\n于是带着那样的想法，回到当下的空间里，我想，我要和值得的人，我爱的人，愿意相伴的人在一起。如果不在一起，那也要“在一起”。\n因为我们可能走向很多个方向，但是不会忘记彼此所在的方向。\n在过去的信里，我窥见我的狂妄，我把那些说给你听，我看见我的迷茫，我把那些分享给你……我们就这样日日夜夜陪伴着彼此，直到这个节点。这个节点之后，我们还在。下个节点之后，我们还在。新的人生阶段，有困顿，有希望，也还有熟悉的人陪在你身侧。\n我也想就这样看着你走在阳光的大道上，那里会布满金色的光辉，就在我看见的那样。只是那是走向希望的。正因我们如此年轻。\n从前说，不想失去初心。现在想说，只要我们还是我们，我们就是完满的。只要没有背叛自我，哪个方向都是方向。\n期望将来的朋友爱人在你身侧爱你。我没办法在的地方也有很多人照顾你陪伴你。\n献给蔡蔡唯一的二十四岁。\n爱您。——爱你的cc",
    timings: {
      celebrateMs: 2600,
    },
  };

  function getScriptBase() {
    var el = document.querySelector('script[src*="main.js"]');
    if (!el || !el.src) return "";
    var u = el.src.replace(/\\/g, "/");
    return u.replace(/[^/]+$/, "");
  }

  function resolveAsset(path) {
    if (/^https?:\/\//i.test(path)) return path;
    var base = getScriptBase();
    try {
      if (base) return new URL(path, base).href;
    } catch (e) {}
    try {
      return new URL(path, window.location.href).href;
    } catch (e2) {
      return path;
    }
  }

  var state = {
    cakeTop: null,
    cakeBottom: null,
    galleryIndex: 0,
    touchStartX: 0,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function showScene(id) {
    document.querySelectorAll(".scene").forEach(function (el) {
      el.classList.remove("scene-active");
    });
    var next = document.getElementById(id);
    if (next) next.classList.add("scene-active");
    document.dispatchEvent(
      new CustomEvent("dreamscene", { detail: { id: id } })
    );
  }

  window.__birthdayShowScene = showScene;

  function enterLetterScene() {
    showScene("scene-letter");
    var sb = $("scroll-body");
    if (!sb) return;
    sb.scrollTop = 0;
    sb.querySelectorAll(".letter-line").forEach(function (ln) {
      ln.classList.remove("visible");
    });
    requestAnimationFrame(function () {
      var first = sb.querySelector(".letter-page");
      if (first) {
        var lines = first.querySelectorAll(".letter-line");
        lines.forEach(function (ln, i) {
          setTimeout(function () {
            ln.classList.add("visible");
          }, i * 75);
        });
      }
    });
  }

  window.__birthdayEnterLetter = enterLetterScene;

  function initIntro() {
    $("intro-name").textContent = CONFIG.userName;
    $("intro-next-btn").addEventListener("click", function () {
      showScene("scene-cake");
    });
  }

  function renderCakeOptions() {
    $("cake-user-name").textContent = CONFIG.userName;
    var topRow = $("top-options");
    var bottomRow = $("bottom-options");
    topRow.innerHTML = "";
    bottomRow.innerHTML = "";

    function makeChips(options, row, part) {
      options.forEach(function (label) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.textContent = label;
        b.dataset.part = part;
        b.dataset.label = label;
        b.addEventListener("click", function () {
          row.querySelectorAll(".chip").forEach(function (c) {
            c.classList.remove("selected");
          });
          b.classList.add("selected");
          if (part === "top") state.cakeTop = label;
          else state.cakeBottom = label;
          showToast();
          updateCakeVisual();
          updateCakeDone();
        });
        row.appendChild(b);
      });
    }

    makeChips(CONFIG.cakeTopOptions, topRow, "top");
    makeChips(CONFIG.cakeBottomOptions, bottomRow, "bottom");
  }

  function showToast() {
    var t = $("cake-toast");
    t.hidden = false;
    t.classList.remove("pixel-pop");
    void t.offsetWidth;
    t.classList.add("pixel-pop");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      t.hidden = true;
    }, 900);
  }

  function updateCakeVisual() {
    var topEl = document.querySelector(".cake-top");
    var bottomEl = document.querySelector(".cake-bottom");
    if (state.cakeTop) topEl.setAttribute("title", state.cakeTop);
    if (state.cakeBottom) bottomEl.setAttribute("title", state.cakeBottom);
  }

  function updateCakeDone() {
    $("cake-done").disabled = !(state.cakeTop && state.cakeBottom);
  }

  function initCake() {
    renderCakeOptions();
    $("cake-done").addEventListener("click", function () {
      showScene("scene-celebrate");
      setTimeout(function () {
        showScene("scene-gallery");
        updateGallerySlide();
      }, CONFIG.timings.celebrateMs);
    });
  }

  function updateGallerySlide() {
    var photos = CONFIG.photos;
    var n = photos.length;
    if (!n) return;
    var i = ((state.galleryIndex % n) + n) % n;
    state.galleryIndex = i;
    var item = photos[i];
    var img = $("gallery-img");
    var cap = $("gallery-caption");
    var slide = $("gallery-slide");
    if (slide) {
      slide.classList.remove("gallery-slide--enter");
      void slide.offsetWidth;
      slide.classList.add("gallery-slide--enter");
    }
    cap.textContent = item.comment;
    $("gallery-counter").textContent = "第 " + (i + 1) + " / " + n + " 张";
    var dotButtons = $("gallery-dots").querySelectorAll(".gallery-dot");
    dotButtons.forEach(function (d, di) {
      d.classList.toggle("active", di === i);
    });
    var idx = i;
    var cmt = item.comment;
    img.onload = null;
    img.onerror = function () {
      if (state.galleryIndex !== idx) return;
      cap.textContent =
        "（图片未加载：请把 index.html 与 assets 放在同一文件夹，或用 VS Code Live Server 打开。）\n\n" +
        cmt;
    };
    img.src = resolveAsset(item.url);
    img.alt = "回忆 " + (i + 1);
  }

  function renderGallery() {
    var dots = $("gallery-dots");
    dots.innerHTML = "";

    CONFIG.photos.forEach(function (_photo, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot";
      dot.textContent = "●";
      dot.setAttribute("aria-label", "第" + (i + 1) + "张");
      dot.addEventListener("click", function () {
        state.galleryIndex = i;
        updateGallerySlide();
      });
      dots.appendChild(dot);
    });

    $("gallery-prev").addEventListener("click", function () {
      state.galleryIndex =
        (state.galleryIndex - 1 + CONFIG.photos.length) % CONFIG.photos.length;
      updateGallerySlide();
    });
    $("gallery-next").addEventListener("click", function () {
      state.galleryIndex = (state.galleryIndex + 1) % CONFIG.photos.length;
      updateGallerySlide();
    });

    var wrap = $("gallery-slide-wrap");
    if (wrap) {
      wrap.addEventListener(
        "touchstart",
        function (e) {
          if (e.touches.length === 1)
            state.touchStartX = e.touches[0].clientX;
        },
        { passive: true }
      );
      wrap.addEventListener("touchend", function (e) {
        if (!e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - state.touchStartX;
        if (Math.abs(dx) > 48) {
          if (dx < 0) $("gallery-next").click();
          else $("gallery-prev").click();
        }
      });
    }

    state.galleryIndex = 0;
    updateGallerySlide();
    addLetterEntryButton();
  }

  function splitLines(text) {
    return text.split(/\n/).filter(function (s) {
      return s.trim().length;
    });
  }

  function chunkLongParagraph(s, maxLen) {
    var out = [];
    s = s.trim();
    while (s.length) {
      if (s.length <= maxLen) {
        out.push(s);
        break;
      }
      var slice = s.slice(0, maxLen);
      var breakAt = Math.max(
        slice.lastIndexOf("。"),
        slice.lastIndexOf("！"),
        slice.lastIndexOf("？"),
        slice.lastIndexOf("，")
      );
      if (breakAt < maxLen * 0.35) breakAt = maxLen - 1;
      out.push(s.slice(0, breakAt + 1).trim());
      s = s.slice(breakAt + 1).trim();
    }
    return out;
  }

  function buildLetter() {
    var container = $("letter-pages");
    container.innerHTML = "";
    var scrollBody = $("scroll-body");

    function appendPage(title, paragraphs) {
      var page = document.createElement("div");
      page.className = "letter-page";
      if (title) {
        var h = document.createElement("h3");
        h.className = "letter-page-title";
        h.textContent = title;
        page.appendChild(h);
      }
      paragraphs.forEach(function (para) {
        var p = document.createElement("p");
        p.className = "letter-line";
        p.textContent = para;
        page.appendChild(p);
      });
      container.appendChild(page);
    }

    appendPage("", splitLines(CONFIG.letterIntro));

    splitLines(CONFIG.letterBody).forEach(function (para) {
      var parts =
        para.length > 320 ? chunkLongParagraph(para, 300) : [para];
      parts.forEach(function (piece) {
        appendPage("", [piece]);
      });
    });

    var pages = container.querySelectorAll(".letter-page");
    var totalPages = pages.length;

    function revealLine(el) {
      if (el.classList.contains("visible")) return;
      el.classList.add("visible");
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var page = en.target;
          var lines = page.querySelectorAll(".letter-line");
          lines.forEach(function (ln, i) {
            setTimeout(function () {
              revealLine(ln);
            }, i * 70);
          });
        });
      },
      { root: scrollBody, threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    pages.forEach(function (pg) {
      io.observe(pg);
    });

    var indicator = $("letter-page-indicator");
    function updateIndicator() {
      var h = scrollBody.clientHeight || 1;
      var idx = Math.round(scrollBody.scrollTop / h);
      idx = Math.max(0, Math.min(idx, totalPages - 1));
      indicator.textContent = "第 " + (idx + 1) + " / " + totalPages + " 页";
    }

    scrollBody.addEventListener("scroll", updateIndicator, { passive: true });
    updateIndicator();

    $("letter-prev").addEventListener("click", function () {
      scrollBody.scrollBy({
        top: -scrollBody.clientHeight * 0.92,
        behavior: "smooth",
      });
    });
    $("letter-next").addEventListener("click", function () {
      scrollBody.scrollBy({
        top: scrollBody.clientHeight * 0.92,
        behavior: "smooth",
      });
    });
  }

  function addLetterEntryButton() {
    var panel = document.querySelector(".gallery-panel");
    if (!panel || document.getElementById("to-letter-btn")) return;
    var btn = document.createElement("button");
    btn.id = "to-letter-btn";
    btn.type = "button";
    btn.className = "pixel-btn";
    btn.style.marginTop = "1rem";
    btn.textContent = "去许愿星池";
    btn.addEventListener("click", function () {
      showScene("scene-wish");
    });
    panel.appendChild(btn);
  }


  function initWishFallback() {
    var wrap = $("wish-stars");
    if (wrap && wrap.children.length === 0) {
      wrap.innerHTML = "";
      for (var i = 0; i < 14; i++) {
        var star = document.createElement("button");
        star.type = "button";
        star.className = "wish-star";
        star.textContent = "✦";
        star.setAttribute("aria-label", "许愿星星 " + (i + 1));
        var sz = 34 + ((i * 5) % 18);
        star.style.width = sz + "px";
        star.style.height = sz + "px";
        star.style.animationDelay = i * 0.22 + "s";
        star.addEventListener("click", function () {
          this.classList.toggle("lit");
        });
        wrap.appendChild(star);
      }
    }

    var castBtn = $("wish-cast-btn");
    if (castBtn) {
      castBtn.addEventListener("click", function () {
        document.querySelectorAll(".wish-star").forEach(function (star, index) {
          setTimeout(function () {
            star.classList.add("lit");
          }, index * 90);
        });
      });
    }

    var letterBtn = $("wish-to-letter");
    if (letterBtn) {
      letterBtn.addEventListener("click", function () {
        enterLetterScene();
      });
    }
  }

  function init() {
    initIntro();
    initCake();
    renderGallery();
    buildLetter();
    initWishFallback();
    showScene("scene-intro");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
