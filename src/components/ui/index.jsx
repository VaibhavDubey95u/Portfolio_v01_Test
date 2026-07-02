import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export function SectionWrapper({ id, children, className = '' }) {
  const { isDark } = useTheme();

  return (
    <section id={id} className={`py-20 relative ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({ title, subtitle, align = 'center' }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <h2 className="section-title inline-block">{title}</h2>
      <div className={`h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-2 mb-4 ${align === 'center' ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className={`text-sm md:text-base max-w-xl ${align === 'center' ? 'mx-auto' : ''} ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function TagBadge({ children, className = '' }) {
  return (
    <span className={`tag-badge ${className}`}>
      {children}
    </span>
  );
}

export function SkillLevel({ level }) {
  const colors = {
    Beginner: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Expert: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
        colors[level] || colors.Intermediate
      }`}
    >
      {level}
    </span>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-primary-600 border-t-transparent rounded-full animate-spin`} />
  );
}
