import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Testimonials({ metadata }) {
  const testimonials = metadata?.testimonials || [];
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying] = useState(true);
  const autoRef = useRef(null);

  const goTo = (idx, dir = 1) => {
    setDirection(dir);
    setActive(idx);
  };

  const prev = () => {
    const newIdx = (active - 1 + testimonials.length) % testimonials.length;
    goTo(newIdx, -1);
    resetAuto();
  };

  const next = () => {
    const newIdx = (active + 1) % testimonials.length;
    goTo(newIdx, 1);
    resetAuto();
  };

  const resetAuto = () => {
    clearInterval(autoRef.current);
    if (isAutoPlaying) startAuto();
  };

  const startAuto = () => {
    autoRef.current = setInterval(() => {
      setActive(prev => {
        setDirection(1);
        return (prev + 1) % (testimonials.length || 1);
      });
    }, 5000);
  };

  useEffect(() => {
    if (testimonials.length > 1) startAuto();
    return () => clearInterval(autoRef.current);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 })
  };

  const current = testimonials[active];

  return (
    <section id="testimonials" className="min-h-fit max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10 select-none">

      {/* Title */}
      <div className="text-left mb-16 max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-[1px] bg-accent-primary"></span>
          <span className="font-sans font-bold text-[9px] tracking-[0.25em] text-accent-primary uppercase">Voices & Endorsements</span>
        </div>
        <h2 className="font-sans font-bold text-4xl sm:text-6xl tracking-tighter text-text-main mb-4">
          What People <span className="font-serif-italic font-normal text-accent-primary">Say</span>
        </h2>
        <p className="text-muted text-xs sm:text-sm leading-relaxed tracking-wider font-sans">
          Reflections and endorsements from colleagues, mentors, and collaborators.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Main Testimonial Card */}
          <div className="lg:col-span-8 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="parchment-card rounded-3xl p-10 shadow-premium relative overflow-hidden"
              >
                {/* Decorative quote mark */}
                <div className="absolute top-8 right-10 font-serif text-[120px] leading-none text-accent-primary/[0.06] select-none pointer-events-none">
                  "
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= (current.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-muted/30'}`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-serif-italic text-xl sm:text-2xl text-text-main leading-relaxed tracking-wide mb-8 relative z-10">
                  "{current.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 border-t border-black/[0.05] dark:border-white/[0.05] pt-6">
                  {current.avatar ? (
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-12 h-12 rounded-full object-cover border border-accent-primary/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/20 flex items-center justify-center font-sans font-bold text-accent-primary text-base uppercase">
                      {current.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <p className="font-sans font-bold text-sm text-text-main tracking-wide">{current.name}</p>
                    <p className="font-sans text-[10px] text-muted uppercase tracking-widest mt-0.5">
                      {current.role}{current.role && current.company ? ' · ' : ''}{current.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Navigation & Indicators */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Dot Indicators + Arrow Controls */}
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 flex-wrap">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx, idx > active ? 1 : -1)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === active ? 'w-8 bg-accent-primary' : 'w-1.5 bg-black/15 dark:bg-white/15'}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prev}
                  className="parchment-card p-3 rounded-xl hover:border-accent-primary/40 border border-transparent transition-all group"
                >
                  <ChevronLeft className="w-5 h-5 text-muted group-hover:text-accent-primary transition-colors" />
                </button>
                <button
                  onClick={next}
                  className="parchment-card p-3 rounded-xl hover:border-accent-primary/40 border border-transparent transition-all group"
                >
                  <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent-primary transition-colors" />
                </button>
              </div>
            </div>

            {/* Thumbnail list of other testimonials */}
            <div className="flex flex-col gap-3">
              {testimonials.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx, idx > active ? 1 : -1)}
                  className={`text-left p-3 rounded-xl border transition-all duration-300 ${idx === active ? 'border-accent-primary/30 bg-accent-primary/5' : 'border-transparent bg-black/[0.02] dark:bg-white/[0.02] hover:border-accent-primary/15'}`}
                >
                  <p className="font-sans font-bold text-xs text-text-main truncate">{t.name}</p>
                  <p className="font-sans text-[9px] text-muted uppercase tracking-widest truncate mt-0.5">{t.role}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Testimonials;
