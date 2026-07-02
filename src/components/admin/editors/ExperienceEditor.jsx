import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import Modal from '../../ui/Modal';
import toast from 'react-hot-toast';

const EXP_TYPES = ['Internship', 'Full-time', 'Part-time', 'Research', 'Academic', 'Freelance'];

function ExpForm({ item, onSave, onClose, isDark }) {
  const empty = { role: '', company: '', companyLogo: '💼', location: '', duration: '', description: '', technologies: [], type: 'Internship' };
  const [form, setForm] = useState(item ? { ...item, technologies: [...(item.technologies || [])] } : empty);
  const [techInput, setTechInput] = useState('');
  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all ${isDark ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500'}`;

  const addTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm({ ...form, technologies: [...form.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Job Title *</label>
          <input className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Software Engineer Intern" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Company *</label>
          <input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Google" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Logo (emoji)</label>
          <input className={inputCls} value={form.companyLogo} onChange={(e) => setForm({ ...form, companyLogo: e.target.value })} placeholder="🏢" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Type</label>
          <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {EXP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Location</label>
          <input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Duration *</label>
        <input className={inputCls} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Jun 2024 – Aug 2024" />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What did you do? Achievements..." />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-2">Technologies</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.technologies.map((t, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-600/20 text-primary-300 text-xs">
              {t} <button onClick={() => setForm({ ...form, technologies: form.technologies.filter((_, idx) => idx !== i) })}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={`${inputCls} flex-1`} value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology..." onKeyDown={(e) => e.key === 'Enter' && addTech()} />
          <button onClick={addTech} className="btn-primary px-3 text-sm">+</button>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
        <button onClick={() => { if (form.role && form.company) { onSave(form); onClose(); } }} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5">
          <Save size={14} /> Save
        </button>
      </div>
    </div>
  );
}

export default function ExperienceEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();
  const experience = data.experience || [];
  const [modal, setModal] = useState(null);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex justify-end">
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2" id="add-experience-btn">
          <Plus size={15} /> Add Experience
        </button>
      </div>
      <div className="space-y-3">
        {experience.map((exp) => (
          <div key={exp.id} className={`flex items-center gap-4 p-4 rounded-xl border ${isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-2xl flex-shrink-0">{exp.companyLogo || '💼'}</div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{exp.role}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{exp.company} · {exp.duration}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal({ item: exp })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Edit3 size={14} /></button>
              <button onClick={() => { if (window.confirm(`Remove experience "${exp.role || 'this experience'}"?`)) { actions.deleteExperience(exp.id); toast.success('Experience deleted'); } }} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {experience.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border border-dashed ${isDark ? 'border-white/20 text-slate-600' : 'border-slate-300 text-slate-400'}`}>
            No experience entries yet.
          </div>
        )}
      </div>
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.item ? 'Edit Experience' : 'Add Experience'} size="md">
        {modal && (
          <ExpForm
            item={modal.item} isDark={isDark}
            onSave={(form) => { if (modal.item) { actions.updateExperience(modal.item.id, form); toast.success('Experience updated!'); } else { actions.addExperience(form); toast.success('Experience added!'); } }}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
