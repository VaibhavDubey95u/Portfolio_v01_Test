import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, Trash2, Edit3, Save, Upload } from 'lucide-react';
import Modal from '../../ui/Modal';
import toast from 'react-hot-toast';
import { storageService } from '../../../services/storageService';

function CertForm({ item, onSave, onClose, isDark }) {
  const empty = { name: '', issuer: '', issueDate: '', expiryDate: '', certificateUrl: '', badge: '📜', credentialId: '' };
  const [form, setForm] = useState(item || empty);
  const [certFile, setCertFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  
  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all ${isDark ? 'bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500'}`;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, certificateUrl: file.name })); // Just show name as temp
    };
    reader.readAsDataURL(file);
    setCertFile(file);
  };

  const handleSave = async () => {
    if (!form.name || !form.issuer) return;
    setSaving(true);
    let updatedForm = { ...form };
    try {
      if (certFile) {
        const url = await storageService.uploadFile('portfolio-assets', `certs/cert-${Date.now()}`, certFile);
        updatedForm.certificateUrl = url;
      }
      onSave(updatedForm);
      onClose();
    } catch (err) {
      toast.error('Failed to upload file: ' + err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Badge</label>
          <input className={inputCls} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="📜" />
        </div>
        <div className="col-span-3">
          <label className="block text-xs text-slate-400 mb-1">Certification Name *</label>
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="AWS Solutions Architect" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Issuing Organization *</label>
        <input className={inputCls} value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Amazon Web Services" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Issue Date</label>
          <input className={inputCls} value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} placeholder="March 2024" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Expiry Date</label>
          <input className={inputCls} value={form.expiryDate || ''} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} placeholder="March 2027 (or leave blank)" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Certificate URL or Upload File</label>
        <div className="flex gap-2">
          <input className={`${inputCls} flex-1`} value={form.certificateUrl} onChange={(e) => setForm({ ...form, certificateUrl: e.target.value })} placeholder="https://..." />
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline px-3 flex items-center justify-center">
            <Upload size={16} />
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Credential ID</label>
        <input className={inputCls} value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} placeholder="AWS-SAA-XXXXX" />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5">
          <Save size={14} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function CertificationsEditor() {
  const { data, actions } = usePortfolio();
  const { isDark } = useTheme();
  const certifications = data.certifications || [];
  const [modal, setModal] = useState(null);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex justify-end">
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2" id="add-certification-btn">
          <Plus size={15} /> Add Certification
        </button>
      </div>
      <div className="space-y-3">
        {certifications.map((cert) => (
          <div key={cert.id} className={`flex items-center gap-4 p-4 rounded-xl border ${isDark ? 'bg-dark-800 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-2xl flex-shrink-0">{cert.badge || '📜'}</div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{cert.name}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cert.issuer} · {cert.issueDate}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal({ item: cert })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Edit3 size={14} /></button>
              <button onClick={() => { if (window.confirm(`Remove certification "${cert.name || 'this certification'}"?`)) { actions.deleteCertification(cert.id); toast.success('Certification deleted'); } }} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.item ? 'Edit Certification' : 'Add Certification'} size="md">
        {modal && (
          <CertForm
            item={modal.item} isDark={isDark}
            onSave={(form) => { if (modal.item) { actions.updateCertification(modal.item.id, form); toast.success('Certification updated!'); } else { actions.addCertification(form); toast.success('Certification added!'); } }}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
