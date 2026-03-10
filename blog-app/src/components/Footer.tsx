export default function Footer() {
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'My Blog';
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: '1.5rem 0',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          © {currentYear} <strong>{siteTitle}</strong>. Built with Next.js & TypeORM.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          Powered by SQLite & Next.js App Router
        </p>
      </div>
    </footer>
  );
}
