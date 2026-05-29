import React, { useRef, useLayoutEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { gsap, EASE_CINEMATIC } from '../motion';

const TECH_CATEGORIES = [
  {
    category: 'INTERFACE SYSTEMS',
    techs: 'React.js — Next.js — Tailwind CSS — Framer Motion — GSAP'
  },
  {
    category: 'APPLICATION ARCHITECTURE',
    techs: 'Node.js — Express.js — JWT — REST APIs — WebSockets'
  },
  {
    category: 'DATA LAYERS',
    techs: 'MongoDB — PostgreSQL — SQL'
  },
  {
    category: 'WORKFLOW & DEPLOYMENT',
    techs: 'Vercel — Render — Postman — VS Code'
  },
  {
    category: 'COLLABORATIVE SYSTEMS',
    techs: 'Technical Leadership — Cross-functional Communication — Problem Solving'
  }
];

function Philosophy() {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const isHeadInView = useInView(headRef, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // — Section heading: clip-path wipe
      gsap.fromTo(
        '.phil-h2',
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 20 },
        {
          clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0,
          duration: 1.4, ease: 'power4.out',
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // — Tech Stack rows reveal
      gsap.fromTo(
        '.stack-row',
        { opacity: 0, y: 20, x: -10 },
        {
          opacity: 1, y: 0, x: 0,
          duration: 1.2, ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.stack-matrix',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative z-10 select-none overflow-hidden"
      style={{
        paddingTop: 'calc(var(--space-section) * 1.5)',
        paddingBottom: 'calc(var(--space-section) * 1.5)',
      }}
    >
      {/* Atmospheric deep background text and grain */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex flex-col items-center justify-around opacity-[0.02] dark:opacity-[0.015]">
        <motion.h2 
          style={{ x: useTransform(scrollYProgress, [0, 1], ['-5%', '5%']), letterSpacing: '0.05em' }}
          className="text-[12vw] font-sans font-bold leading-none whitespace-nowrap text-text-main"
        >
          ARCHITECTURE
        </motion.h2>
        <motion.h2 
          style={{ x: useTransform(scrollYProgress, [0, 1], ['5%', '-5%']), letterSpacing: '0.05em' }}
          className="text-[12vw] font-sans font-bold leading-none whitespace-nowrap text-text-main"
        >
          INTERFACE
        </motion.h2>
        <motion.h2 
          style={{ x: useTransform(scrollYProgress, [0, 1], ['-10%', '0%']), letterSpacing: '0.05em' }}
          className="text-[12vw] font-sans font-bold leading-none whitespace-nowrap text-text-main"
        >
          SYSTEMS
        </motion.h2>
      </div>

      <div style={{ paddingLeft: 'var(--space-page-x)', paddingRight: 'var(--space-page-x)' }} className="relative z-10 max-w-400 mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* LEFT: Massive Heading */}
          <div ref={headRef} className="lg:col-span-5 pt-8 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isHeadInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
              className="flex items-center gap-3 mb-8"
            >
              <motion.span
                className="h-px bg-accent-primary"
                initial={{ width: 0 }}
                animate={isHeadInView ? { width: '2.5rem' } : {}}
                transition={{ duration: 1.2, ease: EASE_CINEMATIC, delay: 0.2 }}
              />
              <span className="text-overline text-accent-primary">Engineering Architecture</span>
            </motion.div>

            <h2 className="phil-h2 text-text-main font-sans font-bold leading-[0.9] tracking-tighter mb-8" style={{ fontSize: 'clamp(4rem, 7vw, 7rem)', opacity: 0 }}>
              Engineering<br />
              <span className="text-accent-primary font-serif-italic opacity-90 tracking-tight">Systems</span>
            </h2>

            <motion.p 
              className="text-body-editorial text-muted/60 max-w-sm hidden lg:block"
              initial={{ opacity: 0 }}
              animate={isHeadInView ? { opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              A curated toolkit refined through production-grade engineering and immersive frontend systems.
            </motion.p>
          </div>

          {/* RIGHT: Tech Matrix */}
          <div className="lg:col-span-7 flex flex-col pt-4 lg:pt-[5%]">
            
            {/* Capability Matrix / Tech Stack */}
            <div className="stack-matrix">
              <div className="flex flex-col gap-12 sm:gap-16 group/matrix">
                {TECH_CATEGORIES.map((block, i) => (
                  <div key={i} className="stack-row group flex flex-col gap-4 transition-opacity duration-700 hover:opacity-100! group-hover/matrix:opacity-30" style={{ opacity: 0 }}>
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-accent-primary/60 font-semibold transition-colors duration-500 group-hover:text-accent-primary">
                      {block.category}
                    </p>
                    <p className="text-[1.15rem] sm:text-[1.4rem] lg:text-[1.55rem] text-text-main/70 font-sans font-medium tracking-wide leading-relaxed transition-all duration-700 group-hover:text-text-main group-hover:translate-x-3">
                      {block.techs.split(' — ').map((tech, idx, arr) => (
                        <React.Fragment key={idx}>
                          <span className="relative inline-block cursor-default transition-colors duration-500 hover:text-accent-primary after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-accent-primary after:origin-bottom-right after:transition-transform after:duration-500 hover:after:scale-x-100 hover:after:origin-bottom-left">
                            {tech}
                          </span>
                          {idx < arr.length - 1 && <span className="mx-3 opacity-30 select-none font-serif">—</span>}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Philosophy;
