/* Home signature moment: a cursor-reactive dot field behind the hero
   (ambient layer) plus a short pinned scale settle on scroll (scroll
   layer). Touch devices get a static field and no pin; reduced motion
   gets a static field only. */

(function () {
  var hero = document.querySelector(".hero");
  var canvas = document.getElementById("dotgrid");
  if (!hero || !canvas) return;

  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasLibs = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  var animate = hasLibs && !reduced && fine;

  var SPACING = 26;
  var RADIUS = 140;
  var dots = [];
  var W = 0;
  var H = 0;
  var pointer = { x: -9999, y: -9999 };
  var running = false;

  // Precomputed slate -> signal ramp so the hot loop never builds strings.
  var STEPS = 24;
  var ramp = [];
  (function () {
    for (var i = 0; i <= STEPS; i++) {
      var t = i / STEPS;
      var r = Math.round(85 + (0 - 85) * t);
      var g = Math.round(97 + (178 - 97) * t);
      var b = Math.round(108 + (255 - 108) * t);
      var a = 0.3 + 0.62 * t;
      ramp.push("rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")");
    }
  })();

  function build() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (var y = SPACING; y < H - SPACING / 2; y += SPACING) {
      for (var x = SPACING; x < W - SPACING / 2; x += SPACING) {
        dots.push({ ox: x, oy: y, x: x, y: y, vx: 0, vy: 0 });
      }
    }
    drawStatic();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ramp[0];
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      ctx.beginPath();
      ctx.arc(d.ox, d.oy, 1.4, 0, 6.2832);
      ctx.fill();
    }
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    var r2 = RADIUS * RADIUS;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var dx = d.x - pointer.x;
      var dy = d.y - pointer.y;
      var dist2 = dx * dx + dy * dy;
      var t = 0;
      if (dist2 < r2) {
        var dist = Math.sqrt(dist2) || 1;
        var f = 1 - dist / RADIUS;
        t = f;
        d.vx += (dx / dist) * f * 1.7;
        d.vy += (dy / dist) * f * 1.7;
      }
      d.vx += (d.ox - d.x) * 0.085;
      d.vy += (d.oy - d.y) * 0.085;
      d.vx *= 0.82;
      d.vy *= 0.82;
      d.x += d.vx;
      d.y += d.vy;
      ctx.fillStyle = ramp[Math.round(t * STEPS)];
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.4 + t * 1.3, 0, 6.2832);
      ctx.fill();
    }
  }

  build();

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  });

  if (!animate) return;

  hero.addEventListener("pointermove", function (e) {
    var rect = hero.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  });

  hero.addEventListener("pointerleave", function () {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  gsap.ticker.add(tick);

  ScrollTrigger.create({
    trigger: hero,
    start: "top bottom",
    end: "bottom top",
    onToggle: function (self) { running = self.isActive; }
  });
  running = true;

  // -- pinned settle: name starts oversized, locks into place --
  var mm = gsap.matchMedia();
  mm.add("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", function () {
    gsap.set(".hero-zoom", { scale: 1.08, transformOrigin: "50% 38%" });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "+=55%",
        pin: true,
        scrub: true,
        anticipatePin: 1
      }
    });

    tl.to(".hero-zoom", { scale: 1, ease: "none" }, 0)
      .to(".hero-photo", { y: -20, ease: "none" }, 0)
      .to(canvas, { opacity: 0.5, ease: "none" }, 0);
  });

  // -- scroll hint: ambient loop, gone once scrolling starts --
  var hint = document.querySelector(".scroll-hint-line");
  if (hint) {
    gsap.timeline({ repeat: -1, repeatDelay: 0.7, delay: 1.6 })
      .fromTo(hint, { scaleY: 0, opacity: 1 }, { scaleY: 1, duration: 0.9, ease: "sine.inOut" })
      .to(hint, { opacity: 0, duration: 0.35, ease: "power2.in" });

    ScrollTrigger.create({
      start: 60,
      once: true,
      onEnter: function () {
        gsap.to(".scroll-hint", { opacity: 0, duration: 0.3, ease: "power2.in" });
      }
    });
  }
})();
