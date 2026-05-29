import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Default to light palette

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="text-muted hover:text-text-main transition-colors duration-300 flex items-center justify-center p-1.5 focus:outline-none"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-accent-primary" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-accent-primary" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export default ThemeToggle;
