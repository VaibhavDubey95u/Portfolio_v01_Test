import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScrollPosition } from '../../hooks';

export default function BackToTop() {
  const scrollY = useScrollPosition();
  const isVisible = scrollY > 400;

  const scrollToTop = () => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 120); // 100–150ms
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', damping: 20 , stiffness: 500 , mass:0.6}}
          onClick={scrollToTop}
          id="back-to-top"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow flex items-center justify-center hover:shadow-glow-lg active:scale-95 transition-transform duration-200"
          aria-label="Back to top"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.88,  y: 2, opacity: 0.85 }}
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
