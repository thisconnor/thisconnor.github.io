/* Shared motion system. Everything is gated: no JS, a failed CDN, or
   prefers-reduced-motion all land on a fully visible static page. */

(function () {
  var docEl = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasLibs = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  function setCountersFinal() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = formatCount(parseFloat(el.dataset.count), el);
    });
  }

  function formatCount(v, el) {
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    return prefix + Math.round(v).toLocaleString("en-US") + suffix;
  }

  // -- YouTube facades: the real player loads only on click, keeping the
  // page fast and the console clean. Works with or without animation. --
  document.querySelectorAll(".yt-facade[data-yt]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var iframe = document.createElement("iframe");
      iframe.className = "video-embed";
      iframe.src = "https://www.youtube-nocookie.com/embed/" + btn.dataset.yt + "?autoplay=1&rel=0";
      iframe.title = btn.getAttribute("aria-label") || "Video";
      iframe.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    }, { once: true });
  });

  if (!hasLibs || reduced) {
    docEl.classList.add("no-anim");
    setCountersFinal();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // -- smooth scroll, synced to GSAP's ticker --
  var lenis = new Lenis({ lerp: 0.13 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);

  window.CR = { lenis: lenis };

  // -- nav hairline after scrolling begins --
  ScrollTrigger.create({
    start: 20,
    end: "max",
    toggleClass: { targets: ".nav", className: "is-scrolled" }
  });

  // -- page enter: veil lifts, then content staggers in DOM order --
  var veil = document.querySelector(".veil");

  function buildEnter() {
    var tl = gsap.timeline();

    if (veil) {
      tl.to(veil, { yPercent: -100, duration: 0.5, ease: "power4.inOut" })
        .set(veil, { display: "none" });
    }

    var els = gsap.utils.toArray("[data-enter]");
    var base = veil ? 0.32 : 0;
    var splits = [];

    els.forEach(function (el, i) {
      var pos = base + i * 0.08;
      var kind = el.dataset.enter;

      if (kind === "split") {
        var split = SplitText.create(el, { type: "lines", mask: "lines" });
        splits.push(split);
        tl.set(el, { opacity: 1 }, pos);
        tl.from(split.lines, {
          yPercent: 115,
          duration: 0.85,
          ease: "expo.out",
          stagger: 0.08
        }, pos);
      } else if (kind === "clip") {
        tl.set(el, { opacity: 1 }, pos);
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "expo.out",
          onComplete: function () { gsap.set(el, { clearProps: "clipPath" }); }
        }, pos);
        var img = el.querySelector("img");
        if (img) {
          tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.1, ease: "expo.out" }, pos);
        }
      } else {
        tl.fromTo(el, { y: 28, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "expo.out"
        }, pos);
      }
    });

    var ticks = gsap.utils.toArray("[data-tick]");
    if (ticks.length) {
      tl.fromTo(ticks, { opacity: 0, scale: 0.5 }, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power4.out",
        stagger: 0.05
      }, base + 0.75);
    }

    tl.call(function () {
      splits.forEach(function (s) { s.revert(); });
      document.dispatchEvent(new CustomEvent("cr:entered"));
    });
  }

  // SplitText needs final metrics -- wait for fonts, with a safety net.
  var started = false;
  function startEnter() {
    if (started) return;
    started = true;
    buildEnter();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startEnter);
  }
  window.setTimeout(startEnter, 900);

  // -- scroll reveals: once, top 80% --
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.fromTo(el, { y: 36, opacity: 0, scale: 0.98 }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.65,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 80%", once: true }
    });
  });

  gsap.utils.toArray("[data-reveal-group]").forEach(function (group) {
    var items = group.querySelectorAll("[data-reveal-item]");
    if (!items.length) return;
    gsap.fromTo(items, { y: 32, opacity: 0, scale: 0.98 }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: "top 80%", once: true }
    });
  });

  // -- counters --
  gsap.utils.toArray("[data-count]").forEach(function (el) {
    var end = parseFloat(el.dataset.count);
    var state = { v: 0 };
    el.textContent = formatCount(0, el);
    gsap.to(state, {
      v: end,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: function () { el.textContent = formatCount(state.v, el); }
    });
  });

  // -- page exit: quick veil in, then navigate --
  function isInternal(a) {
    if (a.target === "_blank" || a.hasAttribute("download")) return false;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.hash) return false;
    return true;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a || !veil || !isInternal(a)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    var href = a.href;
    var go = function () {
      if (go.done) return;
      go.done = true;
      location.href = href;
    };
    gsap.set(veil, { display: "block", yPercent: 100 });
    gsap.to(veil, { yPercent: 0, duration: 0.32, ease: "power2.in", onComplete: go });
    window.setTimeout(go, 700);
  });

  // Back/forward cache restore: never leave the veil covering the page.
  window.addEventListener("pageshow", function (e) {
    if (e.persisted && veil) gsap.set(veil, { display: "none" });
  });

  // -- looping showcase videos: hide controls, play only while on screen.
  // Reduced-motion and no-JS keep the poster + native controls instead. --
  var clips = document.querySelectorAll("video[data-autoplay]");
  if (clips.length && "IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    clips.forEach(function (v) {
      v.removeAttribute("controls");
      vio.observe(v);
    });
  }
})();
