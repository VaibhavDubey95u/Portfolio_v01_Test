import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, Trash2, Edit3, Save } from 'lucide-react';
import Modal from '../../ui/Modal';
import toast from 'react-hot-toast';

function AchievementForm({ item, onSave, onClose, isDark }) {
  const empty = { title: '', description: '', date: '', certificateLink: '', icon: '🏆', category: 'Achievement' };
  const [form, setForm] = useState(item || empty);
  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all ${isDark ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500'}`;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Icon (emoji)</label>
          <input className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🏆" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Category</label>
          <input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Hackathon" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Title *</label>
        <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="1st Place — HackMIT" />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your achievement..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Date</label>
          <input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="October 2023" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Certificate Link</label>
          <input className={inputCls} value={form.certificateLink} onChange={(e) => setForm({ ...form, certificateLink: e.target.value })} placeholder="https://..." />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
        <button onClick={() => { if (form.title) { onSave(form); onClose(); } }} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5">
          <Save size={14} /> Save
        </button>
      </div>
    </div>
  );
}

export default function AchievementsEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();
  const achievements = data.achievements || [];
  const [modal, setModal] = useState(null);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex justify-end">
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2" id="add-achievement-btn">
          <Plus size={15} /> Add Achievement
        </button>
      </div>
      <div className="space-y-3">
        {achievements.map((ach) => (
          <div key={ach.id} className={`flex items-center gap-4 p-4 rounded-xl border ${isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-2xl flex-shrink-0">{ach.icon || '🏆'}</div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{ach.title}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ach.category} · {ach.date}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal({ item: ach })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Edit3 size={14} /></button>
              <button onClick={() => { if (window.confirm(`Remove achievement "${ach.title || 'this achievement'}"?`)) { actions.deleteAchievement(ach.id); toast.success('Achievement deleted'); } }} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.item ? 'Edit Achievement' : 'Add Achievement'} size="md">
        {modal && (
          <AchievementForm
            item={modal.item} isDark={isDark}
            onSave={(form) => { if (modal.item) { actions.updateAchievement(modal.item.id, form); toast.success('Achievement updated!'); } else { actions.addAchievement(form); toast.success('Achievement added!'); } }}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
