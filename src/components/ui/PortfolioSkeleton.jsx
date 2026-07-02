import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/* ─────────────────────────────────────────────
   Reusable shimmer block
───────────────────────────────────────────── */
function Shimmer({ className = '', style }) {
  return (
    <div
      className={`skeleton-shimmer rounded ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────
   Skeleton: Navbar strip
───────────────────────────────────────────── */
function NavbarSkeleton({ isDark }) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 gap-4 ${
        isDark ? 'bg-dark-900/95' : 'bg-white/95'
      }`}
    >
      <Shimmer className="w-8 h-8 rounded-lg" />
      <Shimmer className="w-24 h-5 rounded-md" />
      <div className="hidden lg:flex items-center gap-2 ml-auto mr-4">
        {[60, 48, 52, 64, 70, 76, 82, 44, 60].map((w, i) => (
          <Shimmer key={i} className="h-4 rounded-md" style={{ width: w }} />
        ))}
      </div>
      <div className="flex items-center gap-2 ml-auto lg:ml-0">
        <Shimmer className="w-8 h-8 rounded-lg" />
        <Shimmer className="w-8 h-8 rounded-lg" />
        <Shimmer className="hidden sm:block w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Skeleton: Hero section
───────────────────────────────────────────── */
function HeroSkeleton({ isDark }) {
  return (
    <section
      className={`relative min-h-screen flex items-center overflow-hidden ${
        isDark ? 'bg-dark-900' : 'bg-slate-50'
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          <div className="space-y-6">
            <Shimmer className="w-48 h-8 rounded-full" />
            <Shimmer className="w-20 h-5 rounded-md" />
            <Shimmer className="w-72 h-16 rounded-xl" />
            <Shimmer className="w-56 h-9 rounded-lg" />
            <div className="space-y-3 max-w-lg">
              <Shimmer className="w-full h-4 rounded-md" />
              <Shimmer className="w-5/6 h-4 rounded-md" />
              <Shimmer className="w-4/6 h-4 rounded-md" />
            </div>
            <div className="flex gap-4 flex-wrap">
              <Shimmer className="w-40 h-12 rounded-xl" />
              <Shimmer className="w-36 h-12 rounded-xl" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Shimmer className="w-20 h-4 rounded-md" />
              {[0, 1, 2, 3].map((i) => (
                <Shimmer key={i} className="w-10 h-10 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Shimmer className="w-64 h-64 sm:w-80 sm:h-80 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Generic section wrapper with skeleton header
───────────────────────────────────────────── */
function SectionSkeleton({ isDark, className = '', children }) {
  return (
    <section className={`py-20 relative ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Shimmer className="h-8 rounded-xl mx-auto mb-3" style={{ width: 192 }} />
          <Shimmer className="h-1 rounded-full mx-auto mb-4" style={{ width: 80 }} />
          <Shimmer className="h-4 rounded-md mx-auto" style={{ width: 320 }} />
        </div>
        {children}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Skeleton: About
───────────────────────────────────────────── */
function AboutSkeleton({ isDark }) {
  return (
    <SectionSkeleton
      isDark={isDark}
      className={isDark ? 'bg-dark-800/30' : 'bg-slate-100/50'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-3">
              <Shimmer className="w-36 h-5 rounded-md" />
              <Shimmer className="w-full h-4 rounded-md" />
              <Shimmer className="w-5/6 h-4 rounded-md" />
              <Shimmer className="w-4/6 h-4 rounded-md" />
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            {[80, 96, 72, 88, 64, 104, 76].map((w, i) => (
              <Shimmer key={i} className="h-8 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Shimmer className="h-28 rounded-2xl w-full" />
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Shimmer key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </SectionSkeleton>
  );
}

/* ─────────────────────────────────────────────
   Skeleton: Skills
───────────────────────────────────────────── */
function SkillsSkeleton({ isDark }) {
  return (
    <SectionSkeleton isDark={isDark}>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {[80, 72, 88, 96, 76, 84].map((w, i) => (
          <Shimmer key={i} className="h-9 rounded-xl" style={{ width: w }} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[0, 1, 2, 3].map((ci) => (
          <div
            key={ci}
            className={`rounded-2xl p-6 ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'
            }`}
          >
            <div className="mb-6 flex items-center gap-3">
              <Shimmer className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Shimmer className="w-32 h-5 rounded-md" />
                <Shimmer className="w-20 h-3 rounded-md" />
              </div>
            </div>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((si) => (
                <div
                  key={si}
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <Shimmer className="w-28 h-4 rounded-md" />
                    <Shimmer className="w-16 h-4 rounded-md" />
                  </div>
                  <Shimmer className="w-full h-2 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

/* ─────────────────────────────────────────────
   Skeleton: Projects
───────────────────────────────────────────── */
function ProjectsSkeleton({ isDark }) {
  return (
    <SectionSkeleton
      isDark={isDark}
      className={isDark ? 'bg-dark-800/30' : 'bg-slate-100/50'}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`rounded-2xl overflow-hidden ${
              isDark ? 'bg-dark-800 border border-white/10' : 'bg-white border border-slate-200'
            }`}
          >
            <Shimmer className="w-full h-44" style={{ borderRadius: 0 }} />
            <div className="p-5 space-y-3">
              <Shimmer className="w-3/4 h-5 rounded-md" />
              <Shimmer className="w-full h-4 rounded-md" />
              <Shimmer className="w-5/6 h-4 rounded-md" />
              <div className="flex flex-wrap gap-2 pt-1">
                {[60, 72, 56, 80].map((w, ti) => (
                  <Shimmer key={ti} className="h-6 rounded-full" style={{ width: w }} />
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Shimmer className="w-24 h-8 rounded-lg" />
                <Shimmer className="w-24 h-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

/* ─────────────────────────────────────────────
   Skeleton: Timeline (Education / Experience)
───────────────────────────────────────────── */
function TimelineSkeleton({ isDark, className = '' }) {
  return (
    <SectionSkeleton isDark={isDark} className={className}>
      <div className="relative">
        <div
          className={`absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 ${
            isDark ? 'bg-white/10' : 'bg-slate-200'
          }`}
          aria-hidden="true"
        />
        <div className="space-y-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex items-start pl-12 sm:pl-0">
              <div className="absolute left-2 sm:left-1/2 sm:-translate-x-1/2 top-4">
                <Shimmer className="w-4 h-4 rounded-full" />
              </div>
              <div
                className={`sm:w-5/12 rounded-2xl p-5 space-y-3 ${
                  isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'
                } ${i % 2 === 0 ? 'sm:ml-auto sm:mr-[calc(50%+1.5rem)]' : 'sm:ml-[calc(50%+1.5rem)]'}`}
              >
                <Shimmer className="w-40 h-5 rounded-md" />
                <Shimmer className="w-32 h-4 rounded-md" />
                <Shimmer className="w-24 h-3 rounded-md" />
                <Shimmer className="w-full h-4 rounded-md" />
                <Shimmer className="w-4/5 h-4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionSkeleton>
  );
}

/* ─────────────────────────────────────────────
   Skeleton: Card grid (Achievements / Certifications)
───────────────────────────────────────────── */
function CardGridSkeleton({ isDark, className = '' }) {
  return (
    <SectionSkeleton isDark={isDark} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 space-y-3 ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'
            }`}
          >
            <Shimmer className="w-12 h-12 rounded-xl" />
            <Shimmer className="w-3/4 h-5 rounded-md" />
            <Shimmer className="w-full h-4 rounded-md" />
            <Shimmer className="w-5/6 h-4 rounded-md" />
            <Shimmer className="w-24 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

/* ─────────────────────────────────────────────
   Skeleton: Contact
───────────────────────────────────────────── */
function ContactSkeleton({ isDark }) {
  return (
    <SectionSkeleton isDark={isDark}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <Shimmer className="w-full h-4 rounded-md" />
            <Shimmer className="w-5/6 h-4 rounded-md" />
          </div>
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Shimmer className="w-12 h-12 rounded-xl flex-shrink-0" />
                <div className="space-y-2">
                  <Shimmer className="w-16 h-3 rounded-md" />
                  <Shimmer className="w-36 h-4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`rounded-2xl p-6 space-y-5 ${
            isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'
          }`}
        >
          <div className="grid grid-cols-2 gap-4">
            <Shimmer className="h-12 rounded-xl" />
            <Shimmer className="h-12 rounded-xl" />
          </div>
          <Shimmer className="h-12 rounded-xl w-full" />
          <Shimmer className="h-32 rounded-xl w-full" />
          <Shimmer className="h-12 rounded-xl w-36" />
        </div>
      </div>
    </SectionSkeleton>
  );
}

/* ─────────────────────────────────────────────
   Skeleton: Footer
───────────────────────────────────────────── */
function FooterSkeleton({ isDark }) {
  return (
    <footer
      className={`py-8 border-t ${
        isDark ? 'border-white/10 bg-dark-900' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Shimmer className="w-40 h-4 rounded-md" />
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <Shimmer key={i} className="w-8 h-8 rounded-lg" />
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   Root export: PortfolioSkeleton
───────────────────────────────────────────── */
export default function PortfolioSkeleton() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-dark-900' : 'bg-slate-50'} transition-colors duration-300`}
      aria-label="Loading portfolio content"
      aria-busy="true"
    >
      <NavbarSkeleton isDark={isDark} />

      <main>
        <HeroSkeleton isDark={isDark} />
        <AboutSkeleton isDark={isDark} />
        <SkillsSkeleton isDark={isDark} />
        <ProjectsSkeleton isDark={isDark} />
        <TimelineSkeleton isDark={isDark} />
        <TimelineSkeleton
          isDark={isDark}
          className={isDark ? 'bg-dark-800/30' : 'bg-slate-100/50'}
        />
        <CardGridSkeleton isDark={isDark} />
        <CardGridSkeleton
          isDark={isDark}
          className={isDark ? 'bg-dark-800/30' : 'bg-slate-100/50'}
        />
        <ContactSkeleton isDark={isDark} />
      </main>

      <FooterSkeleton isDark={isDark} />
    </div>
  );
}
