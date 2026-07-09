import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Shield, Hash } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionWrapper, SectionHeader } from '../ui';

export default function Certifications() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const certifications = data.certifications || [];

  return (
    <SectionWrapper id="certifications">
      <SectionHeader
        title="Certifications"
        subtitle="Professional certifications demonstrating my commitment to continuous learning."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
              isDark
                ? 'bg-dark-800 border-white/10 hover:border-accent-400/40 hover:shadow-glow'
                : 'bg-white border-slate-200 hover:border-accent-400/60 hover:shadow-lg'
            }`}
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-bl-3xl" />

            <div className="p-6">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600/30 to-secondary-500/30 border border-primary-500/20 flex items-center justify-center text-3xl">
                  {cert.badge}
                </div>
                <div className="flex flex-col gap-1">
                  <Shield size={16} className="text-emerald-400" />
                  <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-medium`}>
                    Verified
                  </span>
                </div>
              </div>

              <h3 className={`font-bold text-sm mb-1 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {cert.name}
              </h3>
              <p className="text-primary-400 text-sm font-medium mb-3">{cert.issuer}</p>

              <div className={`space-y-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  Issued: {cert.issueDate}
                  {cert.expiryDate && ` · Expires: ${cert.expiryDate}`}
                </span>
                {cert.credentialId && (
                  <span className="flex items-center gap-1.5">
                    <Hash size={11} />
                    <span className="font-mono">{cert.credentialId}</span>
                  </span>
                )}
              </div>

              {cert.certificateUrl && (
                <motion.a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ filter: isDark ? 'brightness(1.2)' : 'brightness(0.8)', transition: { duration: 0.08, delay: 0 } }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTimeout(() => window.open(cert.certificateUrl, '_blank'), 120);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors group relative before:absolute before:-inset-2 before:content-['']"
                >
                  View Certificate
                  <ExternalLink
                    size={11}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </motion.a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
