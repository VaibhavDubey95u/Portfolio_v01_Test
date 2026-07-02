import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PortfolioError({ onRetry }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-dark-900' : 'bg-slate-50'
      } transition-colors duration-300`}
      role="alert"
      aria-live="assertive"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`relative z-10 max-w-md w-full mx-4 rounded-3xl p-10 text-center ${
          isDark
            ? 'bg-dark-800/80 border border-white/10 backdrop-blur-xl'
            : 'bg-white border border-slate-200 shadow-xl'
        }`}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <WifiOff size={36} className="text-red-400" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}
        >
          Unable to load portfolio
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`text-sm leading-relaxed mb-8 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Please check your internet connection and try again.
        </motion.p>

        {/* Retry button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          id="portfolio-error-retry"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold rounded-xl shadow-glow hover:shadow-glow-lg hover:from-primary-500 hover:to-secondary-400 transition-all duration-300"
        >
          <RefreshCw size={18} />
          Retry
        </motion.button>
      </motion.div>
    </div>
  );
}
