import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Globe, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionWrapper, SectionHeader } from '../ui';
import { validateEmail } from '../../utils/helpers';
import { portfolioService } from '../../services/portfolioService';

const SOCIAL_CONFIG = [
  { key: 'github', icon: Github, label: 'GitHub', color: 'hover:text-white' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' },
  { key: 'twitter', icon: Twitter, label: 'Twitter', color: 'hover:text-sky-400' },
  { key: 'website', icon: Globe, label: 'Website', color: 'hover:text-emerald-400' },
];

export default function Contact() {
  const { data } = usePortfolio();
  const { isDark } = useTheme();
  const { contact } = data;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Invalid email address';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('sending');
    try {
      await portfolioService.addMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setStatus('error');
      // Briefly show error state
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputClass = (field) => `
    w-full px-4 py-3 rounded-xl text-sm border transition-all duration-200 outline-none
    ${isDark
      ? `bg-dark-700/50 border-white/10 text-slate-100 placeholder:text-slate-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 ${errors[field] ? 'border-red-500/60' : ''}`
      : `bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 ${errors[field] ? 'border-red-400' : ''}`
    }
  `;

  const contactItems = [
    { icon: Mail, label: 'Email', value: contact?.email, href: `mailto:${contact?.email}` },
    { icon: Phone, label: 'Phone', value: contact?.phone, href: `tel:${contact?.phone}` },
    { icon: MapPin, label: 'Location', value: contact?.location, href: null },
  ].filter((c) => c.value);

  return (
    <SectionWrapper id="contact" className={isDark ? 'bg-dark-800/30' : 'bg-slate-100/50'}>
      <SectionHeader
        title="Get In Touch"
        subtitle="Have a project in mind or just want to chat? I'd love to hear from you."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Availability badge */}
          {contact?.availability && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  {contact.availability}
                </p>
                {contact.preferredContact && (
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Preferred: {contact.preferredContact}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Contact items */}
          <div className="space-y-4">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <motion.div
                key={label}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600/30 to-secondary-500/30 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                  {href ? (
                    <a href={href} className={`text-sm font-medium hover:text-primary-400 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {value}
                    </a>
                  ) : (
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social links */}
          <div>
            <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Connect with me on social media:
            </p>
            <div className="flex gap-3">
              {SOCIAL_CONFIG.map(({ key, icon: Icon, label, color }) => {
                const href = contact?.[key];
                if (!href) return null;
                return (
                  <motion.a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isDark
                        ? `bg-white/10 text-slate-400 border border-white/10 hover:border-primary-500/40 hover:shadow-glow ${color}`
                        : `bg-white text-slate-500 border border-slate-200 hover:border-primary-300 ${color}`
                    }`}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={`glass-card p-8 ${!isDark && 'glass-card-light'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Send a Message
            </h3>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center gap-4"
              >
                <CheckCircle size={48} className="text-emerald-400" />
                <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Message Sent!
                </h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Thanks for reaching out! I'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      id="contact-name"
                      className={inputClass('name')}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      id="contact-email"
                      className={inputClass('email')}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  id="contact-subject"
                  className={inputClass('subject')}
                />

                <div>
                  <textarea
                    placeholder="Your Message *"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    id="contact-message"
                    rows={5}
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="contact-submit"
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
