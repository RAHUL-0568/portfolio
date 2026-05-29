import React, { useEffect, useRef } from 'react';

function InteractiveCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let isVisible = true; // Optimization flag

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const handleMouseMove = (e) => {
      if (!isVisible) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', handleMouseMove, { passive: true });
    parent.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Floating stellar particles configuration
    let particles = [];
    const maxParticles = 25; // Heavily reduced for cinematic feel & FPS

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        const originX = Math.random() * width;
        const originY = Math.random() * height;
        particles.push({
          x: originX,
          y: originY,
          originX,
          originY,
          vx: (Math.random() - 0.5) * 0.1, // extremely slow cinematic drift
          vy: (Math.random() - 0.5) * 0.1,
          size: Math.random() * 1.0 + 0.4, 
          phase: Math.random() * Math.PI * 2,
          speed: 0.0005 + Math.random() * 0.0015
        });
      }
    };

    initParticles();

    let r = 111, g = 123, b = 82; // Default to olive

    const updateColors = () => {
      const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-primary').trim();
      if (themeColor && themeColor.startsWith('#')) {
        r = parseInt(themeColor.slice(1, 3), 16) || r;
        g = parseInt(themeColor.slice(3, 5), 16) || g;
        b = parseInt(themeColor.slice(5, 7), 16) || b;
      }
    };
    
    updateColors();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Subtle render loop
    const animate = () => {
      if (!isVisible) return; // Pause RAF when out of viewport

      ctx.clearRect(0, 0, width, height);

      // Damp mouse coordinates for high-end inertia motion
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05; // slower easing
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw and calculate particles
      particles.forEach((p) => {
        p.phase += p.speed;
        const driftX = Math.cos(p.phase) * 0.2;
        const driftY = Math.sin(p.phase) * 0.2;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        let fx = 0;
        let fy = 0;

        if (mouse.active && dist < 180) { // reduced interact radius
          const force = (180 - dist) / 180;
          const angle = Math.atan2(dy, dx) + Math.PI / 2;
          fx = Math.cos(angle) * force * 0.3; // subtle interaction
          fy = Math.sin(angle) * force * 0.3;
        }

        p.x += p.vx + driftX + fx;
        p.y += p.vy + driftY + fy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render particle dot - very soft opacity
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.05 + Math.sin(p.phase) * 0.04})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render architectural lines connecting close neighbors
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dist = Math.hypot(pi.x - pj.x, pi.y - pj.y);

          if (dist < 90) { // reduced line connect radius
            const alpha = (90 - dist) / 90 * 0.025; // much softer line opacity
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    // Intersection Observer to Pause Render Loop
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!isVisible) {
          isVisible = true;
          animate(); // Resume
        }
      } else {
        isVisible = false; // Pause
      }
    }, { threshold: 0 });
    
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      io.disconnect();
      window.removeEventListener('resize', handleResize);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40 mix-blend-multiply dark:mix-blend-lighten"
    />
  );
}

export default InteractiveCanvas;
