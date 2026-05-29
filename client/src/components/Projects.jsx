import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, EASE_CINEMATIC } from "../motion";

// Curated cinematic background layers matching the project contexts
const PREVIEW_MEDIA = [
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2564&auto=format&fit=crop", // LiveCanvas: Soft Gradient
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2564&auto=format&fit=crop", // JobHunt: Professional/Workspace Editorial
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2564&auto=format&fit=crop", // SmartStay: Architectural Luxury Hotel
];

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Smooth mouse tracking with inertia for the SVG mask
  const mouseX = useSpring(-500, { stiffness: 80, damping: 24, mass: 1.2 });
  const mouseY = useSpring(-500, { stiffness: 80, damping: 24, mass: 1.2 });

  const sectionRef = useRef(null);
  const headRef = useRef(null);

  const fallbackProjects = [
    {
      title: "LiveCanvas",
      category: "Collaborative Systems",
      description:
        "Real-time interactive whiteboard architecture designed for seamless multi-user collaboration, low-latency drawing synchronization, and immersive visual interaction workflows.",
      techStack: [
        "React.js",
        "Convex",
        "Node.js",
        "WebSockets",
        "Framer Motion",
      ],
      status: "LIVE EXPERIENCE / 2026",
    },
    {
      title: "JobHunt",
      category: "Platform Engineering",
      description:
        "Production-grade recruitment and job management ecosystem focused on authentication flows, structured application pipelines, and scalable backend integration systems.",
      techStack: ["React.js", "Express.js", "MongoDB", "JWT", "REST APIs"],
      status: "FULL-STACK PLATFORM",
    },
    {
      title: "SmartStay",
      category: "Digital Hospitality Systems",
      description:
        "A full-stack hotel booking app and administration platform featuring secure reservation flows, dynamic room management, and modern customer interaction architecture.",
      techStack: ["React.js", "Node.js", "MongoDB", "Stripe", "Express.js"],
      status: "BOOKING EXPERIENCE SYSTEM",
    },
  ];

  useEffect(() => {
    setIsClient(true);
    fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/projects`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setProjects(data.length > 0 ? data : fallbackProjects);
        setLoading(false);
      })
      .catch(() => {
        setProjects(fallbackProjects);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      // Offset by half the mask size (500x350 / 2) to center it on cursor
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 175);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  // GSAP ScrollTrigger for section reveals and deep parallax
  useLayoutEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Deep background ghost text parallax
      gsap.to(".proj-ghost", {
        y: "-30%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // H2 clip-path reveal
      gsap.fromTo(
        ".proj-heading",
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, y: 18 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );

      // Overline
      gsap.fromTo(
        ".proj-overline",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // Project row entry choreography
      gsap.utils.toArray(".proj-row").forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Row dividers grow
      ScrollTrigger.batch(".proj-divider", {
        start: "top 92%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { scaleX: 0, transformOrigin: "left" },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "power3.inOut",
              stagger: { each: 0.1 },
            },
          ),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading || !isClient) return null;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-10 select-none overflow-hidden"
      style={{
        paddingTop: "var(--space-section)",
        paddingBottom: "var(--space-section)",
      }}
    >
      {/* ── True SVG Cursor Mask Definition ── */}
      <svg className="fixed top-0 left-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter
            id="cinematic-blur"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="40" />
          </filter>
          <mask id="cursor-reveal-mask">
            {/* The background of the mask must be black (transparent) */}
            <rect width="100vw" height="100vh" fill="black" />
            {/* The white rect is the "hole" in the mask, heavily blurred */}
            <motion.rect
              width="500"
              height="350"
              rx="40"
              fill="white"
              filter="url(#cinematic-blur)"
              x={mouseX}
              y={mouseY}
            />
          </mask>
        </defs>
      </svg>

      {/* ── Hidden Cinematic Background Layer (Revealed via Mask) ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          WebkitMaskImage: "url(#cursor-reveal-mask)",
          maskImage: "url(#cursor-reveal-mask)",
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: hoveredIndex !== null ? 1 : 0,
        }}
      >
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2, ease: EASE_CINEMATIC }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={PREVIEW_MEDIA[hoveredIndex % PREVIEW_MEDIA.length]}
                alt="Cinematic Layer"
                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen opacity-90 contrast-125 grayscale-[30%]"
              />
              {/* Atmospheric overlay */}
              <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4wMSIgbnVtT2N0YXZlcz0iMyIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Deep Background Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center overflow-hidden z-0">
        <h2
          className="proj-ghost text-[25vw] font-serif-italic leading-none whitespace-nowrap opacity-[0.03] text-text-main tracking-tighter"
          style={{ marginLeft: "-5vw" }}
        >
          ARCHIVE
        </h2>
      </div>

      <div
        style={{
          paddingLeft: "var(--space-page-x)",
          paddingRight: "var(--space-page-x)",
        }}
        className="relative z-10"
      >
        {/* ── Section Header ── */}
        <div
          ref={headRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-32"
        >
          <div>
            <div
              className="proj-overline flex items-center gap-3 mb-8"
              style={{ opacity: 0 }}
            >
              <span className="w-10 h-[1px] bg-accent-primary" />
              <span className="text-overline text-accent-primary">
                Digital Exhibition
              </span>
            </div>
            <h2
              className="proj-heading heading-editorial text-text-main"
              style={{ opacity: 0 }}
            >
              My
              <br />
              <span className="heading-serif-accent text-accent-primary">
                Projects
              </span>
            </h2>
          </div>
          <p
            className="proj-sub text-body-editorial text-muted max-w-xs self-end mb-4"
            style={{ opacity: 0 }}
          >
            A curated archive of production architectures and interactive
            systems, designed with rigorous engineering and editorial
            constraint.
          </p>
        </div>

        {/* ── Asymmetrical Exhibition List ── */}
        <div className="relative">
          {projects.map((proj, idx) => {
            const isHovered = hoveredIndex === idx;
            // Create asymmetrical rhythm
            const offsetLeft = idx % 2 !== 0 ? "lg:ml-[15vw]" : "lg:ml-0";

            return (
              <div key={proj._id || idx} className="relative z-10">
                <div
                  className="proj-divider border-t border-black/[0.04] dark:border-white/[0.04]"
                  style={{ transformOrigin: "left", transform: "scaleX(0)" }}
                />
                <div
                  className={`proj-row group cursor-pointer ${offsetLeft}`}
                  style={{
                    paddingTop: "clamp(3rem, 6vw, 6rem)",
                    paddingBottom: "clamp(3rem, 6vw, 6rem)",
                    opacity: 0,
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-16">
                    {/* Meta + Title */}
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-12 flex-1">
                      {/* Serial Number */}
                      <span className="font-serif-italic text-accent-primary/30 text-lg lg:mt-6 shrink-0 transition-colors duration-700 group-hover:text-accent-primary">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>

                      {/* Title & Detailed Editorial Description */}
                      <div className="flex flex-col gap-6 lg:gap-8">
                        <h3
                          className="text-text-main font-sans font-bold leading-[0.9] tracking-tighter transition-all duration-700"
                          style={{
                            fontSize: "clamp(3rem, 7vw, 7.5rem)",
                            color: isHovered
                              ? "transparent"
                              : "var(--color-text-main)",
                            WebkitTextStroke: isHovered
                              ? "1px var(--color-accent-primary)"
                              : "0px",
                          }}
                        >
                          {proj.title}
                        </h3>

                        {/* Detailed Editorial Block */}
                        <div
                          className="flex flex-col gap-3.5 max-w-[540px] transition-all duration-700 ease-out"
                          style={{
                            opacity: isHovered ? 1 : 0.6,
                            transform: isHovered
                              ? "translateY(0)"
                              : "translateY(4px)",
                          }}
                        >
                          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-accent-primary/80 font-semibold">
                            {proj.category}
                          </p>
                          <p className="text-[0.9rem] lg:text-[0.95rem] text-text-main/80 leading-[1.7] font-medium">
                            {proj.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-1">
                            <p className="text-[0.7rem] text-text-main/60 tracking-wide font-medium">
                              {proj.techStack?.join(" · ")}
                            </p>
                            <span className="hidden sm:block w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
                            <p className="text-[0.65rem] uppercase tracking-widest text-muted font-semibold">
                              {proj.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Arrow Column */}
                    <div className="flex flex-col items-end justify-center shrink-0">
                      <span className="hidden lg:flex w-12 h-12 rounded-full border border-black/10 dark:border-white/10 items-center justify-center text-muted group-hover:text-text-main group-hover:border-accent-primary group-hover:bg-accent-primary/5 transition-all duration-700 group-hover:scale-110">
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div
            className="proj-divider border-t border-black/[0.04] dark:border-white/[0.04]"
            style={{ transformOrigin: "left", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}

export default Projects;
