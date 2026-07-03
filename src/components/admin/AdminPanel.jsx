import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Code2, FolderOpen, GraduationCap,
  Briefcase, Trophy, Award, Mail, Settings, LogOut, Menu, X,
  ChevronRight, Sun, Moon, Home, ArrowLeft, Layers,
  TrendingUp, Edit3, Globe, Zap, Shield, RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';

// Import all section editors
import HeroEditor from './editors/HeroEditor';
import AboutEditor from './editors/AboutEditor';
import SkillsEditor from './editors/SkillsEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import EducationEditor from './editors/EducationEditor';
import ExperienceEditor from './editors/ExperienceEditor';
import AchievementsEditor from './editors/AchievementsEditor';
import CertificationsEditor from './editors/CertificationsEditor';
import ContactEditor from './editors/ContactEditor';
import MessagesEditor from './editors/MessagesEditor';

const SECTIONS = [
  {
    id: 'hero',
    label: 'Hero',
    icon: LayoutDashboard,
    component: HeroEditor,
    description: 'Name, title, photo, resume & social links',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
  },
  {
    id: 'about',
    label: 'About',
    icon: User,
    component: AboutEditor,
    description: 'Introduction, career goals & interests',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Code2,
    component: SkillsEditor,
    description: 'Tech skills, categories & proficiency levels',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderOpen,
    component: ProjectsEditor,
    description: 'Portfolio projects, links & tech stack',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    component: EducationEditor,
    description: 'Degrees, institutions & academic details',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/30',
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: Briefcase,
    component: ExperienceEditor,
    description: 'Work history, roles & responsibilities',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: Trophy,
    component: AchievementsEditor,
    description: 'Awards, hackathons & notable wins',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: Award,
    component: CertificationsEditor,
    description: 'Professional certifications & credentials',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: Mail,
    component: ContactEditor,
    description: 'Contact info, socials & availability',
    color: 'from-teal-500 to-green-500',
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: Mail,
    component: MessagesEditor,
    description: 'View and manage contact form submissions',
    color: 'from-sky-500 to-indigo-500',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
  },
];

/* ─── Dashboard Overview Component ─── */
function DashboardOverview({ data, onNavigate, isDark }) {
  const stats = [
    { label: 'Projects', value: data.projects?.length || 0, icon: FolderOpen, color: 'from-orange-500 to-amber-500' },
    { label: 'Skills Categories', value: data.skills?.categories?.length || 0, icon: Code2, color: 'from-emerald-500 to-teal-500' },
    { label: 'Experience', value: data.experience?.length || 0, icon: Briefcase, color: 'from-indigo-500 to-blue-600' },
    { label: 'Certifications', value: data.certifications?.length || 0, icon: Award, color: 'from-red-500 to-pink-500' },
    { label: 'Education', value: data.education?.length || 0, icon: GraduationCap, color: 'from-pink-500 to-rose-500' },
    { label: 'Achievements', value: data.achievements?.length || 0, icon: Trophy, color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-6 border ${
          isDark ? 'bg-gradient-to-br from-primary-900/40 to-secondary-900/30 border-white/10' : 'bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200/50'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary-500/10 to-transparent rounded-tr-full pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Layers size={22} className="text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Portfolio CMS Dashboard
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              You have full control over every section of your portfolio. Click any section below to edit its content — all changes are saved automatically.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Auto-save enabled
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                <Globe size={10} />
                {SECTIONS.length} sections editable
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                <Shield size={10} />
                Changes stored  to database
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div>
        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Portfolio at a Glance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl border ${isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Section cards */}
      <div>
        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Edit Sections
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(section.id)}
                className={`group text-left p-4 rounded-xl border transition-all duration-200 ${
                  isDark
                    ? `bg-dark-800 border-white/10 hover:border-white/20 hover:bg-dark-700`
                    : `bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm`
                }`}
                id={`dashboard-card-${section.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {section.label}
                      </p>
                      <Edit3 size={13} className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                    </div>
                    <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {section.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick access hero profile info */}
      {data.hero?.name && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`p-4 rounded-xl border ${isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'}`}
        >
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Current Profile
          </h3>
          <div className="flex items-center gap-3">
            {data.hero?.profileImage ? (
              <img
                src={data.hero.profileImage}
                alt={data.hero.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/30 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {data.hero?.name?.[0] || '?'}
              </div>
            )}
            <div>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.hero.name}</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{data.hero.title}</p>
              {data.hero.tagline && (
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>"{data.hero.tagline}"</p>
              )}
            </div>
            <button
              onClick={() => onNavigate('hero')}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isDark ? 'border-white/10 text-slate-300 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Edit3 size={12} />
              Edit
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main AdminPanel ─── */
export default function AdminPanel({ onLogout }) {
  const { isDark, toggleTheme } = useTheme();
  const { data, actions } = usePortfolio();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  React.useEffect(() => {
    setResetConfirmText('');
  }, [showResetConfirm]);

  const currentSection = SECTIONS.find((s) => s.id === activeSection);
  const ActiveComponent = currentSection?.component || null;

  const navigate = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const isDashboard = activeSection === 'dashboard';

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-dark-900' : 'bg-slate-50'}`}>
      {/* Sidebar Overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar (desktop: always visible; mobile: slide-in overlay) ── */}
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex w-64 flex-col flex-shrink-0 border-r transition-colors duration-200 ${
          isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between px-4 py-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-glow flex-shrink-0">
              <Layers size={17} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Portfolio CMS</p>
              <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Full Editor Dashboard</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {/* Dashboard link */}
          <motion.button
            onClick={() => navigate('dashboard')}
            whileHover={{ x: 3 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              activeSection === 'dashboard'
                ? 'bg-gradient-to-r from-primary-600/80 to-secondary-500/60 text-white shadow-glow'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="admin-nav-dashboard"
          >
            <TrendingUp size={16} className={activeSection === 'dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-inherit'} />
            Dashboard
            {activeSection === 'dashboard' && <ChevronRight size={14} className="ml-auto" />}
          </motion.button>

          {/* Divider */}
          <div className={`my-2 mx-1 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
          <p className={`px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Sections
          </p>

          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <motion.button
                key={section.id}
                onClick={() => navigate(section.id)}
                whileHover={{ x: 3 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600/80 to-secondary-500/60 text-white shadow-glow'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id={`admin-nav-${section.id}`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-inherit'} />
                {section.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-3 border-t space-y-0.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <Link to="/" target="_blank">
            <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}>
              <Home size={15} />
              View Portfolio
            </button>
          </Link>

          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            id="admin-reset-btn"
          >
            <RefreshCw size={15} />
            Reset to Default
          </button>

          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="admin-logout-btn"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar (slide-in overlay) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className={`lg:hidden fixed top-0 left-0 bottom-0 z-40 w-64 flex flex-col border-r ${
              isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            {/* Sidebar Header (mobile) */}
            <div className={`flex items-center justify-between px-4 py-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-glow flex-shrink-0">
                  <Layers size={17} className="text-white" />
                </div>
                <div>
                  <p className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Portfolio CMS</p>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Full Editor Dashboard</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">
                <X size={18} />
              </button>
            </div>
            {/* Mobile Nav */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              <button
                onClick={() => navigate('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSection === 'dashboard'
                    ? 'bg-gradient-to-r from-primary-600/80 to-secondary-500/60 text-white'
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <TrendingUp size={16} />
                Dashboard
                {activeSection === 'dashboard' && <ChevronRight size={14} className="ml-auto" />}
              </button>
              <div className={`my-2 mx-1 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
              <p className={`px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Sections</p>
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => navigate(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600/80 to-secondary-500/60 text-white'
                        : isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={16} />
                    {section.label}
                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </nav>
            {/* Mobile Footer */}
            <div className={`p-3 border-t space-y-0.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Link to="/" target="_blank">
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Home size={15} /> View Portfolio
                </button>
              </Link>
              <button onClick={toggleTheme} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}>
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                id="admin-reset-btn"
              >
                <RefreshCw size={15} />
                Reset to Default
              </button>
              <button onClick={onLogout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className={`flex items-center gap-4 px-4 sm:px-6 py-4 border-b ${isDark ? 'border-white/10 bg-dark-800/50' : 'border-slate-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-20`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {!isDashboard && (
              <>
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`text-sm shrink-0 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Dashboard
                </button>
                <ChevronRight size={14} className={`shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              </>
            )}
            <div className="min-w-0">
              <h1 className={`font-bold text-base sm:text-lg leading-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isDashboard ? 'Portfolio CMS' : `${currentSection?.label} Editor`}
              </h1>
              <p className={`text-xs hidden sm:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {isDashboard ? 'Manage all sections of your portfolio' : currentSection?.description}
              </p>
            </div>
          </div>

          {/* Section indicator badge */}
          {!isDashboard && currentSection && (
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${currentSection.bgColor} ${currentSection.textColor} border ${currentSection.borderColor}`}>
              <Zap size={10} />
              Editing
            </div>
          )}

          {/* Back to Portfolio button */}
          <Link
            to="/"
            className={`ml-auto shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              isDark
                ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="back-to-portfolio-btn"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">View Portfolio</span>
            <span className="sm:hidden">View</span>
          </Link>
        </div>

        {/* Editor content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isDashboard ? (
                <DashboardOverview data={data} onNavigate={navigate} isDark={isDark} />
              ) : (
                <div className="space-y-4">
                  {/* Section header */}
                  <div className={`flex items-center gap-3 p-4 rounded-xl border ${isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'}`}>
                    {currentSection && (
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentSection.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                        {React.createElement(currentSection.icon, { size: 18, className: 'text-white' })}
                      </div>
                    )}
                    <div>
                      <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currentSection?.label} Section
                      </h2>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {currentSection?.description} · Changes auto-saved
                      </p>
                    </div>
                  </div>

                  {ActiveComponent && <ActiveComponent />}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Reset Confirm Modal ── */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowResetConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative z-10 w-full max-w-sm p-6 rounded-2xl border ${
                isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <RefreshCw size={20} className="text-red-400" />
              </div>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Reset All Portfolio Data?
              </h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                This will reset <strong>all sections</strong> to the default demo data — Hero, About, Skills, Projects, Education, Experience, Achievements, Certifications, and Contact. This action cannot be undone.
              </p>

              <div className="mb-6">
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Type <strong className={isDark ? 'text-white' : 'text-slate-900'}>RESET PORTFOLIO</strong> to enable the Reset All button.
                </p>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  placeholder="Type RESET PORTFOLIO"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                    isDark
                      ? 'bg-dark-900/50 border-white/10 text-white placeholder-slate-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50'
                  }`}
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  Type <strong>RESET PORTFOLIO</strong> exactly as shown to enable the Reset All button.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 btn-outline text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { actions.resetToDefault(); setShowResetConfirm(false); setActiveSection('dashboard'); }}
                  disabled={resetConfirmText.trim() !== 'RESET PORTFOLIO'}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  id="confirm-reset-btn"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
