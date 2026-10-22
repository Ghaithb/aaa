'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Tab = 'overview' | 'budget' | 'tasks' | 'guests' | 'quotes';

interface Event { id: string; title: string; type: string; date: string; governorate: string; city: string; guestCount: number; budgetMillimes: number; status: string; bookings: any[]; budgetLines: any[]; tasks: any[]; guests: any[]; quoteRequests: any[]; }

const token = () => localStorage.getItem('token') || '';

export default function EventWorkspace({ params }: { params: { id: string } }) {
  const { id } = use(params as any) as { id: string };
  const [event, setEvent] = useState<Event | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/v1/events/${id}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json()).then(setEvent).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'var(--text-secondary)' }}>Chargement...</div>;
  if (!event) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'var(--danger)' }}>Événement introuvable</div>;

  const spent = event.budgetLines?.reduce((s: number, l: any) => s + l.actualMillimes, 0) || 0;
  const estimated = event.budgetLines?.reduce((s: number, l: any) => s + l.estimatedMillimes, 0) || 0;
  const budgetPct = event.budgetMillimes ? Math.round((spent / event.budgetMillimes) * 100) : 0;

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: '📊 Aperçu' },
    { key: 'budget', label: '💰 Budget' },
    { key: 'tasks', label: '✅ Tâches' },
    { key: 'guests', label: '👥 Invités' },
    { key: 'quotes', label: '📋 Devis' },
  ];

  return (
    <main style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard/client" className="navbar-logo" style={{ fontSize: '1.2rem' }}>← FERHA</Link>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{event.title}</span>
        </div>
        <span className="badge badge-primary">{event.status}</span>
      </nav>

      <div className="container" style={{ paddingTop: 90 }}>
        {/* Event header */}
        <div style={{ padding: '32px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>{event.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            📅 {new Date(event.date).toLocaleDateString('fr-TN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · 📍 {event.city}, {event.governorate} · 👥 {event.guestCount} invités
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--bg-card)', borderRadius: 12, padding: 4, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', transition: 'all 0.2s',
                background: tab === t.key ? 'var(--primary)' : 'transparent',
                color: tab === t.key ? 'white' : 'var(--text-secondary)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid-2" style={{ gap: 24 }}>
            {/* Budget overview */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>💰 Budget</h3>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Dépensé</span>
                  <span style={{ fontWeight: 600 }}>{(spent / 1000).toFixed(0)} / {(event.budgetMillimes / 1000).toFixed(0)} DT</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-card-2)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(budgetPct, 100)}%`, background: budgetPct > 90 ? 'var(--danger)' : 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 999, transition: 'width 0.5s' }} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 6 }}>{budgetPct}% utilisé</p>
              </div>
            </div>
            {/* Tasks overview */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>✅ Tâches</h3>
              {['TODO', 'IN_PROGRESS', 'DONE'].map(s => {
                const count = event.tasks?.filter((t: any) => t.status === s).length || 0;
                return (
                  <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{s === 'TODO' ? '🔲 À faire' : s === 'IN_PROGRESS' ? '🔄 En cours' : '✅ Terminé'}</span>
                    <span style={{ fontWeight: 600 }}>{count}</span>
                  </div>
                );
              })}
            </div>
            {/* Guests overview */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>👥 Invités</h3>
              {[['CONFIRMED', '✅ Confirmés'], ['PENDING', '⏳ En attente'], ['DECLINED', '❌ Déclinés']].map(([s, label]) => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{event.guests?.filter((g: any) => g.rsvpStatus === s).length || 0}</span>
                </div>
              ))}
            </div>
            {/* Bookings overview */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🛠️ Prestataires réservés</h3>
              {event.bookings?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aucune réservation pour le moment</p>
              ) : event.bookings?.map((b: any) => (
                <div key={b.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                  <strong>{b.provider?.businessName}</strong>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: 12 }}>{(b.totalMillimes / 1000).toFixed(0)} DT</span>
                  <span className={`badge ${b.contractSigned ? 'badge-success' : 'badge-warning'}`} style={{ marginLeft: 8, fontSize: '0.7rem' }}>
                    {b.contractSigned ? 'Contrat signé' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUDGET */}
        {tab === 'budget' && <BudgetTab eventId={id} lines={event.budgetLines} total={event.budgetMillimes} />}

        {/* TASKS */}
        {tab === 'tasks' && <TasksTab eventId={id} tasks={event.tasks} />}

        {/* GUESTS */}
        {tab === 'guests' && <GuestsTab eventId={id} guests={event.guests} />}

        {/* QUOTES */}
        {tab === 'quotes' && <QuotesTab eventId={id} requests={event.quoteRequests} />}
      </div>
    </main>
  );
}

/* ── Budget Tab ─────────────────────────────────────────────────── */
function BudgetTab({ eventId, lines, total }: { eventId: string; lines: any[]; total: number }) {
  const [items, setItems] = useState(lines || []);
  const [form, setForm] = useState({ category: '', label: '', estimatedMillimes: '', actualMillimes: '' });

  const addLine = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/v1/events/${eventId}/budget`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ ...form, estimatedMillimes: +form.estimatedMillimes * 1000, actualMillimes: +form.actualMillimes * 1000 }),
    });
    if (res.ok) { const l = await res.json(); setItems(p => [...p, l]); setForm({ category: '', label: '', estimatedMillimes: '', actualMillimes: '' }); }
  };

  const totalEst = items.reduce((s, l) => s + l.estimatedMillimes, 0);
  const totalAct = items.reduce((s, l) => s + l.actualMillimes, 0);

  return (
    <div>
      <div className="grid-3" style={{ marginBottom: 32 }}>
        <div className="card" style={{ textAlign: 'center' }}><div className="stat-number">{(total / 1000).toLocaleString('fr-TN')}</div><div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>DT Budget total</div></div>
        <div className="card" style={{ textAlign: 'center' }}><div className="stat-number">{(totalEst / 1000).toLocaleString('fr-TN')}</div><div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>DT Estimé</div></div>
        <div className="card" style={{ textAlign: 'center' }}><div className="stat-number" style={{ background: totalAct > total ? 'var(--danger)' : undefined, WebkitBackgroundClip: totalAct > total ? 'unset' : undefined, WebkitTextFillColor: totalAct > total ? 'var(--danger)' : undefined }}>{(totalAct / 1000).toLocaleString('fr-TN')}</div><div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>DT Dépensé</div></div>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Ajouter une ligne budgétaire</h3>
        <form onSubmit={addLine}>
          <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
            <input className="input-field" placeholder="Catégorie (ex: Traiteur)" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
            <input className="input-field" placeholder="Libellé" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
            <input type="number" className="input-field" placeholder="Montant estimé (DT)" value={form.estimatedMillimes} onChange={e => setForm(f => ({ ...f, estimatedMillimes: e.target.value }))} required />
            <input type="number" className="input-field" placeholder="Montant réel (DT)" value={form.actualMillimes} onChange={e => setForm(f => ({ ...f, actualMillimes: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>+ Ajouter</button>
        </form>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((l, i) => (
          <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginRight: 12, fontSize: '0.75rem' }}>{l.category}</span>
              <strong>{l.label}</strong>
            </div>
            <div style={{ display: 'flex', gap: 24, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Est: <strong style={{ color: 'var(--text-primary)' }}>{(l.estimatedMillimes / 1000).toFixed(0)} DT</strong></span>
              <span>Réel: <strong style={{ color: l.actualMillimes > l.estimatedMillimes ? 'var(--danger)' : 'var(--success)' }}>{(l.actualMillimes / 1000).toFixed(0)} DT</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tasks Tab ──────────────────────────────────────────────────── */
function TasksTab({ eventId, tasks }: { eventId: string; tasks: any[] }) {
  const [items, setItems] = useState(tasks || []);
  const [form, setForm] = useState({ title: '', dueDate: '', priority: 'MEDIUM' });

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/v1/events/${eventId}/tasks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(form),
    });
    if (res.ok) { const t = await res.json(); setItems(p => [...p, t]); setForm({ title: '', dueDate: '', priority: 'MEDIUM' }); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/v1/events/${eventId}/tasks/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ status }),
    });
    setItems(p => p.map(t => t.id === id ? { ...t, status } : t));
  };

  const PRIORITY_COLORS: Record<string, string> = { LOW: 'badge-primary', MEDIUM: 'badge-warning', HIGH: 'badge-danger', URGENT: 'badge-danger' };

  return (
    <div>
      <div className="card" style={{ marginBottom: 28 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Ajouter une tâche</h3>
        <form onSubmit={addTask}>
          <div className="grid-3" style={{ gap: 14, marginBottom: 14 }}>
            <input className="input-field" placeholder="Titre de la tâche" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            <input type="date" className="input-field" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            <select className="input-field" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>+ Ajouter</button>
        </form>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
          <div key={status}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {status === 'TODO' ? '🔲 À faire' : status === 'IN_PROGRESS' ? '🔄 En cours' : '✅ Terminé'}
            </h4>
            {items.filter(t => t.status === status).map(t => (
              <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`badge ${PRIORITY_COLORS[t.priority]}`} style={{ fontSize: '0.7rem' }}>{t.priority}</span>
                  <span style={{ fontWeight: 500, textDecoration: status === 'DONE' ? 'line-through' : 'none', opacity: status === 'DONE' ? 0.6 : 1 }}>{t.title}</span>
                  {t.dueDate && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>· {new Date(t.dueDate).toLocaleDateString('fr-TN')}</span>}
                </div>
                <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                  style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  {['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Guests Tab ─────────────────────────────────────────────────── */
function GuestsTab({ eventId, guests }: { eventId: string; guests: any[] }) {
  const [items, setItems] = useState(guests || []);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', group: '' });
  const counts = { total: items.length, confirmed: items.filter(g => g.rsvpStatus === 'CONFIRMED').length, pending: items.filter(g => g.rsvpStatus === 'PENDING').length, declined: items.filter(g => g.rsvpStatus === 'DECLINED').length };

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/v1/events/${eventId}/guests`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(form),
    });
    if (res.ok) { const g = await res.json(); setItems(p => [...p, g]); setForm({ firstName: '', lastName: '', phone: '', group: '' }); }
  };

  const updateRsvp = async (id: string, rsvpStatus: string) => {
    await fetch(`${API}/api/v1/events/${eventId}/guests/${id}/rsvp`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ rsvpStatus }),
    });
    setItems(p => p.map(g => g.id === id ? { ...g, rsvpStatus } : g));
  };

  return (
    <div>
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[['Total', counts.total, '👥'], ['Confirmés', counts.confirmed, '✅'], ['En attente', counts.pending, '⏳'], ['Déclinés', counts.declined, '❌']].map(([l, v, i]) => (
          <div key={l as string} className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{i}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{v}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Ajouter un invité</h3>
        <form onSubmit={addGuest}>
          <div className="grid-4" style={{ gap: 12, marginBottom: 12 }}>
            <input className="input-field" placeholder="Prénom" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
            <input className="input-field" placeholder="Nom" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required />
            <input className="input-field" placeholder="Téléphone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <input className="input-field" placeholder="Groupe (famille, amis...)" value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>+ Ajouter</button>
        </form>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(g => (
          <div key={g.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px' }}>
            <div>
              <strong>{g.firstName} {g.lastName}</strong>
              {g.group && <span style={{ color: 'var(--text-secondary)', marginLeft: 12, fontSize: '0.85rem' }}>{g.group}</span>}
              {g.phone && <span style={{ color: 'var(--text-secondary)', marginLeft: 12, fontSize: '0.85rem' }}>📞 {g.phone}</span>}
            </div>
            <select value={g.rsvpStatus} onChange={e => updateRsvp(g.id, e.target.value)}
              style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
              {['PENDING', 'CONFIRMED', 'DECLINED', 'MAYBE'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Quotes Tab ─────────────────────────────────────────────────── */
function QuotesTab({ eventId, requests }: { eventId: string; requests: any[] }) {
  const [items, setItems] = useState(requests || []);
  const [form, setForm] = useState({ providerId: '', message: '' });

  const sendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/v1/quote-requests`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ eventId, ...form }),
    });
    if (res.ok) { const q = await res.json(); setItems(p => [...p, q]); setForm({ providerId: '', message: '' }); }
  };

  const STATUS_COLORS: Record<string, string> = { PENDING: 'badge-warning', QUOTED: 'badge-primary', ACCEPTED: 'badge-success', REJECTED: 'badge-danger' };

  return (
    <div>
      <div className="card" style={{ marginBottom: 28 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Envoyer une demande de devis</h3>
        <form onSubmit={sendRequest}>
          <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
            <input className="input-field" placeholder="ID du prestataire" value={form.providerId} onChange={e => setForm(f => ({ ...f, providerId: e.target.value }))} required />
            <input className="input-field" placeholder="Message (optionnel)" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>📬 Envoyer la demande</button>
        </form>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(req => (
          <div key={req.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: req.quotes?.length ? 16 : 0 }}>
              <div>
                <strong>{req.provider?.businessName || 'Prestataire'}</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: 12 }}>⭐ {req.provider?.rating || '—'}</span>
              </div>
              <span className={`badge ${STATUS_COLORS[req.status] || 'badge-primary'}`}>{req.status}</span>
            </div>
            {req.quotes?.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                {req.quotes.map((q: any) => (
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                    <span>💰 <strong>{(q.totalMillimes / 1000).toFixed(0)} DT</strong> · {q.status}</span>
                    {q.status === 'SENT' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                          onClick={async () => { await fetch(`${API}/api/v1/quotes/${q.id}/accept`, { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } }); setItems(p => p.map(r => r.id === req.id ? { ...r, status: 'ACCEPTED' } : r)); }}>
                          Accepter
                        </button>
                        <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                          onClick={async () => { await fetch(`${API}/api/v1/quotes/${q.id}/reject`, { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } }); }}>
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
