/**
 * Gatherly - Responsive Navigation & Header Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
      mobileBtn.innerHTML = isOpen
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !mobileBtn.contains(e.target) && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
      }
    });

    // Close when resizing back to desktop screen
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
      }
    });
  }

  // 2. Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop().split('?')[0];

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Header elevation on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 20px rgba(16, 24, 40, 0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
});
