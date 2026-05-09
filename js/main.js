/* ============================================================
   Q10 SPORTS — main.js
============================================================ */


/* ── Navbar: clase al hacer scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


/* ── Menú móvil ── */
const burgerBtn  = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu  = document.getElementById('closeMenu');

burgerBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));

function closeMobile() {
  mobileMenu.classList.remove('open');
}


/* ── Scroll reveal con IntersectionObserver ── */
const reveals   = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObs.observe(el));


/* ── Carrusel de palabras del título ── */
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const items    = track.querySelectorAll('.carousel-item');
  const total    = items.length;
  const interval = 2800;
  let   current  = 0;
  let   timer    = null;

  function goTo(index) {
    track.style.transform = `translateY(${-index}em)`;
    current = index;
  }

  function next() {
    const nextIndex = (current + 1) % total;

    if (nextIndex === 0) {
      track.style.transition = 'none';
      track.style.transform  = 'translateY(0em)';
      current = 0;
      track.getBoundingClientRect(); // forzar reflow
      track.style.transition = 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)';
    } else {
      goTo(nextIndex);
    }
  }

  goTo(0);
  timer = setInterval(next, interval);

  // Pausar en hover sobre el hero
  const heroSection = document.getElementById('inicio');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(timer));
    heroSection.addEventListener('mouseleave', () => {
      clearInterval(timer);
      timer = setInterval(next, interval);
    });
  }
})();


/* ── Carrusel de imágenes de fondo ── */
(function () {
  const SLIDE_DURATION = 5000; // ms entre slides

  const slides      = document.querySelectorAll('#inicio .bg-slide');
  const dotsWrap    = document.getElementById('heroDots');
  const progressBar = document.getElementById('heroProgress');

  if (!slides.length || !dotsWrap || !progressBar) return;

  let currentSlide  = 0;
  let progressStart = null;
  let animFrame;

  /* Crear puntos de navegación */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Imagen ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  /* Cambiar slide */
  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dotsWrap.children[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dotsWrap.children[currentSlide].classList.add('active');
    progressStart = null;
    cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(animateProgress);
  }

  /* Barra de progreso */
  function animateProgress(ts) {
    if (!progressStart) progressStart = ts;
    const pct = Math.min(((ts - progressStart) / SLIDE_DURATION) * 100, 100);
    progressBar.style.width = pct + '%';
    if (pct < 100) {
      animFrame = requestAnimationFrame(animateProgress);
    } else {
      progressBar.style.width = '0%';
      goToSlide(currentSlide + 1);
    }
  }

  /* Pausar progreso cuando el hero no es visible */
  const heroSection = document.getElementById('inicio');
  if (heroSection) {
    const pauseObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animFrame = requestAnimationFrame(animateProgress);
      } else {
        cancelAnimationFrame(animFrame);
      }
    }, { threshold: 0.2 });
    pauseObs.observe(heroSection);
  }

  animFrame = requestAnimationFrame(animateProgress);
})();