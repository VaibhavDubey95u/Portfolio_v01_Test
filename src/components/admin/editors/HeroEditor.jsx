import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { Save, Plus, X, Upload, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { storageService } from '../../../services/storageService';

function FormField({ label, id, children, required }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1.5 text-slate-400">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function HeroEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();
  const [form, setForm] = useState({ ...data.hero });
  const [socialLinks, setSocialLinks] = useState({ ...data.hero?.socialLinks });
  const [typingTexts, setTypingTexts] = useState(data.hero?.typingTexts || []);
  const [newText, setNewText] = useState('');
  const fileInputRef   = useRef(null);
  const resumeInputRef = useRef(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);

  /* Convert selected file → base64 and store in form state */
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, profileImage: ev.target.result }));
    };
    reader.readAsDataURL(file);
    setProfileImageFile(file);
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, profileImage: '' }));
    setProfileImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* Resume upload — store file only, NO base64 */
  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      toast.error('Please select a PDF or Word document.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Resume must be smaller than 10 MB.');
      return;
    }
    setResumeFile(file);
  };

  const handleRemoveResume = () => {
    setForm((prev) => ({ ...prev, resumeLink: '' }));
    setResumeFile(null);
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all ${
    isDark
      ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500'
  }`;

  const handleSave = async () => {
    setSaving(true);
    let updatedForm = { ...form };
    
    try {
      if (profileImageFile) {
        const url = await storageService.uploadFile('portfolio-assets', `hero/profile-${Date.now()}`, profileImageFile);
        updatedForm.profileImage = url;
      }
      if (resumeFile) {
        const url = await storageService.uploadFile('portfolio-assets', `hero/resume-${Date.now()}`, resumeFile);
        updatedForm.resumeLink = url;
      }
      
      actions.updateHero({ ...updatedForm, socialLinks, typingTexts });
      toast.success('Hero section updated!');
      setProfileImageFile(null);
      setResumeFile(null);
    } catch (err) {
      toast.error('Failed to save Hero: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addTypingText = () => {
    if (newText.trim()) {
      setTypingTexts([...typingTexts, newText.trim()]);
      setNewText('');
    }
  };

  const removeTypingText = (i) => {
    setTypingTexts(typingTexts.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name" id="hero-name" required>
          <input
            id="hero-name"
            className={inputCls}
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your Name"
          />
        </FormField>
        <FormField label="Title" id="hero-title">
          <input
            id="hero-title"
            className={inputCls}
            value={form.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. CS Student"
          />
        </FormField>
      </div>

      <FormField label="Tagline" id="hero-tagline">
        <input
          id="hero-tagline"
          className={inputCls}
          value={form.tagline || ''}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="Short catchy tagline"
        />
      </FormField>

      <FormField label="Description" id="hero-description">
        <textarea
          id="hero-description"
          className={`${inputCls} resize-none`}
          rows={3}
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Brief introduction paragraph"
        />
      </FormField>

      <FormField label="Profile Photo" id="hero-image">
        {/* Hidden native file input */}
        <input
          ref={fileInputRef}
          id="hero-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {form.profileImage ? (
          /* ── Preview + frame adjustment ── */
          <div className="space-y-4">
            {/* Top row: preview + action buttons */}
            <div className="flex items-center gap-4">
              <img
                src={form.profileImage}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-primary-500/40 shadow-lg flex-shrink-0"
                style={{ objectPosition: form.imagePosition || 'center center' }}
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    isDark
                      ? 'border-white/10 text-slate-300 hover:bg-white/10'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Upload size={14} />
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
                >
                  <ImageOff size={14} />
                  Remove Photo
                </button>
              </div>
            </div>

            {/* Frame position picker */}
            <div>
              <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Frame Position — click to adjust crop focus
              </p>
              <div className="grid grid-cols-3 gap-1 w-28">
                {[
                  { pos: 'left top',      label: '↖' },
                  { pos: 'center top',    label: '↑' },
                  { pos: 'right top',     label: '↗' },
                  { pos: 'left center',   label: '←' },
                  { pos: 'center center', label: '●' },
                  { pos: 'right center',  label: '→' },
                  { pos: 'left bottom',   label: '↙' },
                  { pos: 'center bottom', label: '↓' },
                  { pos: 'right bottom',  label: '↘' },
                ].map(({ pos, label }) => {
                  const active = (form.imagePosition || 'center center') === pos;
                  return (
                    <button
                      key={pos}
                      type="button"
                      title={pos}
                      onClick={() => setForm((prev) => ({ ...prev, imagePosition: pos }))}
                      className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                        active
                          ? 'bg-primary-600 text-white shadow-glow scale-110'
                          : isDark
                          ? 'bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-primary-100 hover:text-primary-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── Upload drop zone ── */
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full flex flex-col items-center gap-3 px-4 py-8 rounded-xl border-2 border-dashed transition-all duration-200 group ${
              isDark
                ? 'border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 text-slate-400'
                : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50/50 text-slate-500'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isDark ? 'bg-white/5 group-hover:bg-primary-500/15' : 'bg-slate-100 group-hover:bg-primary-100'
            }`}>
              <Upload size={24} className="text-primary-400" />
            </div>
            <div className="text-center">
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Click to upload your photo
              </p>
              <p className="text-xs mt-1 text-slate-500">
                JPG, PNG, WEBP &mdash; max 5 MB
              </p>
            </div>
          </button>
        )}
      </FormField>

      <FormField label="Resume / CV" id="hero-resume">
        {/* Hidden file input */}
        <input
          ref={resumeInputRef}
          id="hero-resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleResumeUpload}
        />

        {form.resumeLink || resumeFile ? (
          /* ── File loaded ── */
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            isDark ? 'bg-dark-700 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            {/* PDF icon */}
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-400" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {resumeFile ? resumeFile.name : 'Resume Uploaded'}
              </p>
              <p className="text-xs text-emerald-400 mt-0.5">✓ Ready to download</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isDark
                    ? 'border-white/10 text-slate-300 hover:bg-white/10'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Upload size={12} />
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
              >
                <X size={12} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* ── Upload zone ── */
          <button
            type="button"
            onClick={() => resumeInputRef.current?.click()}
            className={`w-full flex items-center gap-4 px-4 py-5 rounded-xl border-2 border-dashed transition-all duration-200 group ${
              isDark
                ? 'border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5'
                : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              isDark ? 'bg-white/5 group-hover:bg-primary-500/15' : 'bg-slate-100 group-hover:bg-primary-100'
            }`}>
              <Upload size={20} className="text-primary-400" />
            </div>
            <div className="text-left">
              <p className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Click to upload your Resume
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                PDF or Word &mdash; max 10 MB
              </p>
            </div>
          </button>
        )}
      </FormField>

      {/* Typing texts */}
      <div>
        <label className="block text-xs font-medium mb-2 text-slate-400">Typing Animation Texts</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {typingTexts.map((t, i) => (
            <div key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm">
              <span>{t}</span>
              <button onClick={() => removeTypingText(i)} className="hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a typing text..."
            onKeyDown={(e) => e.key === 'Enter' && addTypingText()}
          />
          <button onClick={addTypingText} className="btn-primary px-3 py-2">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-xs font-medium mb-3 text-slate-400">Social Links</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['github', 'linkedin', 'twitter', 'email', 'website'].map((key) => (
            <FormField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} id={`social-${key}`}>
              <input
                id={`social-${key}`}
                className={inputCls}
                value={socialLinks[key] || ''}
                onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                placeholder={key === 'email' ? 'you@email.com' : 'https://...'}
              />
            </FormField>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto" id="hero-save-btn">
        <Save size={16} />
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
