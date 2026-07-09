import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Search, Star, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionWrapper, SectionHeader, TagBadge } from '../ui';

function ProjectCard({ project, isDark, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDark
          ? 'bg-dark-800 border-white/10 hover:border-primary-500/50 hover:shadow-glow'
          : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-lg'
      }`}
    >
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white text-xs font-bold backdrop-blur-sm">
          <Star size={10} fill="white" />
          Featured
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div
          className="hidden w-full h-full bg-gradient-to-br from-primary-800/60 to-secondary-800/60 items-center justify-center absolute inset-0"
          style={{ display: 'none' }}
        >
          <span className="text-5xl">🚀</span>
        </div>
        {/* Overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent flex items-end justify-center pb-4 gap-3"
            >
              {project.githubLink && (
                <motion.a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                  whileTap={{ filter: 'brightness(1.2)', transition: { duration: 0.08, delay: 0 } }}
                  className="relative before:absolute before:-inset-2 before:content-[''] flex items-center gap-1.5 px-3 py-1.5 bg-dark-800/90 backdrop-blur text-white text-xs font-medium rounded-lg border border-white/20 hover:bg-dark-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setTimeout(() => window.open(project.githubLink, '_blank'), 200);
                  }}
                >
                  <Github size={14} />
                  GitHub
                </motion.a>
              )}
              {project.liveDemo && (
                <motion.a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileTap={{ filter: 'brightness(1.2)', transition: { duration: 0.08, delay: 0 } }}
                  className="relative before:absolute before:-inset-2 before:content-[''] flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/90 backdrop-blur text-white text-xs font-medium rounded-lg hover:bg-primary-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setTimeout(() => window.open(project.liveDemo, '_blank'), 180);
                  }}
                >
                  <ExternalLink size={14} />
                  Live Demo
                </motion.a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-bold text-base leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {project.title}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
            isDark ? 'bg-secondary-500/20 text-secondary-300' : 'bg-secondary-50 text-secondary-700'
          }`}>
            {project.category}
          </span>
        </div>

        <p className={`text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(project.techStack || []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                isDark
                  ? 'bg-primary-600/15 text-primary-300 border border-primary-500/20'
                  : 'bg-primary-50 text-primary-700 border border-primary-200'
              }`}
            >
              {tech}
            </span>
          ))}
          {project.techStack?.length > 4 && (
            <span className={`text-xs px-2 py-0.5 rounded-md ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-1">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Github size={14} />
              Code
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const projects = data.projects || [];

  // Collect unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
    return cats;
  }, [projects]);

  // Collect all unique tech tags
  const allTags = useMemo(() => {
    const tags = new Set();
    projects.forEach((p) => (p.techStack || []).forEach((t) => tags.add(t)));
    return ['All Tech', ...tags];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        (p.techStack || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchFilter = activeFilter === 'All' || p.category === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [projects, search, activeFilter]);

  return (
    <SectionWrapper id="projects" className={isDark ? 'bg-dark-800/20' : 'bg-slate-100/30'}>
      <SectionHeader
        title="Projects"
        subtitle="A showcase of my best work — from AI tools to full-stack web apps."
      />

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* Search */}
        <div className={`relative flex-1 max-w-md ${search ? '' : ''}`}>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search projects, technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="project-search"
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border transition-all ${
              isDark
                ? 'bg-dark-800 border-white/10 text-slate-100 placeholder:text-slate-500 focus:border-primary-500 focus:outline-none'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none'
            }`}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.85, opacity: 0.75, y: 2, filter: 'brightness(0.9)' }}
              transition={{ duration: 0.08 }}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-glow'
                  : isDark
                  ? 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              No projects match your search. Try a different query.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter + search}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                isDark={isDark}
                delay={i * 0.08}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-10 text-center"
      >
        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
