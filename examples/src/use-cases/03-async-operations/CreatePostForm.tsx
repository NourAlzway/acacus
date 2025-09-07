import React, { useState, useEffect, useMemo } from 'react';
import { blogStore } from './BlogStore';

export function CreatePostForm() {
  // State access
  const users = blogStore.get(state => state.users);

  // Async states with type-safe API
  const fetchUsersStatus = blogStore.getAsyncStatus('fetchUsers');
  const createPostStatus = blogStore.getAsyncStatus('createPost');

  // Memoize actions to prevent re-renders
  const actions = useMemo(
    () => ({
      fetchUsers: blogStore.use(actions => actions.fetchUsers),
      createPost: blogStore.use(actions => actions.createPost),
    }),
    []
  );

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1,
  });

  // Load users on mount
  useEffect(() => {
    if (users.length === 0 && !fetchUsersStatus.loading) {
      actions.fetchUsers();
    }
  }, [users.length, fetchUsersStatus.loading, actions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await actions.createPost({
        title: formData.title.trim(),
        body: formData.body.trim(),
        userId: formData.userId,
      });

      // Reset form on success
      setFormData({ title: '', body: '', userId: 1 });
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div
      style={{
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
      }}
    >
      <h2>Create New Post</h2>

      {/* Users loading state */}
      {fetchUsersStatus.loading && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#d1ecf1',
            color: '#0c5460',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '14px',
          }}
        >
          Loading users...
        </div>
      )}

      {/* Users error state */}
      {fetchUsersStatus.error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '14px',
          }}
        >
          Failed to load users: {fetchUsersStatus.error.message}
          <button
            onClick={actions.fetchUsers}
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

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '15px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={e =>
              setFormData(prev => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter post title"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
            disabled={createPostStatus.loading}
          />
        </div>

        {/* Body */}
        <div style={{ marginBottom: '15px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Content
          </label>
          <textarea
            value={formData.body}
            onChange={e =>
              setFormData(prev => ({ ...prev, body: e.target.value }))
            }
            placeholder="Enter post content"
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
            }}
            disabled={createPostStatus.loading}
          />
        </div>

        {/* Author */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Author
          </label>
          <select
            value={formData.userId}
            onChange={e =>
              setFormData(prev => ({ ...prev, userId: Number(e.target.value) }))
            }
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
            disabled={createPostStatus.loading || users.length === 0}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createPostStatus.loading || users.length === 0}
          style={{
            padding: '12px 24px',
            backgroundColor: createPostStatus.loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: createPostStatus.loading ? 'not-allowed' : 'pointer',
          }}
        >
          {createPostStatus.loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>

      {/* Create post error */}
      {createPostStatus.error && (
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
          Failed to create post: {createPostStatus.error.message}
        </div>
      )}

      {/* Success message */}
      {createPostStatus.data && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          Post "{createPostStatus.data.title}" created successfully!
        </div>
      )}
    </div>
  );
}
