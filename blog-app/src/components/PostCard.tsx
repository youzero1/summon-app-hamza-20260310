import Link from 'next/link';
import { Post } from '@/entities/Post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {post.coverImage && (
        <div style={{ height: '180px', overflow: 'hidden', background: 'var(--background)' }}>
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      {!post.coverImage && (
        <div style={{
          height: '6px',
          background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
        }} />
      )}

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className={`badge ${post.published ? 'badge-green' : 'badge-gray'}`}>
            {post.published ? 'Published' : 'Draft'}
          </span>
          <time style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formattedDate}</time>
        </div>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
          <Link href={`/posts/${post.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            flex: 1,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {post.excerpt}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {post.author}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href={`/posts/${post.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
              Read More
            </Link>
            <Link href={`/edit/${post.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
              Edit
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
