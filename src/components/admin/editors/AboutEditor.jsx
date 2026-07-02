import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AboutEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();
  const [form, setForm] = useState({ ...data.about });
  const [interests, setInterests] = useState([...(data.about?.interests || [])]);
  const [stats, setStats] = useState([...(data.about?.stats || [])]);
  const [newInterest, setNewInterest] = useState('');

  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all ${
    isDark
      ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500'
  }`;

  const handleSave = () => {
    actions.updateAbout({ ...form, interests, stats });
    toast.success('About section updated!');
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const updateStat = (i, field, value) => {
    const updated = [...stats];
    updated[i] = { ...updated[i], [field]: value };
    setStats(updated);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-xs font-medium mb-1.5 text-slate-400">Introduction</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={4}
          value={form.introduction || ''}
          onChange={(e) => setForm({ ...form, introduction: e.target.value })}
          placeholder="Tell visitors about yourself..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 text-slate-400">Career Goals</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={form.careerGoals || ''}
          onChange={(e) => setForm({ ...form, careerGoals: e.target.value })}
          placeholder="What you're looking for in your career..."
        />
      </div>

      {/* Interests */}
      <div>
        <label className="block text-xs font-medium mb-2 text-slate-400">Interests</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {interests.map((interest, i) => (
            <div key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-slate-300">
              <span>{interest}</span>
              <button onClick={() => setInterests(interests.filter((_, idx) => idx !== i))} className="hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add interest..."
            onKeyDown={(e) => e.key === 'Enter' && addInterest()}
          />
          <button onClick={addInterest} className="btn-primary px-3 py-2">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div>
        <label className="block text-xs font-medium mb-3 text-slate-400">Stats Cards</label>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className={`p-3 rounded-xl border ${isDark ? 'bg-dark-700 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
              <input
                className={inputCls}
                value={stat.value || ''}
                onChange={(e) => updateStat(i, 'value', e.target.value)}
                placeholder="25+"
              />
              <input
                className={inputCls}
                value={stat.label || ''}
                onChange={(e) => updateStat(i, 'label', e.target.value)}
                placeholder="Label"
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary flex items-center gap-2 w-full sm:w-auto" id="about-save-btn">
        <Save size={16} />
        Save Changes
      </button>
    </div>
  );
}
