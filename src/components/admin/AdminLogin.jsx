import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Eye, EyeOff, Shield, UserPlus, LogIn,
  CheckCircle, Mail, KeyRound, ArrowLeft,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/authService';

// Removed localStorage constants and helpers
import { supabase } from '../../services/supabaseClient';
/* ─────────────────────────────────────────────────────────────
   Input class helper  (pure function, no hooks)
───────────────────────────────────────────────────────────── */
function cls(isDark, hasError) {
  const base = 'w-full pl-10 pr-12 py-3 rounded-xl text-sm border outline-none transition-all duration-200';
  const dark  = `bg-dark-700 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500${hasError ? ' !border-red-500/60' : ''}`;
  const light = `bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500${hasError ? ' !border-red-400' : ''}`;
  return `${base} ${isDark ? dark : light}`;
}

/* ─────────────────────────────────────────────────────────────
   Presentational components  (defined OUTSIDE parent component
   so React never remounts them on re-render → no focus loss)
───────────────────────────────────────────────────────────── */

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

function EmailField({ id, value, onChange, placeholder, isDark, hasError, autoFocus }) {
  return (
    <div className="relative">
      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        id={id}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="email"
        autoFocus={autoFocus}
        className={cls(isDark, hasError)}
      />
    </div>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}

function SubmitBtn({ id, disabled, loading, Icon, label }) {
  return (
    <motion.button
      type="submit"
      id={id}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
    >
      {loading ? <Spinner /> : <><Icon size={16} />{label}</>}
    </motion.button>
  );
}

function ErrMsg({ msg }) {
  if (!msg) return null;
  return (
    <motion.p
      key={msg}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-400 text-xs text-center"
    >
      {msg}
    </motion.p>
  );
}

function OkPanel({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 py-4"
    >
      <CheckCircle size={44} className="text-emerald-400" />
      <p className="text-emerald-400 text-sm font-medium text-center">{msg}</p>
    </motion.div>
  );
}

function BackBtn({ onClick, isDark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs mt-5 mx-auto transition-colors ${
        isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <ArrowLeft size={12} /> Back to Login
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
export default function AdminLogin({ onLogin }) {
  const { isDark } = useTheme();

  /* Derive initial mode from localStorage — reactive via state */
  const [mode, setMode] = useState('login'); // Default to login with Supabase

  /* Loading / feedback */
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  /* Per-mode field state */
  const [signupEmail,   setSignupEmail]   = useState('');
  const [signupPw,      setSignupPw]      = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSPw,       setShowSPw]       = useState(false);
  const [showSCfm,      setShowSCfm]      = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw,    setLoginPw]    = useState('');
  const [showLPw,    setShowLPw]    = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');

  const [resetPw,   setResetPw]   = useState('');
  const [resetCfm,  setResetCfm]  = useState('');
  const [showRPw,   setShowRPw]   = useState(false);
  const [showRCfm,  setShowRCfm]  = useState(false);

  /* Navigate between modes */
  function goTo(next) {
    setError('');
    setSuccessMsg('');
    setMode(next);
  }

  /* ── SIGN-UP ── */
  async function handleSignup(e) {
    e.preventDefault();
    setError('');

    if (!/\S+@\S+\.\S+/.test(signupEmail.trim())) {
      setError('Please enter a valid email address.'); return;
    }
    if (signupPw.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (signupPw !== signupConfirm) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    // Removed localStorage logic here

    setLoading(false);
    setSuccessMsg('Account created! Taking you to login…');
    setTimeout(() => {
      setSuccessMsg('');
      setSignupEmail(''); setSignupPw(''); setSignupConfirm('');
      setMode('login');   // ← reactive: now hasPassword() is true
    }, 1800);
  }

  /* ── LOGIN ── */
  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.signIn(loginEmail, loginPw);
      onLogin();
    } catch (err) {
      setError(err.message || 'Incorrect credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ── FORGOT – verify email ── */
  async function handleForgotVerify(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.toLowerCase().trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;

      setSuccessMsg("We've sent a password reset link to your email address.");
      setTimeout(() => {
        setSuccessMsg('');
        setForgotEmail('');
        goTo('login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error sending reset email.');
    } finally {
      setLoading(false);
    }
  }

  /* ── RESET – set new password ── */
  async function handleReset(e) {
    e.preventDefault();
    setError('');

    if (resetPw.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (resetPw !== resetCfm) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    // Removed localStorage logic here

    setLoading(false);
    setSuccessMsg('Password updated! Taking you to login…');
    setTimeout(() => {
      setSuccessMsg('');
      setResetPw(''); setResetCfm('');
      setMode('login');
    }, 1800);
  }

  /* ── Shared card shell ── */
  const cardBg = isDark ? 'bg-dark-900' : 'bg-slate-50';
  const isKeyMode = mode === 'forgot' || mode === 'reset';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${cardBg}`}>
      {/* Ambient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, type: 'spring', damping: 22 }}
        className={`w-full max-w-md glass-card p-8 relative z-10 ${!isDark && 'glass-card-light'}`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            key={isKeyMode ? 'key' : 'shield'}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-glow"
          >
            {isKeyMode
              ? <KeyRound size={30} className="text-white" />
              : <Shield size={32} className="text-white" />}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">

          {/* ══════════════ SIGN-UP ══════════════ */}
          {mode === 'signup' && (
            <motion.div key="signup"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>

              <h1 className={`text-2xl font-bold text-center mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Create Admin Account
              </h1>
              <p className={`text-center text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Set your email &amp; password to secure the admin panel
              </p>

              {successMsg
                ? <OkPanel msg={successMsg} />
                : (
                  <form onSubmit={handleSignup} className="space-y-3" noValidate>
                    <EmailField
                      id="signup-email" value={signupEmail}
                      onChange={(e) => { setSignupEmail(e.target.value); setError(''); }}
                      placeholder="Your Email Address"
                      isDark={isDark} hasError={!!error} autoFocus
                    />
                    <PwField
                      id="signup-pw" value={signupPw}
                      onChange={(e) => { setSignupPw(e.target.value); setError(''); }}
                      show={showSPw} onToggle={() => setShowSPw((v) => !v)}
                      placeholder="Password (min. 6 chars)"
                      isDark={isDark} hasError={!!error}
                    />
                    <PwField
                      id="signup-confirm" value={signupConfirm}
                      onChange={(e) => { setSignupConfirm(e.target.value); setError(''); }}
                      show={showSCfm} onToggle={() => setShowSCfm((v) => !v)}
                      placeholder="Confirm Password"
                      isDark={isDark} hasError={!!error}
                    />
                    <ErrMsg msg={error} />
                    <SubmitBtn
                      id="admin-signup-btn" Icon={UserPlus} label="Create Account"
                      loading={loading} disabled={!signupEmail || !signupPw || !signupConfirm}
                    />
                  </form>
                )}
            </motion.div>
          )}

          {/* ══════════════ LOGIN ══════════════ */}
          {mode === 'login' && (
            <motion.div key="login"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>

              <h1 className={`text-2xl font-bold text-center mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Admin Panel
              </h1>
              <p className={`text-center text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter your email &amp; password to continue
              </p>

              <form onSubmit={handleLogin} className="space-y-3" noValidate>
                <EmailField
                  id="login-email" value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setError(''); }}
                  placeholder="Admin Email Address"
                  isDark={isDark} hasError={!!error} autoFocus
                />
                <PwField
                  id="login-pw" value={loginPw}
                  onChange={(e) => { setLoginPw(e.target.value); setError(''); }}
                  show={showLPw} onToggle={() => setShowLPw((v) => !v)}
                  placeholder="Admin Password"
                  isDark={isDark} hasError={!!error}
                />
                <ErrMsg msg={error} />
                <SubmitBtn
                  id="admin-login-btn" Icon={LogIn} label="Login"
                  loading={loading} disabled={!loginEmail || !loginPw}
                />
              </form>

              <div className="text-center mt-5">
                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() => { setLoginEmail(''); setLoginPw(''); setError(''); goTo('forgot'); }}
                  className={`text-xs underline underline-offset-2 transition-colors ${
                    isDark ? 'text-slate-500 hover:text-primary-400' : 'text-slate-400 hover:text-primary-600'
                  }`}
                >
                  Forgot your password?
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════ FORGOT – verify email ══════════════ */}
          {mode === 'forgot' && (
            <motion.div key="forgot"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>

              <h1 className={`text-2xl font-bold text-center mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Forgot Password?
              </h1>
              <p className={`text-center text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter the email you registered with to verify your identity
              </p>

              {successMsg
                ? <OkPanel msg={successMsg} />
                : (
                  <form onSubmit={handleForgotVerify} className="space-y-3" noValidate>
                    <EmailField
                      id="forgot-email" value={forgotEmail}
                      onChange={(e) => { setForgotEmail(e.target.value); setError(''); }}
                      placeholder="Your Admin Email"
                      isDark={isDark} hasError={!!error} autoFocus
                    />
                    <ErrMsg msg={error} />
                    <SubmitBtn
                      id="verify-email-btn" Icon={Mail} label="Verify Email"
                      loading={loading} disabled={!forgotEmail}
                    />
                  </form>
                )}

              {!successMsg && (
                <div className="flex justify-center">
                  <BackBtn onClick={() => goTo('login')} isDark={isDark} />
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════ RESET – new password ══════════════ */}
          {mode === 'reset' && (
            <motion.div key="reset"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>

              <h1 className={`text-2xl font-bold text-center mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Set New Password
              </h1>
              <p className={`text-center text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Email verified ✓ — choose your new password below
              </p>

              {successMsg
                ? <OkPanel msg={successMsg} />
                : (
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
                    <ErrMsg msg={error} />
                    <SubmitBtn
                      id="admin-reset-pw-btn" Icon={KeyRound} label="Reset Password"
                      loading={loading} disabled={!resetPw || !resetCfm}
                    />
                  </form>
                )}

              {!successMsg && (
                <div className="flex justify-center">
                  <BackBtn onClick={() => goTo('login')} isDark={isDark} />
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
