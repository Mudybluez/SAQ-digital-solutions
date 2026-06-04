/* ============================================================
   SAQ Digital Solutions — motion engine
   GSAP + ScrollTrigger. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  const REDUCED = false;
  const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- LOADER ---------------- */
  function runLoader() {
    const loader = document.getElementById("loader");
    const body = document.body;
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true;
      body.classList.remove("loading");
      if (loader) { loader.style.transition = "opacity 0.9s ease"; loader.style.opacity = "0"; setTimeout(() => loader && loader.remove(), 950); }
      startHero();
    };
    if (REDUCED || !window.gsap) { if (loader) loader.remove(); body.classList.remove("loading"); startHero(); return; }

    const tl = gsap.timeline({ onComplete: finish });
    tl.from("#loader .mark", { scale: 0.7, opacity: 0, duration: 0.8, ease: "back.out(2)" })
      .to("#loader .lbl", { opacity: 1, duration: 0.5 }, "-=0.35")
      .to({}, { duration: 0.5 });

    // Failsafe: if rAF is throttled (hidden tab) or anything stalls, never trap the user.
    setTimeout(finish, 2600);
  }

  /* ---------------- NAV ---------------- */
  function initNav() {
    const nav = document.getElementById("nav");
    const onScroll = () => { nav.classList.toggle("solid", scrollY > 80); };
    onScroll(); addEventListener("scroll", onScroll, { passive: true });

    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    toggle.addEventListener("click", () => { toggle.classList.toggle("open"); menu.classList.toggle("open"); });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { toggle.classList.remove("open"); menu.classList.remove("open"); }));
  }

  /* ---------------- THEME TOGGLE ---------------- */
  function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      document.documentElement.classList.add("theme-transition");
      document.body.classList.add("theme-transition");
      
      const isLight = document.body.classList.toggle("light-theme");
      document.documentElement.classList.toggle("light-theme", isLight);
      localStorage.setItem("theme", isLight ? "light" : "dark");
      
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
        document.body.classList.remove("theme-transition");
      }, 500);
    });
  }

  /* ---------------- PORTFOLIO DYNAMIC ---------------- */
  async function initPortfolio() {
    const grid = document.getElementById("workGrid");
    const pagContainer = document.getElementById("portfolioPagination");
    if (!grid) return;

    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Не удалось загрузить проекты");

      const projects = data.projects;
      if (projects.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text2); padding: 40px 0;">Проектов пока нет.</div>`;
        return;
      }

      const limit = 4;
      let currentPage = 1;
      const totalPages = Math.ceil(projects.length / limit);

      function renderPage(page) {
        currentPage = page;
        const start = (page - 1) * limit;
        const end = start + limit;
        const pageProjects = projects.slice(start, end);

        grid.innerHTML = pageProjects.map(project => {
          let bgStyle = "";
          let dataGrad = "";
          if (project.image.startsWith("/") || project.image.startsWith("http")) {
            bgStyle = `background-image: url('${project.image}'); background-size: cover; background-position: center;`;
          } else {
            dataGrad = `data-grad="${project.image}"`;
          }

          const tagsHtml = project.tags.map(t => `<span>${t}</span>`).join("");

          return `
            <a class="h-card reveal" href="/work/${project.slug}" data-cursor>
              <div class="shot">
                <div class="ph-grid" ${dataGrad} style="${bgStyle}"></div>
                <div class="kind">${project.category}</div>
                <div class="ovl"></div>
                <span class="card-open">Открыть кейс →</span>
              </div>
              <div class="meta">
                <div class="pname">${project.title}</div>
                <div class="pdesc">${project.description}</div>
                <div class="tags">${tagsHtml}</div>
              </div>
            </a>
          `;
        }).join("");

        renderControls();

        // Animate portfolio cards only
        if (!REDUCED && window.gsap) {
          // Kill previous triggers inside workGrid to prevent conflict/leaks
          ScrollTrigger.getAll().forEach(st => {
            if (st.trigger && st.trigger.closest && st.trigger.closest("#workGrid")) {
              st.kill();
            }
          });

          gsap.utils.toArray("#workGrid .reveal").forEach((el) => {
            gsap.to(el, {
              y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 86%" },
            });
          });
        }
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }

      function renderControls() {
        if (totalPages <= 1) {
          pagContainer.innerHTML = "";
          return;
        }

        let buttons = [];
        buttons.push(`<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="window.setPortfolioPage(${currentPage - 1})">← Назад</button>`);

        for (let i = 1; i <= totalPages; i++) {
          buttons.push(`<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="window.setPortfolioPage(${i})">${i}</button>`);
        }

        buttons.push(`<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="window.setPortfolioPage(${currentPage + 1})">Вперед →</button>`);

        pagContainer.innerHTML = buttons.join("");
      }

      window.setPortfolioPage = (page) => {
        renderPage(page);
        document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
      };

      renderPage(1);

    } catch (err) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--danger); padding: 40px 0;">Ошибка загрузки портфолио.</div>`;
      console.error(err);
    }
  }

  /* ---------------- HERO PARTICLES ---------------- */
  function initParticles() {
    const canvas = document.getElementById("particles");
    if (!canvas || REDUCED) return;
    const ctx = canvas.getContext("2d");
    let w, h, parts = [], dpr = Math.min(devicePixelRatio || 1, 2);
    let mouseX = 0, mouseY = 0, tx = 0, ty = 0;
    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(60, Math.floor(w / 26));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 2 + 0.6, depth: Math.random() * 0.7 + 0.3,
        vy: -(Math.random() * 0.25 + 0.05), a: Math.random() * 0.5 + 0.2,
      }));
    }
    const hero = document.getElementById("hero");
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    function frame() {
      ctx.clearRect(0, 0, w, h);
      tx += (mouseX - tx) * 0.05; ty += (mouseY - ty) * 0.05;
      for (const p of parts) {
        p.y += p.vy; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        const ox = tx * 30 * p.depth, oy = ty * 18 * p.depth;
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,134,42,${p.a * p.depth})`;
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize(); addEventListener("resize", resize); frame();
  }

  /* ---------------- HERO TEXT ---------------- */
  function splitChars() {
    document.querySelectorAll("[data-split]").forEach((el) => {
      const text = el.textContent; el.textContent = "";
      [...text].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "char"; span.textContent = ch === " " ? "\u00A0" : ch;
        el.appendChild(span);
      });
    });
  }
  function startHero() {
    if (REDUCED || !window.gsap) {
      document.querySelector(".hero-rule").style.width = "100%";
      return;
    }
    const tl = gsap.timeline({ delay: 0.1 });
    tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
      .from(".hero-h1 .char", { y: 70, opacity: 0, duration: 0.7, stagger: 0.035, ease: "power3.out" }, "-=0.2")
      .to(".hero-rule", { width: "100%", duration: 1.0, ease: "power2.inOut" }, "-=0.5")
      .from(".hero-sub", { x: -40, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.7")
      .from(".hero-ctas > *", { y: 24, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.4")
      .from(".scroll-ind", { opacity: 0, duration: 0.6 }, "-=0.2");
  }

  /* ---------------- SCROLL REVEALS ---------------- */
  function initReveals() {
    if (REDUCED || !window.gsap) return;

    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
      });
    });

    // value underline sweep handled by reveal + css; stat count-up
    document.querySelectorAll(".stat .num[data-count]").forEach((el) => {
      const target = +el.getAttribute("data-count");
      const valEl = el.querySelector(".val");
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => {
          const obj = { v: 0 };
          gsap.to(obj, { v: target, duration: 1.6, ease: "power2.out", onUpdate: () => { valEl.textContent = Math.round(obj.v); } });
        },
      });
    });

    // complexity bars
    document.querySelectorAll(".tier .cbar i[data-bar]").forEach((el) => {
      const pct = el.getAttribute("data-bar");
      gsap.to(el, { height: pct + "%", duration: 1.1, ease: "power2.out", scrollTrigger: { trigger: el.closest(".tier"), start: "top 80%" } });
    });

    // process spine draw + nodes
    const spine = document.querySelector(".timeline .spine i");
    if (spine) {
      gsap.to(spine, { height: "100%", ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 80%", scrub: 0.6 } });
    }
    gsap.utils.toArray(".step .node").forEach((node) => {
      gsap.from(node, { scale: 0, duration: 0.4, ease: "back.out(2)", scrollTrigger: { trigger: node.closest(".step"), start: "top 78%" } });
    });

    // pricing rows
    gsap.from(".ptable .prow", { opacity: 0, y: 24, duration: 0.6, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: ".ptable", start: "top 80%" } });
  }

  /* ---------------- PORTFOLIO CAROUSEL (arrows + drag + keys) ---------------- */
  function initCarousel() {
    const track = document.getElementById("hTrack");
    const vp = document.getElementById("hViewport");
    if (!track || !vp) return;
    const prev = document.getElementById("hPrev");
    const next = document.getElementById("hNext");
    const bar = document.getElementById("hBar");
    const curEl = document.getElementById("hCur");
    const totEl = document.getElementById("hTotal");
    const cards = [...track.children];
    if (!cards.length) return;

    let i = 0;
    const pad2 = (n) => String(n).padStart(2, "0");
    if (totEl) totEl.textContent = pad2(cards.length);

    const cs = () => getComputedStyle(track);
    const stepSize = () => {
      const gap = parseFloat(cs().columnGap || cs().gap) || 28;
      return cards[0].getBoundingClientRect().width + gap;
    };
    const maxScroll = () => Math.max(0, track.scrollWidth - vp.clientWidth);

    function go(n) {
      const step = stepSize();
      const ms = maxScroll();
      const lastIdx = step ? Math.ceil(ms / step) : 0;
      i = Math.max(0, Math.min(n, lastIdx));
      const x = Math.min(i * step, ms);
      track.style.transform = `translateX(${-x}px)`;
      const atStart = x <= 0.5;
      const atEnd = x >= ms - 0.5;
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
      if (bar) bar.style.width = (ms ? Math.max(12, (x / ms) * 100) : 100) + "%";
      if (curEl) curEl.textContent = pad2(Math.min(i + 1, cards.length));
    }

    if (prev) prev.addEventListener("click", () => go(i - 1));
    if (next) next.addEventListener("click", () => go(i + 1));

    // Keyboard arrows when the section is in view
    const section = document.getElementById("portfolio");
    addEventListener("keydown", (e) => {
      if (!section) return;
      const r = section.getBoundingClientRect();
      const inView = r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
      if (!inView) return;
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "ArrowRight") go(i + 1);
    });

    // Pointer drag / swipe
    let down = false, sx = 0, si = 0;
    vp.addEventListener("pointerdown", (e) => {
      down = true; sx = e.clientX; si = i;
      track.style.transition = "none";
      try { vp.setPointerCapture(e.pointerId); } catch {}
    });
    vp.addEventListener("pointerup", (e) => {
      if (!down) return;
      down = false; track.style.transition = "";
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 50) go(si + (dx < 0 ? 1 : -1));
      else go(si);
    });
    vp.addEventListener("pointercancel", () => { down = false; track.style.transition = ""; });

    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => go(i), 150); });
    go(0);
  }

  /* ---------------- FORM ---------------- */
  function initForm() {
    const form = document.getElementById("leadForm");
    const ok = document.getElementById("formSuccess");
    if (!form) return;
    const btn = form.querySelector(".btn-submit");
    const btnLabel = btn ? btn.querySelector(".bs-label") : null;
    const errBox = document.getElementById("formError");

    const showSuccess = () => {
      if (window.gsap && !REDUCED) {
        gsap.to(form, { opacity: 0, y: 12, duration: 0.4, onComplete: () => { form.style.display = "none"; ok.classList.add("show"); gsap.from(ok, { opacity: 0, y: 16, duration: 0.5 }); } });
      } else { form.style.display = "none"; ok.classList.add("show"); }
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (errBox) errBox.textContent = "";

      let valid = true;
      form.querySelectorAll("[required]").forEach((inp) => {
        const field = inp.closest(".field");
        if (!inp.value.trim()) { field.classList.add("invalid"); valid = false; }
        else field.classList.remove("invalid");
      });
      if (!valid) return;

      const payload = {
        name: form.name.value,
        phone: form.phone.value,
        type: form.type.value,
        desc: form.desc.value,
        company: form.company ? form.company.value : "",
      };

      if (btn) btn.disabled = true;
      if (btnLabel) btnLabel.textContent = "Отправляем…";

      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) { showSuccess(); return; }
        throw new Error(data.error || "Не удалось отправить заявку.");
      } catch (err) {
        if (errBox) errBox.textContent = err.message + " Или напишите напрямую: t.me/malayev_yerkanat";
        if (btn) btn.disabled = false;
        if (btnLabel) btnLabel.textContent = "Отправить заявку";
      }
    });

    form.querySelectorAll("input, textarea").forEach((inp) => inp.addEventListener("input", () => { const f = inp.closest(".field"); if (f) f.classList.remove("invalid"); }));
  }

  /* ---------------- VIDEO BACKGROUND ---------------- */
  function initVideoBackground() {
    const videos = [document.getElementById("bgVideoDark"), document.getElementById("bgVideoLight")];
    const videoContainer = document.querySelector(".video-bg-container");
    if (!videoContainer) return;

    if (REDUCED || !window.gsap || !window.ScrollTrigger) {
      // Reduced motion fallback: loop and play
      videos.forEach((video) => {
        if (!video) return;
        video.loop = true;
        video.play().catch(() => {});
      });
      return;
    }

    videos.forEach((video) => {
      if (!video) return;
      video.pause();

      const initScrub = () => {
        const dur = video.duration;
        if (!dur || isNaN(dur)) return;

        // Playback scrub linked to body scroll position
        gsap.to(video, {
          currentTime: dur,
          ease: "none",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          }
        });
      };

      if (video.readyState >= 1) {
        initScrub();
      } else {
        video.addEventListener("loadedmetadata", initScrub);
      }
    });

    // Parallax container movement
    gsap.to(videoContainer, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    });
  }

  /* ---------------- BOOT ---------------- */
  async function boot() {
    splitChars();
    initNav();
    initTheme();
    initVideoBackground();
    initParticles();
    initReveals();
    await initPortfolio();
    initCarousel();
    initForm();
    runLoader();
    if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
