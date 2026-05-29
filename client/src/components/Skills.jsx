import React, { useState, useRef } from 'react';
import { ExternalLink, Zap, Code2, Layers, Cpu, Database, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const CATEGORY_ICONS = {
  'Frontend': <Layers className="w-3.5 h-3.5" />,
  'Backend': <Cpu className="w-3.5 h-3.5" />,
  'Database': <Database className="w-3.5 h-3.5" />,
  'Programming': <Code2 className="w-3.5 h-3.5" />,
  'Web': <Globe className="w-3.5 h-3.5" />,
  'default': <Zap className="w-3.5 h-3.5" />
};

const PROFICIENCY_LABELS = {
  90: 'Expert',
  75: 'Advanced',
  55: 'Proficient',
  35: 'Intermediate',
  0: 'Learning'
};

function getProficiencyLabel(value) {
  const thresholds = [90, 75, 55, 35, 0];
  for (const t of thresholds) {
    if (value >= t) return PROFICIENCY_LABELS[t];
  }
  return 'Learning';
}

function getProficiencyColor(value) {
  if (value >= 90) return 'from-emerald-500 to-teal-400';
  if (value >= 75) return 'from-accent-primary to-accent-secondary';
  if (value >= 55) return 'from-blue-500 to-indigo-400';
  if (value >= 35) return 'from-amber-500 to-orange-400';
  return 'from-rose-500 to-pink-400';
}

function SkillBar({ skill, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [showTooltip, setShowTooltip] = useState(false);

  const proficiency = skill.proficiency ?? 50;
  const label = getProficiencyLabel(proficiency);
  const barColor = getProficiencyColor(proficiency);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col gap-2 p-4 rounded-2xl border border-transparent hover:border-accent-primary/20 hover:bg-accent-primary/[0.02] transition-all duration-300"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (skill.description || skill.projectName) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-0 z-30 mb-2 max-w-xs parchment-card rounded-xl p-3 shadow-premium text-[10px] leading-relaxed pointer-events-none"
          >
            {skill.description && (
              <p className="text-text-main font-sans">{skill.description}</p>
            )}
            {skill.projectName && (
              <p className="text-accent-primary font-bold uppercase tracking-wider mt-1.5 text-[9px]">
                Used in: {skill.projectName}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-accent-primary">
            {skill.icon || CATEGORY_ICONS[skill.category] || CATEGORY_ICONS['default']}
          </span>
          <span className="font-sans font-bold text-sm text-text-main tracking-wide">{skill.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[9px] font-bold text-muted uppercase tracking-widest">{label}</span>
          <span className="font-mono text-[10px] font-bold text-accent-primary">{proficiency}%</span>
        </div>
      </div>

      {/* Proficiency Bar */}
      <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay: delay, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* Project Link */}
      {skill.projectLink && (
        <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <a
            href={skill.projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[9px] text-accent-primary font-bold uppercase tracking-widest hover:underline"
          >
            <ChevronRight className="w-3 h-3" />
            <span>View Project</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      )}
    </div>
  );
}

function Skills({ metadata }) {
  const detailedSkills = metadata?.detailedSkills || [];
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(detailedSkills.map(s => s.category).filter(Boolean)))];
  const filtered = activeCategory === 'All' ? detailedSkills : detailedSkills.filter(s => s.category === activeCategory);

  if (!detailedSkills || detailedSkills.length === 0) return null;

  return (
    <section id="skills" className="min-h-fit max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10 select-none">

      {/* Title */}
      <div className="text-left mb-16 max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-[1px] bg-accent-primary"></span>
          <span className="font-sans font-bold text-[9px] tracking-[0.25em] text-accent-primary uppercase">Technical Proficiency</span>
        </div>
        <h2 className="font-sans font-bold text-4xl sm:text-6xl tracking-tighter text-text-main mb-4">
          Skills <span className="font-serif-italic font-normal text-accent-primary">Matrix</span>
        </h2>
        <p className="text-muted text-xs sm:text-sm leading-relaxed tracking-wider font-sans">
          An honest proficiency breakdown across frameworks, languages, and tools — with linked project references.
        </p>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-sans font-bold text-[10px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-accent-primary text-white border-accent-primary shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 border-transparent text-muted hover:border-accent-primary/30'
              }`}
            >
              <span>{CATEGORY_ICONS[cat] || CATEGORY_ICONS['default']}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Skill Bars Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          {filtered.map((skill, idx) => (
            <SkillBar key={`${skill.name}-${idx}`} skill={skill} delay={idx * 0.06} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted text-xs font-sans uppercase tracking-widest">
          No skills in this category.
        </div>
      )}

    </section>
  );
}

export default Skills;
