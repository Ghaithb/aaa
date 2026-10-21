'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = data.user.role === 'PRESTATAIRE' ? '/dashboard/prestataire' : '/dashboard/client';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Link href="/" className="navbar-logo" style={{ fontSize: '2rem', display: 'block', marginBottom: 12 }}>
            FERHA ✦
          </Link>
          <p style={{ color: 'var(--text-secondary)' }}>سهل عليك فرحك</p>
        </div>

        <div className="gradient-card" style={{ padding: '40px 36px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Bon retour ! 👋</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Connectez-vous à votre compte FERHA</p>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', marginBottom: 24, fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" id="login-btn" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Pas encore de compte ?{' '}
            <Link href="/inscription" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
