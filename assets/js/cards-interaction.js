/**
 * Hemisphere Hotels & Resorts — Luxury Card Interactions & Micro-Parallax
 * Inspired by world-class hospitality editorial design (Nemacolin aesthetic).
 */

export function initCardInteractions() {
  // Only activate on devices with a fine pointer (desktop mouse/trackpad) and no reduced motion
  if (window.matchMedia('(hover: none) or (prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const selector = '.property-card, .exp-card, .offer-card, .room-card, .dining-card, .dir-card, .story-module__media';
  const cards = document.querySelectorAll(selector);

  cards.forEach((card) => {
    let bounds = null;
    let isHovering = false;
    let rafId = null;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    const updateBounds = () => {
      bounds = card.getBoundingClientRect();
    };

    const onMouseEnter = () => {
      updateBounds();
      isHovering = true;
      card.style.willChange = 'transform, box-shadow';
      card.classList.add('is-card-hovered');
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const onMouseMove = (e) => {
      if (!bounds) updateBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Normalize between -0.5 and 0.5
      const px = Math.max(-0.5, Math.min(0.5, (mouseX / bounds.width) - 0.5));
      const py = Math.max(-0.5, Math.min(0.5, (mouseY / bounds.height) - 0.5));

      // Gentle luxury tilt: max 4.5 degrees
      targetRotateX = -py * 6;
      targetRotateY = px * 6;

      // Pass coordinates for optional radial light follow
      card.style.setProperty('--mouse-x', `${((mouseX / bounds.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${((mouseY / bounds.height) * 100).toFixed(1)}%`);
    };

    const onMouseLeave = () => {
      isHovering = false;
      targetRotateX = 0;
      targetRotateY = 0;
      card.classList.remove('is-card-hovered');
    };

    const animate = () => {
      // Smooth lerp (spring damping)
      currentRotateX += (targetRotateX - currentRotateX) * 0.12;
      currentRotateY += (targetRotateY - currentRotateY) * 0.12;

      const lift = isHovering ? -7 : 0;
      card.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) translateY(${lift}px)`;

      // Settle loop when mouse leaves and rotation approaches zero
      if (
        !isHovering &&
        Math.abs(targetRotateX - currentRotateX) < 0.04 &&
        Math.abs(targetRotateY - currentRotateY) < 0.04
      ) {
        card.style.transform = '';
        card.style.willChange = '';
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    card.addEventListener('mouseenter', onMouseEnter, { passive: true });
    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseleave', onMouseLeave, { passive: true });
  });
}
