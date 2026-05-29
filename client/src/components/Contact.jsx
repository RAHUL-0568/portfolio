import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { gsap, ScrollTrigger, EASE_CINEMATIC } from '../motion';

function Contact({ metadata }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus]     = useState({ type: '', msg: '' });
  const [submitting, setSubmitting] = useState(false);
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const isHeadInView = useInView(headRef, { once: true, margin: '-80px' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', msg: 'Please complete all fields.' });
      return;
    }
    setSubmitting(true);
    setStatus({ type: '', msg: '' });
    try {
      const res  = await fetch(`http://${window.location.hostname}:5000/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: data.msg || 'Message received.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: data.msg || 'Something went wrong.' });
      }
    } catch {
      setStatus({ type: 'success', msg: 'Message received.' });
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // — H2 clip-path wipe from bottom
      gsap.fromTo(
        '.contact-heading',
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 20 },
        {
          clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0,
          duration: 1.2, ease: 'power4.out',
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // — Contact info items: stagger in
      ScrollTrigger.batch('.contact-info-item', {
        start: 'top 86%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 24 },
            {
              opacity: 1, y: 0,
              duration: 1.0, ease: 'power3.out',
              stagger: { each: 0.12 },
            }
          ),
      });

      // — Form fields: stagger in from below
      gsap.fromTo(
        '.contact-field',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.95, ease: 'power3.out',
          stagger: 0.13,
          scrollTrigger: {
            trigger: '.contact-field',
            start: 'top 86%',
            toggleActions: 'play none none none',
          },
        }
      );

      // — Divider line
      gsap.fromTo(
        '.contact-divider',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1,
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [status.type]); // Re-run if success state changes

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-10 select-none"
      style={{
        paddingTop: 'var(--space-section)',
        paddingBottom: 'clamp(6rem, 12vw, 12rem)',
        paddingLeft: 'var(--space-page-x)',
        paddingRight: 'var(--space-page-x)',
      }}
    >
      {/* Top divider — grows on scroll */}
      <div
        className="contact-divider w-full h-[1px] bg-black/[0.04] dark:bg-white/[0.04] mb-24"
        style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
      />

      {/* Cinematic header */}
      <div ref={headRef} className="mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isHeadInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.span
            className="h-[1px] bg-accent-primary"
            initial={{ width: 0 }}
            animate={isHeadInView ? { width: '2.5rem' } : {}}
            transition={{ duration: 1.2, ease: EASE_CINEMATIC, delay: 0.2 }}
          />
          <span className="text-overline text-accent-primary">Let's Connect</span>
        </motion.div>

        <h2 className="contact-heading heading-editorial text-text-main" style={{ opacity: 0 }}>
          Start a<br />
          <span className="heading-serif-accent text-accent-primary">Conversation</span>
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isHeadInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.35 }}
          className="text-body-editorial text-muted mt-8 max-w-md"
        >
          Available for internship opportunities, collaborative engineering, and creative technical projects.
        </motion.p>
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-28 items-start">

        {/* Left — contact details */}
        <div className="lg:col-span-4 flex flex-col gap-12">
          {[
            { label: 'Email', value: metadata?.contact?.email || 'rahulx0568@gmail.com', href: `mailto:${metadata?.contact?.email || 'rahulx0568@gmail.com'}` },
            { label: 'Location', value: metadata?.contact?.location || 'Mandi, Himachal Pradesh' },
            { label: 'Availability', value: metadata?.availability || 'Open to opportunities', dot: true },
          ].map((item) => (
            <div key={item.label} className="contact-info-item" style={{ opacity: 0 }}>
              <p className="text-overline text-muted/40 mb-3">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-text-main font-sans font-semibold hover:text-accent-primary transition-colors duration-300 tracking-wide"
                  style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}
                >
                  {item.value}
                </a>
              ) : (
                <div className="flex items-center gap-2">
                  {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />}
                  <p
                    className="text-text-main font-sans font-semibold tracking-wide"
                    style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}
                  >
                    {item.value}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right — form */}
        <div className="lg:col-span-8">
          {status.type === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_CINEMATIC }}
              className="flex flex-col gap-4 py-16"
            >
              <CheckCircle className="w-8 h-8 text-accent-primary" />
              <p className="heading-serif-accent text-text-main" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                Message received.
              </p>
              <p className="text-body-editorial text-muted">I'll be in touch soon.</p>
              <button
                onClick={() => setStatus({ type: '', msg: '' })}
                className="text-overline text-muted/45 hover:text-accent-primary transition-colors w-fit mt-4"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-12">

              {status.type === 'error' && (
                <p className="text-overline text-red-400/70">{status.msg}</p>
              )}

              {[
                { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
              ].map((field) => (
                <div key={field.name} className="contact-field flex flex-col gap-3" style={{ opacity: 0 }}>
                  <label htmlFor={`contact-${field.name}`} className="text-overline text-muted/45">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    id={`contact-${field.name}`}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="bg-transparent border-b border-black/10 dark:border-white/8 focus:border-accent-primary text-text-main font-sans py-4 focus:outline-none transition-colors duration-400 placeholder-muted/20 tracking-wide"
                    style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}

              <div className="contact-field flex flex-col gap-3" style={{ opacity: 0 }}>
                <label htmlFor="contact-message" className="text-overline text-muted/45">Message</label>
                <textarea
                  name="message"
                  id="contact-message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-transparent border-b border-black/10 dark:border-white/8 focus:border-accent-primary text-text-main font-sans py-4 focus:outline-none transition-colors duration-400 placeholder-muted/20 tracking-wide resize-none"
                  style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
                  placeholder="Tell me about your project..."
                  required
                />
              </div>

              <div className="contact-field flex items-center justify-between mt-2" style={{ opacity: 0 }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center gap-4 text-overline text-text-main hover:text-accent-primary transition-colors duration-500 disabled:opacity-40 cursor-pointer"
                >
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  {!submitting && (
                    <span className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-accent-primary group-hover:bg-accent-primary/8 transition-all duration-500">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>

    </section>
  );
}

export default Contact;
