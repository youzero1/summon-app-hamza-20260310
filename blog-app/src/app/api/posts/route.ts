import { NextRequest, NextResponse } from 'next/server';
import { getPostRepository } from '@/lib/database';
import { Post } from '@/entities/Post';

export async function GET(request: NextRequest) {
  try {
    const repo = await getPostRepository();
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const queryOptions: Parameters<typeof repo.findAndCount>[0] = {
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    if (publishedOnly === 'true') {
      queryOptions.where = { published: true };
    }

    const [posts, total] = await repo.findAndCount(queryOptions);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author, coverImage, published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const repo = await getPostRepository();

    // Handle duplicate slugs
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;
    while (await repo.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const post = repo.create({
      title,
      slug,
      content,
      excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150),
      author: author || 'Admin',
      coverImage: coverImage || null,
      published: published || false,
    });

    const saved = await repo.save(post);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
