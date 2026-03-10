'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/posts');
        router.refresh();
      } else {
        alert('Failed to delete the post. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn btn-danger"
      style={{ opacity: loading ? 0.7 : 1 }}
    >
      {loading ? 'Deleting...' : 'Delete Post'}
    </button>
  );
}
