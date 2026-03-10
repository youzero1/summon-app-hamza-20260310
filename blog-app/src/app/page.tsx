import Link from 'next/link';
import { getPostRepository } from '@/lib/database';
import { Post } from '@/entities/Post';
import PostCard from '@/components/PostCard';

async function getLatestPosts(): Promise<Post[]> {
  try {
    const repo = await getPostRepository();
    return await repo.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
      take: 6,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getLatestPosts();
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'My Blog';
  const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A simple blog built with Next.js';

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 0 2.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '2.5rem',
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {siteTitle}
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          {siteDescription}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/posts" className="btn btn-primary">Browse All Posts</Link>
          <Link href="/posts/new" className="btn btn-secondary">Write a Post</Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Latest Posts</h2>
          {posts.length > 0 && (
            <Link href="/posts" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>View all →</Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No posts yet. Be the first to write something!
            </p>
            <Link href="/posts/new" className="btn btn-primary">Create First Post</Link>
          </div>
        ) : (
          <div className="grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
