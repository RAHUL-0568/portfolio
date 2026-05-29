import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "../motion";

const GALLERY_IMAGES = [
  {
    src: "/gallery-1.jpeg",
  },
  {
    src: "/gallery-2.jpeg",
  },
  {
    src: "/gallery-3.jpeg",
  },
  {
    src: "/gallery-4.jpeg",
  },
];

function Gallery() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);

  // Detect mobile to disable parallax (prevents scroll jank on touch devices)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subdued background texture parallax
  const yBg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Cinematic vertical drift for overlapping layers
  // Foreground elements (1 and 3) drift faster to create depth
  const yImg1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yImg2 = useTransform(scrollYProgress, [0, 1], ["10%", "-5%"]);
  const yImg3 = useTransform(scrollYProgress, [0, 1], ["-5%", "18%"]);
  const yImg4 = useTransform(scrollYProgress, [0, 1], ["20%", "-12%"]);

  // On mobile: static zero motion values to skip JS transform overhead safely
  const staticY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading wipe reveal
      gsap.fromTo(
        ".gal-heading",
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, y: 20 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // Staggered image fade in with subtle 0.96 -> 1 scaling
      gsap.fromTo(
        ".gal-img-container",
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.6,
          ease: "power3.out",
          stagger: 0.25,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative z-10 select-none overflow-hidden"
      style={{
        paddingTop: "var(--space-section)",
        paddingBottom: "calc(var(--space-section) * 1.5)",
      }}
    >
      {/* ── Deep Background Atmosphere (Subdued) ── */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center overflow-hidden z-0 opacity-[0.015] dark:opacity-[0.01]">
        <motion.h2
          style={{ y: isMobile ? staticY : yBg }}
          className="text-[20vw] font-serif-italic leading-none whitespace-nowrap text-text-main tracking-tighter blur-sm text-center"
        >
          VISUALS
        </motion.h2>
      </div>

      <div
        style={{
          paddingLeft: "var(--space-page-x)",
          paddingRight: "var(--space-page-x)",
        }}
        className="relative z-10 max-w-[1600px] mx-auto"
      >
        {/* ── Section Header ── */}
        <div ref={headRef} className="flex flex-col mb-24 md:mb-32">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-[1px] bg-accent-primary" />
            <span className="text-overline text-accent-primary">
              Digital Exhibition
            </span>
          </div>
          <h2
            className="gal-heading heading-editorial text-text-main"
            style={{ opacity: 0 }}
          >
            My
            <br />
            <span className="heading-serif-accent text-accent-primary">
              Gallery
            </span>
          </h2>
        </div>

        {/* ── Adaptive Editorial Flow System ── */}
        {/* Group scope for neighbor dimming interactions */}
        <div className="relative w-full flex flex-col lg:flex-row justify-between gap-16 lg:gap-12 group/gallery mt-16 max-w-[1200px] mx-auto px-4 lg:px-12">
          {/* ── LEFT COLUMN (Sunset & Statue) ── */}
          <div className="flex flex-col gap-12 lg:gap-16 w-full lg:w-[48%]">
            {/* Image 1: Sunset Frame (Top Left) - Featured Image (380-480px max width) */}
            <motion.div
              className="gal-img-container relative w-full max-w-[380px] lg:max-w-[480px] group transition-opacity duration-700 group-hover/gallery:opacity-40 hover:!opacity-100"
              style={{ y: isMobile ? staticY : yImg1, opacity: 0, willChange: "transform" }}
            >
              <div className="w-full overflow-hidden border border-black/[0.04] dark:border-white/[0.04] shadow-premium group-hover:shadow-2xl transition-shadow duration-700">
                <img
                  src={GALLERY_IMAGES[0].src}
                  alt={GALLERY_IMAGES[0].title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block grayscale-[30%] contrast-110 transition-transform duration-1000 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                />
              </div>
              <div className="absolute -left-4 -bottom-6 lg:-left-12 lg:-bottom-12 bg-background/90 p-4 lg:p-6 flex flex-col gap-1 shadow-xl" style={{ backdropFilter: isMobile ? 'none' : 'blur(12px)' }}>
                <p className="text-overline text-accent-primary">
                  {GALLERY_IMAGES[0].subtitle}
                </p>
                <p className="font-sans font-medium text-text-main/80 text-sm">
                  {GALLERY_IMAGES[0].title}
                </p>
              </div>
            </motion.div>

            {/* Image 4: Statue (Bottom Left) - Small Accent Image (180-240px width) */}
            <motion.div
              className="gal-img-container relative left-16 top-6 lg:left-24 lg:top-10 w-[200px] lg:w-[240px] mt-[5px] group transition-opacity duration-700 group-hover/gallery:opacity-40 hover:!opacity-100"
              style={{ y: isMobile ? staticY : yImg4, opacity: 0, willChange: "transform" }}
            >
              <div className="w-full overflow-hidden border border-black/[0.04] dark:border-white/[0.04] shadow-premium group-hover:shadow-2xl transition-shadow duration-700">
                <img
                  src={GALLERY_IMAGES[3].src}
                  alt={GALLERY_IMAGES[3].title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block grayscale-[50%] contrast-125 transition-transform duration-1000 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                />
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN (Temple & Church) ── */}
          <div className="flex flex-col gap-12 lg:gap-16 w-full lg:w-[48%] lg:mt-32 items-end">
            {/* Image 2: Temple (Top Right) - Medium Supporting Image (260-340px max width) */}
            <motion.div
              className="gal-img-container relative w-full max-w-[300px] lg:max-w-[340px] group transition-opacity duration-700 group-hover/gallery:opacity-40 hover:!opacity-100"
              style={{ y: isMobile ? staticY : yImg2, opacity: 0, willChange: "transform" }}
            >
              <div className="w-full overflow-hidden border border-black/[0.04] dark:border-white/[0.04] shadow-premium group-hover:shadow-2xl transition-shadow duration-700">
                <img
                  src={GALLERY_IMAGES[1].src}
                  alt={GALLERY_IMAGES[1].title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block grayscale-[30%] contrast-110 transition-transform duration-1000 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                />
              </div>
              <div className="absolute -right-4 -bottom-6 lg:-right-10 lg:-bottom-10 bg-background/90 p-4 lg:p-6 flex flex-col gap-1 shadow-xl text-right z-10" style={{ backdropFilter: isMobile ? 'none' : 'blur(12px)' }}>
                <p className="text-overline text-accent-primary">
                  {GALLERY_IMAGES[1].subtitle}
                </p>
                <p className="font-sans font-medium text-text-main/80 text-sm">
                  {GALLERY_IMAGES[1].title}
                </p>
              </div>
            </motion.div>

            {/* Image 3: Church (Bottom Right) - Medium Supporting Image (260-340px max width) */}
            <motion.div
              className="gal-img-container relative w-full max-w-[300px] lg:max-w-[340px] group transition-opacity duration-700 group-hover/gallery:opacity-40 hover:!opacity-100"
              style={{ y: isMobile ? staticY : yImg3, opacity: 0, willChange: "transform" }}
            >
              <div className="w-full overflow-hidden border border-black/[0.04] dark:border-white/[0.04] shadow-premium group-hover:shadow-2xl transition-shadow duration-700">
                <img
                  src={GALLERY_IMAGES[2].src}
                  alt={GALLERY_IMAGES[2].title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block grayscale-[30%] contrast-110 transition-transform duration-1000 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                />
              </div>
              <div className="absolute bottom-6 right-6 lg:-bottom-8 lg:-left-12 bg-background/90 p-4 lg:p-6 flex-col gap-1 shadow-xl text-left hidden sm:flex z-10" style={{ backdropFilter: isMobile ? 'none' : 'blur(12px)' }}>
                <p className="text-overline text-accent-primary">
                  {GALLERY_IMAGES[2].subtitle}
                </p>
                <p className="font-sans font-medium text-text-main/80 text-sm">
                  {GALLERY_IMAGES[2].title}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Gallery;
