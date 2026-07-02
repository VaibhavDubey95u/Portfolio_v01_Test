import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Heart } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionWrapper, SectionHeader } from '../ui';

export default function About() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const { about, hero } = data;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <SectionWrapper
      id="about"
      className={isDark ? 'bg-dark-800/30' : 'bg-slate-100/50'}
    >
      <SectionHeader
        title="About Me"
        subtitle="Get to know me — my background, goals, and what drives my passion for technology."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
      >
        {/* Text side */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-primary-400" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Introduction
              </h3>
            </div>
            <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {about?.introduction}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-secondary-400" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Career Goals
              </h3>
            </div>
            <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {about?.careerGoals}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-3">
              <Heart size={18} className="text-accent-400" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Interests
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(about?.interests || []).map((interest, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-300 hover:border-primary-500/50 hover:text-primary-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats side */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Profile card */}
          <div className={`glass-card p-6 space-y-4 ${!isDark && 'glass-card-light'}`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden">
                <img
                  src={hero?.profileImage}
                  alt={hero?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hero?.name || 'Alex')}&background=1e3a8a&color=60a5fa&size=64`;
                  }}
                />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {hero?.name}
                </h3>
                <p className="text-primary-400 text-sm">{hero?.title}</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {data.contact?.location}
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

            <p className={`text-sm italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              "{hero?.tagline}"
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {(about?.stats || []).map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className={`glass-card p-5 text-center cursor-default ${!isDark && 'glass-card-light'}`}
              >
                <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
