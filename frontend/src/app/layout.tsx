import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FERHA — سهل عليك فرحك',
  description: 'La plateforme de gestion d\'événements pour le marché tunisien. Trouvez les meilleurs prestataires, gérez votre budget et votre planning.',
  keywords: 'événements, mariage, tunisie, prestataires, organisation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body className={`${outfit.variable} ${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
