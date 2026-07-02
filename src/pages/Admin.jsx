import React, { useState, useEffect, useCallback } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import AdminPanel from '../components/admin/AdminPanel';
import { authService } from '../services/authService';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    authService.getSession().then((session) => {
      setSession(session);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    // Listen for auth changes
    const { data } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogin = useCallback(() => {
    // This is handled by onAuthStateChange, but we can optionally do something here
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;
  }

  return session ? (
    <AdminPanel onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}
