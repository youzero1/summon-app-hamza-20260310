import { NextRequest, NextResponse } from 'next/server';
import { getPostRepository } from '@/lib/database';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getPostRepository();
    const post = await repo.findOne({ where: { id: parseInt(params.id, 10) } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getPostRepository();
    const post = await repo.findOne({ where: { id: parseInt(params.id, 10) } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, author, coverImage, published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Update slug if title changed
    if (title !== post.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await repo.findOne({ where: { slug } });
        if (!existing || existing.id === post.id) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      post.slug = slug;
    }

    post.title = title;
    post.content = content;
    post.excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150);
    post.author = author || 'Admin';
    post.coverImage = coverImage || null;
    post.published = published !== undefined ? published : post.published;

    const updated = await repo.save(post);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getPostRepository();
    const post = await repo.findOne({ where: { id: parseInt(params.id, 10) } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await repo.remove(post);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
