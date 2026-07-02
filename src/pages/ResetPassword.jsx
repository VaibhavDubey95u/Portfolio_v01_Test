import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useTheme } from '../context/ThemeContext';

function cls(isDark, hasError) {
  const base = 'w-full pl-10 pr-12 py-3 rounded-xl text-sm border outline-none transition-all duration-200';
  const dark  = `bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500${hasError ? ' !border-red-500/60' : ''}`;
  const light = `bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500${hasError ? ' !border-red-400' : ''}`;
  return `${base} ${isDark ? dark : light}`;
}

function PwField({ id, value, onChange, show, onToggle, placeholder, isDark, hasError, autoFocus }) {
  return (
    <div className="relative">
      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        autoFocus={autoFocus}
        className={cls(isDark, hasError)}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}

export default function ResetPassword() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [resetPw, setResetPw] = useState('');
  const [resetCfm, setResetCfm] = useState('');
  const [showRPw, setShowRPw] = useState(false);
  const [showRCfm, setShowRCfm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleReset(e) {
    e.preventDefault();
    setError('');

    if (resetPw.length < 6) {
      setError('Password must be at least 6 characters.'); 
      return;
    }
    if (resetPw !== resetCfm) {
      setError('Passwords do not match.'); 
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: resetPw
      });

      if (updateError) throw updateError;

      setSuccessMsg('Password updated! Taking you to login…');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  }

  const cardBg = isDark ? 'bg-dark-900' : 'bg-slate-50';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${cardBg}`}>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, type: 'spring', damping: 22 }}
        className={`w-full max-w-md glass-card p-8 relative z-10 ${!isDark && 'glass-card-light'}`}
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-glow"
          >
            <KeyRound size={30} className="text-white" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
        >
          <h1 className={`text-2xl font-bold text-center mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Set New Password
          </h1>
          <p className={`text-center text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Please enter your new password below
          </p>

          {successMsg ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <CheckCircle size={44} className="text-emerald-400" />
              <p className="text-emerald-400 text-sm font-medium text-center">{successMsg}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleReset} className="space-y-3">
              <PwField
                id="reset-pw" value={resetPw}
                onChange={(e) => { setResetPw(e.target.value); setError(''); }}
                show={showRPw} onToggle={() => setShowRPw((v) => !v)}
                placeholder="New Password (min. 6 chars)"
                isDark={isDark} hasError={!!error} autoFocus
              />
              <PwField
                id="reset-confirm" value={resetCfm}
                onChange={(e) => { setResetCfm(e.target.value); setError(''); }}
                show={showRCfm} onToggle={() => setShowRCfm((v) => !v)}
                placeholder="Confirm New Password"
                isDark={isDark} hasError={!!error}
              />
              
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs text-center"
                >
                  {error}
                </motion.p>
              )}
              
              <motion.button
                type="submit"
                id="reset-password-btn"
                disabled={!resetPw || !resetCfm || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              >
                {loading ? <Spinner /> : <><KeyRound size={16} />Update Password</>}
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
