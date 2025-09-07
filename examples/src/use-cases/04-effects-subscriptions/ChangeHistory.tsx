import { settingsStore } from './SettingsStore';

export function ChangeHistory() {
  const changeHistory = settingsStore.get(state => state.changeHistory);

  const clearHistory = settingsStore.use(actions => actions.clearHistory);

  const formatValue = (value: string | number | boolean): string => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h3 style={{ margin: 0 }}>Change History ({changeHistory.length})</h3>
        {changeHistory.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              padding: '4px 8px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '12px',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {changeHistory.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>
          No changes yet. Modify settings above to see the change history.
        </p>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {changeHistory
            .slice()
            .reverse()
            .map((change, index) => (
              <div
                key={`${change.timestamp}-${index}`}
                style={{
                  padding: '10px',
                  borderBottom:
                    index < changeHistory.length - 1
                      ? '1px solid #eee'
                      : 'none',
                  fontSize: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#007bff' }}>{change.field}</strong>
                    <div style={{ color: '#666', marginTop: '2px' }}>
                      {formatValue(change.oldValue)} →{' '}
                      {formatValue(change.newValue)}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#999',
                      textAlign: 'right',
                      marginLeft: '10px',
                    }}
                  >
                    {formatTimestamp(change.timestamp)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
