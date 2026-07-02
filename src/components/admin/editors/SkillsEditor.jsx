import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import {
  Plus, Trash2, Save, X, Edit3, ChevronDown, ChevronUp,
  Download, Upload, Search, GripVertical, Eye, EyeOff,
  Copy, CheckCircle2, Layers,
  Zap, Star, BarChart2, Filter,
  Code2, Layout, Server, Database, Wrench, Brain
} from 'lucide-react';

const ICON_MAP = { Code2, Layout, Server, Database, Wrench, Brain, Tool: Wrench };

import toast from 'react-hot-toast';
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const LEVEL_PERCENTAGES = { Beginner: 25, Intermediate: 55, Advanced: 78, Expert: 95 };
const LEVEL_COLORS = {
  Beginner:     { bar: '#64748b', badge: 'bg-slate-500/20 text-slate-400', ring: 'ring-slate-500/40' },
  Intermediate: { bar: '#3b82f6', badge: 'bg-blue-500/20 text-blue-400',  ring: 'ring-blue-500/40' },
  Advanced:     { bar: '#8b5cf6', badge: 'bg-violet-500/20 text-violet-400', ring: 'ring-violet-500/40' },
  Expert:       { bar: '#f59e0b', badge: 'bg-amber-500/20 text-amber-400', ring: 'ring-amber-500/40' },
};

const SKILL_EMOJIS = [
  '🐍','🟨','🔷','☕','⚙️','🐹','⚛️','▲','🎨','🌐','🔮','🟢','⚡',
  '🎸','🔗','🐘','🍃','🔴','🐬','🐙','🐳','☁️','🐧','🔥','🤖','📐',
  '🐼','💎','🚀','✨','🛡️','📦','🔑','📊','🌍','🎯','💡','🧠','⭐',
  '🏆','🔬','💻','🖥️','⌨️','🖱️','📱','🔧','🔨','🪛','⚗️','🧮',
];

const CATEGORY_EMOJIS = [
  '💻','🎨','⚙️','🗄️','🛠️','🤖','📱','🚀','🔬','📊','🌐','🔐',
  '☁️','🎯','🧠','⚡','💡','🏗️','📐','🔗','🌟','🎭','🔧','📈',
];

/* ─────────────────────────────────────────────
   Tiny shared helpers
───────────────────────────────────────────── */
function cls(...parts) { return parts.filter(Boolean).join(' '); }

function inputCls(isDark, extra = '') {
  return cls(
    'w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all',
    isDark
      ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500',
    extra
  );
}

/* ─────────────────────────────────────────────
   EmojiPicker
───────────────────────────────────────────── */
function EmojiPicker({ value, onChange, isDark, options = SKILL_EMOJIS, size = 'md' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const btnSize = size === 'sm' ? 'w-9 h-9 text-lg' : 'w-11 h-11 text-xl';

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cls(
          btnSize, 'rounded-xl flex items-center justify-center border-2 transition-all',
          isDark
            ? 'bg-dark-700 border-white/10 hover:border-indigo-500'
            : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm',
          open && (isDark ? 'border-indigo-500' : 'border-indigo-400')
        )}
        title="Pick icon"
      >
        {value && ICON_MAP[value] ? React.createElement(ICON_MAP[value], { size: size === 'sm' ? 16 : 20 }) : value || '⚡'}
      </button>

      {open && (
        <div className={cls(
          'absolute top-12 left-0 z-[60] p-3 rounded-2xl border shadow-2xl w-64',
          isDark ? 'bg-dark-700 border-white/10' : 'bg-white border-slate-200'
        )}>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Pick an Icon</p>
          <div className="grid grid-cols-8 gap-1 mb-2 max-h-40 overflow-y-auto">
            {options.map(em => (
              <button
                key={em}
                type="button"
                onClick={() => { onChange(em); setOpen(false); }}
                className={cls(
                  'w-7 h-7 rounded-lg text-base flex items-center justify-center transition-colors',
                  value === em
                    ? 'bg-indigo-500/30 ring-1 ring-indigo-500'
                    : isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                )}
              >{em}</button>
            ))}
          </div>
          <input
            className={inputCls(isDark, 'text-xs py-1.5')}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Or type any emoji"
            maxLength={4}
          />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SkillBar preview
───────────────────────────────────────────── */
function MiniSkillBar({ skill, isDark }) {
  const pct = skill.percentage || LEVEL_PERCENTAGES[skill.level] || 50;
  const barColor = LEVEL_COLORS[skill.level]?.bar || '#6366f1';
  const badgeCls = LEVEL_COLORS[skill.level]?.badge || 'bg-indigo-500/20 text-indigo-400';
  return (
    <div className={cls('p-2.5 rounded-lg border transition-all', isDark ? 'bg-white/5 border-white/8' : 'bg-white border-slate-100 shadow-sm')}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-base">{skill.icon || '⚡'}</span>
        <span className={cls('text-xs font-semibold flex-1 truncate', isDark ? 'text-slate-200' : 'text-slate-800')}>{skill.name || 'Skill'}</span>
        <span className={cls('text-[9px] font-medium px-1 py-0.5 rounded-full', badgeCls)}>{skill.level}</span>
      </div>
      <div className={cls('h-1 rounded-full overflow-hidden', isDark ? 'bg-white/10' : 'bg-slate-100')}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sortable Skill Row
───────────────────────────────────────────── */
function SortableSkillRow({ skill, catId, onUpdate, onDelete, isDark }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ ...skill });
  const barColor  = LEVEL_COLORS[form.level]?.bar || '#6366f1';
  const badgeCls  = LEVEL_COLORS[skill.level]?.badge || 'bg-indigo-500/20 text-indigo-400';
  const pct       = skill.percentage || LEVEL_PERCENTAGES[skill.level] || 50;

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Skill name required'); return; }
    onUpdate(catId, skill.id, form);
    setEditing(false);
    toast.success('Skill updated!');
  };

  if (editing) {
    return (
      <div ref={setNodeRef} style={style} className={cls(
        'p-4 rounded-xl border-2 border-indigo-500/40 space-y-3',
        isDark ? 'bg-dark-700' : 'bg-indigo-50/50'
      )}>
        <div className="flex gap-2 items-center">
          <EmojiPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} isDark={isDark} />
          <input
            className={inputCls(isDark)}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Skill name"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {LEVELS.map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => setForm(f => ({ ...f, level: lvl, percentage: LEVEL_PERCENTAGES[lvl] }))}
              className={cls(
                'py-1.5 rounded-lg text-xs font-semibold border transition-all',
                form.level === lvl
                  ? 'bg-indigo-600 text-white border-transparent shadow'
                  : isDark
                  ? 'border-white/10 text-slate-400 hover:border-indigo-500/40 hover:text-indigo-400'
                  : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
              )}
            >{lvl}</button>
          ))}
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-slate-400">Proficiency</span>
            <span className={cls('text-xs font-bold tabular-nums', isDark ? 'text-white' : 'text-slate-900')}>{form.percentage}%</span>
          </div>
          <div className={cls('relative h-2 rounded-full', isDark ? 'bg-white/10' : 'bg-slate-200')}>
            <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-300" style={{ width: `${form.percentage}%`, backgroundColor: barColor }} />
            <input type="range" min={5} max={100} step={5}
              value={form.percentage}
              onChange={e => setForm(f => ({ ...f, percentage: +e.target.value }))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => { setEditing(false); setForm({ ...skill }); }}
            className={cls('flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
              isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}
          >Cancel</button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-2"
          ><Save size={14} /> Save</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={cls(
      'group flex items-center gap-3 p-3 rounded-xl transition-all',
      isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
    )}>
      <button {...attributes} {...listeners} className="touch-none cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
        <GripVertical size={14} />
      </button>
      <div className={cls('w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0',
        isDark ? 'bg-dark-700' : 'bg-white shadow-sm border border-slate-100')}>
        {skill.icon || '⚡'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cls('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{skill.name}</span>
          <span className={cls('text-[10px] font-medium px-1.5 py-0.5 rounded-full', badgeCls)}>{skill.level}</span>
        </div>
        <div className={cls('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/10' : 'bg-slate-200')}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: LEVEL_COLORS[skill.level]?.bar || '#6366f1' }} />
        </div>
        <span className={cls('text-[10px] mt-0.5 block', isDark ? 'text-slate-600' : 'text-slate-400')}>{pct}%</span>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={() => setEditing(true)}
          className={cls('p-1.5 rounded-lg transition-colors', isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-800')}
          title="Edit"
        ><Edit3 size={13} /></button>
        <button type="button" onClick={() => {
          if (window.confirm(`Remove skill "${skill.name || 'this skill'}"?`)) {
            onDelete(catId, skill.id);
          }
        }}
          className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          title="Remove"
        ><Trash2 size={13} /></button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Add Skill Form
───────────────────────────────────────────── */
function AddSkillForm({ catId, onAdd, onClose, isDark }) {
  const [form, setForm] = useState({ name: '', level: 'Intermediate', percentage: 55, icon: '⚡' });
  const barColor = LEVEL_COLORS[form.level]?.bar || '#6366f1';

  const submit = () => {
    if (!form.name.trim()) { toast.error('Enter a skill name'); return; }
    onAdd(catId, form);
    onClose();
    toast.success('Skill added!');
  };

  return (
    <div className={cls('mt-3 p-4 rounded-2xl border-2 border-dashed border-indigo-500/40 space-y-4',
      isDark ? 'bg-indigo-500/5' : 'bg-indigo-50/60')}>
      <p className={cls('text-xs font-semibold uppercase tracking-widest', isDark ? 'text-indigo-400' : 'text-indigo-600')}>
        ✨ New Skill
      </p>

      <div className="flex gap-2 items-center">
        <EmojiPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} isDark={isDark} />
        <input
          className={inputCls(isDark)}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. React, Python, Docker…"
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose(); }}
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-2 font-medium">Proficiency Level</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LEVELS.map(lvl => (
            <button key={lvl} type="button"
              onClick={() => setForm(f => ({ ...f, level: lvl, percentage: LEVEL_PERCENTAGES[lvl] }))}
              className={cls('py-2 rounded-xl text-xs font-bold border transition-all',
                form.level === lvl
                  ? 'bg-indigo-600 text-white border-transparent shadow-md'
                  : isDark
                  ? 'border-white/10 text-slate-400 hover:border-indigo-400 hover:text-indigo-400'
                  : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-700')}
            >{lvl}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs text-slate-400 font-medium">Fine-tune</label>
          <span className={cls('text-xs font-bold', isDark ? 'text-white' : 'text-slate-800')}>{form.percentage}%</span>
        </div>
        <div className={cls('relative h-3 rounded-full overflow-hidden', isDark ? 'bg-white/5' : 'bg-slate-200')}>
          <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200" style={{ width: `${form.percentage}%`, backgroundColor: barColor }} />
          <input type="range" min={5} max={100} step={5}
            value={form.percentage}
            onChange={e => setForm(f => ({ ...f, percentage: +e.target.value }))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Live preview */}
      <div className={cls('p-3 rounded-xl border', isDark ? 'bg-dark-700 border-white/5' : 'bg-white border-slate-100 shadow-sm')}>
        <p className="text-[10px] text-slate-500 mb-2 font-semibold uppercase tracking-wider">Preview</p>
        <MiniSkillBar skill={form} isDark={isDark} />
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onClose}
          className={cls('flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors',
            isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}
        >Cancel</button>
        <button type="button" onClick={submit}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        ><Plus size={15} /> Add Skill</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sortable Category Block
───────────────────────────────────────────── */
function SortableCategoryBlock({ cat, onRename, onDelete, onAddSkill, onUpdateSkill, onDeleteSkill, onReorderSkills, isDark, searchQuery }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.45 : 1, zIndex: isDragging ? 999 : undefined };

  const [expanded, setExpanded]     = useState(true);
  const [addingSkill, setAddingSkill] = useState(false);
  const [renaming, setRenaming]     = useState(false);
  const [newName, setNewName]       = useState(cat.name);
  const [catIcon, setCatIcon]       = useState(cat.icon || '📦');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filteredSkills = searchQuery
    ? (cat.skills || []).filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : (cat.skills || []);

  const skillIds = filteredSkills.map(s => s.id);

  const handleSkillDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const old = cat.skills || [];
    const oldIdx = old.findIndex(s => s.id === active.id);
    const newIdx = old.findIndex(s => s.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    onReorderSkills(cat.id, arrayMove(old, oldIdx, newIdx));
    toast.success('Skills reordered');
  };

  const skillCount   = cat.skills?.length || 0;
  const displayCount = filteredSkills.length;

  return (
    <div ref={setNodeRef} style={style} className={cls(
      'rounded-2xl border overflow-hidden transition-all',
      isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200 shadow-sm',
      isDragging && 'shadow-2xl ring-2 ring-indigo-500/40'
    )}>
      {/* Category header */}
      <div className={cls('flex items-center gap-3 px-4 py-3.5',
        expanded && (isDark ? 'border-b border-white/5' : 'border-b border-slate-100'))}>

        {/* Drag handle */}
        <button {...attributes} {...listeners} type="button"
          className="touch-none cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
          <GripVertical size={16} />
        </button>

        {renaming ? (
          <div className="flex gap-2 flex-1 items-center">
            <EmojiPicker value={catIcon} onChange={v => setCatIcon(v)} isDark={isDark} options={CATEGORY_EMOJIS} size="sm" />
            <input
              className={inputCls(isDark)}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter' && newName.trim()) { onRename(cat.id, newName.trim(), catIcon); setRenaming(false); toast.success('Category renamed!'); }
                if (e.key === 'Escape') { setNewName(cat.name); setCatIcon(cat.icon || '📦'); setRenaming(false); }
              }}
            />
            <button type="button"
              onClick={() => { if (newName.trim()) { onRename(cat.id, newName.trim(), catIcon); setRenaming(false); toast.success('Renamed!'); } }}
              className="p-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors flex-shrink-0"
            ><Save size={13} /></button>
            <button type="button"
              onClick={() => { setNewName(cat.name); setCatIcon(cat.icon || '📦'); setRenaming(false); }}
              className={cls('p-2 rounded-lg text-xs border transition-colors flex-shrink-0',
                isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500')}
            ><X size={13} /></button>
          </div>
        ) : (
          <>
            <button type="button" onClick={() => setExpanded(v => !v)} className="flex items-center gap-2.5 flex-1 text-left min-w-0">
              <div className={cls('w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all',
                expanded
                  ? 'bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/20'
                  : isDark ? 'bg-white/8 border border-white/10' : 'bg-slate-100 border border-slate-200')}>
                {cat.icon && ICON_MAP[cat.icon] ? React.createElement(ICON_MAP[cat.icon], { size: 20 }) : cat.icon || '📦'}
              </div>
              <div className="min-w-0">
                <p className={cls('text-sm font-bold truncate', isDark ? 'text-white' : 'text-slate-900')}>{cat.name}</p>
                <p className={cls('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                  {skillCount} skill{skillCount !== 1 ? 's' : ''}
                  {searchQuery && displayCount !== skillCount && ` · ${displayCount} match`}
                </p>
              </div>
              <div className="ml-auto text-slate-400 flex-shrink-0">
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <button type="button" onClick={() => setRenaming(true)}
                className={cls('p-2 rounded-lg transition-colors', isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700')}
                title="Rename category"
              ><Edit3 size={14} /></button>
              <button type="button" onClick={() => { setAddingSkill(true); setExpanded(true); }}
                className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                title="Add skill"
              ><Plus size={14} /></button>
              <button type="button"
                onClick={() => { if (window.confirm(`Remove "${cat.name}" and all its skills?`)) { onDelete(cat.id); toast.success('Category removed'); } }}
                className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                title="Delete category"
              ><Trash2 size={14} /></button>
            </div>
          </>
        )}
      </div>

      {/* Skills list */}
      {expanded && (
        <div className="px-3 py-3 space-y-1">
          {displayCount === 0 && !addingSkill && (
            <div className={cls('text-center py-8 rounded-xl border border-dashed',
              isDark ? 'border-white/10 text-slate-600' : 'border-slate-200 text-slate-400')}>
              <p className="text-sm mb-1">{searchQuery ? 'No matching skills' : 'No skills yet'}</p>
              {!searchQuery && (
                <button type="button" onClick={() => setAddingSkill(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  + Add first skill
                </button>
              )}
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSkillDragEnd}>
            <SortableContext items={skillIds} strategy={verticalListSortingStrategy}>
              {filteredSkills.map(skill => (
                <SortableSkillRow
                  key={skill.id}
                  skill={skill}
                  catId={cat.id}
                  onUpdate={onUpdateSkill}
                  onDelete={(cId, sId) => { onDeleteSkill(cId, sId); toast.success('Skill removed'); }}
                  isDark={isDark}
                />
              ))}
            </SortableContext>
          </DndContext>

          {addingSkill && (
            <AddSkillForm catId={cat.id} onAdd={onAddSkill} onClose={() => setAddingSkill(false)} isDark={isDark} />
          )}

          {!addingSkill && skillCount > 0 && (
            <button type="button" onClick={() => setAddingSkill(true)}
              className={cls('w-full mt-1 py-2.5 rounded-xl border border-dashed text-sm font-medium flex items-center justify-center gap-2 transition-all',
                isDark
                  ? 'border-white/15 text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/5'
                  : 'border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50')}>
              <Plus size={14} /> Add Skill to {cat.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   StatBadge
───────────────────────────────────────────── */
function StatBadge({ label, value, gradient, icon: Icon, isDark }) {
  return (
    <div className={cls('p-4 rounded-2xl border', isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200 shadow-sm')}>
      <div className="flex items-start justify-between mb-2">
        <p className={cls('text-xs font-medium', isDark ? 'text-slate-500' : 'text-slate-400')}>{label}</p>
        {Icon && <Icon size={14} className="text-slate-500" />}
      </div>
      <p className={cls('text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent', gradient)}>{value}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main SkillsEditor
───────────────────────────────────────────── */
export default function SkillsEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();

  const categories = data.skills?.categories || [];
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [addingCat, setAddingCat]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const importRef = useRef(null);

  // Section-level header/subtitle editing
  const [editingHeader, setEditingHeader] = useState(false);
  const [headerForm, setHeaderForm] = useState({
    title: data.skills?.title || 'Skills & Expertise',
    subtitle: data.skills?.subtitle || 'A comprehensive overview of my technical skills across various domains.',
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  /* Stats */
  const totalSkills  = categories.reduce((s, c) => s + (c.skills?.length || 0), 0);
  const expertCount  = categories.reduce((s, c) => s + (c.skills?.filter(sk => sk.level === 'Expert').length || 0), 0);
  const advancedCount = categories.reduce((s, c) => s + (c.skills?.filter(sk => sk.level === 'Advanced').length || 0), 0);

  /* Category drag-end */
  const handleCatDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = categories.findIndex(c => c.id === active.id);
    const newIdx = categories.findIndex(c => c.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    actions.reorderCategories(arrayMove(categories, oldIdx, newIdx));
    toast.success('Categories reordered');
  };

  /* Export */
  const handleExport = () => {
    const exported = { skills: data.skills, exportedAt: new Date().toISOString(), version: '2.0' };
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `skills-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Skills exported!');
  };

  /* Import */
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const cats = parsed?.skills?.categories || parsed?.categories;
        if (!Array.isArray(cats)) throw new Error('Invalid format');
        const totalSkillCount = cats.reduce((s, c) => s + (c.skills?.length || 0), 0);
        if (!window.confirm(`Import ${cats.length} categories with ${totalSkillCount} skills? This will replace existing skills data.`)) return;
        // Delete all existing categories first
        [...categories].forEach(c => actions.deleteSkillCategory(c.id));
        // Add imported categories (context assigns new IDs on creation)
        // We use a two-step approach: add category, then use reorderCategories for the full import
        // Since addSkillCategory creates empty categories, we need to track and add skills after
        // Best approach: use reorderCategories with full data including skills
        const importedCats = cats.map((cat, idx) => ({
          ...cat,
          id: `cat-import-${Date.now()}-${idx}`,
          skills: (cat.skills || []).map((s, si) => ({
            ...s,
            id: `skill-import-${Date.now()}-${idx}-${si}`,
          })),
        }));
        actions.reorderCategories(importedCats);
        toast.success(`✅ Imported ${cats.length} categories with ${totalSkillCount} skills!`);
      } catch {
        toast.error('Invalid JSON file. Please use a file exported from this editor.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  /* Copy skills as text */
  const handleCopyText = () => {
    const text = categories
      .map(c => `${c.name}:\n${(c.skills || []).map(s => `  - ${s.name} (${s.level}, ${s.percentage}%)`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text).then(() => toast.success('Skills copied to clipboard!'));
  };

  /* Save section header */
  const saveHeader = () => {
    actions.updateSkillsMeta(headerForm);
    toast.success('Section header saved!');
    setEditingHeader(false);
  };

  /* Add category */
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    actions.addSkillCategory({ name: newCatName.trim(), icon: newCatIcon });
    setNewCatName('');
    setNewCatIcon('📦');
    setAddingCat(false);
    toast.success(`"${newCatName.trim()}" category added!`);
  };

  const handleRenameCategory = (id, name, icon) => {
    actions.updateSkillCategory(id, { name, icon });
  };

  /* Filtered categories for display */
  const displayCats = filterLevel === 'all'
    ? categories
    : categories.filter(c => (c.skills || []).some(s => s.level === filterLevel));

  const catIds = displayCats.map(c => c.id);

  return (
    <div className="space-y-5 max-w-2xl">

      {/* ── Stats Banner ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBadge label="Categories" value={categories.length} gradient="from-violet-600 to-indigo-500" icon={Layers} isDark={isDark} />
        <StatBadge label="Total Skills" value={totalSkills} gradient="from-indigo-600 to-blue-500" icon={BarChart2} isDark={isDark} />
        <StatBadge label="Expert" value={expertCount} gradient="from-amber-500 to-orange-400" icon={Star} isDark={isDark} />
        <StatBadge label="Advanced" value={advancedCount} gradient="from-violet-500 to-pink-500" icon={Zap} isDark={isDark} />
      </div>

      {/* ── Section Header Editor ── */}
      <div className={cls('p-4 rounded-2xl border', isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200 shadow-sm')}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cls('text-sm font-bold', isDark ? 'text-white' : 'text-slate-800')}>Section Header</h3>
          <button type="button" onClick={() => setEditingHeader(v => !v)}
            className={cls('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600')}>
            <Edit3 size={12} /> {editingHeader ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editingHeader ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Section Title</label>
              <input
                className={inputCls(isDark)}
                value={headerForm.title}
                onChange={e => setHeaderForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Skills & Expertise"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Subtitle</label>
              <textarea
                className={cls(inputCls(isDark), 'resize-none')}
                rows={2}
                value={headerForm.subtitle}
                onChange={e => setHeaderForm(f => ({ ...f, subtitle: e.target.value }))}
                placeholder="A brief description of your skills…"
              />
            </div>
            <button type="button" onClick={saveHeader}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
              <Save size={14} /> Save Header
            </button>
          </div>
        ) : (
          <div>
            <p className={cls('text-base font-bold', isDark ? 'text-white' : 'text-slate-900')}>{headerForm.title}</p>
            <p className={cls('text-xs mt-0.5', isDark ? 'text-slate-500' : 'text-slate-400')}>{headerForm.subtitle}</p>
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className={cls('p-4 rounded-2xl border space-y-3', isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200 shadow-sm')}>
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className={cls(inputCls(isDark), 'pl-9')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search skills across all categories…"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter + Action bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Level filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-500 shrink-0" />
            <div className="flex flex-wrap gap-1">
              {['all', ...LEVELS].map(lvl => (
                <button key={lvl} type="button" onClick={() => setFilterLevel(lvl)}
                  className={cls('px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                    filterLevel === lvl
                      ? 'bg-indigo-600 text-white'
                      : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}>
                  {lvl === 'all' ? 'All' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowPreview(v => !v)}
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
              className={cls('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                showPreview
                  ? 'bg-indigo-600 text-white border-transparent'
                  : isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}>
              {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
              <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Preview'}</span>
            </button>

            <button type="button" onClick={handleCopyText}
              title="Copy as text"
              className={cls('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}>
              <Copy size={13} />
              <span className="hidden sm:inline">Copy</span>
            </button>

            <button type="button" onClick={handleExport}
              title="Export JSON"
              className={cls('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}>
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button type="button" onClick={() => importRef.current?.click()}
              title="Import JSON"
              className={cls('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}>
              <Upload size={13} />
              <span className="hidden sm:inline">Import</span>
            </button>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>
      </div>

      {/* ── Live Preview Panel ── */}
      {showPreview && (
        <div className={cls('p-4 rounded-2xl border', isDark ? 'bg-dark-800 border-white/10' : 'bg-slate-50 border-slate-200')}>
          <p className={cls('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-indigo-400' : 'text-indigo-600')}>
            👁️ Live Preview
          </p>
          {categories.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No skills to preview yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className={cls('p-3 rounded-xl border', isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm')}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg flex items-center justify-center w-6 h-6">{cat.icon && ICON_MAP[cat.icon] ? React.createElement(ICON_MAP[cat.icon], { size: 20 }) : cat.icon || '📦'}</span>
                    <div>
                      <p className={cls('text-xs font-bold', isDark ? 'text-white' : 'text-slate-900')}>{cat.name}</p>
                      <p className={cls('text-[10px]', isDark ? 'text-slate-500' : 'text-slate-400')}>{cat.skills?.length || 0} skills</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {(cat.skills || []).map(skill => (
                      <MiniSkillBar key={skill.id} skill={skill} isDark={isDark} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Categories (with DnD reorder) ── */}
      <div className={cls('p-5 rounded-2xl border', isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200 shadow-sm')}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={cls('text-sm font-bold', isDark ? 'text-white' : 'text-slate-800')}>
            Skill Categories
            {searchQuery && (
              <span className="ml-2 text-xs text-indigo-400 font-normal">
                — searching "{searchQuery}"
              </span>
            )}
          </h3>
          {filterLevel !== 'all' && (
            <span className={cls('text-xs px-2 py-0.5 rounded-full', LEVEL_COLORS[filterLevel]?.badge)}>
              Showing {filterLevel} only
            </span>
          )}
        </div>

        {categories.length === 0 && !addingCat && (
          <div className={cls('text-center py-10 rounded-2xl border border-dashed mb-4',
            isDark ? 'border-white/10 text-slate-600' : 'border-slate-200 text-slate-400')}>
            <p className="text-sm font-medium mb-1">No categories yet</p>
            <p className="text-xs">Add a category like "Frontend", "Backend", "AI & ML"</p>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCatDragEnd}>
          <SortableContext items={catIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {displayCats.map(cat => (
                <SortableCategoryBlock
                  key={cat.id}
                  cat={cat}
                  isDark={isDark}
                  onRename={handleRenameCategory}
                  onDelete={actions.deleteSkillCategory}
                  onAddSkill={actions.addSkill}
                  onUpdateSkill={actions.updateSkill}
                  onDeleteSkill={actions.deleteSkill}
                  onReorderSkills={actions.reorderSkills}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add category form */}
        {addingCat ? (
          <div className={cls('mt-4 p-4 rounded-2xl border-2 border-dashed border-indigo-500/40',
            isDark ? 'bg-indigo-500/5' : 'bg-indigo-50/60')}>
            <p className={cls('text-xs font-semibold uppercase tracking-widest mb-3', isDark ? 'text-indigo-400' : 'text-indigo-600')}>
              New Category
            </p>
            <div className="flex gap-2 items-center mb-3">
              <EmojiPicker value={newCatIcon} onChange={setNewCatIcon} isDark={isDark} options={CATEGORY_EMOJIS} />
              <input
                className={inputCls(isDark)}
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="e.g. Frontend, Backend, AI & ML, DevOps…"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') { setAddingCat(false); setNewCatName(''); } }}
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setAddingCat(false); setNewCatName(''); setNewCatIcon('📦'); }}
                className={cls('flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors',
                  isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}
              >Cancel</button>
              <button type="button" onClick={handleAddCategory} disabled={!newCatName.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              ><Plus size={15} /> Add Category</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setAddingCat(true)}
            id="add-category-btn"
            className={cls('w-full mt-4 py-3 rounded-2xl border-2 border-dashed text-sm font-semibold flex items-center justify-center gap-2 transition-all',
              isDark
                ? 'border-white/15 text-slate-500 hover:border-indigo-500/60 hover:text-indigo-400 hover:bg-indigo-500/5'
                : 'border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50')}>
            <Plus size={16} /> Add New Category
          </button>
        )}
      </div>

      {/* ── Quick Import Templates ── */}
      <div className={cls('p-4 rounded-2xl border', isDark ? 'bg-dark-800/50 border-white/5' : 'bg-slate-50 border-slate-100')}>
        <p className={cls('text-xs font-bold mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>⚡ Quick-Add Category Templates</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Frontend', icon: '🎨' },
            { name: 'Backend', icon: '⚙️' },
            { name: 'DevOps', icon: '🚀' },
            { name: 'AI & ML', icon: '🤖' },
            { name: 'Mobile', icon: '📱' },
            { name: 'Databases', icon: '🗄️' },
            { name: 'Security', icon: '🔐' },
            { name: 'Cloud', icon: '☁️' },
          ].map(tpl => {
            const exists = categories.some(c => c.name.toLowerCase() === tpl.name.toLowerCase());
            return (
              <button key={tpl.name} type="button" disabled={exists}
                onClick={() => { actions.addSkillCategory({ name: tpl.name, icon: tpl.icon }); toast.success(`"${tpl.name}" added!`); }}
                className={cls('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  exists
                    ? isDark ? 'border-white/5 text-slate-600 cursor-default' : 'border-slate-100 text-slate-300 cursor-default'
                    : isDark
                    ? 'border-white/10 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/5'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50')}>
                <span>{tpl.icon}</span> {tpl.name}
                {exists && <CheckCircle2 size={11} className="text-emerald-500 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tips ── */}
      <div className={cls('p-4 rounded-2xl border text-sm', isDark ? 'bg-dark-800/50 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400')}>
        <p className="font-semibold mb-2 text-indigo-400">💡 Tips & Shortcuts</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Drag</strong> the <GripVertical size={11} className="inline" /> handle to reorder categories and skills</li>
          <li>• <strong>Hover</strong> any skill row to reveal Edit and Remove buttons</li>
          <li>• Click the <strong>emoji button</strong> to pick an icon for categories and skills</li>
          <li>• Use <strong>level buttons</strong> to auto-set proficiency, then fine-tune with the slider</li>
          <li>• Use <strong>Export</strong> to back up your skills as JSON, and <strong>Import</strong> to restore</li>
          <li>• <strong>Preview</strong> shows how your skills look on the public portfolio</li>
          <li>• All changes are <strong>saved instantly</strong> to localStorage</li>
        </ul>
      </div>
    </div>
  );
}
