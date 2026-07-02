import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionWrapper, SectionHeader } from '../ui';

export default function Education() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const educationList = data.education || [];

  return (
    <SectionWrapper id="education" className={isDark ? 'bg-dark-800/30' : 'bg-slate-100/50'}>
      <SectionHeader
        title="Education"
        subtitle="My academic journey and the institutions that shaped my technical foundation."
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-secondary-500 to-transparent" />

        <div className="space-y-8">
          {educationList.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative pl-20"
            >
              {/* Timeline dot */}
              <div className="absolute left-5 top-5 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 border-2 border-dark-900 shadow-glow flex items-center justify-center z-10">
                <GraduationCap size={12} className="text-white" />
              </div>

              {/* Card */}
              <motion.div
                whileHover={{ x: 4, boxShadow: '0 0 20px rgba(37,99,235,0.2)' }}
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  isDark
                    ? 'bg-dark-800 border-white/10 hover:border-primary-500/40'
                    : 'bg-white border-slate-200 hover:border-primary-300'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {edu.degree}
                    </h3>
                    <p className="text-primary-400 font-semibold">{edu.institution}</p>
                  </div>
                  {edu.current && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Current
                    </span>
                  )}
                </div>

                <div className={`flex flex-wrap gap-4 text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-secondary-400" />
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </span>
                  {edu.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-secondary-400" />
                      {edu.location}
                    </span>
                  )}
                  {edu.cgpa && (
                    <span className="flex items-center gap-1.5">
                      <Award size={14} className="text-yellow-400" />
                      CGPA: <strong className="text-yellow-400">{edu.cgpa}</strong>
                    </span>
                  )}
                </div>

                {edu.description && (
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {edu.description}
                  </p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
