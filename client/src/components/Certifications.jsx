import React, { useState } from 'react';
import { Award, ExternalLink, Calendar, Hash, Shield, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_COLORS = {
  'Cloud': 'from-blue-500/15 to-cyan-500/15 border-blue-400/25 text-blue-600 dark:text-blue-400',
  'Frontend': 'from-purple-500/15 to-pink-500/15 border-purple-400/25 text-purple-600 dark:text-purple-400',
  'Backend': 'from-emerald-500/15 to-teal-500/15 border-emerald-400/25 text-emerald-600 dark:text-emerald-400',
  'AI': 'from-orange-500/15 to-amber-500/15 border-orange-400/25 text-orange-600 dark:text-orange-400',
  'Security': 'from-red-500/15 to-rose-500/15 border-red-400/25 text-red-600 dark:text-red-400',
  'Database': 'from-indigo-500/15 to-violet-500/15 border-indigo-400/25 text-indigo-600 dark:text-indigo-400',
  'default': 'from-accent-primary/10 to-accent-secondary/10 border-accent-primary/20 text-accent-primary'
};

function getCategoryStyle(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['default'];
}

function Certifications({ metadata }) {
  const certifications = metadata?.certifications || [];
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(certifications.map(c => c.category).filter(Boolean)))];
  const filtered = activeFilter === 'All' ? certifications : certifications.filter(c => c.category === activeFilter);

  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="min-h-fit max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10 select-none">

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[1px] bg-accent-primary"></span>
            <span className="font-sans font-bold text-[9px] tracking-[0.25em] text-accent-primary uppercase">Credentials & Achievements</span>
          </div>
          <h2 className="font-sans font-bold text-4xl sm:text-6xl tracking-tighter text-text-main mb-4">
            Certified <span className="font-serif-italic font-normal text-accent-primary">Expertise</span>
          </h2>
          <p className="text-muted text-xs sm:text-sm leading-relaxed tracking-wider font-sans">
            Industry-recognized certifications, awards, and validated competencies.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans font-bold text-[9px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-accent-primary text-white border-accent-primary shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 border-transparent text-muted hover:border-accent-primary/30'
                }`}
              >
                {cat === 'All' && <Filter className="w-3 h-3" />}
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Certifications Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((cert, idx) => {
            const catStyle = getCategoryStyle(cert.category);
            return (
              <motion.div
                key={`${cert.name}-${idx}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group parchment-card rounded-2xl p-6 shadow-premium relative overflow-hidden flex flex-col gap-4 hover:shadow-lg transition-all duration-300"
              >
                {/* Category Badge */}
                {cert.category && (
                  <div className={`absolute top-5 right-5 bg-gradient-to-r ${catStyle} border text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full`}>
                    {cert.category}
                  </div>
                )}

                {/* Badge Icon or Award Icon */}
                <div className="flex items-center gap-3">
                  {cert.badge ? (
                    <img
                      src={cert.badge}
                      alt={cert.name}
                      className="w-12 h-12 rounded-xl object-contain border border-black/5 dark:border-white/5 p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/15 flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent-primary" />
                    </div>
                  )}
                </div>

                {/* Cert Name */}
                <div>
                  <h3 className="font-sans font-bold text-sm text-text-main leading-snug tracking-wide pr-16">
                    {cert.name}
                  </h3>
                  <p className="font-sans text-[10px] text-accent-primary font-semibold uppercase tracking-widest mt-1">
                    {cert.issuer}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-col gap-1.5">
                  {cert.date && (
                    <div className="flex items-center gap-1.5 text-[9px] text-muted">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{cert.date}</span>
                    </div>
                  )}
                  {cert.credentialId && (
                    <div className="flex items-center gap-1.5 text-[9px] text-muted font-mono">
                      <Hash className="w-3 h-3 shrink-0" />
                      <span className="truncate">{cert.credentialId}</span>
                    </div>
                  )}
                </div>

                {/* Verify Link */}
                {cert.link && (
                  <div className="mt-auto pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[9px] font-bold text-accent-primary uppercase tracking-widest hover:opacity-75 transition-opacity"
                    >
                      <Shield className="w-3 h-3" />
                      <span>Verify Credential</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted text-xs font-sans uppercase tracking-widest">
          No certifications in this category.
        </div>
      )}

    </section>
  );
}

export default Certifications;
