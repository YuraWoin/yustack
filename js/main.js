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


  // ── Multi-step Quiz Handler (Додано для маркетингу) ──
  const quizSteps = document.querySelectorAll('.quiz-step');
  const nextBtns = document.querySelectorAll('.quiz-next');
  const prevBtns = document.querySelectorAll('.quiz-prev');
  const progressFill = document.querySelector('.quiz-progress-fill');
  let currentStep = 0;

  function updateQuiz() {
    quizSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
    });
    if (progressFill) {
      const progressPercent = ((currentStep + 1) / quizSteps.length) * 100;
      progressFill.style.width = `${progressPercent}%`;
    }
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Базова перевірка другого кроку (контакти)
      if (currentStep === 1) {
        const contactInput = document.getElementById('client-contact');
        if (contactInput && !contactInput.value.trim()) {
          contactInput.style.borderColor = 'var(--orange)';
          return;
        } else if (contactInput) {
          contactInput.style.borderColor = 'var(--border)';
        }
      }

      if (currentStep < quizSteps.length - 1) {
        currentStep++;
        updateQuiz();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateQuiz();
      }
    });
  });

  const quizForm = document.getElementById('quiz-form');
  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const serviceType = document.querySelector('input[name="service"]:checked')?.value || 'Не обрано';
      const contactInfo = document.getElementById('client-contact')?.value || '';
      const clientMessage = document.getElementById('client-message')?.value || '';

      currentStep = 2; // Перехід на фінальний екран успіху
      updateQuiz();

      console.log('Дані квізу:', { serviceType, contactInfo, clientMessage });
    });
  }

});