import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScrollPosition } from '../../hooks';

export default function BackToTop() {
  const scrollY = useScrollPosition();
  const isVisible = scrollY > 400;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={scrollToTop}
          id="back-to-top"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow flex items-center justify-center hover:shadow-glow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
          aria-label="Back to top"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowUp size={20} />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
