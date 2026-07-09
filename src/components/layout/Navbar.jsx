import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Download, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useScrollPosition, useActiveSection } from '../../hooks';
import { scrollToSection } from '../../utils/helpers';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'certifications', label: 'Certs' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { data } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);

  // ----------
  const [viewportTop, setViewportTop] = useState(0);

  // -------------
  const scrollY = useScrollPosition();
  const activeSection = useActiveSection(NAV_ITEMS.map((n) => n.id));
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const isScrolled = scrollY > 20;

  // new line
  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return;

    const update = () => {
        setViewportTop(viewport.offsetTop);
    };

    update();

    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
        viewport.removeEventListener("resize", update);
        viewport.removeEventListener("scroll", update);
    };
}, []);

  // ----------

  const handleNavClick = (id) => {
    setTimeout(() => {
      if (!isHomePage) {
        window.location.href = `/#${id}`;
        return;
      }
      scrollToSection(id);
      setIsOpen(false);
    }, 120);
  };

  return (
    <>
      <nav className="fixed inset-x-0 z-50"   style={{ top: viewportTop }}>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`w-full transition-all duration-300 pt-[env(safe-area-inset-top)] ${
            isScrolled
              ? isDark
                ? 'bg-dark-900/95 backdrop-blur-xl border-b border-white/10 shadow-glass'
                : 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
              : 'bg-transparent'
          }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ filter: isDark ? 'brightness(1.2)' : 'brightness(0.8)' }}
              transition={{ duration: 0.08 }}
              onClick={() => handleNavClick('hero')}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-sm">
                  {data.hero?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {data.hero?.name?.split(' ')[0] || 'Portfolio'}
              </span>
            </motion.button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <motion.button
                  whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
                  transition={{ duration: 0.08 }}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-${item.id}`}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
                    activeSection === item.id && isHomePage
                      ? isDark
                        ? 'text-white bg-white/10'
                        : 'text-primary-600 bg-primary-50'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && isHomePage && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                transition={{ duration: 0.08 }}
                onClick={toggleTheme}
                id="theme-toggle"
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDark ? 'moon' : 'sun'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Admin Link */}
              <Link to="/admin">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                  id="admin-link"
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/10'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-label="Admin panel"
                >
                  <Settings size={18} />
                </motion.button>
              </Link>

              {/* Resume Button */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
                transition={{ duration: 0.08 }}
                href={data.hero?.resumeLink || '/resume.pdf'}
                download
                id="download-resume"
                className="hidden sm:flex items-center gap-2 btn-primary text-sm py-2 px-4"
              >
                <Download size={14} />
                Resume
              </motion.a>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
                transition={{ duration: 0.08 }}
                onClick={() => setIsOpen(!isOpen)}
                id="mobile-menu-toggle"
                className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isOpen ? 'x' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed top-0 right-0 bottom-0 z-50 w-72 lg:hidden ${
                isDark ? 'bg-dark-800 border-l border-white/10' : 'bg-white border-l border-slate-200'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Navigation
                  </span>
                  <motion.button onClick={() => setIsOpen(false)} whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }} transition={{ duration: 0.08 }} aria-label="Close menu">
                    <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                  </motion.button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {NAV_ITEMS.map((item, i) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 , duration: 0.08 }}
                      whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        activeSection === item.id && isHomePage
                          ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                          : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-white/10'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-3">
                  <motion.a
                    href={data.hero?.resumeLink || '/resume.pdf'}
                    download
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                    whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
                    transition={{ duration: 0.08 }}
                  >
                    <Download size={14} />
                    Download Resume
                  </motion.a>
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <motion.button className="btn-outline w-full flex items-center justify-center gap-2 text-sm" whileTap={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} type="button">
                      <Settings size={14} />
                      Admin Panel
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
