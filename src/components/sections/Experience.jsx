import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionWrapper, SectionHeader } from '../ui';

export default function Experience() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const experienceList = data.experience || [];

  const typeColors = {
    Internship: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Research: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Academic: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Full-time': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  };

  return (
    <SectionWrapper id="experience">
      <SectionHeader
        title="Experience"
        subtitle="Professional experiences, internships, and research roles that shaped my skills."
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-secondary-500 via-primary-500 to-transparent" />

        <div className="space-y-8">
          {experienceList.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative pl-20"
            >
              {/* Timeline dot */}
              <div className="absolute left-5 top-5 w-6 h-6 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 border-2 border-dark-900 shadow-glow-cyan flex items-center justify-center z-10">
                <Briefcase size={12} className="text-white" />
              </div>

              {/* Connector line to card */}
              <div className="absolute left-11 top-[22px] w-8 h-px bg-gradient-to-r from-secondary-500/50 to-transparent" />

              {/* Card */}
              <motion.div
                whileHover={{ x: 4, boxShadow: '0 0 20px rgba(6,182,212,0.15)' }}
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  isDark
                    ? 'bg-dark-800 border-white/10 hover:border-secondary-500/40'
                    : 'bg-white border-slate-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{exp.companyLogo}</span>
                    <div>
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {exp.role}
                      </h3>
                      <p className="text-secondary-400 font-semibold">{exp.company}</p>
                    </div>
                  </div>
                  {exp.type && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      typeColors[exp.type] || typeColors.Internship
                    }`}>
                      {exp.type}
                    </span>
                  )}
                </div>

                <div className={`flex flex-wrap gap-4 text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary-400" />
                    {exp.duration}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary-400" />
                      {exp.location}
                    </span>
                  )}
                </div>

                <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {exp.description}
                </p>

                {/* Technologies */}
                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                          isDark
                            ? 'bg-primary-600/15 text-primary-300 border border-primary-500/20'
                            : 'bg-primary-50 text-primary-700 border border-primary-200'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
