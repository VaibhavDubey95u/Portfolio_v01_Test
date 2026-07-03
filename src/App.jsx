import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';
import ResetPassword from './pages/ResetPassword';
import IntroLoader from './components/ui/IntroLoader';

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
          <IntroLoader key="intro" onDone={() => setLoading(false)} />
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
