import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'My Blog',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A simple blog built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 140px)', paddingTop: '2rem', paddingBottom: '3rem' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
