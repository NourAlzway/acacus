import { settingsStore } from './SettingsStore';

export function SettingsPanel() {
  const settings = settingsStore.get(state => state.settings);
  const unsavedChanges = settingsStore.get(state => state.unsavedChanges);

  const updateSetting = settingsStore.use(actions => actions.updateSetting);
  const markAsSaved = settingsStore.use(actions => actions.markAsSaved);
  const revertToDefaults = settingsStore.use(
    actions => actions.revertToDefaults
  );

  const handleSave = () => {
    // Simulate saving to server
    console.log('Manually saving settings...');
    setTimeout(() => {
      markAsSaved();
      alert('Settings saved successfully!');
    }, 500);
  };

  const handleRevert = () => {
    if (confirm('Reset all settings to default values?')) {
      revertToDefaults();
    }
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
          marginBottom: '25px',
        }}
      >
        <h2 style={{ margin: 0 }}>Settings</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {unsavedChanges && (
            <span
              style={{
                color: '#ff6b35',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!unsavedChanges}
            style={{
              padding: '6px 12px',
              backgroundColor: unsavedChanges ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: unsavedChanges ? 'pointer' : 'not-allowed',
            }}
          >
            Save
          </button>
          <button
            onClick={handleRevert}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Theme */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Theme
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {(['light', 'dark'] as const).map(theme => (
              <label
                key={theme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  checked={settings.theme === theme}
                  onChange={() => updateSetting('theme', theme)}
                  style={{ marginRight: '6px' }}
                />
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Language
          </label>
          <select
            value={settings.language}
            onChange={e => updateSetting('language', e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="de">Deutsche</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Font Size: {settings.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="20"
            value={settings.fontSize}
            onChange={e => updateSetting('fontSize', Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#666',
            }}
          >
            <span>12px</span>
            <span>20px</span>
          </div>
        </div>

        {/* Checkboxes */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={e => updateSetting('notifications', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
              Enable notifications
            </span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={e => updateSetting('autoSave', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
              Auto-save (2 second delay)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
