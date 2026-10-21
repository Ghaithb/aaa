'use client';
import { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '../../../types/user';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'CLIENT' as UserRole });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = form.role === 'PRESTATAIRE' ? '/dashboard/prestataire' : '/dashboard/client';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Link href="/" className="navbar-logo" style={{ fontSize: '2rem', display: 'block', marginBottom: 12 }}>
            FERHA ✦
          </Link>
          <p style={{ color: 'var(--text-secondary)' }}>Créez votre compte gratuit</p>
        </div>

        <div className="gradient-card" style={{ padding: '40px 36px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Bienvenue ! 🎉</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Rejoignez des milliers d'utilisateurs FERHA</p>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            {(['CLIENT', 'PRESTATAIRE'] as UserRole[]).map((r) => (
              <button key={r} type="button"
                onClick={() => setForm(f => ({ ...f, role: r }))}
                style={{
                  padding: '14px', borderRadius: 10, border: '1px solid',
                  borderColor: form.role === r ? 'var(--primary)' : 'var(--border)',
                  background: form.role === r ? 'rgba(249,115,22,0.1)' : 'var(--bg-card-2)',
                  color: form.role === r ? 'var(--primary)' : 'var(--text-secondary)',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {r === 'CLIENT' ? '👰 Client' : '🛠️ Prestataire'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', marginBottom: 20, fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prénom</label>
                <input id="firstName" className="input-field" placeholder="Sarra" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nom</label>
                <input id="lastName" className="input-field" placeholder="Mansour" value={form.lastName} onChange={set('lastName')} required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>E-mail</label>
              <input id="email" type="email" className="input-field" placeholder="vous@exemple.com" value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mot de passe (6+ caractères)</label>
              <input id="password" type="password" className="input-field" placeholder="••••••••" value={form.password} onChange={set('password')} minLength={6} required />
            </div>

            <button type="submit" className="btn-primary" id="register-btn" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Création...' : '🚀 Créer mon compte'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Déjà un compte ?{' '}
            <Link href="/connexion" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
