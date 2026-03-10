import PostForm from '@/components/PostForm';

export default function NewPostPage() {
  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="page-header">
          <h1>Create New Post</h1>
          <p>Write and publish a new blog post</p>
        </div>
        <PostForm />
      </div>
    </div>
  );
}
