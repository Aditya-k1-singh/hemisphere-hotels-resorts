/**
 * Hemisphere Hotels & Resorts — 3D Atmospheric Hero Canvas
 * Subtle, luxury WebGL particles with gentle cursor parallax & ambient flow.
 * Respects prefers-reduced-motion, low-power devices, and pauses when off-screen.
 */
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export function initHeroParticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 1. Accessibility: Respect user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    container.style.background = 'radial-gradient(ellipse at center, #1C2225 0%, #111517 100%)';
    return;
  }

  // 2. WebGL Support Test
  try {
    const canvasTest = document.createElement('canvas');
    if (!(window.WebGLRenderingContext && (canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl')))) {
      container.style.background = 'radial-gradient(ellipse at center, #1C2225 0%, #111517 100%)';
      return;
    }
  } catch (e) {
    return;
  }

  const scene = new THREE.Scene();
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 4;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
  } catch (e) {
    console.warn('WebGL init failed, using CSS gradient fallback:', e);
    return;
  }

  // Atmospheric Particles (Warm Brass + Golden Motes)
  const particlesCount = window.innerWidth < 768 ? 250 : 550;
  const posArray = new Float32Array(particlesCount * 3);
  const scaleArray = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    posArray[i * 3 + 0] = (Math.random() - 0.5) * 12;
    posArray[i * 3 + 1] = (Math.random() - 0.5) * 8;
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 6;
    scaleArray[i] = Math.random() * 0.03 + 0.01;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Subtle circular points
  const material = new THREE.PointsMaterial({
    size: 0.035,
    color: 0xC5A880, // Hemisphere Brass
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  // Subtle Parallax Variables
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  const onMouseMove = (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Pause rendering when off-screen via IntersectionObserver
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(container);

  let animationFrameId;
  let clock = new THREE.Clock();

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Gentle rotation
    particlesMesh.rotation.y = elapsedTime * 0.02;
    particlesMesh.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;

    // Smooth camera mouse follow (lerp)
    currentMouseX += (targetMouseX - currentMouseX) * 0.04;
    currentMouseY += (targetMouseY - currentMouseY) * 0.04;

    camera.position.x = currentMouseX;
    camera.position.y = -currentMouseY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  animate();

  const onResize = () => {
    if (!container || !renderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize, { passive: true });
}
