import { notFound } from 'next/navigation';
import { getPostRepository } from '@/lib/database';
import PostForm from '@/components/PostForm';

async function getPost(id: string) {
  try {
    const repo = await getPostRepository();
    return await repo.findOne({ where: { id: parseInt(id, 10) } });
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="page-header">
          <h1>Edit Post</h1>
          <p>Update your blog post</p>
        </div>
        <PostForm
          post={{
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.author,
            coverImage: post.coverImage || '',
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
