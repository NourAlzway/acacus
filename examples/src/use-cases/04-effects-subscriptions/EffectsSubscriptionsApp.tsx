import { SettingsPanel } from './SettingsPanel';
import { ChangeHistory } from './ChangeHistory';
import { LiveSubscription } from './LiveSubscription';

export function EffectsSubscriptionsApp() {
  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>Effects & Subscriptions Example</h1>
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px' }}>
          This example demonstrates Acacus effects and subscription system.
          Effects are side effects that run automatically when state changes,
          while subscriptions allow components to listen for specific state
          changes.
        </p>

        <div
          style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '6px',
            marginBottom: '15px',
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
            Effects in Action:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>
              <strong>localStorage Persistence</strong>: Settings auto-save to
              browser storage
            </li>
            <li>
              <strong>Theme Application</strong>: Changes immediately apply to
              the page
            </li>
            <li>
              <strong>Auto-save</strong>: When enabled, saves changes after 2
              second delay
            </li>
            <li>
              <strong>Change Logging</strong>: All changes are logged to console
              and history
            </li>
          </ul>
        </div>

        <div
          style={{
            padding: '15px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d7ff',
            borderRadius: '6px',
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>
            Open Browser Console:
          </h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Press F12 and check the console to see effect logs in real-time as
            you change settings. You'll see persistence, theme changes, and
            auto-save messages.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: '1fr 1fr',
          marginBottom: '20px',
        }}
      >
        <SettingsPanel />
        <ChangeHistory />
      </div>

      <LiveSubscription />

      <style>{`
        .theme-light {
          background-color: #ffffff;
          color: #333333;
        }
        .theme-dark {
          background-color: #1a1a1a;
          color: #e0e0e0;
        }
        .theme-dark h1,
        .theme-dark h2,
        .theme-dark h3,
        .theme-dark h4 {
          color: #ffffff;
        }
        .theme-dark div {
          border-color: #404040 !important;
          background-color: #2a2a2a;
        }
        .theme-dark input,
        .theme-dark select,
        .theme-dark textarea {
          background-color: #333333;
          color: #e0e0e0;
          border-color: #555555;
        }
      `}</style>
    </div>
  );
}
