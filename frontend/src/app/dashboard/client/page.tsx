'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Event { id: string; title: string; type: string; date: string; governorate: string; status: string; _count: { bookings: number; guests: number; tasks: number }; budgetMillimes: number; }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'badge-warning', PLANNING: 'badge-primary', CONFIRMED: 'badge-success',
  COMPLETED: 'badge-success', CANCELLED: 'badge-danger',
};

const EVENT_ICONS: Record<string, string> = {
  MARIAGE: '💍', FIANCES: '💐', BAPTEME: '👼', ANNIVERSAIRE: '🎂',
  CONFERENCE: '🎤', SOIREE: '✨', SEMINAIRE: '📋', AUTRE: '🎉',
};

export default function ClientDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'MARIAGE', date: '', governorate: 'Tunis', city: '', guestCount: '', budgetMillimes: '' });

  useEffect(() => {
    const u = localStorage.getItem('user');
    const t = localStorage.getItem('token');
    if (!u || !t) { window.location.href = '/connexion'; return; }
    setUser(JSON.parse(u));
    fetch(`${API}/api/v1/events`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(setEvents).finally(() => setLoading(false));
  }, []);

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await fetch(`${API}/api/v1/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ ...form, guestCount: +form.guestCount || undefined, budgetMillimes: form.budgetMillimes ? +form.budgetMillimes * 1000 : undefined }),
    });
    if (res.ok) {
      const ev = await res.json();
      setEvents(p => [ev, ...p]);
      setShowCreate(false);
    }
  };

  const totalBudget = events.reduce((s, e) => s + (e.budgetMillimes || 0), 0);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'var(--text-secondary)' }}>Chargement...</div>;

  return (
    <main style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      {/* Top bar */}
      <nav className="navbar">
        <span className="navbar-logo">FERHA ✦</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Bonjour, <strong style={{ color: 'var(--text-primary)' }}>{user?.firstName}</strong> 👋
          </span>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 100 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8 }}>
              Mes <span className="gradient-text">événements</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>{events.length} événement{events.length !== 1 ? 's' : ''} planifié{events.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            ✦ Créer un événement
          </button>
        </div>

        {/* KPIs */}
        <div className="grid-4" style={{ marginBottom: 48 }}>
          {[
            { label: 'Événements', value: events.length, icon: '🎉' },
            { label: 'Budget total (DT)', value: (totalBudget / 1000).toLocaleString('fr-TN'), icon: '💰' },
            { label: 'Invités total', value: events.reduce((s, e) => s + (e._count?.guests || 0), 0), icon: '👥' },
            { label: 'Prestataires réservés', value: events.reduce((s, e) => s + (e._count?.bookings || 0), 0), icon: '🛠️' },
          ].map((kpi, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: '2rem' }}>{kpi.icon}</div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{kpi.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Events grid */}
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 12, fontWeight: 700 }}>Aucun événement pour le moment</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Créez votre premier événement pour commencer à organiser votre journée parfaite.</p>
            <button className="btn-primary" onClick={() => setShowCreate(true)}>Créer mon premier événement</button>
          </div>
        ) : (
          <div className="grid-3">
            {events.map(ev => (
              <Link key={ev.id} href={`/dashboard/client/evenements/${ev.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ fontSize: '2rem' }}>{EVENT_ICONS[ev.type] || '🎉'}</div>
                    <span className={`badge ${STATUS_BADGE[ev.status] || 'badge-primary'}`}>{ev.status}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{ev.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
                    📅 {new Date(ev.date).toLocaleDateString('fr-TN', { day: 'numeric', month: 'long', year: 'numeric' })} · 📍 {ev.governorate}
                  </p>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span>👥 {ev._count?.guests || 0} invités</span>
                    <span>🛠️ {ev._count?.bookings || 0} réservations</span>
                    <span>✅ {ev._count?.tasks || 0} tâches</span>
                  </div>
                  {ev.budgetMillimes && (
                    <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(249,115,22,0.08)', borderRadius: 8, fontSize: '0.9rem' }}>
                      💰 Budget: <strong>{(ev.budgetMillimes / 1000).toLocaleString('fr-TN')} DT</strong>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Modal Create Event */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
          <div className="gradient-card" style={{ width: '100%', maxWidth: 520, padding: 40, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>✨ Nouvel événement</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
            </div>
            <form onSubmit={createEvent} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Titre de l'événement</label>
                <input className="input-field" placeholder="Mariage de Sarra et Ahmed" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Type</label>
                  <select className="input-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {['MARIAGE', 'FIANCES', 'BAPTEME', 'ANNIVERSAIRE', 'CONFERENCE', 'SOIREE', 'SEMINAIRE', 'AUTRE'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date</label>
                  <input type="date" className="input-field" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gouvernorat</label>
                  <select className="input-field" value={form.governorate} onChange={e => setForm(f => ({ ...f, governorate: e.target.value }))}>
                    {['Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Bizerte', 'Beja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabes', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili', 'Zaghouan'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ville</label>
                  <input className="input-field" placeholder="Tunis" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nombre d'invités</label>
                  <input type="number" className="input-field" placeholder="120" value={form.guestCount} onChange={e => setForm(f => ({ ...f, guestCount: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Budget (DT)</label>
                  <input type="number" className="input-field" placeholder="5000" value={form.budgetMillimes} onChange={e => setForm(f => ({ ...f, budgetMillimes: e.target.value }))} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                🎉 Créer l'événement
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
