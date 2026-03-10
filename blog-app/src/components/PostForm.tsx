'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostFormProps {
  post?: {
    id: number;
    title: string;
    content: string;
    author: string;
    coverImage: string;
    published: boolean;
  };
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    author: post?.author || 'Admin',
    coverImage: post?.coverImage || '',
    published: post?.published || false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      setLoading(false);
      return;
    }

    try {
      const url = isEditing ? `/api/posts/${post.id}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setSuccess(isEditing ? 'Post updated successfully!' : 'Post created successfully!');

      setTimeout(() => {
        router.push(`/posts/${data.id}`);
        router.refresh();
      }, 800);
    } catch (err) {
      console.error('Submit error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--surface)',
      padding: '2rem',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
    }}>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter post title..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content here..."
          rows={12}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input
          id="author"
          name="author"
          type="text"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="coverImage">Cover Image URL (optional)</label>
        <input
          id="coverImage"
          name="coverImage"
          type="url"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="form-group">
        <div className="form-check">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={formData.published}
            onChange={handleChange}
          />
          <label htmlFor="published" style={{ marginBottom: 0, cursor: 'pointer' }}>
            Publish this post
          </label>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {formData.published ? 'This post will be visible to everyone.' : 'This post will be saved as a draft.'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
        </button>
        <Link href={isEditing ? `/posts/${post.id}` : '/posts'} className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
