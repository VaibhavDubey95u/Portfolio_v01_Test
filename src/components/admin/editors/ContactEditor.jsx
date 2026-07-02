import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();
  const [form, setForm] = useState({ ...data.contact });

  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all ${
    isDark
      ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500'
  }`;

  const handleSave = () => {
    actions.updateContact(form);
    toast.success('Contact info updated!');
  };

  const fields = [
    { key: 'email', label: 'Email Address', placeholder: 'you@example.com' },
    { key: 'phone', label: 'Phone Number', placeholder: '+1 (xxx) xxx-xxxx' },
    { key: 'location', label: 'Location', placeholder: 'City, State, Country' },
    { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username' },
    { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
    { key: 'twitter', label: 'Twitter URL', placeholder: 'https://twitter.com/username' },
    { key: 'website', label: 'Personal Website', placeholder: 'https://yourwebsite.com' },
    { key: 'availability', label: 'Availability Status', placeholder: 'Open to full-time roles starting May 2025' },
    { key: 'preferredContact', label: 'Preferred Contact Method', placeholder: 'Email or LinkedIn' },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className={key === 'availability' || key === 'preferredContact' ? 'sm:col-span-2' : ''}>
            <label className="block text-xs font-medium mb-1.5 text-slate-400">{label}</label>
            <input
              className={inputCls}
              value={form[key] || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              id={`contact-edit-${key}`}
            />
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="btn-primary flex items-center gap-2 w-full sm:w-auto" id="contact-save-btn">
        <Save size={16} />
        Save Changes
      </button>
    </div>
  );
}
