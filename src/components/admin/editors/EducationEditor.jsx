import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, Trash2, Edit3, Save } from 'lucide-react';
import Modal from '../../ui/Modal';
import toast from 'react-hot-toast';

function EduForm({ item, onSave, onClose, isDark }) {
  const empty = { degree: '', institution: '', location: '', startDate: '', endDate: '', cgpa: '', description: '', current: false };
  const [form, setForm] = useState(item || empty);
  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all ${isDark ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500'}`;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-slate-400 mb-1">Degree / Qualification *</label>
        <input className={inputCls} value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="B.S. in Computer Science" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Institution *</label>
          <input className={inputCls} value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="MIT" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Location</label>
          <input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Cambridge, MA" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Start Year</label>
          <input className={inputCls} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="2021" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">End Year</label>
          <input className={inputCls} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="2025" disabled={form.current} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">CGPA</label>
          <input className={inputCls} value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} placeholder="3.9/4.0" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: '' })} className="w-4 h-4 rounded accent-primary-500" />
        <span className="text-sm text-slate-400">Currently studying here</span>
      </label>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Coursework, achievements..." />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
        <button onClick={() => { if (form.degree && form.institution) { onSave(form); onClose(); } }} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5">
          <Save size={14} /> Save
        </button>
      </div>
    </div>
  );
}

export default function EducationEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();
  const education = data.education || [];
  const [modal, setModal] = useState(null);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex justify-end">
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2" id="add-education-btn">
          <Plus size={15} /> Add Education
        </button>
      </div>
      <div className="space-y-3">
        {education.map((edu) => (
          <div key={edu.id} className={`flex items-center gap-4 p-4 rounded-xl border ${isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-2xl flex-shrink-0">{edu.logo || '🎓'}</div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{edu.degree}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{edu.institution} · {edu.startDate} – {edu.current ? 'Present' : edu.endDate}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal({ item: edu })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Edit3 size={14} /></button>
              <button onClick={() => { if (window.confirm(`Remove education "${edu.degree || 'this education'}"?`)) { actions.deleteEducation(edu.id); toast.success('Education deleted'); } }} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {education.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border border-dashed ${isDark ? 'border-white/20 text-slate-600' : 'border-slate-300 text-slate-400'}`}>
            No education entries yet.
          </div>
        )}
      </div>
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.item ? 'Edit Education' : 'Add Education'} size="md">
        {modal && (
          <EduForm
            item={modal.item} isDark={isDark}
            onSave={(form) => { if (modal.item) { actions.updateEducation(modal.item.id, form); toast.success('Education updated!'); } else { actions.addEducation(form); toast.success('Education added!'); } }}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
