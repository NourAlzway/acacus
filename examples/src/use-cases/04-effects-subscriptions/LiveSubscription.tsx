import { useState, useEffect } from 'react';
import { settingsStore } from './SettingsStore';

export function LiveSubscription() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(true);

  useEffect(() => {
    if (!isSubscribed) return;

    // Subscribe to all state changes
    const unsubscribe = settingsStore.subscribe((newState, prevState) => {
      const timestamp = new Date().toLocaleTimeString();

      // Check what changed
      const changes: string[] = [];

      // Check settings changes
      Object.keys(newState.settings).forEach(key => {
        const typedKey = key as keyof typeof newState.settings;
        if (newState.settings[typedKey] !== prevState.settings[typedKey]) {
          changes.push(
            `${key}: ${prevState.settings[typedKey]} → ${newState.settings[typedKey]}`
          );
        }
      });

      // Check other state changes
      if (newState.unsavedChanges !== prevState.unsavedChanges) {
        changes.push(
          `unsavedChanges: ${prevState.unsavedChanges} → ${newState.unsavedChanges}`
        );
      }

      if (newState.changeHistory.length !== prevState.changeHistory.length) {
        changes.push(
          `changeHistory: ${prevState.changeHistory.length} → ${newState.changeHistory.length} items`
        );
      }

      if (changes.length > 0) {
        const changeText = changes.join(', ');
        setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${changeText}`]); // Keep last 20 logs
      }
    });

    // Add initial log
    setLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Subscription started`,
    ]);

    return () => {
      unsubscribe();
      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Subscription stopped`,
      ]);
    };
  }, [isSubscribed]);

  const toggleSubscription = () => {
    setIsSubscribed(prev => !prev);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
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
        <h3 style={{ margin: 0 }}>
          Live Subscription
          <span
            style={{
              marginLeft: '10px',
              padding: '2px 6px',
              fontSize: '12px',
              backgroundColor: isSubscribed ? '#28a745' : '#dc3545',
              color: 'white',
              borderRadius: '3px',
            }}
          >
            {isSubscribed ? 'ACTIVE' : 'STOPPED'}
          </span>
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleSubscription}
            style={{
              padding: '4px 8px',
              backgroundColor: isSubscribed ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '12px',
            }}
          >
            {isSubscribed ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={clearLogs}
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
        </div>
      </div>

      <div
        style={{
          height: '200px',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '4px',
          padding: '10px',
          fontFamily: 'Monaco, Consolas, monospace',
          fontSize: '12px',
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            {isSubscribed
              ? 'Waiting for state changes...'
              : 'Subscription is stopped. Click "Start" to begin monitoring.'}
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: '4px',
                color: log.includes('Subscription') ? '#007bff' : '#333',
              }}
            >
              {log}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        <strong>How it works:</strong> This component uses{' '}
        <code>settingsStore.subscribe()</code> to listen for all state changes.
        Each change is logged with a timestamp showing exactly what changed from
        the previous state to the new state.
      </div>
    </div>
  );
}
