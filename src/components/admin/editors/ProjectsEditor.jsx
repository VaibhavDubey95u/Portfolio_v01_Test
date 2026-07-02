import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, Trash2, Edit3, Save, Star, Upload } from 'lucide-react';
import Modal from '../../ui/Modal';
import toast from 'react-hot-toast';
import { storageService } from '../../../services/storageService';

function ProjectForm({ project, onSave, onClose, isDark }) {
  const empty = {
    title: '', description: '', techStack: [], githubLink: '', liveDemo: '',
    image: '', featured: false, category: 'Full-Stack',
  };
  const [form, setForm] = useState(project ? { ...project, techStack: [...(project.techStack || [])] } : empty);
  const [techInput, setTechInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all ${
    isDark
      ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500'
  }`;

  const addTech = () => {
    if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
      setForm({ ...form, techStack: [...form.techStack, techInput.trim()] });
      setTechInput('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    let updatedForm = { ...form };
    try {
      if (imageFile) {
        const url = await storageService.uploadFile('portfolio-assets', `projects/img-${Date.now()}`, imageFile);
        updatedForm.image = url;
      }
      onSave(updatedForm);
      onClose();
    } catch (err) {
      toast.error('Failed to upload image: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project Name" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Category</label>
          <input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Full-Stack" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description *</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this project do?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">GitHub Link</label>
          <input className={inputCls} value={form.githubLink} onChange={(e) => setForm({ ...form, githubLink: e.target.value })} placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Live Demo</label>
          <input className={inputCls} value={form.liveDemo} onChange={(e) => setForm({ ...form, liveDemo: e.target.value })} placeholder="https://..." />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Image URL or Upload</label>
        <div className="flex gap-2">
          <input className={`${inputCls} flex-1`} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline px-3 flex items-center justify-center">
            <Upload size={16} />
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-2">Tech Stack</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.techStack.map((t, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-600/20 text-primary-300 text-xs">
              {t}
              <button onClick={() => setForm({ ...form, techStack: form.techStack.filter((_, idx) => idx !== i) })} className="hover:text-red-400">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={`${inputCls} flex-1`} value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add tech..." onKeyDown={(e) => e.key === 'Enter' && addTech()} />
          <button onClick={addTech} className="btn-primary px-3 text-sm">+</button>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded accent-primary-500" />
        <span className="text-sm text-slate-400">Featured project</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5"
        >
          <Save size={14} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function ProjectsEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();
  const projects = data.projects || [];
  const [modal, setModal] = useState(null); // { project? }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{projects.length} projects</p>
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2" id="add-project-btn">
          <Plus size={15} /> Add Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              isDark ? 'bg-dark-800 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-700 to-secondary-700">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">🚀</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.title}</p>
                {project.featured && <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
              </div>
              <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{project.category} · {(project.techStack || []).slice(0, 3).join(', ')}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal({ project })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <Edit3 size={14} />
              </button>
              <button onClick={() => { if (window.confirm(`Remove project "${project.title || 'this project'}"?`)) { actions.deleteProject(project.id); toast.success('Project deleted'); } }} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border border-dashed ${isDark ? 'border-white/20 text-slate-600' : 'border-slate-300 text-slate-400'}`}>
            No projects yet. Click "Add Project" to get started.
          </div>
        )}
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.project ? 'Edit Project' : 'Add Project'} size="lg">
        {modal && (
          <ProjectForm
            project={modal.project}
            isDark={isDark}
            onSave={(form) => {
              if (modal.project) {
                actions.updateProject(modal.project.id, form);
                toast.success('Project updated!');
              } else {
                actions.addProject(form);
                toast.success('Project added!');
              }
            }}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
