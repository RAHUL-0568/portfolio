import React, { useState } from 'react';
import { Award, Code2, Layers, Cpu } from 'lucide-react';

function SkillVisualizer({ skills }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const skillRelations = {
    'React.js': ['JavaScript', 'HTML', 'CSS', 'Next.js', 'Tailwind CSS'],
    'Next.js': ['React.js', 'JavaScript', 'Tailwind CSS', 'Node.js'],
    'Node.js': ['JavaScript', 'Express.js', 'REST APIs', 'JWT', 'MongoDB'],
    'Express.js': ['Node.js', 'REST APIs', 'MongoDB', 'PostgreSQL'],
    'MongoDB': ['Node.js', 'Express.js', 'Mongoose'],
    'JavaScript': ['React.js', 'Next.js', 'Node.js', 'Express.js']
  };

  const getSkillCategoryIcon = (category) => {
    switch (category) {
      case 'Programming': return <Code2 className="w-3.5 h-3.5 text-accent-primary" />;
      case 'Frontend': return <Layers className="w-3.5 h-3.5 text-accent-secondary" />;
      case 'Backend': return <Cpu className="w-3.5 h-3.5 text-accent-primary" />;
      default: return <Award className="w-3.5 h-3.5 text-accent-primary" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none bg-transparent">
      <div className="flex items-center gap-2 text-[10px] font-bold text-text-main uppercase tracking-[0.2em] border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
        <Cpu className="w-4 h-4 text-accent-primary" />
        <span>Competence spectrum</span>
      </div>

      <div className="flex flex-col gap-6">
        {skills?.map((cat, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {getSkillCategoryIcon(cat.category)}
              <span className="font-sans font-bold text-[9px] text-muted tracking-[0.2em] uppercase">{cat.category}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill, sIdx) => {
                const isCurrent = hoveredSkill === skill;
                const isRelated = hoveredSkill && skillRelations[hoveredSkill]?.includes(skill);
                
                return (
                  <span
                    key={sIdx}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`px-3 py-1.5 rounded-lg font-sans text-[10px] font-semibold border transition-all duration-300 cursor-pointer ${
                      isCurrent
                        ? 'bg-accent-primary/10 border-accent-primary text-text-main shadow-accentGlow scale-[1.03]'
                        : isRelated
                        ? 'bg-accent-secondary/15 border-accent-secondary/40 text-accent-primary'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-muted hover:border-accent-primary hover:text-text-main'
                    }`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillVisualizer;
