import React, { useRef, useLayoutEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap, ScrollTrigger } from '../motion';

const CAPABILITIES = [
  { num: '01', title: 'Cinematic Frontend Systems',     sub: 'React · Next.js · Framer Motion' },
  { num: '02', title: 'Full-Stack Product Engineering',  sub: 'Node.js · Express · MongoDB' },
  { num: '03', title: 'Real-Time Interactive Interfaces',sub: 'WebSockets · Collaborative UX' },
  { num: '04', title: 'Creative UI Architecture',        sub: 'Design Systems · Motion Design' },
  { num: '05', title: 'API Design & Integration',        sub: 'REST · JWT · Third-Party Services' },
  { num: '06', title: 'Immersive Digital Experiences',   sub: 'Scroll Choreography · Interaction' },
];

function Capabilities() {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const listRef    = useRef(null);
  const lineRef    = useRef(null);
  const isHeadInView = useInView(headRef, { once: true, margin: '-80px' });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // — Heading: clip-path wipe from bottom
      gsap.fromTo(
        '.cap-heading',
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 20 },
        {
          clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0,
          duration: 1.2, ease: 'power4.out',
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // — Subtext fade
      gsap.fromTo(
        '.cap-subtext',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 1.0, ease: 'power3.out', delay: 0.25,
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // — Each capability row: stagger batch reveal
      ScrollTrigger.batch('.cap-row', {
        start: 'top 88%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 36, x: -12 },
            {
              opacity: 1, y: 0, x: 0,
              duration: 1.0, ease: 'power3.out',
              stagger: { each: 0.09 },
            }
          );
        },
      });

      // — Number counters: subtle scale in
      gsap.fromTo(
        '.cap-num',
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1, scale: 1,
          duration: 0.8, ease: 'back.out(1.4)',
          stagger: 0.09,
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // — Metadata labels: fade in right to left
      gsap.fromTo(
        '.cap-meta',
        { opacity: 0, x: 16 },
        {
          opacity: 1, x: 0,
          duration: 0.9, ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // — Bottom line: grow from left
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.4, ease: 'power3.out',
            scrollTrigger: {
              trigger: lineRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative z-10 select-none"
      style={{
        paddingTop: 'var(--space-section)',
        paddingBottom: 'var(--space-section)',
        paddingLeft: 'var(--space-page-x)',
        paddingRight: 'var(--space-page-x)',
      }}
    >
      {/* ── Section Header ── */}
      <div ref={headRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">

        <div>
          {/* Overline — slides from left via Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isHeadInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-5"
          >
            <motion.span
              className="h-[1px] bg-accent-primary"
              initial={{ width: 0 }}
              animate={isHeadInView ? { width: '2.5rem' } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
            <span className="text-overline text-accent-primary">Selected Capabilities</span>
          </motion.div>

          {/* H2 — GSAP clip reveal */}
          <h2 className="cap-heading heading-editorial text-text-main" style={{ opacity: 0 }}>
            What I<br />
            <span className="heading-serif-accent text-accent-primary">Build</span>
          </h2>
        </div>

        <p className="cap-subtext text-body-editorial text-muted max-w-sm self-end pb-1" style={{ opacity: 0 }}>
          A curated set of disciplines refined through production-grade engineering and creative craft.
        </p>
      </div>

      {/* ── Capability List ── */}
      <div ref={listRef}>
        {CAPABILITIES.map((item) => (
          <div
            key={item.num}
            className="cap-row capability-item group border-t border-black/[0.06] dark:border-white/[0.06] flex items-start justify-between gap-8 cursor-default"
            style={{
              paddingTop: 'clamp(1.8rem, 3vw, 3rem)',
              paddingBottom: 'clamp(1.8rem, 3vw, 3rem)',
              opacity: 0, // GSAP controls initial state
            }}
          >
            {/* Number */}
            <span
              className="cap-num font-serif-italic text-accent-primary/30 shrink-0 select-none leading-none"
              style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)', paddingTop: '0.2em', opacity: 0 }}
            >
              {item.num}
            </span>

            {/* Title */}
            <div className="flex-1">
              <h3
                className="text-text-main font-sans font-bold leading-tight group-hover:text-accent-primary transition-colors duration-500"
                style={{ fontSize: 'clamp(1.35rem, 3.2vw, 2.8rem)', letterSpacing: '-0.03em' }}
              >
                {item.title}
              </h3>
            </div>

            {/* Metadata */}
            <span
              className="cap-meta text-overline text-muted/45 shrink-0 hidden md:block self-end pb-1"
              style={{ opacity: 0 }}
            >
              {item.sub}
            </span>
          </div>
        ))}

        {/* Bottom border — grows in */}
        <div
          ref={lineRef}
          className="border-t border-black/[0.06] dark:border-white/[0.06]"
          style={{ transformOrigin: 'left' }}
        />
      </div>

    </section>
  );
}

export default Capabilities;
