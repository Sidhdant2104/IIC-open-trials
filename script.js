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



});
