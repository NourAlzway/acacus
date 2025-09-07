import { userStore } from './UserStore';
import { Card } from '../../components/Card';

export const SelectedUserPanel = () => {
  const selectedUser = userStore.get(state =>
    state.users.find(user => user.id === state.selectedUserId)
  );
  const selectUser = userStore.use(actions => actions.selectUser);
  const updateUser = userStore.use(actions => actions.updateUser);
  const toggleUserStatus = userStore.use(actions => actions.toggleUserStatus);

  const handleEditField = (field: 'name' | 'email') => {
    if (!selectedUser) return;

    const currentValue = selectedUser[field];
    const newValue = prompt(`Enter new ${field}:`, currentValue);

    if (newValue && newValue !== currentValue) {
      if (field === 'email' && !newValue.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
      updateUser(selectedUser.id, { [field]: newValue });
    }
  };

  return (
    <Card title="Selected User" minHeight="300px">
      {selectedUser ? (
        <div>
          {/* User Avatar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: selectedUser.active ? '#10b981' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginRight: '16px',
              }}
            >
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                }}
              >
                {selectedUser.name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: selectedUser.active ? '#10b981' : '#ef4444',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {selectedUser.active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500',
                  }}
                >
                  ID
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: '500',
                  }}
                >
                  #{selectedUser.id}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500',
                  }}
                >
                  Name
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: '500',
                  }}
                >
                  {selectedUser.name}
                </div>
              </div>
              <button
                onClick={() => handleEditField('name')}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: 'transparent',
                  color: '#3b82f6',
                  border: '1px solid #3b82f6',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500',
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: '500',
                  }}
                >
                  {selectedUser.email}
                </div>
              </div>
              <button
                onClick={() => handleEditField('email')}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: 'transparent',
                  color: '#3b82f6',
                  border: '1px solid #3b82f6',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => toggleUserStatus(selectedUser.id)}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: selectedUser.active ? '#fef3c7' : '#dcfce7',
                color: selectedUser.active ? '#92400e' : '#166534',
                border: `1px solid ${selectedUser.active ? '#f59e0b' : '#16a34a'}`,
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {selectedUser.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => selectUser(null)}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#6b7280',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              fontSize: '24px',
            }}
          >
            👤
          </div>
          <div
            style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}
          >
            No user selected
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            Click on a user from the list to view details
          </div>
        </div>
      )}
    </Card>
  );
};
