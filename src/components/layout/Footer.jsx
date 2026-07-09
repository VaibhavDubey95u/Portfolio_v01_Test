import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Twitter, Mail, Code2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { scrollToSection } from '../../utils/helpers';

const FOOTER_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: data.contact?.github, label: 'GitHub' },
    { icon: Linkedin, href: data.contact?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: data.contact?.twitter, label: 'Twitter' },
    { icon: Mail, href: `mailto:${data.contact?.email}`, label: 'Email' },
  ].filter((s) => s.href);

  return (
    <footer
      className={`relative border-t ${
        isDark ? 'border-white/10 bg-dark-900' : 'border-slate-200 bg-slate-50'
      }`}
    >
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Code2 size={16} className="text-white" />
              </div>
              <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {data.hero?.name || 'Portfolio'}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {data.hero?.tagline || 'Building tomorrow\'s software, today.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  <motion.button
                    whileTap={{ filter: isDark ? 'brightness(1.2)' : 'brightness(0.8)' }}
                    transition={{ duration: 0.08 }}
                    onClick={() => setTimeout(() => scrollToSection(link.id), 120)}
                    className={`text-sm transition-colors duration-200 ${
                      isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Connect
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                  transition={{ duration: 0.08 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTimeout(() => window.open(href, '_blank'), 120);
                  }}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDark
                      ? 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/20'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            © {currentYear} {data.hero?.name || 'Portfolio'}. All rights reserved.
          </p>
          <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Made with{' '}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart size={14} className="text-red-500 fill-red-500" />
            </motion.span>{' '}
            and React
          </p>
        </div>
      </div>
    </footer>
  );
}
