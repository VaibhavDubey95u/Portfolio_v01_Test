// Utility helpers

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function clampPercentage(value) {
  return Math.min(100, Math.max(0, value));
}

export function getSkillLevelColor(level) {
  const colors = {
    Beginner: 'from-slate-500 to-slate-400',
    Intermediate: 'from-blue-600 to-cyan-500',
    Advanced: 'from-purple-600 to-blue-500',
    Expert: 'from-primary-600 to-secondary-500',
  };
  return colors[level] || colors.Intermediate;
}

export function getSkillLevelBadgeColor(level) {
  const colors = {
    Beginner: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Expert: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };
  return colors[level] || colors.Intermediate;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr === 'Present') return 'Present';
  try {
    const d = new Date(dateStr + '-01');
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function truncate(str, maxLength = 150) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength).trim() + '...';
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function reorderArray(arr, oldIndex, newIndex) {
  const result = Array.from(arr);
  const [removed] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, removed);
  return result;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
