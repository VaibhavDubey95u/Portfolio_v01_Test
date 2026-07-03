import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/* ─────────────────────────────────────────────────────────────────
   DURATION — single source of truth
───────────────────────────────────────────────────────────────── */
const INTRO_MS = 3800;

/* ─────────────────────────────────────────────────────────────────
   STATUS MESSAGES
───────────────────────────────────────────────────────────────── */
const STATUS = [
  'Loading awesome stuff...',
  'Compiling React...',
  'Initializing Portfolio...',
  'Connecting Database...',
  'Loading Projects...',
  'Preparing Experience...',
  'Optimizing Assets...',
  'Finalizing UI...',
  'Almost Ready...',
];

/* ─────────────────────────────────────────────────────────────────
   TOKEN COLOR PALETTE  (VS Code Material Theme Palenight)
───────────────────────────────────────────────────────────────── */
const C = {
  kw:  '#C792EA', // keyword         purple
  str: '#C3E88D', // string          green
  fn:  '#82AAFF', // function/var    blue
  ty:  '#FFCB6B', // type            yellow
  op:  '#89DDFF', // operator/punct  cyan
  pr:  '#F78C6C', // property/env    orange
  tag: '#F07178', // JSX tag / bool  red
  cm:  '#546E7A', // comment         slate
  pl:  '#CDD3DE', // plain text      light
  nu:  '#F78C6C', // number          orange
};

/* ─────────────────────────────────────────────────────────────────
   CODE LINES  — 80 realistic lines with contextual pausing hints
   Each line may carry { pause: ms } to add a delay after the line
   completes (simulates thinking / end-of-block hesitation).
───────────────────────────────────────────────────────────────── */
const CODE_LINES = [
  // ── file header comment
  { tokens: [{ t: '// portfolio/src/pages/Portfolio.tsx', c: C.cm }], pause: 120 },
  { tokens: [{ t: '// Full-stack portfolio — React + TypeScript + Supabase', c: C.cm }], pause: 200 },
  { tokens: [] },

  // ── imports
  { tokens: [{ t: 'import', c: C.kw }, { t: ' React, { useState, useEffect, useCallback, useMemo }', c: C.pl }, { t: ' from ', c: C.kw }, { t: "'react'", c: C.str }, { t: ';', c: C.pl }], pause: 60 },
  { tokens: [{ t: 'import', c: C.kw }, { t: ' { motion, AnimatePresence, useScroll }', c: C.pl }, { t: ' from ', c: C.kw }, { t: "'framer-motion'", c: C.str }, { t: ';', c: C.pl }], pause: 60 },
  { tokens: [{ t: 'import', c: C.kw }, { t: ' { createClient, SupabaseClient }', c: C.pl }, { t: ' from ', c: C.kw }, { t: "'@supabase/supabase-js'", c: C.str }, { t: ';', c: C.pl }], pause: 60 },
  { tokens: [{ t: 'import', c: C.kw }, { t: ' { useQuery, useQueryClient }', c: C.pl }, { t: ' from ', c: C.kw }, { t: "'@tanstack/react-query'", c: C.str }, { t: ';', c: C.pl }], pause: 180 },
  { tokens: [] },

  // ── Supabase client
  { tokens: [{ t: '// ── Supabase client', c: C.cm }] },
  { tokens: [{ t: 'const', c: C.kw }, { t: ' supabase', c: C.fn }, { t: ': ', c: C.op }, { t: 'SupabaseClient', c: C.ty }, { t: ' = ', c: C.op }, { t: 'createClient', c: C.fn }, { t: '(', c: C.pl }] },
  { tokens: [{ t: '  import.meta.env.', c: C.pl }, { t: 'VITE_SUPABASE_URL', c: C.pr }, { t: ',', c: C.pl }] },
  { tokens: [{ t: '  import.meta.env.', c: C.pl }, { t: 'VITE_SUPABASE_ANON_KEY', c: C.pr }] },
  { tokens: [{ t: ');', c: C.pl }], pause: 200 },
  { tokens: [] },

  // ── TypeScript interfaces
  { tokens: [{ t: '// ── Data types', c: C.cm }] },
  { tokens: [{ t: 'interface', c: C.kw }, { t: ' Project', c: C.ty }, { t: ' {', c: C.pl }] },
  { tokens: [{ t: '  id', c: C.pr }, { t: ': ', c: C.op }, { t: 'string', c: C.ty }, { t: ';', c: C.pl }] },
  { tokens: [{ t: '  title', c: C.pr }, { t: ': ', c: C.op }, { t: 'string', c: C.ty }, { t: ';', c: C.pl }] },
  { tokens: [{ t: '  description', c: C.pr }, { t: ': ', c: C.op }, { t: 'string', c: C.ty }, { t: ';', c: C.pl }] },
  { tokens: [{ t: '  tech_stack', c: C.pr }, { t: ': ', c: C.op }, { t: 'string', c: C.ty }, { t: '[];', c: C.pl }] },
  { tokens: [{ t: '  live_url', c: C.pr }, { t: '?: ', c: C.op }, { t: 'string', c: C.ty }, { t: ';', c: C.pl }] },
  { tokens: [{ t: '  github_url', c: C.pr }, { t: '?: ', c: C.op }, { t: 'string', c: C.ty }, { t: ';', c: C.pl }] },
  { tokens: [{ t: '  featured', c: C.pr }, { t: ': ', c: C.op }, { t: 'boolean', c: C.ty }, { t: ';', c: C.pl }] },
  { tokens: [{ t: '  order_index', c: C.pr }, { t: ': ', c: C.op }, { t: 'number', c: C.ty }, { t: ';', c: C.pl }] },
  { tokens: [{ t: '}', c: C.pl }], pause: 160 },
  { tokens: [] },

  // ── API query function
  { tokens: [{ t: 'async function', c: C.kw }, { t: ' fetchProjects', c: C.fn }, { t: '(): ', c: C.pl }, { t: 'Promise', c: C.ty }, { t: '<', c: C.op }, { t: 'Project', c: C.ty }, { t: '[]> {', c: C.op }] },
  { tokens: [{ t: '  const', c: C.kw }, { t: ' { data, error }', c: C.pl }, { t: ' = await ', c: C.op }, { t: 'supabase', c: C.fn }] },
  { tokens: [{ t: '    .from', c: C.fn }, { t: '<', c: C.op }, { t: 'Project', c: C.ty }, { t: ">('projects')", c: C.op }] },
  { tokens: [{ t: '    .select', c: C.fn }, { t: "('*')", c: C.op }] },
  { tokens: [{ t: '    .eq', c: C.fn }, { t: "('published', ", c: C.op }, { t: 'true', c: C.tag }, { t: ')', c: C.op }] },
  { tokens: [{ t: '    .order', c: C.fn }, { t: "('order_index', { ascending: ", c: C.op }, { t: 'true', c: C.tag }, { t: ' })', c: C.op }] },
  { tokens: [{ t: '    .limit', c: C.fn }, { t: '(', c: C.op }, { t: '20', c: C.nu }, { t: ');', c: C.pl }] },
  { tokens: [] },
  { tokens: [{ t: '  if', c: C.kw }, { t: ' (error)', c: C.pl }, { t: ' throw', c: C.kw }, { t: ' new ', c: C.kw }, { t: 'Error', c: C.ty }, { t: '(error.message);', c: C.pl }] },
  { tokens: [{ t: '  return', c: C.kw }, { t: ' data ', c: C.pl }, { t: '??', c: C.op }, { t: ' [];', c: C.pl }] },
  { tokens: [{ t: '}', c: C.pl }], pause: 280 },
  { tokens: [] },

  // ── Custom hook
  { tokens: [{ t: '// ── Custom data hook', c: C.cm }] },
  { tokens: [{ t: 'function', c: C.kw }, { t: ' useProjects', c: C.fn }, { t: '(filter: ', c: C.pl }, { t: 'string', c: C.ty }, { t: ') {', c: C.pl }] },
  { tokens: [{ t: '  const', c: C.kw }, { t: ' queryClient', c: C.fn }, { t: ' = ', c: C.op }, { t: 'useQueryClient', c: C.fn }, { t: '();', c: C.pl }] },
  { tokens: [] },
  { tokens: [{ t: '  const', c: C.kw }, { t: ' { data: projects ', c: C.pl }, { t: '= ', c: C.op }, { t: '[]', c: C.pl }, { t: ', isLoading }', c: C.pl }, { t: ' = ', c: C.op }, { t: 'useQuery', c: C.fn }, { t: '({', c: C.pl }] },
  { tokens: [{ t: "    queryKey: [", c: C.pl }, { t: "'projects'", c: C.str }, { t: '],', c: C.pl }] },
  { tokens: [{ t: '    queryFn:', c: C.pl }, { t: ' fetchProjects', c: C.fn }, { t: ',', c: C.pl }] },
  { tokens: [{ t: '    staleTime: ', c: C.pl }, { t: '1000', c: C.nu }, { t: ' * ', c: C.op }, { t: '60', c: C.nu }, { t: ' * ', c: C.op }, { t: '5', c: C.nu }, { t: ',', c: C.pl }] },
  { tokens: [{ t: '    gcTime: ', c: C.pl }, { t: '1000', c: C.nu }, { t: ' * ', c: C.op }, { t: '60', c: C.nu }, { t: ' * ', c: C.op }, { t: '10', c: C.nu }, { t: ',', c: C.pl }] },
  { tokens: [{ t: '  });', c: C.pl }] },
  { tokens: [] },
  { tokens: [{ t: '  const', c: C.kw }, { t: ' filtered', c: C.fn }, { t: ' = ', c: C.op }, { t: 'useMemo', c: C.fn }, { t: '(() => {', c: C.pl }] },
  { tokens: [{ t: "    if (filter === ", c: C.pl }, { t: "'all'", c: C.str }, { t: ') return projects;', c: C.pl }] },
  { tokens: [{ t: '    return projects.filter(p =>', c: C.pl }] },
  { tokens: [{ t: '      p.tech_stack.includes(filter)', c: C.pl }] },
  { tokens: [{ t: '    );', c: C.pl }] },
  { tokens: [{ t: '  }, [projects, filter]);', c: C.pl }], pause: 180 },
  { tokens: [] },
  { tokens: [{ t: '  return', c: C.kw }, { t: ' { filtered, isLoading };', c: C.pl }] },
  { tokens: [{ t: '}', c: C.pl }], pause: 300 },
  { tokens: [] },

  // ── Main component
  { tokens: [{ t: '// ── Main portfolio page', c: C.cm }] },
  { tokens: [{ t: 'export default function', c: C.kw }, { t: ' Portfolio', c: C.fn }, { t: '() {', c: C.pl }] },
  { tokens: [{ t: "  const [filter, setFilter]", c: C.pl }, { t: ' = ', c: C.op }, { t: 'useState', c: C.fn }, { t: '<', c: C.op }, { t: 'string', c: C.ty }, { t: ">('all');", c: C.pl }] },
  { tokens: [{ t: '  const { filtered, isLoading }', c: C.pl }, { t: ' = ', c: C.op }, { t: 'useProjects', c: C.fn }, { t: '(filter);', c: C.pl }] },
  { tokens: [{ t: '  const { scrollY }', c: C.pl }, { t: ' = ', c: C.op }, { t: 'useScroll', c: C.fn }, { t: '();', c: C.pl }] },
  { tokens: [] },
  { tokens: [{ t: '  const', c: C.kw }, { t: ' handleFilter', c: C.fn }, { t: ' = ', c: C.op }, { t: 'useCallback', c: C.fn }, { t: '(', c: C.pl }] },
  { tokens: [{ t: '    (tech: ', c: C.pl }, { t: 'string', c: C.ty }, { t: ') => setFilter(tech),', c: C.pl }] },
  { tokens: [{ t: '    []', c: C.pl }] },
  { tokens: [{ t: '  );', c: C.pl }], pause: 160 },
  { tokens: [] },
  { tokens: [{ t: '  return', c: C.kw }, { t: ' (', c: C.pl }], pause: 120 },
  { tokens: [{ t: '    <', c: C.op }, { t: 'main', c: C.tag }, { t: ' className', c: C.kw }, { t: '=', c: C.op }, { t: '"portfolio-root"', c: C.str }, { t: '>', c: C.op }] },
  { tokens: [{ t: '      <', c: C.op }, { t: 'Hero', c: C.ty }, { t: ' />', c: C.op }] },
  { tokens: [{ t: '      <', c: C.op }, { t: 'About', c: C.ty }, { t: ' />', c: C.op }] },
  { tokens: [{ t: '      <', c: C.op }, { t: 'Skills', c: C.ty }, { t: ' />', c: C.op }] },
  { tokens: [{ t: '      <', c: C.op }, { t: 'ProjectGrid', c: C.ty }] },
  { tokens: [{ t: '        data', c: C.kw }, { t: '=', c: C.op }, { t: '{filtered}', c: C.pl }] },
  { tokens: [{ t: '        onFilter', c: C.kw }, { t: '=', c: C.op }, { t: '{handleFilter}', c: C.pl }] },
  { tokens: [{ t: '        loading', c: C.kw }, { t: '=', c: C.op }, { t: '{isLoading}', c: C.pl }] },
  { tokens: [{ t: '      />', c: C.op }] },
  { tokens: [{ t: '      <', c: C.op }, { t: 'Experience', c: C.ty }, { t: ' />', c: C.op }] },
  { tokens: [{ t: '      <', c: C.op }, { t: 'Contact', c: C.ty }, { t: ' />', c: C.op }] },
  { tokens: [{ t: '    </', c: C.op }, { t: 'main', c: C.tag }, { t: '>', c: C.op }] },
  { tokens: [{ t: '  );', c: C.pl }] },
  { tokens: [{ t: '}', c: C.pl }], pause: 350 },
  { tokens: [] },
];

/* ─────────────────────────────────────────────────────────────────
   HUMAN-RHYTHM TYPING HOOK
   – variable speed per character
   – contextual line-end pauses
   – auto-loops the code buffer continuously
───────────────────────────────────────────────────────────────── */
function useTypingCode(reducedMotion) {
  // Internal mutable state (not triggering renders directly)
  const s = useRef({
    lineIdx: 0,
    charIdx: 0,
    pauseUntil: 0,
    lineMap: {},
  });

  const [snap, setSnap] = useState({ lineMap: {}, maxLineIdx: -1 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      const full = {};
      CODE_LINES.forEach((_, i) => { full[i] = Infinity; });
      setSnap({ lineMap: full, maxLineIdx: CODE_LINES.length - 1 });
      return;
    }

    // Typing speed: random between MIN…MAX ms per char
    const MIN_DELAY = 14;
    const MAX_DELAY = 38;
    const BLANK_PAUSE = 65;

    // Probability of an extra hesitation mid-line
    const HESITATION_CHANCE = 0.04; // 4% per char
    const HESITATION_MS = 180;

    const tick = (ts) => {
      const r = s.current;

      // respect pause
      if (ts < r.pauseUntil) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const line = CODE_LINES[r.lineIdx];
      const fullText = line.tokens.map(tok => tok.t).join('');
      const isBlank  = fullText.length === 0;

      if (isBlank || r.charIdx > fullText.length) {
        // Advance to next line
        const linePause = line.pause ?? 0;
        r.pauseUntil = ts + BLANK_PAUSE + linePause;
        r.lineIdx = (r.lineIdx + 1) % CODE_LINES.length;
        r.charIdx = 0;

        if (r.lineIdx === 0) {
          // restart lineMap window on loop
          r.lineMap = {};
          setSnap({ lineMap: {}, maxLineIdx: -1 });
        }
      } else {
        r.lineMap[r.lineIdx] = r.charIdx;
        r.charIdx++;

        // natural hesitation
        const hesitate = Math.random() < HESITATION_CHANCE ? HESITATION_MS : 0;
        const charDelay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
        r.pauseUntil = ts + charDelay + hesitate;

        // snapshot for React render
        setSnap({ lineMap: { ...r.lineMap }, maxLineIdx: r.lineIdx });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion]);

  return snap;
}

/* ─────────────────────────────────────────────────────────────────
   TOKEN RENDERER
───────────────────────────────────────────────────────────────── */
function renderTokens(tokens, charCount) {
  if (!tokens || !tokens.length) return null;
  let remaining = typeof charCount === 'number' ? charCount : 0;
  return tokens.map(({ t, c }, i) => {
    if (remaining <= 0) return null;
    const slice = t.slice(0, remaining);
    remaining -= t.length;
    return <span key={i} style={{ color: c || 'inherit' }}>{slice}</span>;
  });
}

/* ─────────────────────────────────────────────────────────────────
   BLINKING CURSOR — VS Code style (solid block, blink every ~0.55s)
───────────────────────────────────────────────────────────────── */
function Cursor() {
  return (
    <motion.span
      className="il-cursor"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.05,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.48, 0.52, 1],
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   SCREEN GLOSS SWEEP — diagonal reflection moving across display
───────────────────────────────────────────────────────────────── */
function ScreenGloss() {
  return (
    <motion.div
      className="il-screen-gloss"
      initial={{ x: '-140%' }}
      animate={{ x: '260%' }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        repeatDelay: 3.5,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   EDITOR OVERLAY
───────────────────────────────────────────────────────────────── */
function EditorOverlay({ lineMap, maxLineIdx }) {
  const innerRef = useRef(null);

  // Smooth scroll to bottom whenever a new line appears
  useEffect(() => {
    const el = innerRef.current?.parentElement; // the scroll container
    if (el) el.scrollTop = el.scrollHeight;
  }, [maxLineIdx]);

  return (
    <div className="il-editor-overlay">
      {/* Tab bar */}
      <div className="il-editor-tabbar">
        <div className="il-editor-tab il-editor-tab--active">
          <span className="il-tab-dot il-tab-dot--blue" />
          Portfolio.tsx
        </div>
        <div className="il-editor-tab">
          <span className="il-tab-dot" />
          supabase.ts
        </div>
        <div className="il-editor-tab">
          <span className="il-tab-dot" />
          types.d.ts
        </div>
      </div>

      {/* Scrollable code area */}
      <div className="il-editor-scroll">
        <div className="il-editor-inner" ref={innerRef}>
          {CODE_LINES.slice(0, maxLineIdx + 2).map((line, idx) => {
            if (lineMap[idx] === undefined) return null;
            const chars    = lineMap[idx];
            const isActive = idx === maxLineIdx;
            return (
              <div
                key={idx}
                className={`il-code-line${isActive ? ' il-code-line--active' : ''}`}
              >
                <span className="il-line-num">{idx + 1}</span>
                <span className="il-line-code">
                  {renderTokens(line.tokens, chars)}
                  {isActive && <Cursor />}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PROGRESS BAR — fills over INTRO_MS duration
───────────────────────────────────────────────────────────────── */
function ProgressBar({ reduced }) {
  return (
    <div className="il-progress-outer">
      <div className="il-progress-track">
        <motion.div
          className="il-progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={
            reduced
              ? { duration: INTRO_MS / 1000, ease: 'linear' }
              : {
                  duration: INTRO_MS / 1000 - 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LAPTOP SVG — premium MacBook-style
───────────────────────────────────────────────────────────────── */
function LaptopSVG({ isDark, glowIntensity }) {
  const d = isDark;
  const gi = glowIntensity; // 0..1 for keyboard illumination

  return (
    <svg
      viewBox="0 0 580 390"
      xmlns="http://www.w3.org/2000/svg"
      className="il-laptop-svg"
      aria-hidden="true"
    >
      <defs>
        {/* Lid aluminum */}
        <linearGradient id="g-lid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={d ? '#3E566E' : '#EEF0F3'} />
          <stop offset="14%"  stopColor={d ? '#2F4258' : '#E6E9EC'} />
          <stop offset="50%"  stopColor={d ? '#1F3040' : '#D3D7DC'} />
          <stop offset="86%"  stopColor={d ? '#15232F' : '#C6CAD0'} />
          <stop offset="100%" stopColor={d ? '#0E1820' : '#B8BCC3'} />
        </linearGradient>

        {/* Lid gloss */}
        <linearGradient id="g-lid-gloss" x1="5%" y1="0%" x2="60%" y2="80%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.14)" />
          <stop offset="50%"  stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Keyboard deck */}
        <linearGradient id="g-deck" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={d ? '#1F2E3D' : '#DADDE2'} />
          <stop offset="100%" stopColor={d ? '#111C27' : '#C3C7CE'} />
        </linearGradient>

        {/* Base front face */}
        <linearGradient id="g-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={d ? '#18263A' : '#C8CDD5'} />
          <stop offset="100%" stopColor={d ? '#0A1219' : '#A5AAB2'} />
        </linearGradient>

        {/* Screen */}
        <linearGradient id="g-screen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0B1320" />
          <stop offset="100%" stopColor="#060C16" />
        </linearGradient>

        {/* Screen ambient glow */}
        <radialGradient id="g-screen-glow" cx="50%" cy="38%" r="58%">
          <stop offset="0%"   stopColor="rgba(22,90,180,0.4)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Keyboard screen-illumination glow (dynamic) */}
        <radialGradient id="g-kb-light" cx="50%" cy="0%" r="75%">
          <stop offset="0%"
            stopColor={`rgba(6,182,212,${(gi * 0.18).toFixed(3)})`} />
          <stop offset="100%" stopColor="rgba(6,182,212,0)" />
        </radialGradient>

        {/* Trackpad */}
        <linearGradient id="g-tp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={d ? '#243040' : '#CED2D9'} />
          <stop offset="100%" stopColor={d ? '#172230' : '#B8BCC4'} />
        </linearGradient>

        {/* Hinge */}
        <linearGradient id="g-hinge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={d ? '#182330' : '#ABAEB5'} />
          <stop offset="100%" stopColor={d ? '#090F18' : '#888C94'} />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="f-shadow" x="-12%" y="-8%" width="124%" height="130%">
          <feDropShadow dx="0" dy="16" stdDeviation="20"
            floodColor={d ? '#000' : '#5070A0'} floodOpacity="0.5" />
          <feDropShadow dx="0" dy="4"  stdDeviation="8"
            floodColor={d ? '#000' : '#4060A0'} floodOpacity="0.3" />
        </filter>

        {/* Screen glow filter */}
        <filter id="f-screen-glow" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Floor shadow ── */}
      <ellipse cx="290" cy="384" rx="200" ry="7"
        fill={d ? 'rgba(0,0,0,0.55)' : 'rgba(80,100,140,0.22)'} />

      {/* ════ BASE BODY ════ */}
      {/* Front face (thin edge) */}
      <path d="M 40 320 L 540 320 L 558 358 L 22 358 Z" fill="url(#g-front)" />

      {/* Keyboard deck */}
      <path d="M 50 244 L 530 244 L 540 320 L 40 320 Z"
        fill="url(#g-deck)" filter="url(#f-shadow)" />

      {/* Deck top bevel */}
      <path d="M 50 244 L 530 244 L 534 251 L 46 251 Z"
        fill={d ? 'rgba(255,255,255,0.065)' : 'rgba(255,255,255,0.6)'} />

      {/* Deck left bevel */}
      <path d="M 40 320 L 50 244 L 46 251 L 38 326 Z"
        fill={d ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.4)'} />

      {/* Deck right bevel */}
      <path d="M 530 244 L 540 320 L 542 326 L 534 251 Z"
        fill={d ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.05)'} />

      {/* Screen illumination on keyboard deck */}
      <path d="M 50 244 L 530 244 L 540 320 L 40 320 Z"
        fill="url(#g-kb-light)" />

      {/* ── Keyboard keys — 4 rows ── */}
      {[260, 276, 292, 308].map((y, row) => {
        const count  = [14, 14, 13, 10][row];
        const startX = [72, 72, 80, 144][row];
        const kw     = [26, 26, 26, 26][row];
        const gap    = 4;
        return Array.from({ length: count }, (_, i) => (
          <rect key={`${row}-${i}`}
            x={startX + i * (kw + gap)} y={y}
            width={kw} height={10} rx={2.5}
            fill={d ? 'rgba(255,255,255,0.056)' : 'rgba(0,0,0,0.07)'}
            stroke={d ? 'rgba(255,255,255,0.022)' : 'rgba(0,0,0,0.04)'}
            strokeWidth="0.5"
          />
        ));
      })}

      {/* Space bar */}
      <rect x="190" y="308" width="200" height="10" rx="2.5"
        fill={d ? 'rgba(255,255,255,0.056)' : 'rgba(0,0,0,0.07)'}
        stroke={d ? 'rgba(255,255,255,0.022)' : 'rgba(0,0,0,0.04)'}
        strokeWidth="0.5"
      />

      {/* Trackpad */}
      <rect x="214" y="330" width="152" height="28" rx="6"
        fill="url(#g-tp)"
        stroke={d ? 'rgba(255,255,255,0.075)' : 'rgba(0,0,0,0.1)'}
        strokeWidth="1"
      />
      {/* Trackpad top gloss */}
      <rect x="215" y="331" width="152" height="8" rx="5"
        fill={d ? 'rgba(255,255,255,0.042)' : 'rgba(255,255,255,0.45)'} />

      {/* ════ HINGE ════ */}
      <rect x="40" y="238" width="500" height="9" rx="4.5" fill="url(#g-hinge)" />
      <rect x="40" y="238" width="500" height="2"  rx="1"   fill={d ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.65)'} />

      {/* ════ LID ════ */}
      <path d="M 48 26 L 532 26 L 524 237 L 56 237 Z"
        fill="url(#g-lid)" filter="url(#f-shadow)" />

      {/* Lid gloss */}
      <path d="M 48 26 L 532 26 L 524 237 L 56 237 Z"
        fill="url(#g-lid-gloss)" />

      {/* Lid bevels */}
      <path d="M 48 26 L 56 237 L 52 235 L 44 28 Z"
        fill={d ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.52)'} />
      <path d="M 532 26 L 528 28 L 524 237 L 528 235 Z"
        fill={d ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.06)'} />
      <path d="M 48 26 L 532 26 L 528 32 L 52 32 Z"
        fill={d ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.72)'} />

      {/* ── Bezel ── */}
      <path d="M 64 40 L 516 40 L 510 228 L 70 228 Z"
        fill={d ? '#060D18' : '#28303E'} />

      {/* ── Screen ── */}
      <path d="M 72 48 L 508 48 L 502 220 L 78 220 Z"
        fill="url(#g-screen)"
        filter="url(#f-screen-glow)"
      />
      {/* Screen ambient glow overlay */}
      <path d="M 72 48 L 508 48 L 502 220 L 78 220 Z"
        fill="url(#g-screen-glow)" />

      {/* Screen top glare */}
      <path d="M 72 48 L 508 48 L 506 60 L 74 60 Z"
        fill={d ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.14)'} />

      {/* ── Webcam ── */}
      <circle cx="290" cy="34" r="4.5" fill={d ? '#070F1A' : '#1E242E'} />
      <circle cx="290" cy="34" r="2.4" fill={d ? '#0EA5E9' : '#3B82F6'} opacity="0.6" />
      <circle cx="291" cy="33" r="0.9" fill="rgba(255,255,255,0.55)" />

      {/* Apple-style logo indent */}
      <ellipse cx="290" cy="132" rx="24" ry="17"
        fill={d ? 'rgba(255,255,255,0.016)' : 'rgba(0,0,0,0.04)'}
        stroke={d ? 'rgba(255,255,255,0.028)' : 'rgba(0,0,0,0.07)'}
        strokeWidth="1" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   AMBIENT PARTICLES
───────────────────────────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  id:    i,
  left:  `${6 + (i * 7.9) % 87}%`,
  top:   `${4 + (i * 8.3) % 92}%`,
  size:  1 + (i % 5) * 0.55,
  dur:   3.8 + (i % 7) * 0.7,
  delay: (i * 0.37) % 3.5,
  base:  0.045 + (i % 6) * 0.028,
}));

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function IntroLoader({ onDone }) {
  const { isDark } = useTheme();
  const reduced    = useReducedMotion();
  const timerRef   = useRef(null);

  const [msgIdx, setMsgIdx]   = useState(0);
  const [glowLevel, setGlow]  = useState(0.5); // 0..1 screen glow intensity
  const [exiting, setExiting] = useState(false);

  /* ── Fire onDone after INTRO_MS ── */
  useEffect(() => {
    timerRef.current = setTimeout(onDone, INTRO_MS);
    return () => clearTimeout(timerRef.current);
  }, [onDone]);

  /* ── Rotate status messages every 420ms ── */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setMsgIdx(p => (p + 1) % STATUS.length), 420);
    return () => clearInterval(id);
  }, [reduced]);

  /* ── Pulsing glow level for keyboard illumination ── */
  useEffect(() => {
    if (reduced) { setGlow(0.6); return; }
    let dir = 1;
    let val = 0.5;
    const id = setInterval(() => {
      val += dir * 0.04;
      if (val >= 1.0) { val = 1.0; dir = -1; }
      if (val <= 0.3) { val = 0.3; dir =  1; }
      setGlow(val);
    }, 80);
    return () => clearInterval(id);
  }, [reduced]);

  const { lineMap, maxLineIdx } = useTypingCode(!!reduced);
  const bg = isDark ? '#06090F' : '#F1F4F9';

  return (
    <motion.div
      className="il-root"
      style={{ background: bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.975 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Vignette */}
      <div className="il-vignette" />

      {/* Background glow orbs */}
      <div className="il-bg-glow il-bg-glow--blue"   style={{ opacity: isDark ? 1 : 0.26 }} />
      <div className="il-bg-glow il-bg-glow--cyan"   style={{ opacity: isDark ? 1 : 0.18 }} />
      <div className="il-bg-glow il-bg-glow--purple" style={{ opacity: isDark ? 0.55 : 0.1 }} />

      {/* Ambient particles */}
      {!reduced && PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="il-particle"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: isDark ? 'rgba(96,165,250,0.9)' : 'rgba(37,99,235,0.6)',
          }}
          animate={{ opacity: [p.base * 0.25, p.base * 2.4, p.base * 0.25] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* ════ CENTER STAGE ════ */}
      <div className="il-stage">

        {/* Halo glow behind laptop */}
        <motion.div
          className="il-laptop-halo"
          animate={reduced ? {} : {
            opacity: isDark ? [0.55, 1, 0.55] : [0.18, 0.32, 0.18],
            scale:   [1, 1.06, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ opacity: isDark ? 0.7 : 0.22 }}
        />

        {/* ── Laptop + editor ── */}
        <motion.div
          className="il-laptop-wrap"
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={
            reduced
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 1, y: [0, -9, -1, -9, 0], scale: 1 }
          }
          transition={
            reduced
              ? { duration: 0.7, ease: 'easeOut' }
              : {
                  opacity: { duration: 0.7, ease: 'easeOut' },
                  scale:   { duration: 0.7, ease: 'easeOut' },
                  y: {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                    delay: 0.7,
                    times: [0, 0.35, 0.5, 0.65, 1],
                  },
                }
          }
        >
          {/* SVG laptop */}
          <LaptopSVG isDark={isDark} glowIntensity={glowLevel} />

          {/* Code editor */}
          <EditorOverlay lineMap={lineMap} maxLineIdx={maxLineIdx} />

          {/* Screen gloss sweep */}
          {!reduced && <ScreenGloss />}

          {/* Screen glow pulse */}
          {!reduced && (
            <motion.div
              className="il-screen-pulse"
              animate={{
                opacity: [0.2, glowLevel * 0.7, 0.2],
                scale:   [1, 1.04, 1],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>

        {/* ── Bottom: progress + status ── */}
        <motion.div
          className="il-bottom"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >
          <ProgressBar reduced={!!reduced} />

          <div className="il-label-wrap">
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIdx}
                className="il-label"
                style={{
                  color: isDark
                    ? 'rgba(148,163,184,0.68)'
                    : 'rgba(71,85,105,0.68)',
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {STATUS[msgIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
