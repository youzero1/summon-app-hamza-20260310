import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostRepository } from '@/lib/database';
import DeleteButton from './DeleteButton';

async function getPost(id: string) {
  try {
    const repo = await getPostRepository();
    const post = await repo.findOne({ where: { id: parseInt(id, 10) } });
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link href="/">Home</Link> {' / '}
          <Link href="/posts">Posts</Link> {' / '}
          <span>{post.title}</span>
        </nav>

        {/* Post Header */}
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className={`badge ${post.published ? 'badge-green' : 'badge-gray'}`}>
              {post.published ? 'Published' : 'Draft'}
            </span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
            <span>By <strong style={{ color: 'var(--text)' }}>{post.author}</strong></span>
            <span>{formattedDate}</span>
          </div>
        </header>

        {/* Cover Image placeholder */}
        {post.coverImage && (
          <div style={{
            width: '100%',
            height: '300px',
            background: 'var(--border)',
            borderRadius: 'var(--radius)',
            marginBottom: '2rem',
            overflow: 'hidden',
          }}>
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Post Content */}
        <article
          className="prose"
          style={{
            background: 'var(--surface)',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
          }}
        >
          {post.content}
        </article>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/posts" className="btn btn-secondary">← Back to Posts</Link>
          <Link href={`/edit/${post.id}`} className="btn btn-primary">Edit Post</Link>
          <DeleteButton postId={post.id} />
        </div>
      </div>
    </div>
  );
}
