import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE_CINEMATIC = [0.16, 1, 0.3, 1];

function CommandMenu({ setShowAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { id: 'about',        label: 'About',          category: 'SECTION',    action: () => handleNavigate('#about') },
    { id: 'capabilities', label: 'Capabilities',   category: 'DISCIPLINES',action: () => handleNavigate('#capabilities') },
    { id: 'projects',     label: 'Selected Work',  category: 'PROJECTS',   action: () => handleNavigate('#projects') },
    { id: 'gallery',      label: 'Gallery Archive',category: 'VISUALS',    action: () => handleNavigate('#gallery') },
    { id: 'contact',      label: 'Contact',        category: 'CONNECT',    action: () => handleNavigate('#contact') },
    { id: 'resume',       label: 'Resume Vault',   category: 'DOCUMENT',   action: () => handleNavigate('#about') },
    { id: 'admin',        label: 'Admin Console',  category: 'SYSTEM',     action: () => { setShowAdmin(true); setIsOpen(false); } }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleNavigate = (hash) => {
    setShowAdmin(false);
    setIsOpen(false);
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelect = (cmd) => {
    cmd.action();
  };

  const handleListKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <>
      {/* Floating ⌘K badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-7 right-7 z-50 flex items-center gap-2.5 text-overline text-muted/50 hover:text-muted transition-colors duration-300 select-none group"
      >
        <kbd className="bg-background border border-black/10 dark:border-white/10 px-2.5 py-1.5 rounded-lg text-[9px] tracking-widest font-sans font-bold group-hover:border-accent-primary/30 transition-all shadow-sm">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4" style={{ paddingTop: '15vh' }}>
            
            {/* Atmospheric Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
              className="absolute inset-0 z-0"
              style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(8px)' }}
              onClick={() => setIsOpen(false)}
            />

            {/* Cinematic Palette */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
              className="relative z-10 w-full max-w-[720px] flex flex-col overflow-hidden"
              style={{
                background: 'var(--color-bg-base)',
                backgroundColor: 'rgba(var(--color-bg-base-rgb), 0.72)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(var(--color-text-main-rgb), 0.06)',
                borderRadius: '1.5rem', // Slight rounding, not overly bubbly
              }}
            >
              
              {/* Header Info */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-black/[0.04] dark:border-white/[0.04]">
                <span className="text-[9px] uppercase tracking-[0.2em] text-text-main/40 font-semibold select-none">
                  Command Center
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-text-main/40 font-semibold select-none">
                  Esc to Close
                </span>
              </div>

              {/* Input Area */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE_CINEMATIC }}
                className="px-8 py-10"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search navigation, projects, systems..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={handleListKeyDown}
                  className="w-full bg-transparent border-none outline-none text-text-main font-medium placeholder-text-main/20"
                  style={{ fontSize: 'clamp(28px, 3vw, 42px)', letterSpacing: '-0.02em' }}
                />
              </motion.div>

              {/* Results List */}
              <div className="flex flex-col pb-6 px-4 max-h-[40vh] overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-text-main/30 text-sm font-medium tracking-wide">No systems match that query.</div>
                ) : (
                  filteredCommands.map((cmd, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <motion.button
                        key={cmd.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 + (idx * 0.04), ease: EASE_CINEMATIC }}
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className="group w-full px-4 py-4 rounded-xl flex items-center justify-between text-left select-none relative"
                        style={{
                          transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                          backgroundColor: isSelected ? 'rgba(var(--color-accent-primary-rgb), 0.04)' : 'transparent',
                        }}
                      >
                        {/* Hover Transform Content */}
                        <div 
                          className="flex items-center justify-between w-full"
                          style={{
                            transform: isSelected ? 'translateX(4px)' : 'translateX(0)',
                            transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        >
                          <span 
                            className="text-base font-medium transition-colors duration-500"
                            style={{ color: isSelected ? 'var(--color-accent-primary)' : 'var(--color-text-main)' }}
                          >
                            {cmd.label}
                          </span>
                          
                          <span 
                            className="text-[9px] tracking-[0.2em] uppercase font-semibold transition-colors duration-500"
                            style={{ color: isSelected ? 'var(--color-accent-primary)' : 'rgba(var(--color-text-main-rgb), 0.3)' }}
                          >
                            {cmd.category}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CommandMenu;
