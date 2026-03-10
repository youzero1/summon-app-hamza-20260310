import Link from 'next/link';
import { getPostRepository } from '@/lib/database';
import { Post } from '@/entities/Post';
import PostCard from '@/components/PostCard';

async function getAllPosts(page: number = 1, limit: number = 9): Promise<{ posts: Post[]; total: number }> {
  try {
    const repo = await getPostRepository();
    const [posts, total] = await repo.findAndCount({
      where: { published: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { posts, total };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total: 0 };
  }
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 9;
  const { posts, total } = await getAllPosts(page, limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>All Posts</h1>
            <p>{total} post{total !== 1 ? 's' : ''} published</p>
          </div>
          <Link href="/posts/new" className="btn btn-primary">+ New Post</Link>
        </div>
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
            {page > 1 ? 'No more posts.' : 'No published posts yet.'}
          </p>
          <Link href="/posts/new" className="btn btn-primary">Create a Post</Link>
        </div>
      ) : (
        <>
          <div className="grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2.5rem',
            }}>
              {page > 1 && (
                <Link href={`/posts?page=${page - 1}`} className="btn btn-secondary">← Previous</Link>
              )}
              <span style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
              }}>
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/posts?page=${page + 1}`} className="btn btn-secondary">Next →</Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
