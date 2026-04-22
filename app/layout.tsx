import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Actief Werkt! - Vacatures',
  description: 'Vind je droombaan bij Actief Werkt!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
