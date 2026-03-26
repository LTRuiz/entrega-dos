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
const reveals  = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObs.observe(el));


/* ── Carrusel de títulos ── */
(function () {
  const track    = document.getElementById('carouselTrack');
  if (!track) return;

  const items    = track.querySelectorAll('.carousel-item');
  const total    = items.length;
  const interval = 2800; // ms entre slides
  let   current  = 0;
  let   timer    = null;

  function goTo(index) {
    track.style.transform = `translateY(${-index}em)`;
    current = index;
  }

  function next() {
    const nextIndex = (current + 1) % total;

    if (nextIndex === 0) {
      // Salto instantáneo al inicio para loop infinito
      track.style.transition = 'none';
      track.style.transform  = 'translateY(0em)';
      current = 0;

      // Forzar reflow antes de re-activar la transición
      track.getBoundingClientRect();
      track.style.transition = 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)';
    } else {
      goTo(nextIndex);
    }
  }

  // Iniciar en el primer slide
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