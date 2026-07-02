import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionWrapper, SectionHeader, SkillLevel } from '../ui';
import { Code2, Layout, Server, Database, Wrench, Brain } from 'lucide-react';

const ICON_MAP = { Code2, Layout, Server, Database, Wrench, Brain, Tool: Wrench };

const LEVEL_VALUES = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 95 };

function SkillBar({ skill, delay = 0, isDark }) {
  const percentage = skill.percentage || LEVEL_VALUES[skill.level] || 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`p-4 rounded-xl border transition-all duration-200 group hover:border-primary-500/50 ${
        isDark
          ? 'bg-white/5 border-white/10 hover:bg-white/8'
          : 'bg-white border-slate-200 hover:border-primary-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{skill.icon}</span>
          <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {skill.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SkillLevel level={skill.level} />
          <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {percentage}%
          </span>
        </div>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const categories = data.skills?.categories || [];
  const sectionTitle    = data.skills?.title    || 'Skills & Expertise';
  const sectionSubtitle = data.skills?.subtitle || 'A comprehensive overview of my technical skills across various domains.';
  const [activeCategory, setActiveCategory] = useState('all');

  const displayCategories =
    activeCategory === 'all'
      ? categories
      : categories.filter((c) => c.id === activeCategory);

  return (
    <SectionWrapper id="skills">
      <SectionHeader
        title={sectionTitle}
        subtitle={sectionSubtitle}
      />

      {/* Category filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-glow'
              : isDark
              ? 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          All Skills
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-glow'
                : isDark
                ? 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Categories grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {displayCategories.map((category, catIdx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
              className={`glass-card p-6 ${!isDark && 'glass-card-light'}`}
            >
              <div className="mb-6 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600/30 to-secondary-500/30 border border-primary-500/20 flex items-center justify-center text-primary-500">
                    {category.icon && ICON_MAP[category.icon] ? (
                      React.createElement(ICON_MAP[category.icon], { className: "w-5 h-5" })
                    ) : (
                      <span className="text-xl">{category.icon || getCategoryEmoji(category.id)}</span>
                    )}
                  </div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {category.name}
                  </h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {category.skills?.length || 0} skills
                </p>
              </div>

              <div className="space-y-3">
                {(category.skills || []).map((skill, skillIdx) => (
                  <SkillBar
                    key={skill.id}
                    skill={skill}
                    delay={catIdx * 0.05 + skillIdx * 0.05}
                    isDark={isDark}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}

function getCategoryEmoji(id) {
  const emojis = {
    languages: '💻',
    frontend: '🎨',
    backend: '⚙️',
    database: '🗄️',
    tools: '🛠️',
    ml: '🤖',
    mobile: '📱',
    devops: '🚀',
  };
  return emojis[id] || '📦';
}
