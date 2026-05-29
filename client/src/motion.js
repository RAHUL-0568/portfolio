/**
 * CINEMATIC MOTION SYSTEM
 * Centralized animation variants, easing curves, and GSAP utilities
 * for a film-quality scroll choreography experience.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Cinematic Easing Curves ───────────────────────────────────────────────
export const EASE_CINEMATIC    = [0.16, 1, 0.3, 1];   // slow ease-out — premium feel
export const EASE_SILK         = [0.25, 0.46, 0.45, 0.94]; // silky smooth
export const EASE_EDITORIAL    = [0.76, 0, 0.24, 1];   // dramatic — fast then slow

// ─── Framer Motion Variants ───────────────────────────────────────────────

/** Whole section fades in from below */
export const sectionReveal = {
  hidden:  { opacity: 0, y: 48 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 1.2, ease: EASE_CINEMATIC },
  },
};

/** Overline / metadata — fades in left to right */
export const overlineReveal = {
  hidden:  { opacity: 0, x: -16 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.9, ease: EASE_CINEMATIC },
  },
};

/** Stagger container — children stagger in sequence */
export const staggerContainer = (staggerDelay = 0.08, delayChildren = 0) => ({
  hidden:  {},
  visible: {
    transition: { staggerChildren: staggerDelay, delayChildren },
  },
});

/** Child item — rises from below */
export const staggerItem = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 1, ease: EASE_CINEMATIC },
  },
};

/** Child item — clip-path masked reveal from bottom */
export const clipReveal = {
  hidden:  { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 20 },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0,
    transition: { duration: 1.1, ease: EASE_EDITORIAL },
  },
};

/** Fade in only */
export const fadeIn = (delay = 0) => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: 'easeOut', delay },
  },
});

/** Heading word by word — wrap each word in a span */
export const wordReveal = {
  hidden:  { opacity: 0, y: '110%' },
  visible: {
    opacity: 1, y: '0%',
    transition: { duration: 1.0, ease: EASE_EDITORIAL },
  },
};

/** Horizontal line grow */
export const lineGrow = {
  hidden:  { scaleX: 0, transformOrigin: 'left' },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: EASE_CINEMATIC, delay: 0.3 },
  },
};

// ─── GSAP Scroll Utilities ─────────────────────────────────────────────────

/**
 * Batch-animates a list of elements with scrubbed stagger on scroll.
 * @param {string} selector   - CSS selector for target elements
 * @param {object} fromVars   - GSAP fromVars
 * @param {object} toVars     - GSAP toVars  
 * @param {object} stOpts     - ScrollTrigger options override
 */
export function batchReveal(selector, fromVars = {}, toVars = {}, stOpts = {}) {
  const defaults = {
    opacity: 0, y: 40,
    duration: 1.0,
    ease: 'power3.out',
    stagger: 0.07,
  };
  const targets = document.querySelectorAll(selector);
  if (!targets.length) return;

  gsap.set(targets, { opacity: 0, y: 40, ...fromVars });

  ScrollTrigger.batch(selector, {
    start: 'top 88%',
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1, y: 0,
        ...defaults,
        ...toVars,
        stagger: { each: 0.07 },
      });
    },
    ...stOpts,
  });
}

/**
 * Parallax on a single element — translateY on scrub
 */
export function parallaxElement(element, speed = 0.12) {
  if (!element) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
  tl.fromTo(element,
    { y: -80 * speed * 10 },
    { y: 80 * speed * 10, ease: 'none' }
  );
  return tl;
}

/**
 * Horizontal shimmer line — grows from 0 to full width on scroll
 */
export function revealLine(element) {
  if (!element) return;
  gsap.fromTo(element,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/** Cleanup all ScrollTriggers (call on component unmount) */
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach(t => t.kill());
}

export { gsap, ScrollTrigger };
