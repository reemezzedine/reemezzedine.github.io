(() => {
  const C = window.CONTENT;
  const $ = (s, el = document) => el.querySelector(s);
  const h = (tag, cls, html) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1. CAKE + CANDLES
     ========================================================= */
  const screen = $("#cake-screen");
  $("#cake-name").textContent = C.cake.kicker;
  $("#cake-title").textContent = C.cake.title;
  $("#cake-hint").textContent = C.cake.hint;
  $("#cake-done").textContent = C.cake.done;
  $("#open-btn").textContent = C.cake.button;
  $("#skip-btn").textContent = C.cake.fallbackHint;
  $("#cake-text").textContent = C.nickname.toLowerCase();

  const candleWrap = $("#candles");
  const candles = [];
  for (let i = 0; i < C.cake.candles; i++) {
    const c = h("div", "candle");
    c.appendChild(h("div", "flame"));
    candleWrap.appendChild(c);
    candles.push(c);
  }
  let litCount = candles.length;

  function blowOut(c) {
    if (c.classList.contains("out")) return;
    c.classList.add("out");
    ["", "s2", "s3"].forEach((s) => {
      const p = h("div", "smoke " + s);
      c.appendChild(p);
      setTimeout(() => p.remove(), 2000);
    });
    if (navigator.vibrate) navigator.vibrate(12);
    litCount--;
    if (litCount === 0) setTimeout(allOut, 450);
  }

  // distance from point p to segment ab
  function distToSeg(p, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = dx * dx + dy * dy;
    let t = len ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  }

  function checkSwipe(a, b) {
    candles.forEach((c) => {
      if (c.classList.contains("out")) return;
      const r = c.querySelector(".flame").getBoundingClientRect();
      const center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      // generous hit area: flame + a bit of candle below it
      const reach = Math.max(r.width * 1.3, 18);
      if (distToSeg(center, a, b) < reach || (Math.abs(b.x - center.x) < reach && b.y > r.top - 30 && b.y < r.bottom + r.height * 2.2)) {
        blowOut(c);
      }
    });
  }

  let last = null;
  screen.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    last = { x: e.clientX, y: e.clientY };
    screen.setPointerCapture?.(e.pointerId);
    checkSwipe(last, last);
  });
  screen.addEventListener("pointermove", (e) => {
    // mouse can also "swipe" just by hovering with the button held; touch always counts
    if (!last) {
      if (e.pointerType === "mouse" && e.buttons === 0) return;
      last = { x: e.clientX, y: e.clientY };
    }
    const now = { x: e.clientX, y: e.clientY };
    checkSwipe(last, now);
    last = now;
  });
  const end = () => (last = null);
  screen.addEventListener("pointerup", end);
  screen.addEventListener("pointercancel", end);
  // stop iOS rubber-banding / pull-to-refresh during the swipe
  screen.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

  const skip = $("#skip-btn");
  setTimeout(() => litCount > 0 && skip.classList.add("show"), 9000);
  skip.addEventListener("click", () => {
    candles.forEach((c, i) => setTimeout(() => blowOut(c), i * 160));
  });

  function allOut() {
    // camera flash, then confetti
    $("#flash").classList.add("go");
    if (navigator.vibrate) navigator.vibrate([20, 60, 20]);
    setTimeout(() => { screen.classList.add("all-out"); sparkleBurst(); }, 120);
  }

  /* ---- smoke + sparkle moment ---- */
  function sparkleBurst() {
    const cv = $("#sparkles");
    const ctx = cv.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const W = (cv.width = innerWidth * dpr), H = (cv.height = innerHeight * dpr);
    const stage = $("#cake-stage").getBoundingClientRect();
    const ox = (stage.left + stage.width / 2) * dpr, oy = (stage.top + stage.height * 0.2) * dpr;
    const colors = ["#4f6ef7", "#bccaff", "#f7c6d6", "#e894b2", "#ffffff", "#ffe08a"];
    const parts = [];
    const n = reduced ? 30 : 110;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = (2 + Math.random() * 7) * dpr;
      parts.push({
        x: ox, y: oy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 4 * dpr,
        s: (3 + Math.random() * 6) * dpr, rot: Math.random() * 6, vr: (Math.random() - .5) * .3,
        c: colors[(Math.random() * colors.length) | 0], star: Math.random() < .55, life: 1,
      });
    }
    function star(x, y, r, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.rotate(Math.PI / 2);
      }
      ctx.fill(); ctx.restore();
    }
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      parts.forEach((p) => {
        if (p.life <= 0) return;
        alive++;
        p.vy += 0.12 * dpr; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.006;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
        ctx.fillStyle = p.c;
        if (p.star) star(p.x, p.y, p.s, p.rot);
        else { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); }
      });
      frame++;
      if (alive && frame < 600) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    })();
  }

  /* ---- open the scrapbook ---- */
  $("#open-btn").addEventListener("click", () => {
    buildBook();
    document.body.classList.remove("locked");
    document.body.classList.add("opened");
    window.scrollTo(0, 0);
    screen.classList.add("leaving"); // curtains part
    setTimeout(() => screen.remove(), 1500);
  });

  /* =========================================================
     2. SCRAPBOOK
     ========================================================= */
  const book = $("#book");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.dispatchEvent(new CustomEvent("seen"));
      io.unobserve(en.target);
    });
  }, { threshold: 0.18 });
  const reveal = (el) => { el.classList.add("reveal"); io.observe(el); return el; };

  const img = (src, alt = "") => {
    const i = new Image();
    i.src = src; i.alt = alt; i.loading = "lazy"; i.decoding = "async"; i.draggable = false;
    return i;
  };

  const filt = (f) => (f ? " f-" + f : "");

  function photoEl(p) {
    const f = h("figure", `photo ${p.style || "polaroid"}${p.wide ? " wide" : ""}${filt(p.filter)}`);
    f.style.setProperty("--tilt", (p.tilt || 0) + "deg");
    const fr = h("div", "frame");
    fr.appendChild(img(p.src, p.caption || ""));
    f.appendChild(fr);
    if (p.caption) f.appendChild(h("figcaption", "", p.caption));
    return reveal(f);
  }

  function stripEl(st, i) {
    const f = h("figure", `strip${st.dark ? " dark" : ""}${filt(st.filter)}`);
    f.style.setProperty("--tilt", (st.tilt || 0) + "deg");
    st.photos.forEach((ph) => {
      // a photo is either "path.webp" or { src, y } where y moves the crop (0 = top, 100 = bottom)
      const p = typeof ph === "string" ? { src: ph } : ph;
      const fr = h("div", "frame");
      const im = img(p.src, st.caption || "");
      if (p.y != null) im.style.objectPosition = `50% ${p.y}%`;
      fr.appendChild(im);
      f.appendChild(fr);
    });
    if (st.caption) f.appendChild(h("figcaption", "", st.caption));
    return reveal(f);
  }

  /* ---- little pen doodles ---- */
  const DOODLES = {
    heart: "M26 44 C8 30 4 18 12 11 C19 5 26 10 26 17 C26 10 34 5 41 11 C49 18 44 30 26 44 Z",
    star: "M26 4 L31 19 L47 19 L34 29 L39 45 L26 35 L13 45 L18 29 L5 19 L21 19 Z",
    sparkle: "M26 4 C27 20 32 25 48 26 C32 27 27 32 26 48 C25 32 20 27 4 26 C20 25 25 20 26 4 Z",
    arrow: "M6 40 C16 20 30 14 44 12 M34 6 L45 12 L37 21",
    squiggle: "M4 30 C10 14 16 46 24 28 S36 12 42 30 S50 40 50 24",
    crown: "M6 40 L10 14 L20 28 L26 10 L32 28 L42 14 L46 40 Z",
    smile: "M26 6 A20 20 0 1 0 26.1 6 M18 21 L18 23 M34 21 L34 23 M16 31 C22 39 30 39 36 31",
    flash: "M30 4 L12 28 L24 28 L18 48 L40 20 L28 20 Z",
  };
  const doodleNames = Object.keys(DOODLES);
  let doodleIdx = 0;
  function addDoodles(el, n) {
    for (let k = 0; k < n; k++) {
      const name = doodleNames[doodleIdx++ % doodleNames.length];
      const d = h("div", "doodle" + (doodleIdx % 3 === 0 ? " red" : ""), `<svg viewBox="0 0 52 52"><path d="${DOODLES[name]}"/></svg>`);
      const spots = [["8%", "auto", "auto", "6px"], ["auto", "10px", "14px", "auto"], ["46%", "4px", "auto", "auto"], ["auto", "auto", "38%", "2px"]];
      const [top, right, bottom, left] = spots[(doodleIdx + k) % spots.length];
      Object.assign(d.style, { top, right, bottom, left, transform: `rotate(${(k % 2 ? 1 : -1) * (8 + doodleIdx * 5 % 20)}deg)` });
      el.appendChild(d);
    }
  }

  const paperStyles = ["checker", "grid", "lined", "kraft"];
  let paperIdx = 0;

  function header(page, el) {
    el.appendChild(h("h2", "page-title", page.title));
    if (page.note) el.appendChild(h("p", "page-note", page.note));
  }

  const builders = {
    photos(page) {
      const el = h("section", "page " + paperStyles[paperIdx++ % 3]);
      header(page, el);
      const grid = h("div", "booth-layout");
      (page.strips || []).forEach((st, i) => grid.appendChild(stripEl(st, i)));
      (page.photos || []).forEach((p) => grid.appendChild(photoEl(p)));
      el.appendChild(grid);
      addDoodles(el, 1);
      return el;
    },

    memories(page) {
      const el = h("section", "page black");
      header(page, el);
      const grid = h("div", "mem-grid");
      const tilts = [-3, 2, -1, 3, -2, 1.5];
      page.items.forEach((m, i) => {
        const card = h("button", "mem-card");
        card.type = "button";
        card.style.setProperty("--tilt", tilts[i % tilts.length] + "deg");
        card.appendChild(h("span", "no", "Nº " + String(i + 1).padStart(3, "0")));
        card.appendChild(h("span", "admit", "admit one"));
        const art = h("span", "mem-art");
        const pic = img(m.photo || m.sticker);
        if (!m.photo) pic.className = "stk";
        art.appendChild(pic);
        card.appendChild(art);
        card.appendChild(h("span", "mem-label", m.label));
        card.appendChild(h("span", "tap", "tap"));
        card.addEventListener("click", () => { card.classList.add("seen"); openModal(m); });
        grid.appendChild(reveal(card));
      });
      el.appendChild(grid);
      return el;
    },

    timeline(page) {
      const el = h("section", "page lined");
      header(page, el);
      const wrap = h("div", "timeline-wrap");
      const ol = h("ol", "timeline");
      page.items.forEach((it) => {
        const li = h("li", "", `<div class="when">${it.when}</div><div class="what">${it.what}</div>`);
        ol.appendChild(reveal(li));
      });
      wrap.appendChild(ol);
      if (page.photo) {
        const f = photoEl({ ...page.photo, style: "polaroid" });
        f.classList.add("timeline-photo");
        wrap.appendChild(f);
      }
      el.appendChild(wrap);
      return el;
    },

    stats(page) {
      const el = h("section", "page black");
      el.appendChild(h("h2", "page-title", page.title));
      el.appendChild(h("p", "stats-sub", page.subtitle));

      const big = h("div", "big-stats");
      page.big.forEach((s) => {
        const b = h("div", "big-stat", `<div class="num" data-to="${s.value}" data-suffix="${s.suffix || ""}">0</div><div class="lbl">${s.label}</div>`);
        big.appendChild(b);
      });
      el.appendChild(big);
      big.addEventListener("seen", () => big.querySelectorAll(".num").forEach(countUp));
      reveal(big);

      el.appendChild(h("h3", "said-title", page.saidTitle));
      const top = Math.max(...page.said.map((v) => v.count));
      page.said.forEach((v, i) => {
        const row = h("div", "vs-row", `
          <div class="lbl">${v.label}</div>
          <div class="bar ${i % 2 ? "m" : "h"}"><i></i><b>${v.count.toLocaleString("en")}</b></div>`);
        row.addEventListener("seen", () => {
          const pct = Math.max(4, (v.count / top) * 78);
          row.querySelector(".bar i").style.width = pct + "%";
          row.querySelector(".bar b").style.left = pct + "%";
        });
        el.appendChild(reveal(row));
      });

      const r = h("div", "receipt");
      r.appendChild(h("h4", "", "bestie studio"));
      r.appendChild(h("div", "meta", `receipt #0211 · cashier: reem<br>customer: ${C.name.toLowerCase()}`));
      r.appendChild(h("hr"));
      page.receipt.forEach(([k, v]) => r.appendChild(h("div", "row", `<span class="k">${k}</span><span class="dots"></span><span class="v">${v}</span>`)));
      r.appendChild(h("hr"));
      r.appendChild(h("div", "row", `<span class="k"><b>TOTAL</b></span><span class="dots"></span><span class="v"><b>priceless</b></span>`));
      r.appendChild(h("div", "stamp", "PAID"));
      r.appendChild(h("div", "barcode"));
      r.appendChild(h("p", "foot", page.receiptFooter));
      el.appendChild(reveal(r));
      return el;
    },

    stickers(page) {
      const el = h("section", "page grid");
      header(page, el);
      const sheet = h("div", "sheet");
      C.stickers.forEach((src) => {
        const slot = h("div", "sheet-slot");
        const s = img(src);
        slot.appendChild(s);
        // pressing a sticker on the sheet peels off a copy you can drag anywhere
        s.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          const br = el.getBoundingClientRect();
          const sr = s.getBoundingClientRect();
          const fs = makeSticker(src, sr.left - br.left, sr.top - br.top, (Math.random() - .5) * 20, false, el);
          fs.classList.add("pop");
          startDrag(fs, e);
        });
        sheet.appendChild(slot);
      });
      el.appendChild(sheet);
      el.appendChild(h("p", "sheet-hint", "press + drag · unlimited supply · go crazy"));
      return el;
    },

    note(page) {
      const el = h("section", "page note-page checker");
      el.appendChild(h("h2", "page-title", page.title));
      const env = h("button", "envelope", `
        <div class="env-back"></div>
        <div class="env-letter"></div>
        <div class="env-front"></div>
        <div class="env-flap"></div>
        <div class="env-stamp">♡</div>
        <div class="env-seal">T</div>`);
      env.type = "button";
      env.setAttribute("aria-label", "open the letter");
      el.appendChild(env);
      const label = h("p", "env-label", page.envelopeLabel);
      el.appendChild(label);

      const letter = h("div", "letter");
      page.letter.forEach((p) => letter.appendChild(h("p", "", p)));
      letter.appendChild(h("p", "signoff", page.signoff));
      el.appendChild(letter);

      env.addEventListener("click", () => {
        if (env.classList.contains("open")) return;
        env.classList.add("open");
        label.textContent = "♡ ♡ ♡";
        setTimeout(() => {
          letter.classList.add("show");
          letter.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
          letter.querySelectorAll("p").forEach((p, i) => setTimeout(() => p.classList.add("in"), 500 + i * 650));
          setTimeout(() => sparkleRain(), 600);
        }, 1100);
      });
      return el;
    },
  };

  function countUp(el) {
    const to = +el.dataset.to, suffix = el.dataset.suffix || "";
    const dur = reduced ? 1 : 1600, t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e).toLocaleString("en") + suffix;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---- memory modal ---- */
  const modal = h("div", "modal", `<div class="modal-card" role="dialog" aria-modal="true"><button class="modal-close" aria-label="close">✕</button><div class="modal-body"></div></div>`);
  document.body.appendChild(modal);
  function openModal(m) {
    const body = $(".modal-body", modal);
    body.innerHTML = "";
    const art = h("div", "modal-art");
    const pic = img(m.photo || m.sticker);
    if (!m.photo) pic.className = "stk";
    art.appendChild(pic);
    body.appendChild(art);
    body.appendChild(h("h3", "", m.label));
    body.appendChild(h("p", "", m.back));
    modal.classList.add("show");
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".modal-close")) modal.classList.remove("show");
  });
  addEventListener("keydown", (e) => e.key === "Escape" && modal.classList.remove("show"));

  /* ---- draggable stickers ---- */
  // stickers live inside a page, positioned relative to it, so they stay put if photos load late
  let wordIdx = 0;
  function makeSticker(src, x, y, rot, isWord, parent) {
    const s = h("div", "free-sticker" + (isWord ? " word" : ""));
    if (isWord) { s.textContent = src; s.classList.add("w" + (wordIdx++ % 4)); }
    else s.appendChild(img(src));
    s.style.left = x + "px";
    s.style.top = typeof y === "string" ? y : y + "px";
    s.style.setProperty("--rot", rot + "deg");
    s.addEventListener("pointerdown", (e) => startDrag(s, e));
    parent.appendChild(s);
    return s;
  }

  function startDrag(s, e) {
    e.preventDefault();
    const parent = s.parentElement;
    const sr = s.getBoundingClientRect();
    const off = { x: e.clientX - sr.left, y: e.clientY - sr.top };
    s.classList.add("dragging");
    s.classList.remove("auto"); // moved by hand: keep it where she puts it
    parent.appendChild(s); // bring to front
    const move = (ev) => {
      const p = parent.getBoundingClientRect();
      const b = book.getBoundingClientRect();
      const minX = b.left - p.left - 10, maxX = b.right - p.left - sr.width + 10;
      const x = Math.max(minX, Math.min(maxX, ev.clientX - p.left - off.x));
      s.style.left = x + "px";
      s.style.top = ev.clientY - p.top - off.y + "px";
    };
    const up = () => {
      s.classList.remove("dragging");
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
  }

  // stickers only go in empty space: never on top of text or photos
  const OBSTACLES = ".page-title, .page-note, figure, .mem-card, .timeline li, .stats-sub, .big-stat, .said-title, .vs-row, .receipt, .sheet, .sheet-hint, .cover-strip, .cover > *:not(.free-sticker), .doodle";
  function scatterStickers() {
    book.querySelectorAll(".free-sticker.auto").forEach((s) => s.remove());
    book.classList.add("measuring"); // measure everything in its final, revealed position
    const sx = scrollX, sy = scrollY;
    const box = (el, pad = 0) => {
      const r = el.getBoundingClientRect();
      return { l: r.left + sx - pad, t: r.top + sy - pad, r: r.right + sx + pad, b: r.bottom + sy + pad };
    };
    const hit = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
    const taken = [...book.querySelectorAll(OBSTACLES)].map((el) => box(el, 6));
    book.querySelectorAll(".free-sticker:not(.auto)").forEach((el) => taken.push(box(el, 4)));

    const pages = [...book.querySelectorAll(".page")];
    // skip the sticker-sheet page and the note page so they stay clean
    const targets = pages.filter((p) => !p.querySelector(".sheet") && !p.classList.contains("note-page"));
    const items = [
      ...C.stickers.map((s) => ({ s, word: false })),
      ...C.wordStickers.map((s) => ({ s, word: true })),
    ];
    const perPage = Math.ceil(items.length / targets.length);
    const vw = document.documentElement.clientWidth;

    items.forEach((it, i) => {
      const rot = (i % 2 ? 1 : -1) * (5 + (i * 7) % 10);
      for (let k = 0; k < targets.length; k++) {
        const p = targets[(i + k) % targets.length];
        const P = box(p);
        const s = makeSticker(it.s, 0, 0, rot, it.word, p);
        s.classList.add("auto");
        const w = s.offsetWidth, hgt = it.word ? s.offsetHeight : Math.max(s.offsetHeight, w);
        // the cover clips its overflow, other pages can have stickers poking past their edges
        const out = p.classList.contains("cover") ? 0 : 28;
        const slot = Math.floor(i / targets.length) % perPage;
        const want = { x: i % 2 ? P.r - w : P.l, y: P.t + (P.b - P.t) * (slot + 0.5) / perPage };
        let best = null, bestD = Infinity;
        for (let y = P.t - out; y <= P.b - hgt + out; y += 10) {
          for (let x = Math.max(4 + sx, P.l - 8); x <= Math.min(vw - w - 4 + sx, P.r - w + 8); x += 10) {
            const c = { l: x, t: y, r: x + w, b: y + hgt };
            if (taken.some((o) => hit(c, o))) continue;
            const d = Math.hypot(x - want.x, (y - want.y) * 0.6);
            if (d < bestD) { bestD = d; best = c; }
          }
        }
        if (best) {
          s.style.left = best.l - P.l + "px";
          s.style.top = best.t - P.t + "px";
          taken.push({ l: best.l - 8, t: best.t - 8, r: best.r + 8, b: best.b + 8 });
          break;
        }
        s.remove(); // no free space on this page, try the next one
      }
    });
    book.classList.remove("measuring");
  }

  // wait for photos + fonts so the layout is final before finding empty spots
  function whenSettled() {
    const imgs = [...book.querySelectorAll("img")];
    imgs.forEach((i) => (i.loading = "eager"));
    const loaded = Promise.all(imgs.map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
    const timeout = new Promise((r) => setTimeout(r, 8000));
    return Promise.race([Promise.all([loaded, document.fonts.ready]), timeout]);
  }

  let lastW = innerWidth, resizeT;
  addEventListener("resize", () => {
    if (!built || innerWidth === lastW) return; // ignore mobile address-bar height changes
    lastW = innerWidth;
    clearTimeout(resizeT);
    resizeT = setTimeout(scatterStickers, 300);
  });

  /* ---- confetti hearts when the letter opens ---- */
  function sparkleRain() {
    if (reduced) return;
    const glyphs = ["♡", "★", "✦", "♥", "✧"];
    for (let i = 0; i < 26; i++) {
      const s = h("span", "", glyphs[i % glyphs.length]);
      s.style.cssText = `position:fixed;z-index:60;pointer-events:none;left:${Math.random() * 100}vw;top:-30px;font-size:${16 + Math.random() * 16}px;color:${["#4f6ef7", "#e894b2", "#bccaff", "#f7c6d6"][i % 4]};transition:transform ${3 + Math.random() * 2}s linear, opacity 1s ${3}s;`;
      document.body.appendChild(s);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        s.style.transform = `translate(${(Math.random() - .5) * 120}px, ${innerHeight + 60}px) rotate(${(Math.random() - .5) * 360}deg)`;
        s.style.opacity = "0";
      }));
      setTimeout(() => s.remove(), 5500);
    }
  }

  let built = false;
  function buildBook() {
    if (built) return;
    built = true;
    const cover = h("section", "page cover", `
      <p class="kicker">${C.cover.kicker}</p>
      <h2>${C.cover.title}</h2>
      <p class="sub">${C.cover.subtitle}</p>
      <span class="date">${C.date}</span>
      <p class="foot">${C.cover.footer}</p>
      <span class="scroll-arrow">↓</span>`);
    const mini = (cls, srcs) => {
      const st = h("div", "cover-strip f-bw " + cls);
      srcs.forEach((src) => {
        const [path, y] = src.split("#");
        const fr = h("div", "frame"), im = img(path);
        if (y) im.style.objectPosition = `50% ${y}%`;
        fr.appendChild(im);
        st.appendChild(fr);
      });
      cover.appendChild(st);
    };
    mini("l", ["photos/silly-1.webp#85", "photos/pout.webp", "photos/kiss-face.webp"]);
    mini("r", ["photos/selfie-together.webp", "photos/mask-selfie.webp", "photos/street-hug.webp"]);
    mini("c", ["photos/hoops.webp", "photos/car-selfie.webp", "photos/apartment-hug.webp"]);
    book.appendChild(cover);
    C.pages.forEach((p) => {
      const make = builders[p.type];
      if (make) book.appendChild(make(p));
    });
    const endEl = h("footer", "ending", `${C.ending}<br><button type="button">blow the candles again</button>`);
    endEl.querySelector("button").addEventListener("click", () => location.reload());
    book.appendChild(endEl);
    whenSettled().then(() => requestAnimationFrame(scatterStickers));
  }

  // handy for editing: open page.html#book to jump straight to the scrapbook
  if (location.hash === "#book") {
    candles.forEach((c) => c.classList.add("out"));
    $("#open-btn").click();
  }
})();
