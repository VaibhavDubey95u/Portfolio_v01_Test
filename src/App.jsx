import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';
import ResetPassword from './pages/ResetPassword';

function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="loading-logo"
      >
        {'<Portfolio />'}
      </motion.div>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ color: '#475569', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}
      >
        Loading awesome stuff...
      </motion.p>
    </motion.div>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1E293B' : '#fff',
            color: isDark ? '#F1F5F9' : '#0F172A',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: { primary: '#2563EB', secondary: '#fff' },
          },
        }}
      />

      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen key="loading" onDone={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <Router>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PortfolioProvider>
          <AppContent />
        </PortfolioProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
