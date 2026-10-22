'use client';
import { useEffect, useState } from 'react';

interface Booking { id: string; date: string; status: string; totalMillimes: number; contractSigned: boolean; depositReceived: boolean; fullyPaid: boolean; reference: string; event: { title: string; date: string; governorate: string }; service?: { name: string }; }
interface QuoteReq { id: string; status: string; event: { title: string; date: string; governorate: string; guestCount: number }; }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const STATUS_COLORS: Record<string, string> = { PENDING: 'badge-warning', CONFIRMED: 'badge-success', COMPLETED: 'badge-success', CANCELLED: 'badge-danger', PREPARING: 'badge-primary' };

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [incoming, setIncoming] = useState<QuoteReq[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'bookings'>('requests');

  const token = () => localStorage.getItem('token') || '';

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { window.location.href = '/connexion'; return; }
    setUser(JSON.parse(u));
    Promise.all([
      fetch(`${API}/api/v1/bookings`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      fetch(`${API}/api/v1/quote-requests/incoming`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
    ]).then(([b, q]) => { setBookings(Array.isArray(b) ? b : []); setIncoming(Array.isArray(q) ? q : []); }).finally(() => setLoading(false));
  }, []);

  const confirmContract = async (id: string) => {
    await fetch(`${API}/api/v1/bookings/${id}/contract`, { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } });
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, contractSigned: true } : bk));
  };

  const confirmDeposit = async (id: string) => {
    await fetch(`${API}/api/v1/bookings/${id}/deposit`, { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } });
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, depositReceived: true } : bk));
  };

  const totalRevenue = bookings.filter(b => b.status !== 'CANCELLED').reduce((s, b) => s + b.totalMillimes, 0);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'var(--text-secondary)' }}>Chargement...</div>;

  return (
    <main style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <nav className="navbar">
        <span className="navbar-logo">FERHA ✦</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tableau de bord prestataire · <strong style={{ color: 'var(--primary)' }}>{user?.firstName}</strong></span>
        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Déconnexion</button>
      </nav>

      <div className="container" style={{ paddingTop: 100 }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8 }}>Mon <span className="gradient-text">tableau de bord</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez vos demandes de devis et vos réservations</p>
        </div>

        {/* KPIs */}
        <div className="grid-4" style={{ marginBottom: 48 }}>
          {[
            { icon: '📬', label: 'Demandes en attente', value: incoming.length },
            { icon: '📅', label: 'Réservations', value: bookings.length },
            { icon: '✅', label: 'Contrats signés', value: bookings.filter(b => b.contractSigned).length },
            { icon: '💰', label: 'Chiffre (DT)', value: (totalRevenue / 1000).toLocaleString('fr-TN') },
          ].map((k, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: '2rem' }}>{k.icon}</div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{k.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--bg-card)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {(['requests', 'bookings'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                background: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)' }}>
              {tab === 'requests' ? `📬 Demandes (${incoming.length})` : `📅 Réservations (${bookings.length})`}
            </button>
          ))}
        </div>

        {/* Requests tab */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {incoming.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
                <p>Aucune demande de devis en attente</p>
              </div>
            ) : incoming.map(req => (
              <div key={req.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{req.event.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    📅 {new Date(req.event.date).toLocaleDateString('fr-TN')} · 📍 {req.event.governorate} · 👥 {req.event.guestCount} invités
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span className="badge badge-warning">{req.status}</span>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    onClick={() => window.location.href = `/dashboard/prestataire/devis/${req.id}`}>
                    Répondre →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
                <p>Aucune réservation pour le moment</p>
              </div>
            ) : bookings.map(b => (
              <div key={b.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{b.event.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Réf: {b.reference}</p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[b.status] || 'badge-primary'}`}>{b.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 24, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20, flexWrap: 'wrap' }}>
                  <span>📅 {new Date(b.date).toLocaleDateString('fr-TN')}</span>
                  <span>💰 {(b.totalMillimes / 1000).toLocaleString('fr-TN')} DT</span>
                  <span>📍 {b.event.governorate}</span>
                </div>
                {/* Face-to-face tracking */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 14px', borderRadius: 8, background: b.contractSigned ? 'rgba(34,197,94,0.1)' : 'var(--bg-card-2)', border: '1px solid', borderColor: b.contractSigned ? 'rgba(34,197,94,0.3)' : 'var(--border)', fontSize: '0.82rem' }}>
                    {b.contractSigned ? '✅ Contrat signé' : '📄 Contrat en attente'}
                  </div>
                  <div style={{ padding: '8px 14px', borderRadius: 8, background: b.depositReceived ? 'rgba(34,197,94,0.1)' : 'var(--bg-card-2)', border: '1px solid', borderColor: b.depositReceived ? 'rgba(34,197,94,0.3)' : 'var(--border)', fontSize: '0.82rem' }}>
                    {b.depositReceived ? '✅ Acompte reçu' : '💵 Acompte en attente'}
                  </div>
                  <div style={{ padding: '8px 14px', borderRadius: 8, background: b.fullyPaid ? 'rgba(34,197,94,0.1)' : 'var(--bg-card-2)', border: '1px solid', borderColor: b.fullyPaid ? 'rgba(34,197,94,0.3)' : 'var(--border)', fontSize: '0.82rem' }}>
                    {b.fullyPaid ? '✅ Solde payé' : '💳 Solde en attente'}
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                  {!b.contractSigned && <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => confirmContract(b.id)}>Marquer contrat signé</button>}
                  {b.contractSigned && !b.depositReceived && <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => confirmDeposit(b.id)}>Marquer acompte reçu</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
