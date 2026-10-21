import Link from 'next/link';

const categories = [
  { icon: '📸', name: 'Photographe', count: '120+' },
  { icon: '🍽️', name: 'Traiteur', count: '85+' },
  { icon: '🏰', name: 'Lieu', count: '60+' },
  { icon: '🎵', name: 'Animation', count: '95+' },
  { icon: '💄', name: 'Maquillage', count: '70+' },
  { icon: '🎂', name: 'Pâtissier', count: '55+' },
  { icon: '💐', name: 'Fleuriste', count: '45+' },
  { icon: '🚗', name: 'Transport', count: '40+' },
];

const steps = [
  { num: '01', title: 'Créez votre événement', desc: 'Décrivez votre mariage, fête ou cérémonie en quelques clics.' },
  { num: '02', title: 'Trouvez vos prestataires', desc: 'Parcourez notre catalogue et envoyez des demandes de devis.' },
  { num: '03', title: 'Comparez les offres', desc: 'Recevez les devis et choisissez la meilleure proposition.' },
  { num: '04', title: 'Gérez tout sur place', desc: 'Budget, planning, invités, contrats — tout en un seul endroit.' },
];

const stats = [
  { num: '2,400+', label: 'Événements organisés' },
  { num: '850+', label: 'Prestataires vérifiés' },
  { num: '24', label: 'Gouvernorats couverts' },
  { num: '4.9/5', label: 'Satisfaction client' },
];

export default function HomePage() {
  return (
    <main>
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">FERHA ✦</a>
        <ul className="navbar-links">
          <li><a href="/prestataires">Prestataires</a></li>
          <li><a href="/categories">Catégories</a></li>
          <li><a href="/tarifs">Tarifs</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/connexion" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Connexion
          </Link>
          <Link href="/inscription" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Commencer
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="gradient-hero" style={{ paddingTop: 160, paddingBottom: 120 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="animate-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 999,
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
            marginBottom: 32, fontSize: '0.9rem', color: 'var(--primary)',
          }}>
            ✦ سهل عليك فرحك — La plateforme #1 en Tunisie
          </div>

          <h1 className="animate-fade-up delay-100" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, marginBottom: 24, lineHeight: 1.1 }}>
            Organisez votre événement{' '}
            <span className="gradient-text">parfait</span>{' '}
            sans stress
          </h1>

          <p className="animate-fade-up delay-200" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Trouvez les meilleurs prestataires tunisiens, comparez les devis, gérez votre budget et vos invités — tout en un seul endroit.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/inscription" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
              🎉 Créer mon événement
            </Link>
            <Link href="/prestataires" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
              Explorer les prestataires
            </Link>
          </div>

          {/* Floating cards decoration */}
          <div className="animate-fade-up delay-400" style={{ marginTop: 80, position: 'relative', display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['Mariage 💍', 'Fiançailles 💐', 'Anniversaire 🎂', 'Baptême 👼'].map((tag) => (
              <span key={tag} style={{
                padding: '10px 20px', borderRadius: 999,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                fontSize: '0.9rem', color: 'var(--text-secondary)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div className="grid-4">
            {stats.map((s, i) => (
              <div key={i} className="stat-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-number">{s.num}</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.95rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
              Tous les prestataires dont vous avez besoin
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Des centaines de professionnels vérifiés dans toute la Tunisie
            </p>
          </div>
          <div className="grid-4">
            {categories.map((cat, i) => (
              <a key={i} href={`/prestataires?categorie=${cat.name.toLowerCase()}`}
                className="card"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 32, cursor: 'pointer' }}>
                <div style={{ fontSize: '2.5rem' }}>{cat.icon}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>{cat.name}</div>
                <div className="badge badge-primary">{cat.count}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(139,92,246,0.05) 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
              Comment ça marche ?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              De l'idée à l'événement inoubliable en 4 étapes simples
            </p>
          </div>
          <div className="grid-4">
            {steps.map((step, i) => (
              <div key={i} className="card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  marginBottom: 16,
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1.1rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="gradient-card animate-pulse-glow" style={{ maxWidth: 700, margin: '0 auto', padding: '64px 48px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 20 }}>
              Prêt à organiser votre <span className="gradient-text">événement parfait</span> ?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: '1.1rem', lineHeight: 1.7 }}>
              Rejoignez des milliers de familles tunisiennes qui ont fait confiance à FERHA pour leurs moments les plus précieux.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/inscription" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
                Créer mon compte gratuitement
              </Link>
              <Link href="/prestataires" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
                Devenir prestataire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 0', marginTop: 48 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="navbar-logo" style={{ marginBottom: 8, display: 'block' }}>FERHA ✦</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>سهل عليك فرحك — Tunis, Tunisie</p>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Prestataires', 'À propos', 'Contact', 'Confidentialité'].map((l) => (
              <a key={l} href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                {l}
              </a>
            ))}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            © 2024 FERHA. Tous droits réservés.
          </p>
        </div>
      </footer>
    </main>
  );
}
