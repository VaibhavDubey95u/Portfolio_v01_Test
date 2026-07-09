import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionWrapper, SectionHeader } from '../ui';

const CATEGORY_COLORS = {
  Hackathon: 'from-yellow-500 to-orange-500',
  'Open Source': 'from-emerald-500 to-teal-500',
  'Competitive Programming': 'from-purple-500 to-pink-500',
  Academic: 'from-blue-500 to-cyan-500',
  Research: 'from-indigo-500 to-violet-500',
};

export default function Achievements() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const achievements = data.achievements || [];

  return (
    <SectionWrapper id="achievements" className={isDark ? 'bg-dark-800/20' : 'bg-slate-100/30'}>
      <SectionHeader
        title="Achievements"
        subtitle="Milestones, awards, and recognition that highlight my journey."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, i) => {
          const gradientClass = CATEGORY_COLORS[achievement.category] || 'from-primary-500 to-secondary-500';
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl border overflow-hidden transition-all duration-300 group ${
                isDark
                  ? 'bg-dark-800 border-white/10 hover:border-primary-500/40 hover:shadow-glow'
                  : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-lg'
              }`}
            >
              {/* Gradient top bar */}
              <div className={`h-1 bg-gradient-to-r ${gradientClass}`} />

              <div className="p-6">
                {/* Icon & category */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-2xl shadow-lg`}>
                    {achievement.icon}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                    isDark
                      ? 'bg-white/10 border-white/10 text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    {achievement.category}
                  </span>
                </div>

                <h3 className={`font-bold text-base mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {achievement.title}
                </h3>

                <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Calendar size={12} />
                    {achievement.date}
                  </span>
                  {achievement.certificateLink && (
                    <motion.a
                      href={achievement.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ filter: isDark ? 'brightness(1.2)' : 'brightness(0.8)', transition: { duration: 0.08, delay: 0 } }}
                      onClick={(e) => {
                        e.preventDefault();
                        setTimeout(() => window.open(achievement.certificateLink, '_blank'), 150);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium relative before:absolute before:-inset-2 before:content-['']"
                    >
                      View <ExternalLink size={11} />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
