'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'My Blog';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'All Posts' },
    { href: '/posts/new', label: 'New Post' },
  ];

  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        <Link href="/" style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text)',
          textDecoration: 'none',
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {siteTitle}
        </Link>

        <nav style={{ display: 'flex', gap: '0.25rem' }}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={label === 'New Post' ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{
                ...(label !== 'New Post' && pathname === href ? {
                  background: 'var(--background)',
                  fontWeight: 600,
                } : {}),
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
