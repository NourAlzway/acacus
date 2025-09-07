import { useEffect } from 'react';
import { PostList } from './PostList';
import { CreatePostForm } from './CreatePostForm';
import { blogStore } from './BlogStore';

export function AsyncOperationsApp() {
  // Auto-load posts on mount
  useEffect(() => {
    const posts = blogStore.get(state => state.posts);
    const fetchPostsState = blogStore.get(state => state.fetchPosts);

    if (posts.length === 0 && !fetchPostsState?.loading) {
      const fetchPosts = blogStore.use(actions => actions.fetchPosts);
      fetchPosts();
    }
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>Async Operations Example</h1>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          This example demonstrates how Acacus handles async operations with
          automatic loading states, error handling, and data management. Each
          async action automatically provides <code>loading</code>,{' '}
          <code>error</code>, and <code>data</code> states.
        </p>

        <div
          style={{
            padding: '15px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d7ff',
            borderRadius: '6px',
            marginTop: '15px',
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>
            Key Features Demonstrated:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Automatic loading states for async operations</li>
            <li>Error handling with retry functionality</li>
            <li>Optimistic updates and data synchronization</li>
            <li>Effects for coordinating async results with local state</li>
            <li>Real-world API interaction patterns</li>
          </ul>
        </div>
      </div>

      <CreatePostForm />
      <PostList />
    </div>
  );
}
