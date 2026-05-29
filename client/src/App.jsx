import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import Projects from './components/Projects';
import Gallery from './components/Gallery';
import Philosophy from './components/Philosophy';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import { initSmoothScroll } from './smoothScroll';

function App() {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading]   = useState(true);

  const fallbackMetadata = {
    name: 'Rahul',
    title: 'Creative Software Engineer',
    contact: {
      email: 'rahulx0568@gmail.com',
      phone: '+91 6230271530',
      location: 'Mandi (H.P)',
      linkedin: 'https://www.linkedin.com/in/rahul-93aba3301'
    },
    education: [
      { institution: 'ABVGIET Pragatinagar, Shimla', degree: 'B.Tech â€” Computer Science & Engineering', period: '2022 â€“ 2026', location: 'Shimla (H.P)' },
    ],
    experience: [
      {
        role: 'Full Stack Developer Intern',
        company: 'Wegile Infotech',
        period: 'Jan 2026',
        details: ['Developed features using React, Next.js, and Node.js backend integrations. Collaborated on code quality reviews and deployment optimizations.']
      },
      {
        role: 'MERN Stack Intern',
        company: 'Novem Control',
        period: '2024',
        details: ['Built production-ready MERN web applications. Integrated secure REST APIs and database triggers.']
      }
    ],
    skills: [
      { category: 'Frontend', skills: ['React.js', 'Next.js', 'Tailwind CSS', 'Framer Motion'] },
      { category: 'Backend',  skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT'] },
    ],
    certifications: [],
    detailedSkills: [],
    testimonials: []
  };

  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    // Mouse tracking for ambient glow
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Metadata fetch (cache-busted)
    fetch(`http://${window.location.hostname}:5000/api/resume/metadata?t=${Date.now()}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setMetadata(data); setLoading(false); })
      .catch(() => { setMetadata(fallbackMetadata); setLoading(false); });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Init Lenis smooth scroll after content loads
  useEffect(() => {
    if (loading) return;

    // Small delay ensures DOM is fully rendered before Lenis init
    const timeout = setTimeout(() => {
      const cleanup = initSmoothScroll();
      return cleanup;
    }, 100);

    return () => clearTimeout(timeout);
  }, [loading]); // Lenis init

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#131211] flex flex-col items-center justify-center select-none">
        <div className="w-6 h-6 border border-t-[#8E8270] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        <p className="mt-5 text-overline text-[#7E7970] animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-background relative overflow-x-hidden select-none">
          {/* Film grain */}
          <div className="noise-overlay" />
          {/* Ambient glow */}
          <div className="ambient-glow" />
          {/* Header */}
          <Header metadata={metadata} />
          {/* Main */}
          <main className="relative z-10">
            <Hero metadata={metadata} />
            <Capabilities />
            <Projects />
            <Gallery />
            <Philosophy />
            <Contact metadata={metadata} />
          </main>
          {/* Editorial footer */}
          <footer
            className="relative z-10 border-t border-black/[0.04] dark:border-white/[0.04] py-12 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ paddingLeft: 'var(--space-page-x)', paddingRight: 'var(--space-page-x)' }}
          >
            <p className="text-overline text-muted/35">© {new Date().getFullYear()} {metadata?.name || 'Rahul'} · All rights reserved</p>
            <p className="text-overline text-muted/25">Crafted with precision & restraint</p>
          </footer>
        </div>
      } />
      <Route path="/admin" element={
        <AdminDashboard metadata={metadata} setMetadata={setMetadata} />
      } />
    </Routes>
  );
}

export default App;
