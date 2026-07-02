import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackToTop from '../components/layout/BackToTop';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Education from '../components/sections/Education';
import Experience from '../components/sections/Experience';
import Achievements from '../components/sections/Achievements';
import Certifications from '../components/sections/Certifications';
import Contact from '../components/sections/Contact';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import PortfolioSkeleton from '../components/ui/PortfolioSkeleton';
import PortfolioError from '../components/ui/PortfolioError';

export default function Portfolio() {
  const { isDark } = useTheme();
  const { data, isLoading, error } = usePortfolio();
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['portfolioData'] });
  };

  // While Supabase is fetching — show the full-page skeleton
  if (isLoading) {
    return <PortfolioSkeleton />;
  }

  // If Supabase failed (and we have no cached data) — show the error screen
  if (error || !data) {
    return <PortfolioError onRetry={handleRetry} />;
  }

  // Data successfully loaded — render the real portfolio
  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-900' : 'bg-slate-50'} transition-colors duration-300`}>
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Experience />
        <Achievements />
        <Certifications />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
