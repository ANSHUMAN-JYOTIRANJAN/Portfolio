/* ==========================================
   app.js — Portfolio Interactive Logic
   Includes: canvas bg, typing, scroll reveal,
   skill bars, counters, nav, form, theme
========================================== */

// ====== 1. ANIMATED CANVAS BACKGROUND ======
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
  }

  function loop() {
    drawParticles();
    animId = requestAnimationFrame(loop);
  }

  resize();
  createParticles();
  loop();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    createParticles();
    loop();
  });
})();


// ====== 2. THEME TOGGLE ======
(function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const icon = btn.querySelector('.theme-icon');
  const saved = localStorage.getItem('portfolio-theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light');
      icon.textContent = '☀️';
    } else {
      document.body.classList.remove('light');
      icon.textContent = '🌙';
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  applyTheme(saved);

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light');
    applyTheme(isLight ? 'dark' : 'light');
  });
})();


// ====== 3. NAVBAR SCROLL BEHAVIOR ======
(function initNav() {
  const header = document.getElementById('header');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Sticky glass effect
    header.classList.toggle('scrolled', y > 60);

    // Back to top visibility
    backToTop.classList.toggle('visible', y > 400);

    // Active nav highlight
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const h = section.offsetHeight;
      if (y >= top && y < top + h) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  });
})();


// ====== 4. MOBILE MENU ======
(function initMobileMenu() {
  const menuBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks.querySelectorAll('.nav-link');

  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    // Animate hamburger
    const spans = menuBtn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      menuBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();


// ====== 5. TYPING EFFECT ======
(function initTyping() {
  const el = document.getElementById('typed-text');
  const phrases = [
    'Web Experiences',
    'Full-Stack Apps',
    'REST APIs',
    'React UIs',
    'ML Solutions',
    'Clean Code ✨'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseMs = 0;

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      el.textContent = current.slice(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pauseMs = 400;
      }
    } else {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseMs = 1800;
      }
    }
    setTimeout(type, pauseMs || (deleting ? 50 : 90));
    pauseMs = 0;
  }

  type();
})();


// ====== 6. SCROLL REVEAL ======
(function initReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    observer.observe(el);
  });
})();


// ====== 7. SKILL BAR ANIMATION ======
(function initSkillBars() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.getAttribute('data-width');
          bar.style.width = w + '%';
        });
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.3 }
  );

  document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));
})();


// ====== 8. COUNTER ANIMATION ======
(function initCounters() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-number').forEach(el => {
          const target = parseInt(el.getAttribute('data-target'));
          const duration = 1500;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(timer);
          }, 16);
        });
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.4 }
  );

  const statsEl = document.querySelector('.about-stats');
  if (statsEl) observer.observe(statsEl);
})();


// ====== 9. CONTACT FORM ======
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    status.className = 'form-status';
    status.textContent = '';

    if (!name || !email || !message) {
      status.textContent = '⚠️ Please fill in all required fields.';
      status.classList.add('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = '⚠️ Please enter a valid email address.';
      status.classList.add('error');
      return;
    }

    // Simulate sending
    submitBtn.querySelector('span').textContent = 'Sending... ⏳';
    submitBtn.disabled = true;

    await new Promise(r => setTimeout(r, 1500));

    status.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
    status.classList.add('success');
    submitBtn.querySelector('span').textContent = 'Send Message 🚀';
    submitBtn.disabled = false;
    form.reset();
  });
})();


// ====== 10. SMOOTH SCROLL (fallback) ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
