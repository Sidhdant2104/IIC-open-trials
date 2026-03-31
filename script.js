// wait for DOM loaded
document.addEventListener('DOMContentLoaded', () => {

  // Navbar Shrink Effect
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active Link Underline Animation
  const navItems = document.querySelectorAll('.nav-item');
  const underline = document.querySelector('.nav-underline');

  function updateUnderline(target) {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const navRect = target.closest('ul').getBoundingClientRect();
    underline.style.width = `${rect.width}px`;
    underline.style.left = `${rect.left - navRect.left}px`;
  }

  // Initialize underline position
  const activeItem = document.querySelector('.nav-item.active');
  if (activeItem) {
    updateUnderline(activeItem);
  }

  navItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      updateUnderline(e.target);
    });

    item.addEventListener('mouseleave', () => {
      const currentActive = document.querySelector('.nav-item.active');
      if (currentActive) {
        updateUnderline(currentActive);
      } else {
        underline.style.width = '0px';
      }
    });

    item.addEventListener('click', (e) => {
      navItems.forEach(nav => nav.classList.remove('active'));
      e.target.classList.add('active');
      updateUnderline(e.target);
    });
  });

  // Tap-to-expand mobile team cards
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      // Only apply tap logic strictly on mobile widths
      if (window.innerWidth < 768) {
        if (card.classList.contains('active')) {
          card.classList.remove('active');
        } else {
          // Collapse any other previously open cards
          teamCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        }
      }
    });
  });

  // Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal only once for cinematic feel
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Subtle Parallax on Hero elements
  const hero = document.querySelector('.hero');
  const wheel = document.querySelector('.ferris-wheel-container');
  const tents = document.querySelector('.tents-container');

  window.addEventListener('scroll', () => {
    const scrollVal = window.scrollY;
    if (scrollVal > hero.offsetHeight) return; // Don't animate if not in view

    if (wheel) wheel.style.transform = `translateX(20%) translateY(10%) translateY(${scrollVal * 0.3}px)`;
    if (tents) tents.style.transform = `translateY(${scrollVal * 0.1}px)`;
  });



  // --- Countdown Timer ---
  const countdownWrapper = document.getElementById('countdown-wrapper');
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  // Deadline: April 4, 2026 11:59 PM IST (UTC+5:30)
  const deadline = new Date("2026-04-04T23:59:00+05:30").getTime();

  function updateDigit(el, value) {
    const formatted = value < 10 ? '0' + value : value.toString();
    if (!el) return;

    const currentSpan = el.querySelector('.current');
    
    if (currentSpan && currentSpan.innerText !== formatted) {
      const nextSpan = document.createElement('span');
      nextSpan.classList.add('next');
      nextSpan.innerText = formatted;
      el.appendChild(nextSpan);
      
      // trigger reflow
      void nextSpan.offsetWidth;
      
      currentSpan.classList.remove('current');
      currentSpan.classList.add('slide-out');
      
      nextSpan.classList.remove('next');
      nextSpan.classList.add('slide-in');
      
      setTimeout(() => {
        if (el.contains(currentSpan)) el.removeChild(currentSpan);
        nextSpan.classList.remove('slide-in');
        nextSpan.classList.add('current');
      }, 300); // smooth 0.3s ease
    } else if (!currentSpan) {
      el.innerHTML = `<span class="current">${formatted}</span>`;
    }
  }

  function disableApplyButtons() {
    const applyButtons = document.querySelectorAll('a[href="/register.html"]');
    applyButtons.forEach(btn => {
      btn.classList.add('btn-disabled');
      btn.title = "Registration Closed";
      btn.addEventListener('click', (e) => e.preventDefault());
    });
  }

  function updateCountdown() {
    if (!countdownWrapper) return;
    
    const now = new Date().getTime();
    const distance = deadline - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      countdownWrapper.innerHTML = '<div class="countdown-message">Registrations Closed</div>';
      disableApplyButtons();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateDigit(daysEl, days);
    updateDigit(hoursEl, hours);
    updateDigit(minsEl, minutes);
    updateDigit(secsEl, seconds);
  }

  let countdownInterval;
  if (countdownWrapper && typeof updateCountdown === "function") {
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Call immediately
  }

});
