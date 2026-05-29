/**
 * SMOOTH SCROLL PROVIDER
 * Wraps Lenis smooth scroll with GSAP ScrollTrigger sync.
 * Import and call `initSmoothScroll()` once in App.jsx.
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

/**
 * Initialize Lenis smooth scrolling and sync with GSAP ScrollTrigger.
 * Returns a cleanup function — call it on component unmount.
 */
export function initSmoothScroll() {
  // Prevent double-init
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  // On touch/mobile devices, skip Lenis entirely — native scroll is faster
  const isTouchDevice = window.matchMedia("(max-width: 768px)").matches ||
    ('ontouchstart' in window && navigator.maxTouchPoints > 0);

  if (isTouchDevice) {
    // Still wire ScrollTrigger so GSAP animations fire correctly
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }

  lenisInstance = new Lenis({
    lerp: 0.15,              // Fast, snappy interpolation (closer to native feeling)
    wheelMultiplier: 1.2,    // Zippy wheel speed for responsive feel
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,      // Always off — native touch is faster
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Wire Lenis raf to GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  return () => {
    lenisInstance?.destroy();
    lenisInstance = null;
    gsap.ticker.remove(() => {});
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
}

/** Get the active Lenis instance */
export function getLenis() {
  return lenisInstance;
}

/** Programmatically scroll to an element ID */
export function scrollToElement(id) {
  const el = document.getElementById(id);
  if (el && lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -80, duration: 1.8 });
  } else if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
