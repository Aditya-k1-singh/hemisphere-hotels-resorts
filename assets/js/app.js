/**
 * Hemisphere Hotels & Resorts — Master Application Core
 */
import { initCookieConsent } from './cookie-manager.js';
import { initCardInteractions } from './cards-interaction.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Privacy & Cookie Consent
  initCookieConsent();

  // 1b. Initialize Luxury Card Interactions & Micro-Parallax
  initCardInteractions();

  // 2. Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');
  const drawerClose = document.querySelector('.mobile-drawer-close');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // 4. Global Book Now Button Triggers
  document.querySelectorAll('[data-trigger-booking]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      const widget = document.querySelector('hemi-booking-widget#global-booking-modal') || document.querySelector('hemi-booking-widget');
      if (widget && typeof widget.open === 'function') {
        widget.open();
      } else {
        window.location.href = '/?book=true';
      }
    });
  });

  // 5. Currency & Language Selector Trigger
  const langTrigger = document.querySelector('.lang-curr-trigger');
  if (langTrigger) {
    langTrigger.addEventListener('click', () => {
      alert("Language & Currency Selection:\n\nSupported Languages: English (EN), Bahasa Melayu (BM), 简体中文 (CN), 日本語 (JA)\nSupported Currencies: MYR (RM), USD ($), SGD (S$), EUR (€), GBP (£), AUD (A$)\n\nSelection is ready for localized routing.");
    });
  }

  // 6. Reveal on Scroll Observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => observer.observe(el));
  }

  // 7. Escape key closes modals and drawers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      const widget = document.querySelector('hemi-booking-widget');
      if (widget && typeof widget.closeModal === 'function') {
        widget.closeModal();
      }
    }
  });
});
