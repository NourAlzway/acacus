import { useMemo } from 'react';
import { blogStore } from './BlogStore';

export function PostList() {
  // State access with stable selectors
  const posts = blogStore.get(state => state.posts);
  const selectedPostId = blogStore.get(state => state.selectedPostId);

  // Async state access with type-safe API
  const fetchPostsStatus = blogStore.getAsyncStatus('fetchPosts');
  const deletePostStatus = blogStore.getAsyncStatus('deletePost');

  // Memoize action access to prevent re-renders
  const actions = useMemo(
    () => ({
      fetchPosts: blogStore.use(actions => actions.fetchPosts),
      selectPost: blogStore.use(actions => actions.selectPost),
      deletePost: blogStore.use(actions => actions.deletePost),
      clearPosts: blogStore.use(actions => actions.clearPosts),
    }),
    []
  );

  const handleDeletePost = async (postId: number, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      try {
        await actions.deletePost(postId);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await actions.fetchPosts();
    } catch (error) {
      console.error('Failed to refresh posts:', error);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2>Blog Posts ({posts.length})</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleRefresh}
            disabled={fetchPostsStatus.loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            {fetchPostsStatus.loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={actions.clearPosts}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Loading State */}
      {fetchPostsStatus.loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            fontStyle: 'italic',
          }}
        >
          Loading posts...
        </div>
      )}

      {/* Error State */}
      {fetchPostsStatus.error && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <strong>Error:</strong> {fetchPostsStatus.error.message}
          <button
            onClick={handleRefresh}
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '12px',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Posts List */}
      {!fetchPostsStatus.loading &&
        posts.length === 0 &&
        !fetchPostsStatus.error && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              fontStyle: 'italic',
            }}
          >
            No posts available. Click "Refresh" to load posts.
          </div>
        )}

      {posts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor:
                  selectedPostId === post.id ? '#f8f9fa' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => actions.selectPost(post.id)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {post.title}
                  </h3>
                  <p
                    style={{
                      margin: '0 0 10px 0',
                      color: '#666',
                      lineHeight: '1.5',
                    }}
                  >
                    {post.body}
                  </p>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#999',
                    }}
                  >
                    Post ID: {post.id} | Author ID: {post.userId}
                  </div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDeletePost(post.id, post.title);
                  }}
                  disabled={deletePostStatus.loading}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginLeft: '15px',
                  }}
                >
                  {deletePostStatus.loading ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Error */}
      {deletePostStatus.error && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          Failed to delete post: {deletePostStatus.error.message}
        </div>
      )}
    </div>
  );
}
