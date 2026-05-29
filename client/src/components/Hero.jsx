import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDownRight, FileText } from "lucide-react";
import InteractiveCanvas from "./InteractiveCanvas";
import { EASE_CINEMATIC, EASE_EDITORIAL } from "../motion";

function Hero({ metadata }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  const resumeUrl =
    metadata?.contact?.email
      ? `http://${window.location.hostname}:5000/public/RAHUL_Resume.pdf`
      : "/RAHUL_Resume.pdf";

  // Scroll-linked parallax for atmospheric depth
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Canvas layer drifts up faster (depth illusion)
  const canvasY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Main text drifts up slightly
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Visual anchor drifts up slowly
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  // Springify for smoothness
  const smoothCanvasY = useSpring(canvasY, { stiffness: 60, damping: 25 });
  const smoothTextY = useSpring(textY, { stiffness: 60, damping: 25 });
  const smoothVisualY = useSpring(visualY, { stiffness: 40, damping: 30 });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden select-none"
      style={{
        paddingLeft: "var(--space-page-x)",
        paddingRight: "var(--space-page-x)",
        paddingBottom: "12rem",
        paddingTop: "6rem",
      }}
    >
      {/* ── Layer 0: Ambient Interactive Canvas ── */}
      <motion.div
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ y: smoothCanvasY, opacity: canvasOpacity }}
      >
        <InteractiveCanvas />
      </motion.div>

      {/* Layer 1 fog has been removed as requested to match site background exactly */}

      {/* ── Layer 1.5: Atmospheric Right-Side Visual ── */}
      <motion.div
        className="absolute right-0 top-[15%] w-[80vw] md:w-[60vw] max-w-[900px] pointer-events-none z-[2]"
        style={{ y: smoothVisualY }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: [0, 0.5, 0.35] }}
        transition={{
          opacity: {
            duration: 4,
            ease: "easeInOut",
            times: [0, 0.6, 1],
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 1,
          },
          x: { duration: 1.8, ease: EASE_CINEMATIC },
        }}
      >
        <div className="relative w-full aspect-video">
          <img
            src="https://images.squarespace-cdn.com/content/v1/5769fc401b631bab1addb2ab/1541580611624-TE64QGKRJG8SWAIUS7NS/ke17ZwdGBToddI8pDm48kPoswlzjSVMM-SxOp7CV59BZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PI6FXy8c9PWtBlqAVlUS5izpdcIXDZqDYvprRqZ29Pw0o/coding-freak.gif"
            alt="Atmospheric Coding Integration"
            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen grayscale-[30%] contrast-75 sepia-[15%] blur-[1px]"
            style={{
              maskImage:
                "radial-gradient(ellipse at center, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 80%)",
            }}
          />
        </div>
      </motion.div>

      {/* ── Layer 2: Content — Parallax Drift ── */}
      <motion.div
        className="relative z-10 w-full"
        style={{ y: smoothTextY, opacity: textOpacity }}
      >
        {/* Overline — slides in from left */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, ease: EASE_CINEMATIC, delay: 0.2 }}
          className="flex items-center gap-3 mb-10"
        >
          <motion.span
            className="h-[1px] bg-accent-primary"
            initial={{ width: 0 }}
            animate={{ width: "3rem" }}
            transition={{ duration: 1.2, ease: EASE_CINEMATIC, delay: 0.5 }}
          />
          <span className="text-overline text-accent-primary">
            Creative Software Engineer · 2026
          </span>
        </motion.div>

        {/* ── H1: "Rahul" — word masked reveal ── */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE_EDITORIAL, delay: 0.3 }}
          >
            <h1 className="heading-monumental text-text-main leading-none">
              {metadata?.name || "Rahul"}
            </h1>
          </motion.div>
        </div>

        {/* ── Serif "Developer" — asymmetric offset ── */}
        <div className="overflow-hidden mt-[-0.05em]">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE_EDITORIAL, delay: 0.46 }}
            className="ml-[12%] sm:ml-[18%] lg:ml-[22%]"
          >
            <span
              className="heading-serif-accent text-accent-primary"
              style={{ fontSize: "clamp(3.5rem, 11vw, 10.5rem)" }}
            >
              {metadata?.title || "Fullstack Developer"}
            </span>
          </motion.div>
        </div>

        {/* ── Bottom row: narrative bio + CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE_CINEMATIC, delay: 0.85 }}
          className="mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-10"
        >
          <p className="text-body-editorial text-muted max-w-md">
            {metadata?.heroText || "B.Tech Computer Science — engineering production-grade full-stack systems. Handcrafting interactive experiences where engineering precision meets editorial storytelling."}
          </p>

          <div className="flex items-center gap-10 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById("projects");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-4 text-overline text-text-main hover:text-accent-primary transition-colors duration-500 cursor-pointer"
            >
              <span>Selected Work</span>
              <span className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-accent-primary group-hover:bg-accent-primary/8 transition-all duration-500">
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <a
              href={resumeUrl}
              download="Rahul_Resume.pdf"
              className="text-overline text-muted/50 hover:text-muted transition-colors duration-300 flex items-center gap-2"
            >
              <FileText className="w-3 h-3" />
              <span>View Archive</span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.4 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
        className="absolute bottom-10 flex items-center gap-3 text-overline text-muted/35 pointer-events-none"
        style={{ right: "var(--space-page-x)" }}
      >
        <span>Scroll</span>
        <motion.span
          className="h-[1px] bg-muted/20"
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          transition={{ duration: 1.4, ease: EASE_CINEMATIC, delay: 1.8 }}
        />
      </motion.div>
    </section>
  );
}

export default Hero;

