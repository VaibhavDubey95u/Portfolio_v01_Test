import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronDown, Github, Linkedin, Twitter, Mail, Globe, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { useTypingEffect } from '../../hooks';
import { scrollToSection } from '../../utils/helpers';

const SOCIAL_ICONS = {
  github: { icon: Github, label: 'GitHub' },
  linkedin: { icon: Linkedin, label: 'LinkedIn' },
  twitter: { icon: Twitter, label: 'Twitter' },
  email: { icon: Mail, label: 'Email', prefix: 'mailto:' },
  website: { icon: Globe, label: 'Website' },
};

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        particles.forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      id="particles-canvas"
    />
  );
}

export default function Hero() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const { hero } = data;
  const typingText = useTypingEffect(hero?.typingTexts || [hero?.title || ''], 80, 2000);

  const socialEntries = Object.entries(hero?.socialLinks || {}).filter(([, v]) => v);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section
      id="hero"
      className={`relative min-h-screen flex items-center overflow-hidden ${
        isDark ? 'bg-dark-900' : 'bg-slate-50'
      }`}
    >
      {/* Particle background */}
      <ParticleCanvas />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            {/* Name */}
            <motion.div variants={itemVariants}>
              <p className={`text-lg font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Hi, I'm
              </p>
              <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {hero?.name || 'Your Name'}
              </h1>
            </motion.div>

            {/* Typing text */}
            <motion.div variants={itemVariants} className="h-10">
              <div className="flex items-center gap-2">
                <span className="text-2xl text-primary-400">{'<'}</span>
                <span className="text-xl sm:text-2xl font-semibold gradient-text typing-cursor">
                  {typingText}
                </span>
                <span className="text-2xl text-primary-400">{'/>'}</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className={`text-base sm:text-lg leading-relaxed max-w-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {hero?.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.a
                href={hero?.resumeLink || '#'}
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
                transition={{ duration: 0.08 }}
                className={`btn-primary flex items-center gap-2 ${!hero?.resumeLink ? 'opacity-50 pointer-events-none' : ''}`}
                id="hero-download-resume"
              >
                <Download size={18} />
                Download Resume
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
                transition={{ duration: 0.08 }}
                onClick={() => setTimeout(() => scrollToSection('projects'), 120)}
                className="btn-outline flex items-center gap-2"
                id="hero-view-projects"
              >
                View Projects
                <ExternalLink size={16} />
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 pt-2">
              <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Find me on:
              </span>
              <div className="flex gap-3">
                {socialEntries.map(([key, href]) => {
                  const social = SOCIAL_ICONS[key];
                  if (!social) return null;
                  const { icon: Icon, label, prefix = '' } = social;
                  return (
                    <motion.a
                      key={key}
                      href={`${prefix}${href}`}
                      target={key !== 'email' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -3 }}
                      whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
                      transition={{ duration: 0.08 }}
                      onClick={(e) => {
                        e.preventDefault();
                        setTimeout(() => {
                          if (key !== 'email') window.open(`${prefix}${href}`, '_blank');
                          else window.location.href = `${prefix}${href}`;
                        }, 120);
                      }}
                      className={`p-2.5 rounded-xl transition-all duration-200 ${
                        isDark
                          ? 'bg-white/10 text-slate-400 hover:text-white hover:bg-primary-600/30 hover:shadow-glow'
                          : 'bg-slate-100 text-slate-500 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                      aria-label={label}
                      id={`hero-social-${key}`}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: 'spring', damping: 20 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-500/30 animate-spin-slow" style={{ margin: '-12px' }} />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-secondary-500/20 animate-spin-slow" style={{ margin: '-24px', animationDirection: 'reverse' }} />

              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/30 to-secondary-500/30 blur-2xl" />

              {/* Image */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden glow-ring"
              >
                {/* Initials fallback — always rendered BEHIND the photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-secondary-800 flex items-center justify-center">
                  <span className="text-8xl font-black text-white/30 select-none">
                    {(hero?.name || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* User photo — absolute on top, only when available */}
                {hero?.profileImage && (
                  <img
                    src={hero.profileImage}
                    alt={hero.name || 'Profile'}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: hero.imagePosition || 'center center' }}
                  />
                )}
              </motion.div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-glow"
              >
                🚀 Open to Work
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-card px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                💻 {data.about?.stats?.[0]?.value || '25+'} Projects
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={(e) => {
            // Need to apply delay manually because it's a div
            setTimeout(() => scrollToSection('about'), 120);
          }}
        >
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Scroll down
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={20} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
