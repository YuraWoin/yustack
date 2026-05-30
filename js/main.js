/* =============================================
   YuStack — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Reveal ──────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ── Terminal Typewriter ────────────────────────
  // Store original text, clear display
  const termCmds = document.querySelectorAll('.t-line .t-cmd');
  termCmds.forEach(line => {
    line.dataset.text = line.textContent;
    line.textContent  = '';
  });

  const termWrap = document.querySelector('.terminal-wrap');
  if (!termWrap) return;

  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const lines = entry.target.querySelectorAll('.t-cmd');
      let delay = 0;

      lines.forEach(line => {
        const text = line.dataset.text || '';
        setTimeout(() => {
          let i = 0;
          const interval = setInterval(() => {
            if (i < text.length) {
              line.textContent += text[i++];
            } else {
              clearInterval(interval);
            }
          }, 28);
        }, delay);
        delay += text.length * 28 + 500;
      });

      termObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  termObserver.observe(termWrap);


  // ── Active nav link on scroll ──────────────────
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

});
